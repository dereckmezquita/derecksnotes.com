# User features plan — PR after #50

Scope and sequencing for the post-hardening user-features PR. List was curated 2026-06-18 from a longer audit; rejected items are recorded so they don't drift back in.

## In scope

**1. In-app notifications** (bell icon + dropdown)
- New table `notifications(id, userId, type, actorUserId, targetType, targetId, payload, readAt, createdAt)`. Unread count exposed via `/api/v1/notifications/unread-count`.
- Producers: reply to your comment, like on your comment, mention in a comment.
- UI: bell in navbar with badge for unread, dropdown lists last 20, click → mark read + jump to target.
- Real-time piggy-backs on the existing SSE `/api/v1/graph/live` (rename to `/api/v1/stream`, multiplex event types).
- This is the foundation for #2 (mentions need it) and #4 (follow's feed wants it too eventually).

**2. @mentions in comments**
- `@username` in comment markdown becomes a link to the user's profile and creates a `notification` row for them.
- Autocomplete dropdown in `<CommentForm>` driven by `/api/v1/users/search?q=`.
- Server-side: on `createComment`, parse `@\w+` tokens; resolve to user ids; fan out notifications.

**3. Bookmarks / save posts**
- New table `bookmarks(id, userId, postId, createdAt)` with `(userId, postId)` unique index.
- UI: bookmark button on every post; bookmark list at `/profile/me/bookmarks` (new route).
- API: `POST /api/v1/posts/:slug/bookmark`, `DELETE /api/v1/posts/:slug/bookmark`, `GET /api/v1/users/me/bookmarks`.

**4. Follow other users**
- New table `follows(id, followerUserId, followedUserId, createdAt)` with `(follower, followed)` unique index.
- UI: Follow / Unfollow button on `/profile/[username]`; follower / following counts on profile.
- "Following" feed at `/profile/me/following-feed` listing recent comments + reactions by people you follow.

**5. Report comment / report user**
- New table `reports(id, reporterUserId, targetType, targetId, reason, status, resolvedAt, resolvedBy, createdAt)` — status: `open | resolved | dismissed`.
- UI: report button on comment + user profile; small modal with reason categories + free-text.
- Admin: new "Reports" tab in `/admin` using the existing `DataTable` + `useRangeSelect` primitives. Bulk resolve / dismiss.

**6. Profile customisation (limited)**
- Add `users.location` (max 100 chars) and `users.socialLinks` (JSON string, validated as array of `{label, url}` with HTTPS-only).
- Display-name editor (already exists) gets validation polish.
- **No pronouns, no cover image, no other fields** — explicit scope cap.

**7. Activity feed on profile**
- New endpoint `GET /api/v1/users/:username/activity` returns recent comments + reactions (paginated).
- "Activity" tab on `/profile/[username]` rendering the feed.

**8. Comment sort: best / top / new**
- New `sort` query param on `GET /api/v1/comments`: `top` (by `likes − dislikes` desc), `best` (Wilson lower bound), `new` (current default).
- UI: tab strip above the comment list.

**9. Markdown preview tab while writing comments**
- Split `<CommentForm>` into Write / Preview tabs. Preview reuses the same `marked` + `DOMPurify` pipeline as `<CommentItem>`.

**10. Reading progress / continue where you left off**
- `IntersectionObserver` on long-post page reports the % scrolled to `POST /api/v1/posts/:slug/read-progress` (debounced 5s, only writes when progress increases).
- New table `readProgress(userId, postId, percent, updatedAt)` with `(userId, postId)` unique index — replaces and extends the existing auto-tracking.
- "Continue reading" rail on `/profile/me` showing posts with 5% < progress < 95%, sorted by `updatedAt` desc.

## Admin counterparts

Each user-facing feature ships with the admin tooling needed to manage it from `/admin`. Same shared `DataTable` / `useRangeSelect` / `BulkActionBar` primitives so the moderation UX is consistent.

- **Notifications (#1)** → "Notifications" tab: send a notification to a specific user or broadcast to all users (system announcement). Volume metrics (total / unread / per-type / last 7 days).
- **Mentions (#2)** → "Mention abuse" flag on the Users tab: per-user mentions-sent count + a `mention_muted` toggle that suppresses fan-out from a problem account.
- **Bookmarks (#3)** → most-bookmarked posts column in Analytics; per-user bookmark count on the Users tab.
- **Follow (#4)** → Users tab shows follower / following counts + a "view follow graph" drill-down (who follows X, who X follows). Bulk "force-unfollow" if needed for abuse cases.
- **Reports (#5)** → this IS the admin feature: new Reports tab with rich table (reporter, target, reason, age, status), filter by status / target type, bulk resolve / dismiss, links to the offending content.
- **Profile customisation (#6)** → moderator action: clear a user's `location` or `socialLinks` if abused. Per-field audit-log entry on edit.
- **Activity feed (#7)** → unified "User activity" drill-down from the Users tab (recent comments + reactions + bookmarks + follows in one chronological view).
- **Reading progress (#10)** → per-post completion-rate stat on Analytics; the queue itself is user-private.

## Deferred

- OAuth login with GitHub — wanted but not this round.

## Explicit non-goals

These were considered and declined; do not reintroduce them under a different name in this PR:

- Block other users
- Pronouns in profile
- Cover / banner image in profile
- TOTP 2FA
- OAuth (apart from the deferred GitHub item)
- Private notes / annotations on posts
- "Export my data" GDPR JSON
- API tokens for personal use
- Dark / light theme toggle

## Implementation order

1. **Notifications foundation** (schema + service + bell UI + SSE multiplex). Unblocks #2 and most engagement loops.
2. **Mentions** (depends on notifications fan-out).
3. **Bookmarks** (small, independent, fast win).
4. **Follow + following-feed** (independent).
5. **Reports** (reuses `DataTable`/`useRangeSelect`/`BulkActionBar` in `/admin`).
6. **Profile customisation** (small schema + form change).
7. **Activity feed** (server query + tab on profile).
8. **Comment sort** (small).
9. **Markdown preview** (client-only, tiny).
10. **Reading progress** (small but new schema and a background write path).

Each item lands as its own commit on the PR branch so progress is visible incrementally.

## Implementation notes (v6.3.0 — what actually shipped vs. this plan)

The branch as merged diverges from the spike in a few user-visible ways. These are tracked here so the spike remains a useful historical artefact rather than a misleading one.

- **Notifications: bell removed.** Feature #1 originally proposed a navbar bell + dropdown. That prototype shipped first (`6c7efbcd`) but was reverted in `fb109fe4`. The durable list now lives on the `/account` Notifications tab and an always-on `NotificationToastWatcher` (mounted in the root layout) surfaces fresh arrivals via Sonner toasts. The watcher re-polls on `visibilitychange` so a returning user catches up without waiting out the interval.
- **Shared `RecordList`.** Not in the plan: the five list tabs on `/account` (Comments, History, Bookmarks, Following, Notifications) were collapsed onto one `RecordList` primitive — shift-click range select + bulk-action toolbar + per-row action are all driven from one source of truth.
- **Soft-delete UX.** Comments that are soft-deleted now stay in the public thread as a `[DELETED]` placeholder; the author name is suppressed but the timestamp and reply chain remain. The earlier `isNull(deletedAt)` filters on the public-thread + reply queries were dropped — the formatter already scrubs the content/user, so deleted rows render as placeholders without leaking the original body or author.
- **Public-profile expansion.** Beyond the plan's profile-customisation item: an always-rendered bio (with a muted placeholder when empty), a paginated **Top Comments** card (server-side `GROUP BY` + `HAVING` + `LIMIT/OFFSET` rather than a JS rank-and-slice), and chip-style social-link buttons with an `↗` external affordance.
- **Read-history clear.** New `DELETE /users/me/read-history` endpoint (no body clears all, `{ slug }` removes one) backs a "Clear all" header button + per-row bulk-remove on the History tab.
- **Comment-permission tests.** New `comments.permissions.test.ts` pins author-only authorisation on `softDeleteComment`, `editComment`, and `bulkDeleteComments`. Thread-visibility tests pin the soft-delete render pipeline so a future filter regression can't break reply chains.
- **Next 15 build fix.** Adding `useSearchParams()` to `/account` (for `?tab=` deep-linking) tripped the SSG prerender; the page body is now wrapped in `<Suspense>` so the build still emits a static shell.
- **`/account?tab=`** deep-linkable URLs. Not in the plan; needed to land alongside the bell-removal so the toast watcher's "Open" action can target a specific tab.

These items are documented here, in [`NEWS.md`](../../NEWS.md) under v6.3.0, and in the PR description.
