# Deployment Scripts

Scripts for deploying and maintaining derecksnotes.com on a Linode VPS.

## Architecture

```
Push to main/release
        │
        ▼
GitHub Actions SSHs into VPS
        │
        ▼
git pull → docker compose build → write .env → docker compose up
```

No Docker Hub. No registry. The VPS builds images locally from source.

## Directory Structure (on VPS)

```
/opt/derecksnotes/
├── prod/                          # git clone (master branch)
└── dev/                           # git clone (feature branches)

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
# Copy the script or clone the repo first
bash cleanup-vps.sh
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

SSHs into VPS, pulls latest code, builds Docker image, writes `.env`, starts containers.

### `update-secrets.yml` — Update Secrets Only

Manual trigger. Rewrites the `.env` file from current GitHub Secrets and restarts containers. No rebuild — use this when you change a secret but don't have a code change.

### `backup-db.yml` — Database Backup

| Trigger | Environment |
|---------|-------------|
| Daily cron (3 AM UTC) | prod |
| Manual (workflow_dispatch) | dev or prod (you choose) |

Runs `scripts/backup-db.sh` on the VPS. Creates timestamped, compressed SQLite backups.

## Scripts

### `backup-db.sh`

Safe SQLite hot backup with rotation.

```bash
# On VPS directly:
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
# SSH into VPS
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

**Build fails on VPS:** Check disk space (`df -h`). Docker builds need ~2GB free. Run `docker system prune` to free space.

**Container won't start:** Check logs: `cd /opt/derecksnotes/prod && docker compose logs`

**Health check failing:** The server health endpoint is `GET /api/health` on port 3001. Check: `curl http://localhost:3001/api/health`

**Database locked:** SQLite can lock under concurrent writes. The backup script uses `.backup` which is safe. If the app reports locking, restart: `docker compose restart`
