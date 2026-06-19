# [derecksnotes.com](https://www.derecksnotes.com) <img src="./.graphics/512-derecks-notes-logo.png" width="75" align="right">

Welcome to version `v6.3.0` of [Dereck's Notes](https://www.derecksnotes.com). This release reshapes the user surface: a unified `/account` hub for comments / history / bookmarks / following / notifications, soft-deleted comments with a `[DELETED]` placeholder that keeps reply chains intact, public-profile bios and a Top Comments card, and toast-driven notifications in place of the navbar bell.

<p align="center">
    <img src="./.graphics/screen-captures/site-capture-full.png" width="750">
</p>

## What's New in v6.3

- **Unified `/account` hub**: a single `RecordList` powers the Comments / History / Bookmarks / Following / Notifications tabs, deep-linkable via `?tab=`.
- **Notifications go inline**: the navbar bell is gone — new arrivals surface as toasts and live in `/account?tab=notifications`.
- **Soft-deleted comments**: deletions leave a `[DELETED]` placeholder that keeps thread structure intact instead of vanishing the row, so replies aren't orphaned.
- **Public profiles**: bio placeholder + Top Comments card on `/profile/[username]`, plus chip-style social-link buttons.

For the full changelog (including the rendering fixes, build-tooling migration, and other under-the-hood work), see [NEWS.md](NEWS.md).

<p align="center">
    <img src="./.graphics/screen-captures/knowledge-graph.png" width="750">
</p>

## Technical Overview

### Frontend

- **Next.js 15**: App Router with React Server Components
- **React 19**: latest, with the new compiler
- **TypeScript**: strict mode
- **MDX**: blog posts, references, dictionaries, courses
- **styled-components**: themed CSS-in-JS
- **WebGL**: custom force-directed graph renderer for `/explore`

### Backend

- **Express 5** on the **Bun** runtime
- **SQLite + Drizzle ORM**: type-safe queries and migrations
- **Session auth**: secure cookie-based
- **NLP graph pipeline**: `natural` for tokenising, stemming, n-grams, and TF-IDF

### Infrastructure

- **Docker**: containerised deployment via GitHub Container Registry
- **GitHub Actions**: build, push, and deploy on release / manual dispatch
- **Nginx**: reverse proxy + Let's Encrypt termination

## Quick Start

```bash
bun install          # installs deps and wires native git hooks via the prepare script
bun run dev          # client on :3000, server on :3001
```

Other handy scripts: `bun run format`, `bun run typecheck`, `bun run lint`, `bun run test`, `bun run build`.

The pre-commit hook auto-formats with Prettier. If commits land without formatting, your hooks aren't wired, re-run `bun install`.

## Project Structure

```
derecksnotes.com/
├── client/          # Next.js 15 frontend
│   └── src/
│       ├── app/         # App Router pages (blog, dictionaries, explore, references, ...)
│       ├── components/  # React components incl. mdx/, graph/, ui/
│       └── lib/         # graph simulation + WebGL renderer
├── server/          # Express 5 + Bun backend
│   └── src/
│       ├── db/          # SQLite + Drizzle ORM
│       ├── routes/      # API routes (auth, comments, graph, posts, search, admin)
│       └── services/    # graph builder, search index
├── shared/          # types shared between client and server
├── scripts/         # deploy + maintenance helpers
└── .githooks/       # pre-commit hook (auto-format)
```

## Features

- **Knowledge Graph**: visit [/explore](https://www.derecksnotes.com/explore) and drag a node, click one, search across the whole corpus.
- **Dictionaries**: biology, chemistry, mathematics — wikilinked entries with KaTeX/MathJax-rendered formulae.
- **Comments & social**: nested threads with Markdown Write / Preview tabs and new / top / best sort, plus @mentions, bookmarks, follow, reports, and toast notifications surfaced in `/account`. Deletions leave a `[DELETED]` placeholder so thread structure survives.
- **Admin dashboard**: user management, comment moderation, audit log.
- **Interactive blog filter**: by category, date, and search.

<p align="center">
    <img src="./.graphics/screen-captures/interactive-profile.png" width="750">
</p>

## Documentation

- [Contributing](CONTRIBUTING.md) — how to contribute
- [Changelog](NEWS.md) — version history
- [Scripts README](scripts/README.md) — deployment + maintenance

## License

Licensed under Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0). See [LICENSE](LICENSE).
