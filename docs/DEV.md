# Development Guide

## Quick Start

```bash
# Install dependencies (from project root)
bun install
cd client && npm install && cd ..
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

### Next.js SWC Lockfile Warning

You may see this warning when starting the client:

```
⨯ Failed to patch lockfile, please try uninstalling and reinstalling next
[TypeError: Cannot read properties of undefined (reading 'os')]
```

**This is cosmetic and does not affect functionality.** It's a known issue with Next.js when using bun as the package manager. The app compiles and runs correctly despite the warning.

### Port Conflicts

If ports 3000-3002 are in use, the client will automatically try higher ports. Check the console output for the actual URL.

## Admin Setup

1. Set `ADMIN_USERNAME` in `server/.env`
2. Register a user with that username through the app
3. The user is automatically added to the admin group

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, styled-components
- **Backend**: Express 5, Bun runtime, TypeScript
- **Database**: SQLite with Drizzle ORM
- **Auth**: Session-based with secure cookies
