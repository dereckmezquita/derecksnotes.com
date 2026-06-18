<!--
Welcome! Before opening this PR, a quick reminder for first-time setup:

  bun install                # installs deps AND wires up native git hooks
                             # (the `prepare` script runs `git config core.hooksPath .githooks`)

  bun run format             # Prettier across the whole repo (also runs in the pre-commit hook)
  bun run typecheck          # client-side TypeScript
  bun run lint               # ESLint on the client
  bun run test               # bun test
  bun run dev                # client on :3000, server on :3001 (concurrently)
  bun run build              # production-like build

The pre-commit hook auto-formats and the commit-msg hook prefixes your subject
with the branch name (e.g. `feature-x: …`). If commits land without the prefix
or with formatting noise, your hooks aren't wired — run `bun install` again.

For deployment / VPS / secrets setup, see `.github/SECRETS.md` and `scripts/README.md`.
-->

## Summary

<!-- One to three sentences. What does this change do and why? -->

## Changes

<!-- Bulleted list of the substantive changes. Skip mechanical noise. -->
-
-

## Test plan

<!-- How you verified this works. Delete what doesn't apply. -->
- [ ] `bun run typecheck` passes
- [ ] `bun run lint` passes
- [ ] `bun run test` passes
- [ ] Ran locally with `bun run dev` and verified the affected pages/routes
- [ ] Production-style build with `bun run build` succeeds

## Screenshots / recordings

<!-- For UI changes. Drag images directly into the PR. -->

## Checklist

- [ ] Branch name reflects the scope (the commit-msg hook will prefix commits with it)
- [ ] Code is formatted (`bun run format`) — should be automatic via the pre-commit hook
- [ ] No secrets, tokens, or `.env` files committed
- [ ] Migrations (if any) tested locally and reviewed for safety
- [ ] Self-reviewed the diff before requesting review
