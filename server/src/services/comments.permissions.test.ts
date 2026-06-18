/**
 * Permission tests for the comment service. These exist because the user
 * explicitly flagged comment-delete authorisation as a class of bug we never
 * want to regress on: only the comment's author (or a moderator going
 * through the admin path) should be able to soft-delete a comment.
 *
 * The tests run against a fresh in-memory SQLite database so they're
 * hermetic and fast. We migrate the schema, seed two users + their
 * comments, then call the service functions directly. Route-level
 * `authenticate()` / `requirePermission()` checks are tested separately
 * by the existing auth tests; here we focus on the authorisation logic
 * inside the service itself, which is the layer the user actually meant.
 */
import { describe, expect, test, beforeAll } from 'bun:test';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// IMPORTANT: set DATABASE_PATH BEFORE importing @db/index. The module reads
// it at import time and caches the Database handle.
process.env.DATABASE_PATH = ':memory:';
process.env.APP_ENV = 'local';

const { db, schema } = await import('@db/index');
const commentService = await import('./comments');

const POST_ID = randomUUID();
const POST_SLUG = 'test-post';
const POST_TITLE = 'Test Post';

const USER_ALICE = randomUUID();
const USER_BOB = randomUUID();
const USER_MALLORY = randomUUID(); // never owns anything; impersonation attempts

beforeAll(async () => {
  // Drizzle migrate() ran during @db/index import — schema is in place.
  // Seed minimal fixtures: two regular users + one post they can comment on.
  const now = new Date().toISOString();
  await db.insert(schema.posts).values({
    id: POST_ID,
    slug: POST_SLUG,
    title: POST_TITLE,
    createdAt: now,
    updatedAt: now
  });
  await db.insert(schema.users).values([
    {
      id: USER_ALICE,
      username: 'alice',
      passwordHash: 'x',
      createdAt: now,
      updatedAt: now
    },
    {
      id: USER_BOB,
      username: 'bob',
      passwordHash: 'x',
      createdAt: now,
      updatedAt: now
    },
    {
      id: USER_MALLORY,
      username: 'mallory',
      passwordHash: 'x',
      createdAt: now,
      updatedAt: now
    }
  ]);
});

async function makeComment(
  authorId: string,
  content = 'hello'
): Promise<string> {
  // Bypass createComment so the test doesn't depend on the rate limiter /
  // notification fan-out / auto-approve heuristic — those are tested
  // elsewhere. Just write a row directly.
  const id = randomUUID();
  await db.insert(schema.comments).values({
    id,
    postId: POST_ID,
    userId: authorId,
    content,
    depth: 0,
    approved: 1,
    createdAt: new Date().toISOString()
  });
  return id;
}

describe('softDeleteComment authorisation', () => {
  test('author can soft-delete their own comment', async () => {
    const id = await makeComment(USER_ALICE, 'alice-own');
    await commentService.softDeleteComment(id, USER_ALICE);
    const row = await db.query.comments.findFirst({
      where: (c, { eq }) => eq(c.id, id)
    });
    expect(row?.deletedAt).not.toBeNull();
    // Content is preserved on disk — the format function scrubs at read
    // time. This is the property the [DELETED] placeholder UX depends on.
    expect(row?.content).toBe('alice-own');
  });

  test("a different user CANNOT soft-delete an author's comment", async () => {
    const id = await makeComment(USER_ALICE, 'alice-cant-touch-this');
    let threw = false;
    try {
      await commentService.softDeleteComment(id, USER_BOB);
    } catch (err) {
      threw = true;
      expect((err as Error).name).toBe('CommentAuthError');
    }
    expect(threw).toBe(true);
    // Row stays alive
    const row = await db.query.comments.findFirst({
      where: (c, { eq }) => eq(c.id, id)
    });
    expect(row?.deletedAt).toBeNull();
  });

  test('soft-deleting an already-deleted comment fails fast', async () => {
    const id = await makeComment(USER_ALICE);
    await commentService.softDeleteComment(id, USER_ALICE);
    let threw = false;
    try {
      await commentService.softDeleteComment(id, USER_ALICE);
    } catch (err) {
      threw = true;
      expect((err as Error).name).toBe('CommentValidationError');
    }
    expect(threw).toBe(true);
  });

  test('soft-deleting a non-existent comment throws CommentNotFoundError', async () => {
    let threw = false;
    try {
      await commentService.softDeleteComment(randomUUID(), USER_ALICE);
    } catch (err) {
      threw = true;
      expect((err as Error).name).toBe('CommentNotFoundError');
    }
    expect(threw).toBe(true);
  });
});

describe('editComment authorisation', () => {
  test('author can edit their own comment', async () => {
    const id = await makeComment(USER_ALICE, 'original');
    await commentService.editComment(id, USER_ALICE, 'edited');
    const row = await db.query.comments.findFirst({
      where: (c, { eq }) => eq(c.id, id)
    });
    expect(row?.content).toBe('edited');
    expect(row?.editedAt).not.toBeNull();
  });

  test("a different user CANNOT edit an author's comment", async () => {
    const id = await makeComment(USER_ALICE, 'alice-original');
    let threw = false;
    try {
      await commentService.editComment(id, USER_BOB, 'bob-edited');
    } catch (err) {
      threw = true;
      expect((err as Error).name).toBe('CommentAuthError');
    }
    expect(threw).toBe(true);
    // Content unchanged
    const row = await db.query.comments.findFirst({
      where: (c, { eq }) => eq(c.id, id)
    });
    expect(row?.content).toBe('alice-original');
  });

  test('editing a deleted comment fails', async () => {
    const id = await makeComment(USER_ALICE);
    await commentService.softDeleteComment(id, USER_ALICE);
    let threw = false;
    try {
      await commentService.editComment(id, USER_ALICE, 'too late');
    } catch (err) {
      threw = true;
      expect((err as Error).name).toBe('CommentValidationError');
    }
    expect(threw).toBe(true);
  });
});

describe('bulkDeleteComments scoping', () => {
  // Imports from userService so the test mirrors what /me/comments/bulk-delete
  // actually does on the wire.
  test("only the caller's own rows are affected, even with mixed ids", async () => {
    const userService = await import('./users');
    const aliceId1 = await makeComment(USER_ALICE, 'a1');
    const aliceId2 = await makeComment(USER_ALICE, 'a2');
    const bobId1 = await makeComment(USER_BOB, 'b1');

    // Alice calls bulk-delete with a mix of her own + Bob's id.
    const deleted = await userService.bulkDeleteComments(USER_ALICE, [
      aliceId1,
      aliceId2,
      bobId1
    ]);
    expect(deleted).toBe(2);

    const a1 = await db.query.comments.findFirst({
      where: (c, { eq }) => eq(c.id, aliceId1)
    });
    const a2 = await db.query.comments.findFirst({
      where: (c, { eq }) => eq(c.id, aliceId2)
    });
    const b1 = await db.query.comments.findFirst({
      where: (c, { eq }) => eq(c.id, bobId1)
    });
    expect(a1?.deletedAt).not.toBeNull();
    expect(a2?.deletedAt).not.toBeNull();
    // Bob's row stays alive — the WHERE clause scoped the update.
    expect(b1?.deletedAt).toBeNull();
  });

  test("caller cannot bulk-delete anyone else's comments", async () => {
    const userService = await import('./users');
    const bobId = await makeComment(USER_BOB);
    const deleted = await userService.bulkDeleteComments(USER_MALLORY, [bobId]);
    expect(deleted).toBe(0);
    const row = await db.query.comments.findFirst({
      where: (c, { eq }) => eq(c.id, bobId)
    });
    expect(row?.deletedAt).toBeNull();
  });

  test('empty input is a no-op', async () => {
    const userService = await import('./users');
    const deleted = await userService.bulkDeleteComments(USER_ALICE, []);
    expect(deleted).toBe(0);
  });
});
