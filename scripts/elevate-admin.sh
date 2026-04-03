#!/bin/bash
set -euo pipefail

# ============================================================
# Elevate a user to admin
#
# Usage:
#   ./elevate-admin.sh <username> [database-path]
#
# Examples:
#   ./elevate-admin.sh dereck /var/www/derecksnotes.com/data/database.sqlite
#   ./elevate-admin.sh dereck /var/www/dev.derecksnotes.com/data/database.sqlite
#
# The user must already be registered on the site.
# ============================================================

USERNAME="${1:-}"
DB_PATH="${2:-/var/www/derecksnotes.com/data/database.sqlite}"

if [ -z "$USERNAME" ]; then
    echo "Usage: $0 <username> [database-path]"
    echo ""
    echo "  username      : The registered username to elevate"
    echo "  database-path : Path to SQLite database (default: /var/www/derecksnotes.com/data/database.sqlite)"
    exit 1
fi

if ! command -v sqlite3 &>/dev/null; then
    echo "Error: sqlite3 is not installed."
    exit 1
fi

if [ ! -f "$DB_PATH" ]; then
    echo "Error: Database not found: $DB_PATH"
    exit 1
fi

# Check user exists
USER_ID=$(sqlite3 "$DB_PATH" "SELECT id FROM users WHERE username = '$USERNAME' AND deleted_at IS NULL LIMIT 1;")

if [ -z "$USER_ID" ]; then
    echo "Error: User '$USERNAME' not found."
    echo ""
    echo "Registered users:"
    sqlite3 "$DB_PATH" "SELECT username FROM users WHERE deleted_at IS NULL;"
    exit 1
fi

# Ensure admin group exists
ADMIN_GROUP_ID=$(sqlite3 "$DB_PATH" "SELECT id FROM groups WHERE name = 'admin' LIMIT 1;")

if [ -z "$ADMIN_GROUP_ID" ]; then
    ADMIN_GROUP_ID="admin-group-$(date +%s)"
    sqlite3 "$DB_PATH" "INSERT INTO groups (id, name, description, is_default) VALUES ('$ADMIN_GROUP_ID', 'admin', 'Administrators', 0);"
    echo "Created admin group."
fi

# Check if already admin
ALREADY=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM user_groups WHERE user_id = '$USER_ID' AND group_id = '$ADMIN_GROUP_ID';")

if [ "$ALREADY" -gt 0 ]; then
    echo "User '$USERNAME' is already an admin."
    exit 0
fi

# Elevate
LINK_ID="ug-$(date +%s)-$(head -c 4 /dev/urandom | xxd -p)"
sqlite3 "$DB_PATH" "INSERT INTO user_groups (id, user_id, group_id) VALUES ('$LINK_ID', '$USER_ID', '$ADMIN_GROUP_ID');"

echo "Done. User '$USERNAME' is now an admin."
