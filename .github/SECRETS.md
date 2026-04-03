# GitHub Secrets Configuration

All required secrets for the CI/CD workflows. Configure in **GitHub repo → Settings → Secrets and variables → Actions**.

## Required Secrets

### Remote Server (Linode)
| Secret | Description |
|--------|-------------|
| `REMOTE_HOST` | Linode server hostname or IP address |
| `REMOTE_USERNAME` | SSH username (typically `root`) |
| `REMOTE_PASSWORD` | SSH password |
| `REMOTE_PORT` | SSH port (typically `22`) |

### Application
| Secret | Description |
|--------|-------------|
| `SESSION_SECRET` | Cookie signing key. Generate with: `openssl rand -base64 32` |
| `ADMIN_USERNAME` | Username that gets auto-elevated to admin on registration |

## Deprecated Secrets (safe to remove)

These are no longer used after the migration away from Docker Hub:

- `DOCKER_USERNAME` — Docker Hub is no longer used
- `DOCKER_PASSWORD` — Docker Hub is no longer used
- `MONGO_PASSWORD` — MongoDB is no longer used (replaced by SQLite)
- `SENDGRID_API_KEY_PROD` — Not yet implemented
- `SENDGRID_API_KEY_DEV` — Not yet implemented

## Workflows

| Workflow | Trigger | Description |
|----------|---------|-------------|
| `deploy.yml` | Release (prod) or manual (dev/prod) | Builds and deploys on VPS |
| `update-secrets.yml` | Manual only | Updates .env and restarts containers |
| `backup-db.yml` | Daily cron + manual | SQLite database backup |

## Environment Configuration

| Setting | Development | Production |
|---------|-------------|------------|
| Domain | `dev.derecksnotes.com` | `derecksnotes.com` |
| Client Port | `3010` | `3000` |
| Server Port | `3011` | `3001` |
| Repo Dir | `/opt/derecksnotes/dev` | `/opt/derecksnotes/prod` |
| Data Dir | `/var/www/dev.derecksnotes.com/data` | `/var/www/derecksnotes.com/data` |
| Public Dir | `/var/www/dev.derecksnotes.com/public` | `/var/www/derecksnotes.com/public` |
| Backups Dir | `/var/www/dev.derecksnotes.com/backups` | `/var/www/derecksnotes.com/backups` |
