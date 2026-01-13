import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const comments = sqliteTable('comments', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    postSlug: text('post_slug').notNull(),
    parentId: text('parent_id'),
    content: text('content').notNull(),
    depth: integer('depth').notNull().default(0),
    approved: integer('approved', { mode: 'boolean' }).notNull().default(false),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),
    editedAt: integer('edited_at', { mode: 'timestamp' }),
    deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const commentsRelations = relations(comments, ({ one, many }) => ({
    user: one(users, {
        fields: [comments.userId],
        references: [users.id]
    }),
    parent: one(comments, {
        fields: [comments.parentId],
        references: [comments.id],
        relationName: 'parentChild'
    }),
    replies: many(comments, { relationName: 'parentChild' }),
    history: many(commentHistory),
    reactions: many(commentReactions)
}));

export const commentHistory = sqliteTable('comment_history', {
    id: text('id').primaryKey(),
    commentId: text('comment_id')
        .notNull()
        .references(() => comments.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    editedAt: integer('edited_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date())
});

export const commentHistoryRelations = relations(commentHistory, ({ one }) => ({
    comment: one(comments, {
        fields: [commentHistory.commentId],
        references: [comments.id]
    })
}));

export const commentReactions = sqliteTable('comment_reactions', {
    id: text('id').primaryKey(),
    commentId: text('comment_id')
        .notNull()
        .references(() => comments.id, { onDelete: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type', { enum: ['like', 'dislike'] }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date())
});

export const commentReactionsRelations = relations(
    commentReactions,
    ({ one }) => ({
        comment: one(comments, {
            fields: [commentReactions.commentId],
            references: [comments.id]
        }),
        user: one(users, {
            fields: [commentReactions.userId],
            references: [users.id]
        })
    })
);
