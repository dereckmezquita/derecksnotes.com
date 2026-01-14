# Contributing to Dereck's Notes

Thank you for considering contributing to Dereck's Notes! Your assistance and insights are valued in making the website a fantastic resource for all users.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (JavaScript runtime)
- Git

### Setup the Project Locally

1. **Fork the Repository:** Click on the 'Fork' button and clone to your local machine
2. **Navigate to Project Directory:** `cd derecksnotes.com`
3. **Install Dependencies:**
   ```bash
   bun install
   cd client && bun install && cd ..
   cd server && bun install && cd ..
   ```
4. **Start Development:**
   ```bash
   bun run dev
   ```
   This starts both the client (port 3000) and server (port 3001) concurrently.

5. **Make Changes:** Implement your changes, fix a bug, or work on a feature
6. **Format Code:** Run `bun run format` before committing
7. **Test Your Changes:** Ensure they work as expected

### Available Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start client and server in development mode |
| `bun run build` | Build the client for production |
| `bun run format` | Format all code with Prettier |
| `bun run test` | Run tests |
| `bun run db:reset` | Reset the database (development) |
| `bun run db:studio` | Open database browser |

## Code Style

- **TypeScript**: Strict mode, ESNext modules
- **Formatting**: 4-space indent, 80 char width, single quotes, no trailing comma
- **React**: Functional components with explicit types
- **Imports**: Use `@/*` path aliases in client code

Run `bun run format` before committing changes.

## Pull Requests

1. **Create a Branch:** `git checkout -b feature/my-feature`
2. **Commit Changes:** Write clear commit messages
3. **Push:** `git push origin feature/my-feature`
4. **Open PR:** Describe your changes and link related issues

## Issue Creation

- Use a descriptive title
- Provide detailed information and steps to reproduce
- Include screenshots if applicable
- Add relevant labels

## Project Structure

```
derecksnotes.com/
├── client/          # Next.js 15 frontend
│   └── src/
│       ├── app/         # App Router pages
│       ├── components/  # React components
│       └── styles/      # Theme and styles
├── server/          # Express 5 backend
│   └── src/
│       ├── db/          # SQLite + Drizzle
│       ├── routes/      # API routes
│       └── middleware/  # Auth & permissions
└── docs/            # Documentation
```

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/).

## License

Contributions are licensed under [CC BY-NC-ND 4.0](LICENSE).

## Thank You

Thank you for contributing to Dereck's Notes!