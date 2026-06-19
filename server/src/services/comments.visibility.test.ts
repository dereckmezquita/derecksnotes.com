/**
 * Thread-visibility tests for the soft-delete pipeline.
 *
 * These exist because the user explicitly flagged the deletedAt filter
 * removal as a class of bug we never want to regress on. The earlier
 * design dropped every deleted row at query time, which broke reply
 * chains when a parent was deleted between two surviving siblings. The
 * new design keeps deleted rows in the result set and lets the formatter
 * scrub them to `[DELETED]` placeholders with no author.
 *
 * The contract pinned by this file:
 *   1. Public thread INCLUDES soft-deleted rows; they render as
 *      `[DELETED]` with `user: null`, preserving reply chain structure.
 *   2. Public thread NEVER leaks the original content or author of a
 *      soft-deleted row.
 *   3. Public thread NEVER shows a pending+deleted row to anonymous
 *      callers (visibility filter still gates on `approved=1`).
 *   4. The owner CAN see their own pending+deleted row (via the userId
 *      branch of the visibility filter), but the formatter still scrubs
 *      it — the original content is not echoed back even to the author
 *      from this path.
 *   5. Reply chains survive a middle-of-chain delete: grandchild remains
 *      reachable through a `[DELETED]` parent.
 *   6. Reply count and total INCLUDE deleted slots (deleted rows occupy
 *      a visible slot in the UI).
 */
import { describe, expect, test, beforeAll } from 'bun:test';
import { randomUUID } from 'node:crypto';

// DATABASE_PATH is set by `bun run test` (see server/package.json) to point
// at an in-memory SQLite shared across all test files in the bun:test
// process. Belt-and-brace fallback for direct file runs.
if (!process.env.DATABASE_PATH) process.env.DATABASE_PATH = ':memory:';
if (!process.env.APP_ENV) process.env.APP_ENV = 'local';

const { db, schema } = await import('@db/index');
const commentService = await import('./comments');

const POST_ID = randomUUID();
const POST_SLUG = 'visibility-test';
const POST_TITLE = 'Visibility Test';

const ALICE = randomUUID();
const BOB = randomUUID();
const ANON: string | null = null;

beforeAll(async () => {
  const now = new Date().toISOString();
  await db.insert(schema.posts).values({
    id: POST_ID,
    slug: POST_SLUG,
    title: POST_TITLE,
    createdAt: now
  });
  // Usernames must be unique across the whole bun:test process — multiple
  // test files share the imported @db/index, so prefix with a random suffix
  // to avoid colliding with other test files that also seed an 'alice'.
  const suffix = randomUUID().slice(0, 8);
  await db.insert(schema.users).values([
    {
      id: ALICE,
      username: `vis-alice-${suffix}`,
      passwordHash: 'x',
      createdAt: now,
      updatedAt: now
    },
    {
      id: BOB,
      username: `vis-bob-${suffix}`,
      passwordHash: 'x',
      createdAt: now,
      updatedAt: now
    }
  ]);
});

async function insertComment(opts: {
  authorId: string;
  approved: boolean;
  parentId?: string | null;
  content?: string;
  deleted?: boolean;
}): Promise<string> {
  const id = randomUUID();
  // Compute depth from parent so the comment service's reply queries
  // can navigate correctly.
  let depth = 0;
  if (opts.parentId) {
    const parent = await db.query.comments.findFirst({
      where: (c, { eq }) => eq(c.id, opts.parentId!),
      columns: { depth: true }
    });
    depth = (parent?.depth || 0) + 1;
  }
  await db.insert(schema.comments).values({
    id,
    postId: POST_ID,
    userId: opts.authorId,
    parentId: opts.parentId || null,
    content: opts.content || 'body',
    depth,
    approved: opts.approved ? 1 : 0,
    createdAt: new Date().toISOString(),
    deletedAt: opts.deleted ? new Date().toISOString() : null
  });
  return id;
}

describe('public thread includes soft-deleted rows as [DELETED]', () => {
  test('top-level soft-deleted comment appears with scrubbed body + null user', async () => {
    const id = await insertComment({
      authorId: ALICE,
      approved: true,
      content: 'this should never leak',
      deleted: true
    });
    const page = await commentService.getCommentsForPost(POST_ID, ANON, 1, 50);
    const row = page.comments.find((c) => c.id === id);
    expect(row).toBeDefined();
    expect(row!.content).toBe('[DELETED]');
    expect(row!.isDeleted).toBe(true);
    expect(row!.user).toBeNull();
    // Defence in depth: the original body is nowhere in the serialised
    // response, even by accident through some unscrubbed field.
    expect(JSON.stringify(row)).not.toContain('this should never leak');
  });

  test('total count includes soft-deleted slots', async () => {
    // Snapshot the count, then add a deleted + a live row and confirm
    // both count.
    const before = await commentService.getCommentsForPost(
      POST_ID,
      ANON,
      1,
      50
    );
    await insertComment({ authorId: ALICE, approved: true, deleted: true });
    await insertComment({ authorId: ALICE, approved: true });
    const after = await commentService.getCommentsForPost(POST_ID, ANON, 1, 50);
    expect(after.total).toBe(before.total + 2);
  });
});

describe('pending+deleted does NOT leak to anonymous viewers', () => {
  test('an unapproved-and-deleted comment is not visible to anon', async () => {
    const id = await insertComment({
      authorId: ALICE,
      approved: false,
      deleted: true,
      content: 'secret pending body'
    });
    const page = await commentService.getCommentsForPost(POST_ID, ANON, 1, 100);
    const row = page.comments.find((c) => c.id === id);
    expect(row).toBeUndefined();
    // And nothing in the page body should mention the secret content.
    expect(JSON.stringify(page)).not.toContain('secret pending body');
  });
});

describe('owner sees their own pending+deleted but the body is scrubbed', () => {
  test('owner sees row as [DELETED] with no original content echoed', async () => {
    const id = await insertComment({
      authorId: ALICE,
      approved: false,
      deleted: true,
      content: 'my own secret pending body'
    });
    const page = await commentService.getCommentsForPost(
      POST_ID,
      ALICE,
      1,
      100
    );
    const row = page.comments.find((c) => c.id === id);
    expect(row).toBeDefined();
    expect(row!.content).toBe('[DELETED]');
    expect(row!.user).toBeNull();
    expect(JSON.stringify(row)).not.toContain('my own secret pending body');
  });

  test("a different user does NOT see another's pending+deleted row", async () => {
    const id = await insertComment({
      authorId: BOB,
      approved: false,
      deleted: true,
      content: 'bob secret'
    });
    const page = await commentService.getCommentsForPost(
      POST_ID,
      ALICE,
      1,
      100
    );
    const row = page.comments.find((c) => c.id === id);
    expect(row).toBeUndefined();
  });
});

describe('reply chains survive a middle-of-chain delete', () => {
  test('grandchild is reachable through a deleted parent', async () => {
    // Build: parent (alive) → child (deleted) → grandchild (alive)
    const parent = await insertComment({ authorId: ALICE, approved: true });
    const child = await insertComment({
      authorId: ALICE,
      approved: true,
      parentId: parent,
      deleted: true,
      content: 'middle-of-chain body'
    });
    const grand = await insertComment({
      authorId: BOB,
      approved: true,
      parentId: child,
      content: 'survivor'
    });

    const page = await commentService.getCommentsForPost(POST_ID, ANON, 1, 100);
    const parentRow = page.comments.find((c) => c.id === parent);
    expect(parentRow).toBeDefined();
    const childRow = parentRow!.replies.find((r) => r.id === child);
    expect(childRow).toBeDefined();
    expect(childRow!.content).toBe('[DELETED]');
    expect(childRow!.user).toBeNull();
    const grandRow = childRow!.replies.find((r) => r.id === grand);
    expect(grandRow).toBeDefined();
    expect(grandRow!.content).toBe('survivor');
    expect(grandRow!.user).not.toBeNull();
    // And the middle row's original body is not in the serialised tree.
    expect(JSON.stringify(parentRow)).not.toContain('middle-of-chain body');
  });

  test('reply count includes deleted children (visible slot total)', async () => {
    // Build a parent with 3 children: 2 deleted + 1 alive.
    const parent = await insertComment({ authorId: ALICE, approved: true });
    await insertComment({
      authorId: ALICE,
      approved: true,
      parentId: parent,
      deleted: true
    });
    await insertComment({
      authorId: BOB,
      approved: true,
      parentId: parent,
      deleted: true
    });
    await insertComment({
      authorId: BOB,
      approved: true,
      parentId: parent
    });
    const page = await commentService.getCommentsForPost(POST_ID, ANON, 1, 100);
    const parentRow = page.comments.find((c) => c.id === parent);
    expect(parentRow).toBeDefined();
    // replyCount counts the visible slot total — deleted children occupy
    // a slot because they render as [DELETED].
    expect(parentRow!.replyCount).toBe(3);
  });
});

describe('getRepliesForComment honours the same contract', () => {
  test('paginated expand returns deleted children as [DELETED]', async () => {
    const parent = await insertComment({ authorId: ALICE, approved: true });
    const deletedChild = await insertComment({
      authorId: ALICE,
      approved: true,
      parentId: parent,
      deleted: true,
      content: 'expand-leak-check'
    });
    const liveChild = await insertComment({
      authorId: BOB,
      approved: true,
      parentId: parent
    });
    const page = await commentService.getRepliesForComment(parent, ANON, 1, 20);
    const dRow = page.replies.find((r) => r.id === deletedChild);
    expect(dRow).toBeDefined();
    expect(dRow!.content).toBe('[DELETED]');
    expect(dRow!.user).toBeNull();
    const lRow = page.replies.find((r) => r.id === liveChild);
    expect(lRow).toBeDefined();
    expect(lRow!.content).not.toBe('[DELETED]');
    expect(JSON.stringify(page)).not.toContain('expand-leak-check');
    // Total counts both children (deleted included).
    expect(page.total).toBeGreaterThanOrEqual(2);
  });
});
