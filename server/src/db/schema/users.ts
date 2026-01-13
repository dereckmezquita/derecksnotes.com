import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    username: text('username').notNull().unique(),
    email: text('email').unique(),
    passwordHash: text('password_hash').notNull(),
    displayName: text('display_name'),
    bio: text('bio'),
    avatarUrl: text('avatar_url'),
    emailVerified: integer('email_verified', { mode: 'boolean' })
        .notNull()
        .default(false),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),
    deletedAt: integer('deleted_at', { mode: 'timestamp' })
});

export const usersRelations = relations(users, ({ many }) => ({
    userGroups: many(userGroups),
    sessions: many(sessions)
}));

export const groups = sqliteTable('groups', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    isDefault: integer('is_default', { mode: 'boolean' })
        .notNull()
        .default(false),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date())
});

export const groupsRelations = relations(groups, ({ many }) => ({
    groupPermissions: many(groupPermissions),
    userGroups: many(userGroups)
}));

export const permissions = sqliteTable('permissions', {
    id: text('id').primaryKey(),
    name: text('name').notNull().unique(),
    description: text('description'),
    category: text('category').notNull()
});

export const permissionsRelations = relations(permissions, ({ many }) => ({
    groupPermissions: many(groupPermissions)
}));

export const groupPermissions = sqliteTable('group_permissions', {
    id: text('id').primaryKey(),
    groupId: text('group_id')
        .notNull()
        .references(() => groups.id, { onDelete: 'cascade' }),
    permissionId: text('permission_id')
        .notNull()
        .references(() => permissions.id, { onDelete: 'cascade' })
});

export const groupPermissionsRelations = relations(
    groupPermissions,
    ({ one }) => ({
        group: one(groups, {
            fields: [groupPermissions.groupId],
            references: [groups.id]
        }),
        permission: one(permissions, {
            fields: [groupPermissions.permissionId],
            references: [permissions.id]
        })
    })
);

export const userGroups = sqliteTable('user_groups', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    groupId: text('group_id')
        .notNull()
        .references(() => groups.id, { onDelete: 'cascade' }),
    assignedAt: integer('assigned_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date())
});

export const userGroupsRelations = relations(userGroups, ({ one }) => ({
    user: one(users, {
        fields: [userGroups.userId],
        references: [users.id]
    }),
    group: one(groups, {
        fields: [userGroups.groupId],
        references: [groups.id]
    })
}));

export const sessions = sqliteTable('sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    sessionToken: text('session_token').notNull().unique(),
    userAgent: text('user_agent'),
    ipAddress: text('ip_address'),
    createdAt: integer('created_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    revokedAt: integer('revoked_at', { mode: 'timestamp' })
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id]
    })
}));
