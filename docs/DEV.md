# Development Guide

## Quick Start

```bash
# Install dependencies (from project root)
bun install
cd client && bun install && cd ..
cd server && bun install && cd ..

# Start development
bun run dev
```

The server automatically initializes the database on startup (runs migrations and seeds if needed).

## Available Scripts

All scripts can be run from the project root:

### Development

| Command | Description |
|---------|-------------|
| `bun run dev` | Start both client and server in development mode |
| `bun run build` | Build the client for production |
| `bun run start` | Start both client and server in production mode |
| `bun run format` | Format all code with Prettier |
| `bun run test` | Run tests |

### Database

| Command | Description |
|---------|-------------|
| `bun run db:generate` | Generate new migration from schema changes |
| `bun run db:migrate` | Apply pending migrations |
| `bun run db:seed` | Seed the database with default data |
| `bun run db:reset` | **Delete and recreate** the database from scratch |
| `bun run db:studio` | Open Drizzle Studio to browse the database |

## Database Workflow

### Making Schema Changes

1. Edit schema files in `server/src/db/schema/`
2. Generate migration: `bun run db:generate`
3. Restart the server (migrations auto-apply on startup)

### Fresh Database Setup

The server auto-initializes on startup, but you can also manually:

```bash
bun run db:reset
```

This deletes the database and recreates it with all migrations and seed data.

### Viewing Data

```bash
bun run db:studio
```

Opens a web UI to browse and edit database records.

## Project Structure

```
derecksnotes.com/
├── client/          # Next.js frontend
│   ├── src/
│   │   ├── app/         # App router pages
│   │   ├── components/  # React components
│   │   ├── context/     # React context providers
│   │   └── utils/       # Utility functions
│   └── package.json
├── server/          # Express backend
│   ├── src/
│   │   ├── db/          # Database (Drizzle ORM)
│   │   ├── routes/      # API routes
│   │   ├── services/    # Business logic
│   │   └── middleware/  # Express middleware
│   ├── drizzle/         # Migration files
│   └── package.json
├── dev/             # Development documentation
└── package.json     # Root package (scripts, formatting)
```

## Environment Variables

### Server (`server/.env`)

```env
# Required
ADMIN_USERNAME=your_admin_username   # User elevated to admin on registration

# Optional (have defaults)
BUILD_ENV=local                       # local | production
PORT=3001                             # API server port
DATABASE_PATH=./data/database.sqlite  # SQLite database location
BASE_URL=http://localhost:3000        # Frontend URL (for CORS)
```

## Known Issues

### Deprecation Warning (util._extend)

You may see this warning when running the client:

```
[DEP0060] DeprecationWarning: The `util._extend` API is deprecated
```

**This is cosmetic and does not affect functionality.** It comes from the `zod` validation library using a deprecated Node.js API internally. The app works correctly despite this warning.

### Port Conflicts

If ports 3000-3002 are in use, the client will automatically try higher ports. Check the console output for the actual URL.

### Gitignore Conflicts

Be careful with `.gitignore` patterns. Broad patterns like `logs` can match directories you want tracked (e.g., `client/src/app/admin/logs/`). Use more specific patterns:

```gitignore
# Good - specific patterns
*.log
/logs/

# Bad - too broad, may match wanted directories
logs
```

## Admin Setup

1. Set `ADMIN_USERNAME` in `server/.env`
2. Register a user with that username through the app
3. The user is automatically added to the admin group
4. Access the admin dashboard at `/admin`

### Admin Features

- **Dashboard**: Overview stats and quick actions
- **Comments**: Approve/reject pending comments
- **Users**: Search, ban/unban, manage group assignments
- **Reports**: Review and resolve user reports
- **Audit Log**: View all admin actions
- **Server Logs**: View, filter, and download server logs
- **Analytics**: Site usage statistics
- **Groups**: Manage permission groups

### Permission System

Users are assigned to groups, and groups have permissions:

- **admin**: Full access to all features
- **moderator**: Comment moderation, limited user management
- **trusted**: Comments auto-approved
- **user**: Standard user permissions

## Deployment

### Prerequisites

Install the GitHub CLI:

```bash
# macOS
brew install gh

# Authenticate
gh auth login
```

### Manual Deployment via GitHub CLI

The deploy workflow can be triggered from any branch using the GitHub CLI:

```bash
# Deploy to dev environment
gh workflow run deploy.yml --ref <branch-name> -f environment=dev

# Deploy to prod environment
gh workflow run deploy.yml --ref <branch-name> -f environment=prod

# Example: Deploy current branch to prod
gh workflow run deploy.yml --ref DN-11-content-improvements-and-cleanup -f environment=prod
```

### Monitor Workflow Progress

```bash
# List recent workflow runs
gh run list --workflow=deploy.yml

# Watch a specific run (get ID from list above)
gh run watch <run-id>

# View logs for a run
gh run view <run-id> --log
```

### Automatic Deployment

- **Production**: Automatically deploys when a GitHub Release is published
- **Manual**: Use the GitHub Actions UI or CLI (requires workflow to be on default branch for UI)

### Deployment Configuration

The workflow creates a `.env` file on the VPS with these variables:

| Variable | Prod | Dev |
|----------|------|-----|
| `DATA_PATH` | `/var/www/derecksnotes.com/data` | `/var/www/dev.derecksnotes.com/data` |
| `PUBLIC_PATH` | `/var/www/derecksnotes.com/public` | `/var/www/dev.derecksnotes.com/public` |
| `PORT_CLIENT` | 3000 | 3010 |
| `PORT_SERVER` | 3001 | 3011 |

### Checking Container Status on VPS

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
```

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, styled-components
- **Backend**: Express 5, Bun runtime, TypeScript
- **Database**: SQLite with Drizzle ORM
- **Auth**: Session-based with secure cookies
