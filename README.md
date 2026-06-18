# [derecksnotes.com](https://www.derecksnotes.com) <img src="./.graphics/512-derecks-notes-logo.png" width="75" align="right">

Welcome to version `v6.1.0` of [Dereck's Notes](https://www.derecksnotes.com). This release adds a Knowledge Graph view of the whole corpus, cleans up the dictionary UI, and ships a number of MDX and content-rendering fixes.

<p align="center">
    <img src="./.graphics/screen-captures/site-capture-full.png" width="750">
</p>

## What's New in v6.1

- **Knowledge Graph**: a WebGL force-directed view of every post, definition, and reference on the site. Drag a node, search across the corpus, watch the unexpected connections bloom. Visit [/explore](https://www.derecksnotes.com/explore).
- **Inline graph embed**: the same canvas drops into any blog post as `<KnowledgeGraphEmbed />`, with its own collapsible controls and a click-to-fullscreen link.
- **New essay**: *A Corpus as a Constellation* — a long-form post on how the graph is built and what twelve thousand nodes revealed.

For the full changelog (including the rendering fixes, build-tooling migration, and other under-the-hood work), see [NEWS.md](NEWS.md).

<p align="center">
    <img src="./.graphics/screen-captures/interactive-profile.png" width="750">
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

The pre-commit hook auto-formats with Prettier; the commit-msg hook prefixes commit subjects with the branch name. If commits land without those, your hooks aren't wired — re-run `bun install`.

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
└── .githooks/       # pre-commit + commit-msg hooks
```

## Features

- **Knowledge Graph**: visit [/explore](https://www.derecksnotes.com/explore) and drag a node, click one, search across the whole corpus.
- **Dictionaries**: biology, chemistry, mathematics — wikilinked entries with KaTeX/MathJax-rendered formulae.
- **Comments**: nested Reddit-style threads on every blog post.
- **Admin dashboard**: user management, comment moderation, audit log.
- **Interactive blog filter**: by category, date, and search.

## Documentation

- [Contributing](CONTRIBUTING.md) — how to contribute
- [Changelog](NEWS.md) — version history
- [Scripts README](scripts/README.md) — deployment + maintenance

## License

Licensed under Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0). See [LICENSE](LICENSE).
