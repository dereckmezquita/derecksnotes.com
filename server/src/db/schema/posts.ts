import {
    sqliteTable,
    text,
    integer,
    uniqueIndex,
    index
} from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const posts = sqliteTable('posts', {
    id: text('id').primaryKey(),
    slug: text('slug').notNull().unique(), // Full URL path: "/blog/posts/biology/cell-structure"
    title: text('title').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date())
});

// Note: postsRelations with comments is defined in comments.ts to avoid circular imports
export const postsRelations = relations(posts, ({ many }) => ({
    pageViews: many(pageViews),
    reactions: many(postReactions)
}));

export const pageViews = sqliteTable(
    'page_views',
    {
        id: text('id').primaryKey(),
        postId: text('post_id')
            .notNull()
            .references(() => posts.id, { onDelete: 'cascade' }),
        ipAddress: text('ip_address').notNull(),
        userAgent: text('user_agent').notNull(),
        referrer: text('referrer'),
        sessionId: text('session_id'),
        userId: text('user_id').references(() => users.id, {
            onDelete: 'set null'
        }),
        isBot: integer('is_bot', { mode: 'boolean' }).notNull().default(false),
        enteredAt: integer('entered_at', { mode: 'timestamp' })
            .notNull()
            .$defaultFn(() => new Date()),
        exitedAt: integer('exited_at', { mode: 'timestamp' }),
        duration: integer('duration'), // Seconds on page
        scrollDepth: integer('scroll_depth') // 0-100 percentage
    },
    (table) => ({
        postIdx: index('page_views_post_idx').on(table.postId)
    })
);

export const pageViewsRelations = relations(pageViews, ({ one }) => ({
    post: one(posts, {
        fields: [pageViews.postId],
        references: [posts.id]
    }),
    user: one(users, {
        fields: [pageViews.userId],
        references: [users.id]
    })
}));

export const postReactions = sqliteTable(
    'post_reactions',
    {
        id: text('id').primaryKey(),
        postId: text('post_id')
            .notNull()
            .references(() => posts.id, { onDelete: 'cascade' }),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        type: text('type', { enum: ['like', 'dislike'] }).notNull(),
        createdAt: integer('created_at', { mode: 'timestamp' })
            .notNull()
            .$defaultFn(() => new Date())
    },
    (table) => ({
        uniqueUserPost: uniqueIndex('post_reactions_user_post_idx').on(
            table.postId,
            table.userId
        )
    })
);

export const postReactionsRelations = relations(postReactions, ({ one }) => ({
    post: one(posts, {
        fields: [postReactions.postId],
        references: [posts.id]
    }),
    user: one(users, {
        fields: [postReactions.userId],
        references: [users.id]
    })
}));
