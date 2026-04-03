# Deployment Scripts

Scripts for deploying and maintaining derecksnotes.com on a Linode VPS.

## Architecture

```
Push to main / Create release
        │
        ▼
GitHub Actions builds Docker image
        │
        ▼
Push to ghcr.io (free, private)
        │
        ▼
SSH into VPS → docker pull → docker compose up
```

Images are built in GitHub Actions (7GB RAM, no OOM issues) and stored in GitHub Container Registry (ghcr.io) — free and private. The VPS just pulls and runs.

## Directory Structure (on VPS)

```
/opt/derecksnotes/
├── prod/                          # docker-compose.yml + .env
└── dev/                           # docker-compose.yml + .env

/var/www/derecksnotes.com/
├── data/database.sqlite           # SQLite DB (Docker volume)
├── public/                        # Site images (Docker volume)
└── backups/                       # Database backups

/var/www/dev.derecksnotes.com/
├── data/database.sqlite
├── public/
└── backups/
```

## Initial Setup

### 1. Run cleanup on VPS

SSH into the VPS and run the migration script:

```bash
ssh root@your-vps
curl -O https://raw.githubusercontent.com/dereckmezquita/derecksnotes.com/master/scripts/cleanup-vps.sh
sudo bash cleanup-vps.sh
```

This removes old Docker Hub-based deployment artifacts and creates the new directory structure.

### 2. Update GitHub Secrets

Go to **GitHub repo → Settings → Secrets and variables → Actions** and ensure these secrets exist:

| Secret | Description |
|--------|-------------|
| `REMOTE_HOST` | VPS IP address or hostname |
| `REMOTE_USERNAME` | SSH username (usually `root`) |
| `REMOTE_PASSWORD` | SSH password |
| `REMOTE_PORT` | SSH port (usually `22`) |
| `SESSION_SECRET` | Cookie signing key. Generate: `openssl rand -base64 32` |
| `ADMIN_USERNAME` | Username that gets auto-elevated to admin on registration |

Remove these old secrets if they exist:
- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

### 3. First deploy

Trigger a manual deploy from **GitHub → Actions → Deploy → Run workflow** and select the `dev` environment to test.

## GitHub Actions Workflows

### `deploy.yml` — Build and Deploy

| Trigger | Environment |
|---------|-------------|
| GitHub Release (published) | prod |
| Manual (workflow_dispatch) | dev or prod (you choose) |

Builds the Docker image in CI, pushes to ghcr.io, then SSHs into VPS to pull and start containers.

### `update-secrets.yml` — Update Secrets Only

Manual trigger. Rewrites the `.env` file from current GitHub Secrets and restarts containers. No rebuild — use this when you change a secret but don't have a code change.

### `backup-db.yml` — Database Backup

| Trigger | Environment |
|---------|-------------|
| Daily cron (3 AM UTC) | prod |
| Manual (workflow_dispatch) | dev or prod (you choose) |

Creates timestamped, compressed SQLite backups with rotation.

## Scripts

### `backup-db.sh`

Safe SQLite hot backup with rotation. Can be run directly on the VPS:

```bash
./scripts/backup-db.sh /var/www/derecksnotes.com/data/database.sqlite \
                       /var/www/derecksnotes.com/backups \
                       30
```

Arguments:
1. Path to SQLite database file
2. Directory to store backups
3. Number of backups to keep (default: 30)

### `cleanup-vps.sh`

One-time migration script. Removes old deployment setup, preserves public assets, creates new directory structure.

## Restoring a Backup

```bash
ssh root@your-vps

# Stop the containers
cd /opt/derecksnotes/prod
docker compose down

# Decompress the backup
gunzip -k /var/www/derecksnotes.com/backups/db-2026-04-02-0300.sqlite.gz

# Replace the database
cp /var/www/derecksnotes.com/backups/db-2026-04-02-0300.sqlite \
   /var/www/derecksnotes.com/data/database.sqlite

# Restart
docker compose up -d
```

## Ports

| Environment | Client | Server |
|-------------|--------|--------|
| prod | 3000 | 3001 |
| dev | 3010 | 3011 |

## Troubleshooting

**Container won't start:** Check logs: `cd /opt/derecksnotes/prod && docker compose logs`

**Health check failing:** `curl http://localhost:3001/api/health`

**Disk full:** `docker system prune` to free space from old images/containers.

**Database locked:** Restart: `docker compose restart`
