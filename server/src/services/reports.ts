import { randomUUID } from 'node:crypto';
import { db, schema } from '@db/index';
import { eq, and, desc, sql, inArray } from 'drizzle-orm';

export type ReportTargetType = 'comment' | 'user';
export type ReportReason = 'spam' | 'harassment' | 'misinformation' | 'other';
export type ReportStatus = 'open' | 'resolved' | 'dismissed';

export interface CreateReportInput {
  reporterId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: ReportReason;
  details?: string | null;
}

export async function createReport(input: CreateReportInput): Promise<string> {
  const id = randomUUID();
  await db.insert(schema.reports).values({
    id,
    reporterId: input.reporterId,
    targetType: input.targetType,
    targetId: input.targetId,
    reason: input.reason,
    details: input.details || null,
    status: 'open',
    createdAt: new Date().toISOString()
  });
  return id;
}

export async function listForAdmin(
  status: ReportStatus | 'all',
  page: number,
  limit: number
) {
  const offset = (page - 1) * limit;
  const whereClause =
    status === 'all' ? undefined : eq(schema.reports.status, status);

  const rows = await db.query.reports.findMany({
    where: whereClause,
    orderBy: [desc(schema.reports.createdAt)],
    limit,
    offset,
    with: {
      reporter: {
        columns: {
          id: true,
          username: true,
          displayName: true,
          avatarUrl: true
        }
      }
    }
  });

  const total = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.reports)
    .where(whereClause || sql`1=1`);

  return {
    reports: rows.map((r) => ({
      id: r.id,
      reporter: r.reporter,
      targetType: r.targetType as ReportTargetType,
      targetId: r.targetId,
      reason: r.reason,
      details: r.details,
      status: r.status as ReportStatus,
      resolvedAt: r.resolvedAt,
      createdAt: r.createdAt
    })),
    total: total[0]?.count || 0
  };
}

export async function setStatus(
  ids: string[],
  status: ReportStatus,
  resolvedBy: string
): Promise<number> {
  if (ids.length === 0) return 0;
  const result = await db
    .update(schema.reports)
    .set({
      status,
      resolvedAt: status === 'open' ? null : new Date().toISOString(),
      resolvedBy: status === 'open' ? null : resolvedBy
    })
    .where(inArray(schema.reports.id, ids))
    .returning({ id: schema.reports.id });
  return result.length;
}

export async function countOpen(): Promise<number> {
  const row = await db
    .select({ count: sql<number>`count(*)` })
    .from(schema.reports)
    .where(eq(schema.reports.status, 'open'));
  return row[0]?.count || 0;
}
