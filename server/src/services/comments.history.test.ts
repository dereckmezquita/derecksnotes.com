/**
 * Tests for the comment-history visibility contract — added after an
 * independent review flagged that the public-thread `[DELETED]` scrub did
 * not extend to /comments/:id/history. The history endpoint is the only
 * other path that returns prior comment content; if the contract is "a
 * soft-deleted comment's body never echoes back through a user-facing
 * path" then this endpoint must honour it too.
 *
 * Final contract pinned here:
 *   - Author of a non-deleted comment: gets the full revision history.
 *   - Author of a soft-deleted comment: gets an empty array (their own
 *     delete action is the signal to stop echoing the body).
 *   - Moderator on any comment, deleted or not: gets the full history
 *     (moderation + audit use case).
 *   - Anyone else: gets null (caller maps to 403).
 */
import { describe, expect, test, beforeAll } from 'bun:test';
import { randomUUID } from 'node:crypto';

if (!process.env.DATABASE_PATH) process.env.DATABASE_PATH = ':memory:';
if (!process.env.APP_ENV) process.env.APP_ENV = 'local';

const { db, schema } = await import('@db/index');
const commentService = await import('./comments');

const POST_ID = randomUUID();
const AUTHOR = randomUUID();
const OTHER = randomUUID();
const MOD = randomUUID();

beforeAll(async () => {
  const now = new Date().toISOString();
  await db.insert(schema.posts).values({
    id: POST_ID,
    slug: 'history-test',
    title: 'History Test',
    createdAt: now
  });
  const suffix = randomUUID().slice(0, 8);
  await db.insert(schema.users).values([
    {
      id: AUTHOR,
      username: `hist-author-${suffix}`,
      passwordHash: 'x',
      createdAt: now,
      updatedAt: now
    },
    {
      id: OTHER,
      username: `hist-other-${suffix}`,
      passwordHash: 'x',
      createdAt: now,
      updatedAt: now
    },
    {
      id: MOD,
      username: `hist-mod-${suffix}`,
      passwordHash: 'x',
      createdAt: now,
      updatedAt: now
    }
  ]);
});

async function insertCommentWithEdits(deleted: boolean): Promise<string> {
  const id = randomUUID();
  const now = new Date().toISOString();
  await db.insert(schema.comments).values({
    id,
    postId: POST_ID,
    userId: AUTHOR,
    content: 'final version',
    depth: 0,
    approved: 1,
    createdAt: now,
    editedAt: now,
    deletedAt: deleted ? now : null
  });
  // Two prior revisions in the history table.
  await db.insert(schema.commentHistory).values([
    {
      id: randomUUID(),
      commentId: id,
      content: 'original secret v1',
      editedAt: now,
      editedBy: AUTHOR
    },
    {
      id: randomUUID(),
      commentId: id,
      content: 'original secret v2',
      editedAt: now,
      editedBy: AUTHOR
    }
  ]);
  return id;
}

describe('non-deleted comment history', () => {
  test('author sees their own full history', async () => {
    const id = await insertCommentWithEdits(false);
    const hist = await commentService.getCommentHistory(id, AUTHOR, false);
    expect(hist).not.toBeNull();
    expect(hist!.length).toBe(3); // current + 2 prior revisions
    expect(hist![0]!.content).toBe('final version');
  });

  test('moderator sees full history of any comment', async () => {
    const id = await insertCommentWithEdits(false);
    const hist = await commentService.getCommentHistory(id, MOD, true);
    expect(hist).not.toBeNull();
    expect(hist!.length).toBe(3);
  });

  test('a different non-mod user gets null (caller maps to 403)', async () => {
    const id = await insertCommentWithEdits(false);
    const hist = await commentService.getCommentHistory(id, OTHER, false);
    expect(hist).toBeNull();
  });
});

describe('soft-deleted comment history', () => {
  test('author of a deleted comment gets empty array (no body echo)', async () => {
    const id = await insertCommentWithEdits(true);
    const hist = await commentService.getCommentHistory(id, AUTHOR, false);
    expect(hist).not.toBeNull();
    expect(hist!.length).toBe(0);
    // Belt-and-brace: even via JSON.stringify the originals must not leak.
    expect(JSON.stringify(hist)).not.toContain('final version');
    expect(JSON.stringify(hist)).not.toContain('original secret v1');
    expect(JSON.stringify(hist)).not.toContain('original secret v2');
  });

  test('moderator still gets full history on a deleted comment (audit path)', async () => {
    const id = await insertCommentWithEdits(true);
    const hist = await commentService.getCommentHistory(id, MOD, true);
    expect(hist).not.toBeNull();
    expect(hist!.length).toBe(3);
    // Moderators do see the content — this is by design.
    expect(hist![0]!.content).toBe('final version');
  });

  test('a different non-mod user gets null even on a deleted comment', async () => {
    const id = await insertCommentWithEdits(true);
    const hist = await commentService.getCommentHistory(id, OTHER, false);
    expect(hist).toBeNull();
  });
});

describe('non-existent comment', () => {
  test('returns empty array (matches the pre-existing contract)', async () => {
    const hist = await commentService.getCommentHistory(
      randomUUID(),
      AUTHOR,
      false
    );
    expect(hist).not.toBeNull();
    expect(hist!.length).toBe(0);
  });
});
