# Dereck's Notes - Server

Express 5 backend API for [derecksnotes.com](https://www.derecksnotes.com).

## Tech Stack

- **Express 5**: Async/await support
- **Bun Runtime**: Fast JavaScript runtime
- **SQLite + Drizzle ORM**: Type-safe database
- **Session Auth**: HTTP-only cookie authentication

## Development

```bash
# From project root (recommended)
bun run dev

# Or server only
cd server && bun run dev
```

Runs on [http://localhost:3001](http://localhost:3001).

## Structure

```
src/
├── db/           # Database (Drizzle ORM + SQLite)
├── routes/v1/    # API routes
│   ├── auth.ts
│   ├── users.ts
│   ├── comments.ts
│   └── admin/    # Admin endpoints
├── middleware/   # Auth & rate limiting
├── services/     # Business logic
└── lib/          # Utilities
```

## API Overview

| Route | Description |
|-------|-------------|
| `/auth` | Register, login, logout, sessions |
| `/users` | Profile management |
| `/comments` | CRUD, likes/dislikes |
| `/reports` | Submit reports |
| `/admin/*` | Dashboard, users, comments, reports, audit, logs, analytics |

## Database Commands

```bash
bun run db:generate  # Generate migration
bun run db:migrate   # Apply migrations
bun run db:seed      # Seed data
bun run db:reset     # Reset database
bun run db:studio    # Browse database
```

## Environment

```env
SESSION_SECRET=your-secret-key
ADMIN_USERNAME=your_admin_username
BUILD_ENV=local  # local | dev | prod
```

## Permission Groups

| Group | Access |
|-------|--------|
| admin | Full access |
| moderator | Comment moderation |
| trusted | Auto-approved comments |
| user | Standard access |

See the [main README](../README.md) for full documentation.
