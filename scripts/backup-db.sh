#!/bin/bash
set -euo pipefail

# ============================================================
# SQLite Database Backup Script
# Safe hot backup using sqlite3 .backup command
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

# ---- Compress ----

echo "Compressing..."
gzip "$BACKUP_PATH"

if [ ! -f "$COMPRESSED_PATH" ]; then
    echo "Error: Compression failed."
    exit 1
fi

COMPRESSED_SIZE=$(du -h "$COMPRESSED_PATH" | cut -f1)
echo "Compressed: ${COMPRESSED_SIZE}"

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
