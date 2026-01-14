# [derecksnotes.com](https://www.derecksnotes.com) <img src="./.graphics/512-derecks-notes-logo.png" width="75" align="right">

Welcome to version `v5.0.0` of [Dereck's Notes](https://www.derecksnotes.com). This major release brings a complete backend overhaul with SQLite, a new admin dashboard, enhanced user profiles, and significant UI improvements.

<p align="center">
    <img src="./.graphics/screen-captures/site-capture-full.png" width="750">
</p>

## What's New in v5.0

- **SQLite Database**: SQLite with Drizzle ORM for simpler deployment and better performance
- **Admin Dashboard**: Full-featured admin panel for user management, comment moderation, and audit logging
- **Enhanced User Profiles**: Mini analytics, session management, and improved comment history
- **Reddit-style Comments**: Pagination, nested replies, and "load more" functionality
- **Role-based Permissions**: Granular admin, moderator, and user permission system
- **UI Refinements**: Fixed navbar hover states, unified theme variables, improved mobile responsiveness

<p align="center">
    <img src="./.graphics/screen-captures/interactive-comments.png" width="750">
</p>

<p align="center">
    <img src="./.graphics/screen-captures/interactive-myprofile.png" width="750">
</p>

## Technical Overview

### Frontend

- **Next.js 15**: App Router with React Server Components
- **React 19**: Latest React with improved performance
- **TypeScript**: Strict mode for type safety
- **MDX**: Blog posts and content written in MDX
- **styled-components**: CSS-in-JS styling with theming support

### Backend

- **Express 5**: Modern Express with async/await support
- **Bun Runtime**: Fast JavaScript runtime for the server
- **SQLite + Drizzle ORM**: Type-safe database with migrations
- **Session Auth**: Secure cookie-based authentication

### Infrastructure

- **Docker**: Containerised deployment
- **GitHub Actions**: CI/CD for testing and deployment
- **Nginx**: Reverse proxy with SSL termination

## Quick Start

```bash
# Install dependencies
bun install
cd client && bun install && cd ..
cd server && bun install && cd ..

# Start development (runs both client and server)
bun run dev
```

The server automatically initialises the database on startup.

See [docs/DEV.md](docs/DEV.md) for detailed development instructions.

## Project Structure

```
derecksnotes.com/
├── client/          # Next.js 15 frontend
│   ├── src/
│   │   ├── app/         # App Router pages
│   │   ├── components/  # React components
│   │   ├── context/     # React context providers
│   │   └── styles/      # Theme and global styles
│   └── package.json
├── server/          # Express 5 backend
│   ├── src/
│   │   ├── db/          # SQLite + Drizzle ORM
│   │   ├── routes/      # API routes
│   │   └── middleware/  # Auth & permissions
│   └── package.json
├── docs/            # Documentation
└── package.json     # Root scripts
```

## Features

### User Accounts
Create accounts, log in, and manage your profile with session management and password changes.

### Comments System
Leave comments on blog posts with nested replies, likes/dislikes, and pagination.

### Admin Dashboard
Manage users, moderate comments, view reports, and audit admin actions.

### Interactive Blog Filter
Filter posts by category, date, and search terms.

<p align="center">
    <img src="./.graphics/screen-captures/interactive-filter-full.png" width="750">
</p>

## Documentation

- [Development Guide](docs/DEV.md) - Setup, commands, and troubleshooting
- [Contributing](CONTRIBUTING.md) - How to contribute
- [Changelog](NEWS.md) - Version history

## License

This project is licensed under the Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0) License. See the [LICENSE](LICENSE) file for details.

