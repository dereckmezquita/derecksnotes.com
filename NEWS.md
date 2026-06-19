# derecksnotes.com Change Log

## v6.4.0 - Recursive course content: source/output split, index pages (2026-06)

Long-form courses move from a co-mingled, level-coded layout to a uniform, arbitrarily-deep tree with a clean source/output split. First PR of a larger content rework.

### Content model

- **One recursive node.** A folder is a container, a file is a leaf, and a folder describes itself with an optional `index.mdx` whose frontmatter is the same shape as a leaf's. This single convention replaces the three old special files: `_series.mdx` (now a folder's `index.mdx`), `_meta.yaml` (now a chapter's `index.mdx`), and the `_passthrough` marker (now `transparent: true` in an index, which works at *any* depth, not just the top level). Nesting has no fixed ceiling.
- **Source vs output split (uniform with blog/dictionaries).** Content stays under `client/src/app/courses/posts/`. Each work (volume) gets a `src/` of authored sources (`.Rmd` + `index.mdx`) and a sibling `built/` of built output (`.mdx` + `index.mdx`) — the same "`src/` + served output" shape blog and dictionaries already use. `built/` is fully disposable: delete it and rebuild from `src/` with no loss, because every title / summary / preface now lives in `src/`, not the output (the old `_meta.yaml`-in-output pain). The fetcher serves `built/` and hides both `src/` and `built/` from the URL.

### URLs

- Order prefixes (`01-`) are a sort key only and are **stripped from the URL**; output-folder names never appear. Part filenames drop their redundant series/chapter qualifiers. Example: the old `…/01-describing-data/01-1_mathematical-statistics-1-foundations_describing-data_types-and-central-tendency` is now `…/describing-data/types-and-central-tendency`. The volume (series) overview URL is unchanged. Containers (chapters) are now their own pages.

### Navigation

- Each node's title is its **own** title; the sidebar/TOC number is positional (`1`, `1.2`) and never concatenates an ancestor title — killing the old "every part shows the series title" bug. The mechanical "Chapter N: / Part N:" labels are gone.
- The sidebar is depth-limited (default 3) with the active branch always expanded; chapter pages and the overview list their children, so deeper nodes are always reachable. Content pages gain an ancestor breadcrumb.

### Build

- **`build-content.R`** replaces the courses use of `build-rmd.R` for the new layout: given a work directory, it knits `.Rmd` and copies `.mdx` / `index.mdx` from `<work>/src/` into `<work>/built/`, with `--clean` wiping the work's `built/` and figures. `build-rmd.R` remains for not-yet-migrated sections (blog, dictionaries).

### Migration & cleanup

- `mathematical-statistics-with-R` is migrated to the new layout (per-part titles fixed at the data level from the old `part:` field; the `mathematical-statistics-with-R` family folder stays out of the URL via `transparent: true` in its `index.mdx`).
- The orphaned legacy `fetchCourseMetadata.ts` is deleted. Blog, references, and dictionaries are unchanged (still served by the existing `fetchContentMetadata`).
- **Deferred to follow-ups:** folding blog/references/dictionaries into the same engine, per-part figure namespacing, and an `old→new` URL redirect map.

## v6.3.1 - Post meta + evolution retrospective (2026-06)

A patch release. The post renderer (`ContentPost`) now displays a `date · author` meta line under the `<h1>` on every blog / course / reference page that has frontmatter to draw from. Series chapters prefer their own chapter date when present and fall back to the series date; the author is always taken from the series for chapters. Renders as a semantic `<time dateTime>` so the date is machine-readable.

Also: a new blog post, *Three rewrites, one corpus*, tracing the site across three repos (the private 2016 hand-coded original, `derecksnotes-0`'s PHP era, the cleaner `derecksnotes.com-archive`, and the present Next.js incarnation) with directory tree + PHP / JSON / Drizzle code excerpts for each.

## v6.3.0 - User Features & Account/Admin Refactor (2026-06)

Ten user-facing features land together with an admin/moderation counterpart for each, plus a structural refactor of the two largest pages on the site (`/account` and `/admin`) and the largest server route file.

### User features

- **In-app notifications**: a durable list lives on the `/account` Notifications tab and an always-on toast watcher fires on new arrivals, re-polling on tab focus. Producers are wired to comment replies, likes, approvals, mentions, follows, and moderator-inbox events.
- **@mentions in comments**: username autocomplete in the comment form, notification fan-out to mentioned users, and an admin per-user mention-mute lever for abusive cases.
- **Bookmarks**: a toggle on every content post plus an `/account` Bookmarks tab listing saved posts.
- **Follow users + Following feed**: follow other accounts, see follower/following counts on profiles, and read a Following feed of recent comments from people you follow.
- **Reports**: users can report a comment or user with a reason and details; the queue surfaces in a new admin Reports tab with bulk resolve/dismiss.
- **Profile customisation**: bio placeholder, location, and chip-style external social links on the public profile, plus a new **Top Comments** card driven by a dedicated endpoint.
- **Comment sort**: new / top / best, rendered through the shared `TabBar`.
- **Markdown preview** tab on the comment form, sharing the renderer with the rendered output so the two cannot drift.
- **Public activity feed** surfacing a user's recent comments and reactions.
- **Reading progress**: per-post tracking with a `/users/me/read-history` clear/remove endpoint.

### Admin / moderation

Every user feature ships with an admin counterpart — the planning doc was updated to require it:

- **Notifications**: a moderator inbox covers pending comments and reports, with bell-style toast batching so a burst of activity doesn't spam.
- **Comment-approved** producer notifies authors when their queued comment clears the queue.
- **Mention-mute** toggle per user.
- **Top Bookmarked Posts** panel in admin analytics.
- **Reports** tab with bulk resolve/dismiss for the new report queue.
- **Bulk approve / reject** helpers wired up alongside the existing per-row actions.

### UI polish

- **Soft-deleted comments stay in the thread** as a `[DELETED]` placeholder so reply chains are preserved; the author name and the empty Unknown link are suppressed, leaving only the timestamp and placeholder body.
- **Shared `RecordList`** primitive backs the new `/account` list tabs (Comments, History, Bookmarks, Following, Notifications).
- **Borderless `TabBar`** unifies Write / Preview on the comment form with the new comment-sort control.
- **`PostEngagement` spacing** tightened; `/account` tab labels shortened so all seven tabs fit on a laptop without horizontal scroll.
- **`/account?tab=...`**: the page reads and writes the active tab in the URL so deep links and reloads land on the right pane.
- **View public profile** shortcut added to the Profile tab.

### Structural refactor

- **Shared contracts**: duplicated client/server types and constants promoted into a single `@derecksnotes/shared` package.
- **`admin/page.tsx`**: 1,335 lines → a 70-line tab router with each tab extracted into its own component.
- **`account/page.tsx`**: 854 lines → a 110-line tab router with `ProfileTab`, `SecurityTab`, `CommentsTab`, `HistoryTab`, `BookmarksTab`, `FollowingFeedTab`, and `NotificationsTab` extracted.
- **`routes/admin.ts`**: 881 lines → `routes/admin/` with seven per-domain sub-routers and no URL-surface change.
- **Comment markdown renderer unified** so the preview matches the rendered output exactly.
- **Reply tree builder collapsed**: the duplicate async `formatCommentTree` used by reply expansion now shares the batched `formatCommentTreeBatched` path, killing the N+1 fan-out at `Show more replies`.
- **Top-comments endpoint paginated** at the SQL layer (GROUP BY + HAVING + LIMIT/OFFSET) so the public-profile card is constant-cost regardless of how prolific the user is.

### Security

- **Permission tests** pinned on comment soft-delete, edit, and bulk-delete so author-only authorization cannot regress.
- **Thread visibility tests** pinned on the deleted-comment placeholder pipeline: deleted parents stay reachable for their children, pending+deleted comments never leak to anonymous viewers, and `[DELETED]` rows never expose the original body or author.

### Bug fixes

- **SSR prerender crash** on the comment form fixed by gating the preview render on `window` and the active mode.
- **Top / best comment sort** was broken because Drizzle's `findMany` aliasing breaks the reactions subquery; ranking now happens in JS.
- **`@mentions` silently dropped** by a Drizzle IN-list binding bug — fixed, plus two `CommentItem` foot-guns around `isOwner` and negative remaining-replies counts.
- **Next 15 production build** failed because `useSearchParams` was bailing the static prerender on `/account`; fixed by wrapping the page body in `Suspense`.

### Docs

- Planning document added for the post-PR-50 user-features track, sequencing the work and listing explicit non-goals; an implementation-notes section records the divergences shipped against it.

## v6.2.0 - Account & Content Hardening (2026-06)

A research-backed pass over the account, comment, and moderation surface plus a usable admin moderation queue.

### Security

- **Session tokens hashed at rest**: the DB now stores `SHA-256` (or `HMAC-SHA256` with optional `SESSION_TOKEN_PEPPER`) of the cookie value, not the raw token. A read-only DB leak can no longer resume any live session.
- **CSRF defence-in-depth** on `/api/v1`: rejects mutating requests whose `Sec-Fetch-Site` is `none`/`cross-site` and whose `Origin`/`Referer` is not in the allowlist. `GET`/`HEAD`/`OPTIONS` unaffected.
- **Login enumeration** killed: a precomputed dummy bcrypt round runs on every failed login, so the response time no longer leaks whether a username exists.
- **Register enumeration** mitigated: email conflict now returns a generic refusal instead of "Email already registered" (TODO: switch to the Mozilla send-on-conflict pattern once an email sender is wired up).
- **Comment edit history** is no longer public: gated on `authenticate()` and visible only to the author or moderators with `comment.view.unapproved`.
- **SSE `/api/v1/graph/live`** authenticated, per-user + per-IP connection caps, explicit `node:crypto` import.
- **`ADMIN_USERNAME` bootstrap**: matching registration is auto-elevated to admin so fresh prod is never locked out; loud warning on non-local deploys when the var is empty.
- **Password length / 72-byte bcrypt truncation**: `hashPassword` / `verifyPassword` pre-hash with NFC-normalised SHA-256 → base64 so the full passphrase contributes entropy regardless of length.
- **Moderator boundary**: `user.ban` callers cannot ban admins (unless they themselves are admin), themselves, or the last remaining admin; can't stack a second ban while one is active.
- **Per-route rate limits** on password change (bcrypt CPU pin), account delete, bulk operations, and all `/admin/*` writes.
- **Audit log auth events**: register, login, logout, password change, account delete now log to `auditLog`.
- **Logout idempotency**: clears the cookie even if no live session — no more 401 on expired-cookie logout.

### Comment correctness

- **N+1 fixed**: `formatCommentTree` was ~800 SQLite round-trips per 20-row page (per-node count + per-node fetch). Replaced with a single BFS sweep + in-memory grouping. Single-digit query count, same output.
- **Soft-deleted top-level comments** no longer consume slots / inflate `total` in the page response.
- **Stable pagination**: `orderBy` gained an `asc(id)` tiebreaker so offset pages can't repeat or skip rows when timestamps collide.
- **Reaction toggle race**: `reactToComment` read-modify-write wrapped in `db.transaction()`.
- **Typed errors**: `CommentValidationError` / `NotFoundError` / `AuthError` replace the fragile `error.stack?.includes('at')` heuristic that silently coerced every business error to 500.
- **Bulk-delete fix**: previously did `N` statements and mis-reported `deleted` as the input length; now a single `inArray` UPDATE with `.returning`.

### Admin moderation queue

- Pending Comments tab is now a rich table with per-author reputation columns: account age, history (approved / rejected / pending), karma (likes minus dislikes received), groups, per-comment reactions, and a flavour badge per row (`admin`, `moderator`, `trusted`, `brand new`, `first comment`, `has rejections`, `clean history`, `unranked`).
- **Shift-click multi-select**: click a checkbox, shift-click another row → toggles every row in between to the new target state. Header checkbox is indeterminate on partial selection.
- Bulk Approve / Bulk Reject wired to the existing transactional endpoints.
- Author-facing pending badge now reads `pending review — only visible to you` with a tooltip explaining the auto-approve threshold.

### Reusable UI primitives

- `DataTable`, `DataTableWrapper`, `DataTableCheckbox`, `SelectAllCheckbox` extracted as the canonical styled table for the codebase.
- `useRangeSelect<T>(items)` hook — id-keyed multi-select with shift-click range semantics; reusable across any selectable list.
- `BulkActionBar` toolbar component that renders nothing when count is 0, with a built-in Clear button.
- `UsersTab` refactored to use the hook — gains shift-click for free.

### Backup hardening

- `scripts/backup-db.sh` runs `PRAGMA integrity_check` + `PRAGMA foreign_key_check` before gzip and `gunzip -t` after; any failure removes the bad artefact and exits non-zero so the rotation can't silently drop the last known-good copy.
- `.github/workflows/backup-db.yml` now scp's the script to the VPS and invokes it instead of inlining a duplicate (single source of truth).

### Convention & infrastructure

- **`BUILD_ENV` → `APP_ENV`** across server, client (`NEXT_PUBLIC_APP_ENV`), Dockerfile, docker-compose, CI workflows, and `.env` examples — following the [Next.js docs convention](https://nextjs.org/docs/messages/non-standard-node-env) and mirroring Vercel's own `NODE_ENV` + `VERCEL_ENV` split. `NODE_ENV=production` pinned at Docker build time so Webpack inlines the production code path through `next-mdx-remote`.
- **MDX 500 fix**: dictionary `[slug]/page.tsx` now pre-builds every MDX file on dev too. The dev "slice(0,3) + dynamicParams" split was leaving the rest to an on-demand RSC compile that crashes inside `@mdx-js/mdx`'s `recma-jsx-rewrite` under Bun. Regression test (12 cases) blocks reintroduction.
- **CI**: new `test.yml` workflow runs client + server typecheck and `bun test` on push and PRs (28/28 green).
- **Security spike** documented at `docs/spikes/2026-06-18-security-fix-research.md` — current best practices for session storage, account enumeration defences, rate-limit budgets, CSRF in 2026, password hashing edge cases, SSE security, SQLite backup durability, and Drizzle transactions. Reference for the implementations above.

## v6.1.0 - Knowledge Graph & Content Rendering Fixes (2026-06)

A WebGL knowledge-graph view of the whole corpus, dictionary UI cleanup, and a batch of MDX rendering fixes.

### New Features

- **Knowledge Graph (`/explore`)**: a force-directed view of every post, definition, and reference on the site. Drag nodes, click to pin, search across the corpus, toggle sections and edge types.
- **Inline graph embed**: a `<KnowledgeGraphEmbed />` MDX component that drops the same canvas into any blog post, with collapsible controls and a "View full screen" link.
- **NLP pipeline (server)**: tokenisation, stopword filtering, n-grams (bigrams + trigrams), TF-IDF, cosine similarity, and union-find communities — built with `natural`, persisted in SQLite.
- **New blog post**: *A Corpus as a Constellation* — a long-form essay on how the graph is built and what the data revealed.

### Cleanup & UX

- **Dictionary sidebar standardisation**: identical layout on listing and entry pages; markdown stripped from tag pills; consistent links to the Knowledge Graph in the About section and footer.
- **Dev/prod SSG split** for dictionary `[slug]` pages: prebuild only the first 3 slugs in dev (`dynamicParams = true` handles the rest on demand) so dev builds stay fast; full SSG in prod.

### MDX Rendering Fixes

- **Drop cap**: preserves the trailing space of the first text node so a same-paragraph link doesn't lose the space before it (`rehypeDropCap.ts`).
- **MDX summary extractor**: recurses into inline children so link / emphasis / strong / code text is no longer dropped from card summaries (`extractMdxSummary.ts`), with unit tests.
- **Math content**: replaced stray placeholder tokens (`'NNNNN'`) that had leaked through the math-protection pass back to `$` / `$$` delimiters across 5 dictionary entries (capm, gradient-boosting, neural-network, normal-distribution, poisson-distribution).

### Server / Graph Builder

- **Heading extractor**: strips fenced code blocks before scanning (R uses `##` as a comment prefix), and dedupes anchors per file — fixes the foreign-key constraint failures that were skipping 12 MDX files from the graph index.
- **`/explore` page refactor**: extracted the canvas + simulation + render loop into a reusable `KnowledgeGraphCanvas` component (614 → ~177 LOC for the page), reused by both `/explore` and the inline embed.
- **Hover tooltip**: now clamps to the canvas bounds in all four directions, fixing overflow in the smaller embed.

### Build Tooling

- **Husky → native git hooks**: migrated to `.githooks/` (pre-commit auto-formats with Prettier; commit-msg prefixes the subject with `^[A-Za-z]+-[0-9]+` if the branch matches). The `prepare` script in root `package.json` wires `core.hooksPath` on `bun install` — no more `husky` dep, no `node_modules` magic.
- **SSL certs**: switched the renewal pipeline on the VPS from manual DNS-01 challenges to the `certbot-dns-linode` plugin so cron renewals are fully automatic.

### Sidebar & Footer

- New **Knowledge Graph** section in the About panel of every sidebar (dictionary listings, dictionary entries, content posts) with a heading + short blurb + link.
- Footer gained a one-line link to the Knowledge Graph between the copyright and version chip.

---

## v5.1.0 - Page Analytics & Code Cleanup (2025-01)

Page view tracking, server logs management, and codebase modularisation.

### New Features

- **Page View Tracking**: Views, unique visitors, duration, and scroll depth per post
- **Post Reactions**: Like/dislike buttons on posts with `usePageView` hook
- **Server Logs Page** (`/admin/logs`): View, filter, soft-delete, and download logs; error summaries with resolution tracking
- **Profile Page Redesign**: Admin-style sidebar layout, simplified UI

### Code Quality

- **Centralized API Types**: New `client/src/types/api.ts` with shared type definitions
- **Modular Components**: Logs page refactored into reusable components
- **Type Fixes**: Removed duplicates, fixed frontend/backend mismatches
- **styled-components**: Fixed transient prop warnings with `$` prefix

### Database

- `0003_page_views_reactions.sql` - Page views and post reactions tables
- `0004_logs_soft_clear.sql` - Soft delete for server logs

---

## v5.0.0 - Major Architecture Overhaul (2025-01)

Major release with complete backend overhaul, admin dashboard, and UI improvements.

### Database Migration: MongoDB to SQLite

- **SQLite + Drizzle ORM**: Replaced MongoDB/Mongoose with SQLite and Drizzle ORM
- **Type-safe schema**: Full TypeScript integration with auto-generated types
- **Migrations**: Version-controlled schema changes with `drizzle-kit`
- **Simpler deployment**: No external database service required
- **Session storage**: SQLite-backed sessions (replaced Redis)

### Admin Dashboard

A complete admin panel for site management:

- **Dashboard Overview**: Stats cards showing pending comments, reports, total users
- **User Management**: Search users, view details, ban/unban, assign groups
- **Comment Moderation**: Approve/reject pending comments, bulk actions
- **Reports System**: View and resolve user reports
- **Audit Log**: Track all admin actions with timestamps
- **Role-based Access**: Permissions control what each admin/moderator can access

### Enhanced User Profiles

- **Mini Analytics**: Total likes, dislikes, positive sentiment %, average engagement
- **Session Management**: View active sessions (future: logout from other devices)
- **Improved Comments Tab**: Shows post titles with links, parent comment context
- **Better Layout**: Left-aligned labels, consistent button styling

### Comments System Improvements

- **Reddit-style Pagination**: Load 20 top-level comments initially, "Load more" button
- **Nested Reply Loading**: Load replies up to 3 levels deep, "Continue thread" for deeper
- **"X more replies"**: Load additional sibling replies on demand
- **Pending Badge**: Only visible to comment author (not other users)
- **Reduced Spacing**: More compact comment layout

### UI/UX Improvements

- **Fixed Nav Hover Bug**: Eliminated 1px white sliver at bottom of nav items (flexbox conversion)
- **Unified Theme Variables**: Single `card` background variable for consistent theming
- **Dropdown Improvements**: Proper positioning with `min-width: max-content`
- **Related Definitions Title**: Added "Related Definitions" header in dictionary sidebar
- **About Section Update**: Updated to reflect SQLite and Next.js 15

### Technical Improvements

- **Next.js 15**: Upgraded from Next.js 14
- **React 19**: Latest React version
- **Express 5**: Modern Express with better async support
- **Bun Runtime**: Fast server-side JavaScript runtime
- **Permission System**: Granular permissions with group inheritance

### Files Changed

Key files modified in this release:
- `server/src/db/` - Complete database rewrite with Drizzle
- `client/src/app/admin/` - New admin dashboard pages
- `client/src/app/profile/page.tsx` - Enhanced profile with analytics
- `client/src/components/ui/Navbar.tsx` - Flexbox conversion
- `client/src/styles/theme.ts` - Unified card background variable
- `client/src/components/comments/` - Pagination support

---

## PR #35 - Environment Variable System Overhaul & Comments Refactoring (Milestone 1)

This release implements a comprehensive environment variable management system with improved type safety, automatic URL construction, and better development workflows. It also includes a complete refactoring of the comments system.

### Server Updates

#### Environment Variable System
- Implemented a type-safe environment variable system with TypeScript typings
- Created a dedicated `env<T>` utility function for type checking and validation
- Added strict type definitions for all environment variables
- Automatic URL construction based on environment type (LOCAL/DEV/PROD)
- Simplified API endpoint prefixing with environment-aware `API_PREFIX`

#### Configuration Files
- Created comprehensive `.env.example` template file with documentation
- Added `DEV.md` with detailed setup instructions and troubleshooting guide
- Standardized environment variable naming conventions

#### Code Updates
- Updated server initialization to use new environment variable system
- Improved cookie security settings based on environment
- Updated auth routes to use auto-constructed URLs for magic links and redirects
- Enhanced server status reporting with additional environment information
- Simplified route handling with consistent API prefixing

#### Developer Experience
- Improved error messages when environment variables are missing
- Added type safety to catch configuration errors at compile time
- Enhanced documentation for local development setup

### Client Updates

#### Comments System Refactoring

- **Comments System Modularization**: Refactored the comments system to avoid code duplication between the comments section and profile page.
  - Created a shared component library at `client/src/components/comments/` with:
    - `types.ts` - Common type definitions
    - `CommentStyles.tsx` - Shared styled components
    - `CommentForm.tsx`, `CommentItem.tsx`, `CommentList.tsx` - Reusable components
    - `index.ts` - Exports all components and types

- **Profile-Specific Comment Components**: Created profile-specific comment components that maintain the original profile page styling while leveraging shared types and functionality.
  - Added `client/src/components/profile/ProfileCommentItem.tsx` - Custom component with profile-specific styling
  - Added `client/src/components/profile/ProfileCommentList.tsx` - List wrapper for profile comments
  - Components maintain the original look and feel of profile comments while eliminating code duplication

#### Benefits:
- Eliminated redundant code between comments section and profile page
- Improved maintainability with consistent component structure
- Preserved the unique styling requirements for each context
- Better separation of concerns
- More extensible architecture for future features

#### Comment Timestamp Improvements
- Changed comment timestamps from relative time format ("5 minutes ago") to absolute timestamps with format YYYY-MM-DD HH:MM:SS
- For edited comments, display the last edit timestamp by default
- Added hover tooltip functionality for edited comments that shows the original creation time
- Improved user experience with custom styled tooltips
- Consistent implementation across both regular comments and profile page comments

#### User Experience Improvements
- Modified user icon in navbar to directly link to profile page when logged in
- Removed user status modal - now clicking the user icon takes logged-in users straight to their profile
- Simplified login flow: after successful login, users can access profile directly from navbar
- Auth modal automatically closes when login is successful
- Fixed TypeScript type errors for custom data attributes used in tooltips

#### Database Schema Improvements
- Added title field to Post model schema
- Updated syncPostsToDB script to store post titles in the database
- Comments in profile section now display post titles with links
- Fixed association between comments and posts for better navigation

#### User Profile Improvements
- Added a dedicated logout button to the profile page
- Placed in the sidebar below profile information for easy access
- Styled with 'danger' variant to visually distinguish it from other actions
- Implements error handling with user feedback
- Automatically redirects to home page after successful logout

#### UI Enhancements
- Replaced emoji-based like/dislike buttons with SVG icons for a more professional look
- Enhanced button styling with subtle hover effects and better visual feedback
- Improved consistency with the site's overall design language
- Added proper disabled state styling for better user feedback
- Fixed comments functionality for dictionary entries with proper slug handling

## Coming Soon
