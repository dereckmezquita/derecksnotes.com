import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './users';

export const auditLog = sqliteTable('audit_log', {
    id: text('id').primaryKey(),
    adminId: text('admin_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    action: text('action').notNull(),
    targetType: text('target_type', {
        enum: ['user', 'comment', 'report', 'group', 'permission']
    }).notNull(),
    targetId: text('target_id').notNull(),
    details: text('details', { mode: 'json' }),
    ipAddress: text('ip_address'),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date())
});

export const auditLogRelations = relations(auditLog, ({ one }) => ({
    admin: one(users, {
        fields: [auditLog.adminId],
        references: [users.id]
    })
}));

export const userBans = sqliteTable('user_bans', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    bannedBy: text('banned_by')
        .notNull()
        .references(() => users.id),
    reason: text('reason').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),
    liftedAt: integer('lifted_at', { mode: 'timestamp' }),
    liftedBy: text('lifted_by').references(() => users.id)
});

export const userBansRelations = relations(userBans, ({ one }) => ({
    user: one(users, {
        fields: [userBans.userId],
        references: [users.id],
        relationName: 'bannedUser'
    }),
    banner: one(users, {
        fields: [userBans.bannedBy],
        references: [users.id],
        relationName: 'banner'
    }),
    lifter: one(users, {
        fields: [userBans.liftedBy],
        references: [users.id],
        relationName: 'lifter'
    })
}));
