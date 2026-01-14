# Project Conventions

Guidelines and conventions for working with the derecksnotes.com codebase. This document is intended for both human developers and AI assistants.

## Quick Reference

```bash
bun run dev          # Start client + server
bun run format       # Format code (run before commits)
bun run db:studio    # Browse database
bun run db:reset     # Reset database
```

## Architecture Overview

```
derecksnotes.com/
├── client/          # Next.js 15 frontend (React 19, TypeScript)
│   ├── src/
│   │   ├── app/         # App router pages + MDX blog posts
│   │   ├── components/  # React components
│   │   ├── context/     # React context providers
│   │   └── utils/       # Utility functions
│   └── package.json
├── server/          # Express 5 backend (Bun runtime, TypeScript)
│   ├── src/
│   │   ├── db/          # Database (Drizzle ORM + SQLite)
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── middleware/  # Express middleware
│   ├── drizzle/         # Migration files
│   └── package.json
├── docs/            # Project documentation
├── .github/         # GitHub Actions workflows
├── docker-compose.yml
├── Dockerfile
└── package.json     # Root package (scripts, formatting)
```

### Key Architecture Decisions

- **Monorepo**: Client and server in same repo, deployed together in single Docker container
- **No standalone mode**: Next.js runs in default server mode (not `output: 'standalone'`) to preserve MDX source files at runtime
- **Single container**: Both Next.js (port 3000) and Express (port 3001) run in one container
- **SQLite**: Database file is persisted via Docker volume mount
- **Nginx reverse proxy**: Handles SSL, rate limiting, and routes traffic to containers

## Related Projects

This project depends on a separate nginx reverse proxy project:

```
# Nginx project (separate repo)
derecksprojects/website/derecks-nginx/
├── sites/
│   └── derecksnotes.conf    # Nginx config for this site
├── Dockerfile
└── docker-compose.yml
```

The nginx project:
- Handles SSL termination (Let's Encrypt certificates)
- Routes traffic to containers (prod on ports 3000/3001, dev on 3010/3011)
- Manages rate limiting (50r/s with burst 100)
- Blocks bad bots
- Runs on the same Docker network (`dereck-network`)

**Important**: Changes to nginx config require deploying the nginx project separately.

## Infrastructure Overview

```
                    ┌─────────────────────────────────────────┐
                    │              Linode VPS                  │
                    │                                          │
Internet ──────────►│  nginx container (ports 80/443)         │
                    │       │                                  │
                    │       ├──► prod_derecksnotes (3000/3001)│
                    │       │                                  │
                    │       └──► dev_derecksnotes (3010/3011) │
                    │                                          │
                    │  Volumes:                                │
                    │   /var/www/derecksnotes.com/data/        │
                    │   /var/www/derecksnotes.com/public/      │
                    │   /var/www/dev.derecksnotes.com/data/    │
                    │   /var/www/dev.derecksnotes.com/public/  │
                    └─────────────────────────────────────────┘
```

## GitHub Workflows

### Deploy Workflow (`.github/workflows/deploy.yml`)

Triggered by:
1. **Manual dispatch** - Via GitHub CLI or Actions UI
2. **Release published** - Auto-deploys to prod when a GitHub Release is created

The workflow:
1. **Build job**: Builds Docker image and pushes to Docker Hub (`dereckmezquita/derecksnotes:prod` or `:dev`)
2. **Deploy job**:
   - Copies `docker-compose.yml` to VPS
   - Creates `.env` file with deployment config
   - Pulls new image and restarts container

### Triggering Deployments

```bash
# Deploy to dev environment
gh workflow run deploy.yml --ref <branch-name> -f environment=dev

# Deploy to prod environment
gh workflow run deploy.yml --ref <branch-name> -f environment=prod

# Monitor workflow progress
gh run list --workflow=deploy.yml
gh run watch <run-id>
```

**Note**: The GitHub Actions UI only shows workflows from the default branch (master). Use the CLI to deploy from feature branches.

### Required GitHub Secrets

- `DOCKER_USERNAME` / `DOCKER_PASSWORD` - Docker Hub credentials
- `REMOTE_HOST` / `REMOTE_USERNAME` / `REMOTE_PASSWORD` / `REMOTE_PORT` - VPS SSH access
- `SESSION_SECRET` - Express session secret
- `ADMIN_USERNAME` - Username that gets auto-elevated to admin group on registration

## Code Style

### TypeScript

- Strict mode enabled
- ESNext modules
- Explicit types for function parameters and returns
- Avoid `any` - use `unknown` and type guards instead

### Formatting (Prettier)

- 4-space indentation
- 80 character line width
- Single quotes
- No trailing commas
- Run `bun run format` before committing

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variables/functions | camelCase | `getUserById`, `isActive` |
| Components/classes | PascalCase | `CommentItem`, `AuthService` |
| Files (components) | PascalCase | `CommentItem.tsx` |
| Files (utilities) | camelCase | `fetchDefinitions.ts` |
| Constants | SCREAMING_SNAKE | `MAX_COMMENT_LENGTH` |
| Database tables | snake_case | `user_groups`, `audit_log` |

### React Components

- Functional components only (no class components)
- Use `.tsx` extension
- Props interface named `{ComponentName}Props`
- Styled-components for styling (with `styled.` prefix)

```typescript
interface CommentItemProps {
    comment: Comment;
    onDelete?: (id: string) => void;
}

export function CommentItem({ comment, onDelete }: CommentItemProps) {
    // ...
}
```

### Import Order

Group imports in this order, with blank lines between groups:

1. React and Next.js
2. External libraries
3. Internal components
4. Internal utilities/services
5. Types
6. Styles

```typescript
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { format } from 'date-fns';
import styled from 'styled-components';

import { CommentList } from '@/components/comments/CommentList';
import { Button } from '@/components/ui/Button';

import { api } from '@/lib/api';
import { formatDate } from '@/utils/dates';

import type { Comment } from '@/types';
```

### Path Aliases

- Client: Use `@/*` for `src/` imports
- Server: Use `@lib/*`, `@db/*`, `@routes/*`, `@middleware/*`, `@services/*`

## Environment Configuration

### Build Environments

The `BUILD_ENV` variable controls configuration:

| Value | Usage | Database Path | Container | Ports |
|-------|-------|---------------|-----------|-------|
| `local` | Local development | `./data/database.sqlite` | N/A | 3000/3001 |
| `dev` | dev.derecksnotes.com | `/app/data/database.sqlite` | `dev_derecksnotes` | 3010/3011 |
| `prod` | derecksnotes.com | `/app/data/database.sqlite` | `prod_derecksnotes` | 3000/3001 |

### VPS Paths

| Environment | Data | Public Assets |
|-------------|------|---------------|
| Prod | `/var/www/derecksnotes.com/data` | `/var/www/derecksnotes.com/public` |
| Dev | `/var/www/dev.derecksnotes.com/data` | `/var/www/dev.derecksnotes.com/public` |

### Server Environment Variables

```env
# Required
SESSION_SECRET=your-secret-key
ADMIN_USERNAME=your_admin_username

# Optional (have defaults based on BUILD_ENV)
BUILD_ENV=local
PORT=3001
DATABASE_PATH=./data/database.sqlite
BASE_URL=http://localhost:3000
```

## Database

### Schema Changes

1. Edit schema files in `server/src/db/schema/`
2. Generate migration: `bun run db:generate`
3. Restart server (migrations auto-apply on startup)

### Important Notes

- SQLite with WAL mode enabled
- Foreign keys enforced
- Timestamps stored as integers (Unix epoch)
- Use Drizzle ORM for all queries

### Useful Commands

```bash
bun run db:generate  # Generate migration from schema changes
bun run db:migrate   # Apply pending migrations
bun run db:seed      # Seed default data
bun run db:reset     # Delete and recreate database
bun run db:studio    # Open Drizzle Studio UI
```

## Docker & Deployment

### Container Structure

Single container runs both services:
- Next.js client on port 3000
- Express API on port 3001

Volumes mount:
- `${DATA_PATH}:/app/data` - SQLite database
- `${PUBLIC_PATH}:/app/client/public` - Static assets (images)

### Express Behind Nginx

The server runs behind nginx reverse proxy. Important settings:

```typescript
// Trust exactly 1 proxy hop (nginx)
app.set('trust proxy', 1);
```

This allows rate limiting and IP detection to work correctly.

## API Conventions

### Route Structure

```
/api/v1/
├── auth/           # Authentication (login, register, logout)
├── users/          # User management
├── comments/       # Comment CRUD
├── reports/        # User reports
└── admin/          # Admin endpoints (protected)
    ├── dashboard/
    ├── users/
    ├── comments/
    ├── reports/
    ├── audit/
    ├── logs/
    ├── analytics/
    └── groups/
```

### Response Format

Success:
```json
{
    "data": { ... },
    "pagination": { "page": 1, "limit": 20, "total": 100 }
}
```

Error:
```json
{
    "error": "Error message",
    "code": "ERROR_CODE"
}
```

### Authentication

- Session-based with HTTP-only cookies
- Cookie name: `session`
- Secure cookies in dev/prod environments
- Sessions stored in database

## Testing

```bash
bun run test        # Run all tests
bun run test:watch  # Watch mode
```

## Git Workflow

### Branch Naming

- Features: `DN-{issue}-short-description`
- Fixes: `fix/{issue}-short-description`

### Commit Messages

```
DN-{issue}: Brief description

Longer explanation if needed.
```

## Common Pitfalls

| Issue | Cause | Solution |
|-------|-------|----------|
| Server Action "x" errors | Standalone mode enabled or MDX files missing | Ensure `output: 'standalone'` is NOT in next.config.ts |
| Rate limit crashes | Wrong trust proxy setting | Use `app.set('trust proxy', 1)` not `true` |
| Database not persisting | Wrong path or volume mount | Check `server/src/lib/env.ts` paths match volume mounts |
| API 404s | Nginx trailing slash issue | Check `/api/` location in nginx config |
| 503 errors | Rate limiting too aggressive | Increase `burst` in nginx config |
| Container can't start | Nginx not running | Ensure nginx container is up and `dereck-network` exists |
| CORS issues (local) | API proxy not configured | Check Next.js rewrites in next.config.ts |
| CORS issues (deployed) | Nginx not routing correctly | Check `/api/` location block in nginx config |

## VPS Debugging

```bash
# SSH to VPS
ssh user@your-vps

# Check running containers
docker ps

# View container logs
docker logs prod_derecksnotes
docker logs dev_derecksnotes

# Check database file exists
ls -la /var/www/derecksnotes.com/data/

# Check nginx logs
docker logs linode_dereck-nginx

# Restart nginx after config changes
docker restart linode_dereck-nginx
```
