import {
  sqliteTable,
  text,
  integer,
  uniqueIndex
} from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// ============================================================================
// USERS & AUTH
// ============================================================================

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').unique(),
  passwordHash: text('password_hash').notNull(),
  displayName: text('display_name'),
  bio: text('bio'),
  avatarUrl: text('avatar_url'),
  createdAt: text('created_at').notNull(),
  updatedAt: text('updated_at').notNull(),
  deletedAt: text('deleted_at')
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  token: text('token').notNull().unique(),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull(),
  expiresAt: text('expires_at').notNull()
});

export const groups = sqliteTable('groups', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  isDefault: integer('is_default').notNull().default(0)
});

export const permissions = sqliteTable('permissions', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  description: text('description'),
  category: text('category').notNull()
});

export const groupPermissions = sqliteTable('group_permissions', {
  id: text('id').primaryKey(),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id),
  permissionId: text('permission_id')
    .notNull()
    .references(() => permissions.id)
});

export const userGroups = sqliteTable('user_groups', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  groupId: text('group_id')
    .notNull()
    .references(() => groups.id)
});

export const userBans = sqliteTable('user_bans', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  bannedBy: text('banned_by')
    .notNull()
    .references(() => users.id),
  reason: text('reason'),
  expiresAt: text('expires_at'),
  createdAt: text('created_at').notNull(),
  liftedAt: text('lifted_at'),
  liftedBy: text('lifted_by').references(() => users.id)
});

// ============================================================================
// POSTS & CONTENT
// ============================================================================

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  createdAt: text('created_at').notNull()
});

export const postReactions = sqliteTable(
  'post_reactions',
  {
    id: text('id').primaryKey(),
    postId: text('post_id')
      .notNull()
      .references(() => posts.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    type: text('type').notNull(), // 'like' | 'dislike'
    createdAt: text('created_at').notNull()
  },
  (table) => [
    uniqueIndex('post_reactions_user_post').on(table.postId, table.userId)
  ]
);

export const readHistory = sqliteTable(
  'read_history',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    postId: text('post_id')
      .notNull()
      .references(() => posts.id),
    readAt: text('read_at').notNull()
  },
  (table) => [
    uniqueIndex('read_history_user_post').on(table.userId, table.postId)
  ]
);

// ============================================================================
// COMMENTS
// ============================================================================

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id')
    .notNull()
    .references(() => posts.id),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  parentId: text('parent_id'),
  content: text('content').notNull(),
  depth: integer('depth').notNull().default(0),
  approved: integer('approved').notNull().default(0),
  pinnedAt: text('pinned_at'),
  pinnedBy: text('pinned_by'),
  createdAt: text('created_at').notNull(),
  editedAt: text('edited_at'),
  deletedAt: text('deleted_at')
});

export const commentHistory = sqliteTable('comment_history', {
  id: text('id').primaryKey(),
  commentId: text('comment_id')
    .notNull()
    .references(() => comments.id),
  content: text('content').notNull(),
  editedAt: text('edited_at').notNull(),
  editedBy: text('edited_by')
    .notNull()
    .references(() => users.id)
});

export const commentReactions = sqliteTable(
  'comment_reactions',
  {
    id: text('id').primaryKey(),
    commentId: text('comment_id')
      .notNull()
      .references(() => comments.id),
    userId: text('user_id')
      .notNull()
      .references(() => users.id),
    type: text('type').notNull(), // 'like' | 'dislike'
    createdAt: text('created_at').notNull()
  },
  (table) => [
    uniqueIndex('comment_reactions_user_comment').on(
      table.commentId,
      table.userId
    )
  ]
);

// ============================================================================
// AUDIT
// ============================================================================

export const auditLog = sqliteTable('audit_log', {
  id: text('id').primaryKey(),
  adminId: text('admin_id')
    .notNull()
    .references(() => users.id),
  action: text('action').notNull(),
  targetType: text('target_type').notNull(),
  targetId: text('target_id'),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: text('created_at').notNull()
});

// ============================================================================
// RELATIONS
// ============================================================================

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
  userGroups: many(userGroups),
  comments: many(comments),
  postReactions: many(postReactions),
  commentReactions: many(commentReactions),
  readHistory: many(readHistory)
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] })
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  groupPermissions: many(groupPermissions),
  userGroups: many(userGroups)
}));

export const permissionsRelations = relations(permissions, ({ many }) => ({
  groupPermissions: many(groupPermissions)
}));

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

export const userGroupsRelations = relations(userGroups, ({ one }) => ({
  user: one(users, { fields: [userGroups.userId], references: [users.id] }),
  group: one(groups, {
    fields: [userGroups.groupId],
    references: [groups.id]
  })
}));

export const postsRelations = relations(posts, ({ many }) => ({
  comments: many(comments),
  postReactions: many(postReactions),
  readHistory: many(readHistory)
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, { fields: [comments.postId], references: [posts.id] }),
  user: one(users, { fields: [comments.userId], references: [users.id] }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id]
  }),
  history: many(commentHistory),
  reactions: many(commentReactions)
}));

export const commentHistoryRelations = relations(commentHistory, ({ one }) => ({
  comment: one(comments, {
    fields: [commentHistory.commentId],
    references: [comments.id]
  }),
  editor: one(users, {
    fields: [commentHistory.editedBy],
    references: [users.id]
  })
}));

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

export const postReactionsRelations = relations(postReactions, ({ one }) => ({
  post: one(posts, {
    fields: [postReactions.postId],
    references: [posts.id]
  }),
  user: one(users, { fields: [postReactions.userId], references: [users.id] })
}));

export const readHistoryRelations = relations(readHistory, ({ one }) => ({
  user: one(users, { fields: [readHistory.userId], references: [users.id] }),
  post: one(posts, { fields: [readHistory.postId], references: [posts.id] })
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  admin: one(users, { fields: [auditLog.adminId], references: [users.id] })
}));

export const userBansRelations = relations(userBans, ({ one }) => ({
  user: one(users, { fields: [userBans.userId], references: [users.id] }),
  banner: one(users, { fields: [userBans.bannedBy], references: [users.id] })
}));
