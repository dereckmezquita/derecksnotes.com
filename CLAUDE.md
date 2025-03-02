# CLAUDE.md - Guidelines for derecksnotes.com

## Project Architecture
- **Client**: Next.js frontend in `/client` directory (React 19, TypeScript)
- **Server**: Express backend in `/server` directory (Bun runtime, TypeScript)
- These components are deployed separately in CI/CD but work together as a complete application
- Client handles rendering and MDX content; server manages comments, users, and data persistence

## Build and Dev Commands
- Dev (both): `yarn dev` (runs client & server concurrently)
- Client dev: `cd client && yarn dev`  
- Server dev: `cd server && bun run dev`
- Lint client: `cd client && yarn lint`
- Format all: `yarn format` (uses prettier)
- Test: `yarn test` (Jest)
- Build client: `cd client && yarn build`

## Code Style Guidelines
- TypeScript: strict mode, ESNext modules
- Formatting: Prettier with 4-space indent, 80 char width, single quotes, no trailing comma
- React components: `.tsx` extension, functional components with explicit types
- Path aliases: Use `@/*` for src imports in client
- Error handling: Wrap async operations in try/catch with appropriate user feedback
- Naming: camelCase for variables/functions, PascalCase for components/classes
- File structure: Components in `/components`, utilities in `/utils`, context in `/context`
- MDX content: Blog posts in `/app/blog/posts`, use proper frontmatter for metadata
- Import order: React, libraries, components, utils, styles (group by type)

Run `yarn format` before committing changes.