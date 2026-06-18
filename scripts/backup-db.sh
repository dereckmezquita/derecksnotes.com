#!/bin/bash
set -euo pipefail

# ============================================================
# SQLite Database Backup Script
# Safe hot backup using sqlite3 .backup command.
# Verifies the backup with PRAGMA integrity_check + PRAGMA foreign_key_check
# before gzipping, and verifies gzip integrity after compression. A backup
# that silently corrupts can rotate out the last known-good copy before
# anyone notices the live DB is bad — these checks make the failure loud
# and synchronous.
#
# Usage:
#   ./backup-db.sh <database-path> <backup-dir> [max-backups]
#
# Example:
#   ./backup-db.sh /var/www/derecksnotes.com/data/database.sqlite \
#                  /var/www/derecksnotes.com/backups 30
# ============================================================

DB_PATH="${1:-}"
BACKUP_DIR="${2:-}"
MAX_BACKUPS="${3:-30}"

# ---- Validation ----

if [ -z "$DB_PATH" ] || [ -z "$BACKUP_DIR" ]; then
    echo "Usage: $0 <database-path> <backup-dir> [max-backups]"
    echo "  database-path : Path to the SQLite database file"
    echo "  backup-dir    : Directory to store backup files"
    echo "  max-backups   : Number of backups to keep (default: 30)"
    exit 1
fi

if ! command -v sqlite3 &>/dev/null; then
    echo "Error: sqlite3 is not installed."
    echo "Install with: apt-get install -y sqlite3"
    exit 1
fi

if [ ! -f "$DB_PATH" ]; then
    echo "Error: Database file not found: $DB_PATH"
    exit 1
fi

# ---- Setup ----

mkdir -p "$BACKUP_DIR"

TIMESTAMP=$(date +"%Y-%m-%d-%H%M")
BACKUP_NAME="db-${TIMESTAMP}.sqlite"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_NAME}"
COMPRESSED_PATH="${BACKUP_PATH}.gz"

echo "=== SQLite Backup ==="
echo "Source:     $DB_PATH"
echo "Backup:     $COMPRESSED_PATH"
echo "Retention:  last $MAX_BACKUPS backups"
echo ""

# ---- Backup ----

echo "Creating backup..."
sqlite3 "$DB_PATH" ".backup '${BACKUP_PATH}'"

if [ ! -f "$BACKUP_PATH" ]; then
    echo "Error: Backup file was not created."
    exit 1
fi

BACKUP_SIZE=$(du -h "$BACKUP_PATH" | cut -f1)
echo "Backup created: ${BACKUP_SIZE}"

# ---- Verify ----

echo "Verifying backup integrity (PRAGMA integrity_check)..."
INTEGRITY_RESULT=$(sqlite3 "$BACKUP_PATH" "PRAGMA integrity_check;")
if [ "$INTEGRITY_RESULT" != "ok" ]; then
    echo "Error: integrity_check failed:"
    echo "$INTEGRITY_RESULT"
    rm -f "$BACKUP_PATH"
    exit 1
fi
echo "  integrity_check: ok"

echo "Verifying foreign keys (PRAGMA foreign_key_check)..."
FK_RESULT=$(sqlite3 "$BACKUP_PATH" "PRAGMA foreign_key_check;")
if [ -n "$FK_RESULT" ]; then
    echo "Error: foreign_key_check failed:"
    echo "$FK_RESULT"
    rm -f "$BACKUP_PATH"
    exit 1
fi
echo "  foreign_key_check: ok"

# ---- Compress ----

echo "Compressing..."
gzip "$BACKUP_PATH"

if [ ! -f "$COMPRESSED_PATH" ]; then
    echo "Error: Compression failed."
    exit 1
fi

echo "Verifying gzip integrity (gunzip -t)..."
if ! gunzip -t "$COMPRESSED_PATH"; then
    echo "Error: gzip test failed:"
    rm -f "$COMPRESSED_PATH"
    exit 1
fi

COMPRESSED_SIZE=$(du -h "$COMPRESSED_PATH" | cut -f1)
echo "Compressed: ${COMPRESSED_SIZE} (verified)"

# ---- Rotate old backups ----

BACKUP_COUNT=$(find "$BACKUP_DIR" -name "db-*.sqlite.gz" -type f | wc -l)

if [ "$BACKUP_COUNT" -gt "$MAX_BACKUPS" ]; then
    DELETE_COUNT=$((BACKUP_COUNT - MAX_BACKUPS))
    echo "Rotating: removing ${DELETE_COUNT} old backup(s)..."

    find "$BACKUP_DIR" -name "db-*.sqlite.gz" -type f -printf '%T@ %p\n' \
        | sort -n \
        | head -n "$DELETE_COUNT" \
        | cut -d' ' -f2- \
        | xargs rm -f
fi

# ---- Summary ----

REMAINING=$(find "$BACKUP_DIR" -name "db-*.sqlite.gz" -type f | wc -l)
echo ""
echo "Done. ${REMAINING} backup(s) stored in ${BACKUP_DIR}"
