#!/bin/bash
set -euo pipefail

# ============================================================
# VPS Cleanup & Migration Script
# One-time script to migrate from Docker Hub deployment
# to git-based on-VPS builds.
#
# Run this ONCE on the Linode VPS before the first new deploy.
#
# Usage:
#   ssh root@your-vps
#   bash cleanup-vps.sh
#
# What it does:
#   1. Stops and removes old containers
#   2. Removes old deployment directories
#   3. PRESERVES public/ directories (site images)
#   4. Creates new directory structure
#   5. Ensures docker network and sqlite3 exist
#
# What it does NOT do:
#   - Clone the repo (the deploy workflow handles that)
#   - Start new containers (run the deploy workflow after)
# ============================================================

echo "=== VPS Cleanup & Migration ==="
echo ""

# ---- Stop old containers ----

echo "--- Stopping old containers ---"

for CONTAINER in prod_derecksnotes dev_derecksnotes; do
    if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER}$"; then
        echo "Stopping and removing: ${CONTAINER}"
        docker stop "$CONTAINER" 2>/dev/null || true
        docker rm "$CONTAINER" 2>/dev/null || true
    else
        echo "Not found: ${CONTAINER} (skipping)"
    fi
done

# Tear down old compose projects
for DIR in /root/prod_docker-compose-derecksnotes /root/dev_docker-compose-derecksnotes; do
    if [ -d "$DIR" ]; then
        echo "Tearing down compose in: ${DIR}"
        cd "$DIR"
        docker compose down 2>/dev/null || true
        cd /root
    fi
done

echo ""

# ---- Remove old deployment directories ----

echo "--- Removing old deployment directories ---"

for DIR in /root/prod_docker-compose-derecksnotes /root/dev_docker-compose-derecksnotes; do
    if [ -d "$DIR" ]; then
        echo "Removing: ${DIR}"
        rm -rf "$DIR"
    else
        echo "Not found: ${DIR} (skipping)"
    fi
done

echo ""

# ---- Handle data directories ----

echo "--- Cleaning old data directories ---"

for DOMAIN in derecksnotes.com dev.derecksnotes.com; do
    DATA_DIR="/var/www/${DOMAIN}/data"
    if [ -d "$DATA_DIR" ]; then
        echo "Removing old data: ${DATA_DIR}"
        rm -rf "$DATA_DIR"
    fi
done

echo ""

# ---- Preserve public directories ----

echo "--- Checking public directories (these are PRESERVED) ---"

for DOMAIN in derecksnotes.com dev.derecksnotes.com; do
    PUBLIC_DIR="/var/www/${DOMAIN}/public"
    if [ -d "$PUBLIC_DIR" ]; then
        FILE_COUNT=$(find "$PUBLIC_DIR" -type f | wc -l)
        echo "PRESERVED: ${PUBLIC_DIR} (${FILE_COUNT} files)"
    else
        echo "Not found: ${PUBLIC_DIR} (will be created on deploy)"
    fi
done

echo ""

# ---- Create new directory structure ----

echo "--- Creating new directory structure ---"

# Repo clone targets
mkdir -p /opt/derecksnotes/prod
mkdir -p /opt/derecksnotes/dev
echo "Created: /opt/derecksnotes/{prod,dev}"

# Data directories (Docker volume mounts)
mkdir -p /var/www/derecksnotes.com/data
mkdir -p /var/www/dev.derecksnotes.com/data
echo "Created: /var/www/{domain}/data"

# Public directories (Docker volume mounts)
mkdir -p /var/www/derecksnotes.com/public
mkdir -p /var/www/dev.derecksnotes.com/public
echo "Created: /var/www/{domain}/public"

# Backup directories
mkdir -p /var/www/derecksnotes.com/backups
mkdir -p /var/www/dev.derecksnotes.com/backups
echo "Created: /var/www/{domain}/backups"

echo ""

# ---- Docker network ----

echo "--- Ensuring Docker network ---"

if docker network ls --format '{{.Name}}' | grep -q "^dereck-network$"; then
    echo "Network exists: dereck-network"
else
    docker network create dereck-network
    echo "Created: dereck-network"
fi

echo ""

# ---- Install sqlite3 ----

echo "--- Checking sqlite3 ---"

if command -v sqlite3 &>/dev/null; then
    echo "sqlite3 is installed: $(sqlite3 --version)"
else
    echo "Installing sqlite3..."
    apt-get update -qq && apt-get install -y -qq sqlite3
    echo "sqlite3 installed: $(sqlite3 --version)"
fi

echo ""

# ---- Prune old Docker images ----

echo "--- Pruning old Docker images ---"
docker image prune -af 2>/dev/null || true
echo "Done."

echo ""

# ---- Summary ----

echo "=== Migration Complete ==="
echo ""
echo "Next steps:"
echo "  1. Remove DOCKER_USERNAME and DOCKER_PASSWORD from GitHub Secrets"
echo "  2. Push the new deploy.yml to your repo"
echo "  3. Trigger a manual deploy via GitHub Actions"
echo "  4. Verify the site is running"
echo ""
echo "Directory structure:"
echo "  /opt/derecksnotes/prod/   - repo clone (deploy workflow will populate)"
echo "  /opt/derecksnotes/dev/    - repo clone (deploy workflow will populate)"
echo "  /var/www/derecksnotes.com/{data,public,backups}"
echo "  /var/www/dev.derecksnotes.com/{data,public,backups}"
