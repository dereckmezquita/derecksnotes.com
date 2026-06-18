# Contributing to Dereck's Notes

Thank you for considering contributing. Below is what you need to get set up locally and the conventions this repo uses.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (JavaScript runtime)
- Git

### Setup

1. **Fork** the repo and clone your fork.
2. **Install dependencies** (workspaces handle `client`, `server`, `shared` in one go):
   ```bash
   bun install
   ```
   This also wires the native git hooks under `.githooks/` via the `prepare` script. If your commits later land without auto-formatting or branch-prefixing, re-run `bun install`.
3. **Start development**:
   ```bash
   bun run dev
   ```
   Runs the client on `:3000` and the server on `:3001` concurrently.

### Available Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Client + server in development mode |
| `bun run build` | Production-style build of the client |
| `bun run start` | Run the built client + server |
| `bun run format` | Prettier across the whole repo |
| `bun run lint` | ESLint on the client |
| `bun run typecheck` | TypeScript `--noEmit` on the client |
| `bun run test` | `bun test` |
| `bun run db:generate` | Generate a Drizzle migration from schema changes |
| `bun run db:migrate` | Apply pending migrations |
| `bun run db:seed` | Seed the database with default data |
| `bun run db:reset` | Reset the database (development only) |
| `bun run db:studio` | Open Drizzle Studio (DB browser) |

## Code Style

- **TypeScript**: strict mode, ESNext modules.
- **Formatting**: 2-space indent, 80-char width, single quotes, no trailing comma (defined in root `package.json` under `"prettier"`).
- **React**: functional components, explicit prop types.
- **Imports**: use `@/*` path aliases in client code.

The `pre-commit` hook runs `bun run format` on every commit so formatting is automatic — you shouldn't need to run it by hand.

## Pull Requests

1. **Branch**: pick a descriptive name. If you prefix the name with `LETTERS-NUMBER` (e.g. `DN-42`, `FEAT-7`), the `commit-msg` hook will auto-prefix every commit subject with it. Without that pattern, commits go through as-is.
2. **Commit messages**: short subjects; the hook strips newlines so write the meaning in the subject. (For longer rationale, put it in the PR description.)
3. **Push** to your fork and open a PR; the [pull request template](.github/pull_request_template.md) walks you through the checklist.

## Issue Creation

- Use a descriptive title.
- Provide reproduction steps and screenshots where useful.
- Add relevant labels.

## Project Structure

```
derecksnotes.com/
├── client/          # Next.js 15 frontend (workspace)
│   └── src/
│       ├── app/         # App Router pages
│       ├── components/  # React components (mdx/, graph/, ui/, ...)
│       └── lib/         # graph simulation + WebGL renderer
├── server/          # Express 5 + Bun backend (workspace)
│   └── src/
│       ├── db/          # SQLite + Drizzle
│       ├── routes/      # API routes
│       ├── services/    # graph builder, search index
│       └── middleware/  # auth + permissions
├── shared/          # types shared between client and server (workspace)
├── scripts/         # deploy + maintenance helpers
└── .githooks/       # pre-commit + commit-msg hooks (wired by `bun install`)
```

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](https://www.contributor-covenant.org/version/2/0/code_of_conduct/).

## License

Contributions are licensed under [CC BY-NC-ND 4.0](LICENSE).

## Thank You

Thank you for contributing to Dereck's Notes!
