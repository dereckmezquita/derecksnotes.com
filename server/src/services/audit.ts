import { db, schema } from '../db';

type TargetType = 'user' | 'comment' | 'report' | 'group' | 'permission';

export async function logAuditAction(
    adminId: string,
    action: string,
    targetType: TargetType,
    targetId: string,
    details?: Record<string, unknown>,
    ipAddress?: string
): Promise<void> {
    await db.insert(schema.auditLog).values({
        id: crypto.randomUUID(),
        adminId,
        action,
        targetType,
        targetId,
        details: details ? details : null,
        ipAddress: ipAddress || null
    });
}
