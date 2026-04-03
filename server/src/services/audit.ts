import crypto from 'crypto';
import { db, schema } from '@db/index';

export async function logAuditAction(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string | null,
  details?: Record<string, unknown>,
  ipAddress?: string
): Promise<void> {
  await db.insert(schema.auditLog).values({
    id: crypto.randomUUID(),
    adminId,
    action,
    targetType,
    targetId: targetId || null,
    details: details ? JSON.stringify(details) : null,
    ipAddress: ipAddress || null,
    createdAt: new Date().toISOString()
  });
}
