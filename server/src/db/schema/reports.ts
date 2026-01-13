import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './users';
import { comments } from './comments';

export const reports = sqliteTable('reports', {
    id: text('id').primaryKey(),
    reporterId: text('reporter_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    commentId: text('comment_id')
        .notNull()
        .references(() => comments.id, { onDelete: 'cascade' }),
    reason: text('reason').notNull(),
    details: text('details'),
    status: text('status', {
        enum: ['pending', 'reviewed', 'dismissed']
    })
        .notNull()
        .default('pending'),
    reviewedBy: text('reviewed_by').references(() => users.id),
    reviewedAt: integer('reviewed_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date())
});

export const reportsRelations = relations(reports, ({ one }) => ({
    reporter: one(users, {
        fields: [reports.reporterId],
        references: [users.id],
        relationName: 'reporter'
    }),
    comment: one(comments, {
        fields: [reports.commentId],
        references: [comments.id]
    }),
    reviewer: one(users, {
        fields: [reports.reviewedBy],
        references: [users.id],
        relationName: 'reviewer'
    })
}));
