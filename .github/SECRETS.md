# GitHub Secrets Configuration

This document lists all required GitHub Secrets for the CI/CD workflows.

## Required Secrets

### Docker Hub
| Secret | Description |
|--------|-------------|
| `DOCKER_USERNAME` | Docker Hub username for pushing images |
| `DOCKER_PASSWORD` | Docker Hub password or access token |

### Application Secrets
| Secret | Description |
|--------|-------------|
| `SESSION_SECRET` | Express session encryption key (generate a secure random string) |
| `MONGO_PASSWORD` | MongoDB password (URL-encoded if contains special characters) |
| `SENDGRID_API_KEY_PROD` | SendGrid API key for production email delivery |
| `SENDGRID_API_KEY_DEV` | SendGrid API key for development email delivery |

### Remote Server (Linode)
| Secret | Description |
|--------|-------------|
| `REMOTE_HOST` | Linode server hostname or IP address |
| `REMOTE_USERNAME` | SSH username (typically `root`) |
| `REMOTE_PASSWORD` | SSH password |
| `REMOTE_PORT` | SSH port (typically `22`) |

## Workflow Triggers

- **Production (`release_prod.yml`)**: Triggered on GitHub release publication
- **Development (`release_dev.yml`)**: Triggered on push to any non-master branch

## Environment Differences

| Setting | Development | Production |
|---------|-------------|------------|
| Domain | `dev.derecksnotes.com` | `derecksnotes.com` |
| Server Port | `3001` | `3003` |
| Client Port | `3000` | `3002` |
| Database | `dev_derecksnotes` | `prod_derecksnotes` |
| SendGrid Key | `SENDGRID_API_KEY_DEV` | `SENDGRID_API_KEY_PROD` |
| Docker Tag | `latest_dev` | `latest_prod` |
