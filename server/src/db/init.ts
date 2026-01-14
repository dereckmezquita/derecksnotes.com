import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sqlite';
import { migrate } from 'drizzle-orm/bun-sqlite/migrator';
import { config } from '@lib/env';
import * as schema from './schema';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Initialize the database:
 * 1. Create data directory if needed
 * 2. Run any pending migrations
 * 3. Seed default data if empty
 */
export async function initializeDatabase(): Promise<void> {
    const dataDir = path.dirname(config.databasePath);

    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
        console.log(`Created data directory: ${dataDir}`);
    }

    // Run migrations
    const sqlite = new Database(config.databasePath);
    const tempDb = drizzle(sqlite);

    try {
        console.log('Checking database migrations...');
        migrate(tempDb, { migrationsFolder: './drizzle' });
        console.log('Database migrations up to date.');
    } catch (error: any) {
        // If the error is about no migrations, that's fine
        if (!error.message?.includes('No migrations')) {
            throw error;
        }
    } finally {
        sqlite.close();
    }

    // Now check if we need to seed
    const { db } = await import('./index');

    const existingPermissions = await db.query.permissions.findMany({
        limit: 1
    });

    if (existingPermissions.length === 0) {
        console.log('Database empty, running initial seed...');
        await seedDatabase(db);
    }
}

async function seedDatabase(db: any): Promise<void> {
    const { schema } = await import('./index');

    function generateId(): string {
        return crypto.randomUUID();
    }

    const DEFAULT_PERMISSIONS = [
        // Comment permissions
        {
            id: generateId(),
            name: 'comment.create',
            description: 'Create new comments',
            category: 'comment'
        },
        {
            id: generateId(),
            name: 'comment.edit.own',
            description: 'Edit own comments',
            category: 'comment'
        },
        {
            id: generateId(),
            name: 'comment.delete.own',
            description: 'Soft delete own comments',
            category: 'comment'
        },
        {
            id: generateId(),
            name: 'comment.edit.any',
            description: 'Edit any comment',
            category: 'comment'
        },
        {
            id: generateId(),
            name: 'comment.delete.any',
            description: 'Soft delete any comment',
            category: 'comment'
        },
        {
            id: generateId(),
            name: 'comment.approve',
            description: 'Approve comments for visibility',
            category: 'comment'
        },
        {
            id: generateId(),
            name: 'comment.view.unapproved',
            description: 'View unapproved comments',
            category: 'comment'
        },
        // User permissions
        {
            id: generateId(),
            name: 'user.view',
            description: 'View user profiles',
            category: 'user'
        },
        {
            id: generateId(),
            name: 'user.edit.own',
            description: 'Edit own profile',
            category: 'user'
        },
        {
            id: generateId(),
            name: 'user.edit.any',
            description: 'Edit any user profile',
            category: 'user'
        },
        {
            id: generateId(),
            name: 'user.ban',
            description: 'Ban/unban users',
            category: 'user'
        },
        {
            id: generateId(),
            name: 'user.delete.own',
            description: 'Soft delete own account',
            category: 'user'
        },
        {
            id: generateId(),
            name: 'user.delete.any',
            description: 'Soft delete any user account',
            category: 'user'
        },
        // Report permissions
        {
            id: generateId(),
            name: 'report.create',
            description: 'Create reports on comments',
            category: 'report'
        },
        {
            id: generateId(),
            name: 'report.view',
            description: 'View all reports',
            category: 'report'
        },
        {
            id: generateId(),
            name: 'report.resolve',
            description: 'Resolve/dismiss reports',
            category: 'report'
        },
        // Admin permissions
        {
            id: generateId(),
            name: 'admin.dashboard',
            description: 'Access admin dashboard',
            category: 'admin'
        },
        {
            id: generateId(),
            name: 'admin.audit.view',
            description: 'View audit logs',
            category: 'admin'
        },
        {
            id: generateId(),
            name: 'admin.groups.manage',
            description: 'Create/edit/delete groups',
            category: 'admin'
        },
        {
            id: generateId(),
            name: 'admin.permissions.assign',
            description: 'Assign permissions to groups',
            category: 'admin'
        },
        {
            id: generateId(),
            name: 'admin.users.manage',
            description: 'Assign users to groups',
            category: 'admin'
        }
    ];

    const GROUP_PERMISSION_MAP: Record<string, string[]> = {
        user: [
            'comment.create',
            'comment.edit.own',
            'comment.delete.own',
            'user.view',
            'user.edit.own',
            'user.delete.own',
            'report.create'
        ],
        trusted: [
            'comment.create',
            'comment.edit.own',
            'comment.delete.own',
            'user.view',
            'user.edit.own',
            'user.delete.own',
            'report.create'
        ],
        moderator: [
            'comment.create',
            'comment.edit.own',
            'comment.delete.own',
            'comment.delete.any',
            'comment.approve',
            'comment.view.unapproved',
            'user.view',
            'user.edit.own',
            'user.delete.own',
            'user.ban',
            'report.create',
            'report.view',
            'report.resolve',
            'admin.dashboard'
        ],
        admin: DEFAULT_PERMISSIONS.map((p) => p.name)
    };

    const DEFAULT_GROUPS = [
        {
            id: generateId(),
            name: 'user',
            description: 'Default user group - comments require approval',
            isDefault: true
        },
        {
            id: generateId(),
            name: 'trusted',
            description: 'Trusted users - comments are auto-approved',
            isDefault: false
        },
        {
            id: generateId(),
            name: 'moderator',
            description: 'Moderators - can approve comments and manage reports',
            isDefault: false
        },
        {
            id: generateId(),
            name: 'admin',
            description: 'Administrators - full access to all features',
            isDefault: false
        }
    ];

    // Insert permissions
    console.log('  Creating permissions...');
    await db.insert(schema.permissions).values(DEFAULT_PERMISSIONS);

    // Get permission IDs by name
    const permissionMap = new Map<string, string>();
    const allPermissions = await db.query.permissions.findMany();
    for (const p of allPermissions) {
        permissionMap.set(p.name, p.id);
    }

    // Insert groups
    console.log('  Creating groups...');
    await db.insert(schema.groups).values(DEFAULT_GROUPS);

    // Get group IDs by name
    const groupMap = new Map<string, string>();
    const allGroups = await db.query.groups.findMany();
    for (const g of allGroups) {
        groupMap.set(g.name, g.id);
    }

    // Assign permissions to groups
    console.log('  Assigning permissions to groups...');
    const groupPermissionInserts: Array<{
        id: string;
        groupId: string;
        permissionId: string;
    }> = [];

    for (const [groupName, permissionNames] of Object.entries(
        GROUP_PERMISSION_MAP
    )) {
        const groupId = groupMap.get(groupName);
        if (!groupId) continue;

        for (const permName of permissionNames) {
            const permId = permissionMap.get(permName);
            if (!permId) continue;

            groupPermissionInserts.push({
                id: generateId(),
                groupId,
                permissionId: permId
            });
        }
    }

    await db.insert(schema.groupPermissions).values(groupPermissionInserts);

    console.log('  Database seeded successfully!');
}
