import pino from 'pino';
import crypto from 'crypto';
import { db } from '@db/index';
import { serverLogs, errorSummary, type LogLevel } from '@db/schema/logs';
import { eq, desc, and, gte, lte, sql, or, like } from 'drizzle-orm';
import { config } from '@lib/env';

// Create pino logger with pretty printing in development
export const logger = pino({
    level: config.buildEnv === 'local' ? 'debug' : 'info',
    transport:
        config.buildEnv === 'local'
            ? {
                  target: 'pino-pretty',
                  options: {
                      colorize: true,
                      translateTime: 'HH:MM:ss',
                      ignore: 'pid,hostname'
                  }
              }
            : undefined
});

// Map pino levels to our database levels
const levelMap: Record<number, LogLevel> = {
    10: 'debug', // trace -> debug
    20: 'debug',
    30: 'info',
    40: 'warn',
    50: 'error',
    60: 'fatal'
};

// Generate a fingerprint for error deduplication
function generateErrorFingerprint(message: string, stack?: string): string {
    const normalized = `${message}:${stack?.split('\n').slice(0, 3).join('|') || ''}`;
    return crypto
        .createHash('sha256')
        .update(normalized)
        .digest('hex')
        .slice(0, 32);
}

// Persist log to database (call this for important logs you want stored)
export async function persistLog(options: {
    level: LogLevel;
    message: string;
    source?: string;
    context?: Record<string, any>;
    stack?: string;
    userId?: string;
    requestId?: string;
    ipAddress?: string;
    userAgent?: string;
    path?: string;
    method?: string;
    statusCode?: number;
    duration?: number;
}) {
    const id = crypto.randomUUID();

    try {
        await db.insert(serverLogs).values({
            id,
            level: options.level,
            message: options.message,
            source: options.source,
            context: options.context || null,
            stack: options.stack,
            userId: options.userId,
            requestId: options.requestId,
            ipAddress: options.ipAddress,
            userAgent: options.userAgent,
            path: options.path,
            method: options.method,
            statusCode: options.statusCode,
            duration: options.duration
        });

        // For errors, also update error summary for aggregation
        if (options.level === 'error' || options.level === 'fatal') {
            const fingerprint = generateErrorFingerprint(
                options.message,
                options.stack
            );

            const result = await db
                .update(errorSummary)
                .set({
                    lastSeenAt: new Date(),
                    count: sql`${errorSummary.count} + 1`
                })
                .where(eq(errorSummary.fingerprint, fingerprint))
                .returning({ id: errorSummary.id });

            if (result.length === 0) {
                await db.insert(errorSummary).values({
                    id: crypto.randomUUID(),
                    fingerprint,
                    message: options.message,
                    source: options.source,
                    stack: options.stack
                });
            }
        }
    } catch (err) {
        logger.error({ err }, 'Failed to persist log to database');
    }
}

// Helper: log to both pino and database
export const dbLogger = {
    debug: (message: string, context?: Record<string, any>) => {
        logger.debug(context || {}, message);
    },
    info: (message: string, context?: Record<string, any>) => {
        logger.info(context || {}, message);
    },
    warn: (message: string, context?: Record<string, any>) => {
        logger.warn(context || {}, message);
        persistLog({ level: 'warn', message, context });
    },
    error: (message: string, error?: Error, context?: Record<string, any>) => {
        logger.error({ err: error, ...context }, message);
        persistLog({
            level: 'error',
            message,
            context,
            stack: error?.stack
        });
    },
    fatal: (message: string, error?: Error, context?: Record<string, any>) => {
        logger.fatal({ err: error, ...context }, message);
        persistLog({
            level: 'fatal',
            message,
            context,
            stack: error?.stack
        });
    }
};

// Query functions for admin dashboard
export async function getLogs(options: {
    level?: LogLevel | LogLevel[];
    source?: string;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    cleared?: boolean; // Filter by cleared status (undefined = all, false = not cleared, true = cleared only)
    limit?: number;
    offset?: number;
}) {
    const {
        level,
        source,
        search,
        startDate,
        endDate,
        cleared,
        limit = 50,
        offset = 0
    } = options;

    const conditions = [];

    if (level) {
        if (Array.isArray(level)) {
            conditions.push(or(...level.map((l) => eq(serverLogs.level, l))));
        } else {
            conditions.push(eq(serverLogs.level, level));
        }
    }

    if (source) {
        conditions.push(eq(serverLogs.source, source));
    }

    if (search) {
        conditions.push(
            or(
                like(serverLogs.message, `%${search}%`),
                like(serverLogs.path, `%${search}%`)
            )
        );
    }

    if (startDate) {
        conditions.push(gte(serverLogs.createdAt, startDate));
    }

    if (endDate) {
        conditions.push(lte(serverLogs.createdAt, endDate));
    }

    // Filter by cleared status
    if (cleared === false) {
        conditions.push(sql`${serverLogs.clearedAt} IS NULL`);
    } else if (cleared === true) {
        conditions.push(sql`${serverLogs.clearedAt} IS NOT NULL`);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [logs, countResult] = await Promise.all([
        db
            .select()
            .from(serverLogs)
            .where(whereClause)
            .orderBy(desc(serverLogs.createdAt))
            .limit(limit)
            .offset(offset),
        db
            .select({ count: sql<number>`count(*)` })
            .from(serverLogs)
            .where(whereClause)
    ]);

    return {
        logs,
        total: countResult[0]?.count || 0,
        limit,
        offset
    };
}

// Clear (soft delete) logs - marks logs as cleared without deleting them
export async function clearLogs(
    logIds: string[],
    clearedBy: string
): Promise<number> {
    if (logIds.length === 0) return 0;

    const result = await db
        .update(serverLogs)
        .set({
            clearedAt: new Date(),
            clearedBy
        })
        .where(
            and(
                or(...logIds.map((id) => eq(serverLogs.id, id))),
                sql`${serverLogs.clearedAt} IS NULL`
            )
        )
        .returning({ id: serverLogs.id });

    return result.length;
}

// Restore cleared logs
export async function unclearLogs(logIds: string[]): Promise<number> {
    if (logIds.length === 0) return 0;

    const result = await db
        .update(serverLogs)
        .set({
            clearedAt: null,
            clearedBy: null
        })
        .where(
            and(
                or(...logIds.map((id) => eq(serverLogs.id, id))),
                sql`${serverLogs.clearedAt} IS NOT NULL`
            )
        )
        .returning({ id: serverLogs.id });

    return result.length;
}

// Clear all logs matching the current filter
export async function clearAllLogs(options: {
    level?: LogLevel | LogLevel[];
    source?: string;
    search?: string;
    startDate?: Date;
    endDate?: Date;
    clearedBy: string;
}): Promise<number> {
    const { level, source, search, startDate, endDate, clearedBy } = options;

    const conditions = [];

    // Only clear logs that aren't already cleared
    conditions.push(sql`${serverLogs.clearedAt} IS NULL`);

    if (level) {
        if (Array.isArray(level)) {
            conditions.push(or(...level.map((l) => eq(serverLogs.level, l))));
        } else {
            conditions.push(eq(serverLogs.level, level));
        }
    }

    if (source) {
        conditions.push(eq(serverLogs.source, source));
    }

    if (search) {
        conditions.push(
            or(
                like(serverLogs.message, `%${search}%`),
                like(serverLogs.path, `%${search}%`)
            )
        );
    }

    if (startDate) {
        conditions.push(gte(serverLogs.createdAt, startDate));
    }

    if (endDate) {
        conditions.push(lte(serverLogs.createdAt, endDate));
    }

    const result = await db
        .update(serverLogs)
        .set({
            clearedAt: new Date(),
            clearedBy
        })
        .where(and(...conditions))
        .returning({ id: serverLogs.id });

    return result.length;
}

export async function getErrorSummaries(options: {
    resolved?: boolean;
    limit?: number;
    offset?: number;
}) {
    const { resolved, limit = 50, offset = 0 } = options;

    const conditions = [];

    if (resolved !== undefined) {
        conditions.push(eq(errorSummary.resolved, resolved));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [summaries, countResult] = await Promise.all([
        db
            .select()
            .from(errorSummary)
            .where(whereClause)
            .orderBy(desc(errorSummary.lastSeenAt))
            .limit(limit)
            .offset(offset),
        db
            .select({ count: sql<number>`count(*)` })
            .from(errorSummary)
            .where(whereClause)
    ]);

    return {
        summaries,
        total: countResult[0]?.count || 0,
        limit,
        offset
    };
}

export async function resolveError(
    errorId: string,
    resolvedBy: string,
    notes?: string
) {
    await db
        .update(errorSummary)
        .set({
            resolved: true,
            resolvedAt: new Date(),
            resolvedBy,
            notes
        })
        .where(eq(errorSummary.id, errorId));
}

export async function unresolveError(errorId: string) {
    await db
        .update(errorSummary)
        .set({
            resolved: false,
            resolvedAt: null,
            resolvedBy: null
        })
        .where(eq(errorSummary.id, errorId));
}

export async function getLogStats() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [errorsToday, errorsThisWeek, unresolvedErrors, logsByLevel] =
        await Promise.all([
            db
                .select({ count: sql<number>`count(*)` })
                .from(serverLogs)
                .where(
                    and(
                        or(
                            eq(serverLogs.level, 'error'),
                            eq(serverLogs.level, 'fatal')
                        ),
                        gte(serverLogs.createdAt, oneDayAgo)
                    )
                ),
            db
                .select({ count: sql<number>`count(*)` })
                .from(serverLogs)
                .where(
                    and(
                        or(
                            eq(serverLogs.level, 'error'),
                            eq(serverLogs.level, 'fatal')
                        ),
                        gte(serverLogs.createdAt, oneWeekAgo)
                    )
                ),
            db
                .select({ count: sql<number>`count(*)` })
                .from(errorSummary)
                .where(eq(errorSummary.resolved, false)),
            db
                .select({
                    level: serverLogs.level,
                    count: sql<number>`count(*)`
                })
                .from(serverLogs)
                .where(gte(serverLogs.createdAt, oneWeekAgo))
                .groupBy(serverLogs.level)
        ]);

    return {
        errorsToday: errorsToday[0]?.count || 0,
        errorsThisWeek: errorsThisWeek[0]?.count || 0,
        unresolvedErrors: unresolvedErrors[0]?.count || 0,
        logsByLevel: logsByLevel.reduce(
            (acc, { level, count }) => {
                acc[level] = count;
                return acc;
            },
            {} as Record<string, number>
        )
    };
}

export async function cleanupOldLogs(daysToKeep: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await db
        .delete(serverLogs)
        .where(lte(serverLogs.createdAt, cutoffDate))
        .returning({ id: serverLogs.id });

    return result.length;
}
