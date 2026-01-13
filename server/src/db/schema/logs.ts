import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';

// Log levels for filtering
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

// Server-side application logs table
export const serverLogs = sqliteTable(
    'server_logs',
    {
        id: text('id').primaryKey(),
        level: text('level', {
            enum: ['debug', 'info', 'warn', 'error', 'fatal']
        }).notNull(),
        message: text('message').notNull(),
        source: text('source'), // e.g., 'auth', 'comments', 'api', 'db'
        context: text('context', { mode: 'json' }), // Additional context data
        stack: text('stack'), // Stack trace for errors
        userId: text('user_id'), // Optional user context
        requestId: text('request_id'), // Optional request tracking
        ipAddress: text('ip_address'),
        userAgent: text('user_agent'),
        path: text('path'), // API path that triggered the log
        method: text('method'), // HTTP method
        statusCode: integer('status_code'), // Response status code
        duration: integer('duration'), // Request duration in ms
        createdAt: integer('created_at', { mode: 'timestamp' })
            .notNull()
            .$defaultFn(() => new Date())
    },
    (table) => ({
        levelIdx: index('idx_server_logs_level').on(table.level),
        sourceIdx: index('idx_server_logs_source').on(table.source),
        createdAtIdx: index('idx_server_logs_created_at').on(table.createdAt),
        levelCreatedIdx: index('idx_server_logs_level_created').on(
            table.level,
            table.createdAt
        )
    })
);

// Separate table for error aggregation (for dashboard quick view)
export const errorSummary = sqliteTable('error_summary', {
    id: text('id').primaryKey(),
    fingerprint: text('fingerprint').notNull().unique(), // Hash of error message + stack
    message: text('message').notNull(),
    source: text('source'),
    stack: text('stack'),
    firstSeenAt: integer('first_seen_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),
    lastSeenAt: integer('last_seen_at', { mode: 'timestamp' })
        .notNull()
        .$defaultFn(() => new Date()),
    count: integer('count').notNull().default(1),
    resolved: integer('resolved', { mode: 'boolean' }).notNull().default(false),
    resolvedAt: integer('resolved_at', { mode: 'timestamp' }),
    resolvedBy: text('resolved_by'),
    notes: text('notes')
});
