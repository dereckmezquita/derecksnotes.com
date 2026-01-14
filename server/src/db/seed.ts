import { db, schema } from './index';
import { eq } from 'drizzle-orm';

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
        // Trusted users get auto-approved comments (handled in logic, not permission)
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
    admin: DEFAULT_PERMISSIONS.map((p) => p.name) // All permissions
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

async function seed() {
    console.log('Seeding database...');

    // Check if already seeded
    const existingPermissions = await db.query.permissions.findMany();
    if (existingPermissions.length > 0) {
        console.log('Database already seeded. Skipping...');
        return;
    }

    // Insert permissions
    console.log('Creating permissions...');
    await db.insert(schema.permissions).values(DEFAULT_PERMISSIONS);

    // Get permission IDs by name
    const permissionMap = new Map<string, string>();
    const allPermissions = await db.query.permissions.findMany();
    for (const p of allPermissions) {
        permissionMap.set(p.name, p.id);
    }

    // Insert groups
    console.log('Creating groups...');
    await db.insert(schema.groups).values(DEFAULT_GROUPS);

    // Get group IDs by name
    const groupMap = new Map<string, string>();
    const allGroups = await db.query.groups.findMany();
    for (const g of allGroups) {
        groupMap.set(g.name, g.id);
    }

    // Assign permissions to groups
    console.log('Assigning permissions to groups...');
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

    // Note: Admin user is created automatically when a user registers with
    // the username matching ADMIN_USERNAME env var. No need to create here.
    const adminUsername = process.env.ADMIN_USERNAME;
    if (adminUsername) {
        console.log(`\nAdmin username configured: ${adminUsername}`);
        console.log(
            'When this user registers, they will automatically be assigned the admin group.'
        );
    } else {
        console.log('\n⚠️  No ADMIN_USERNAME set in environment.');
        console.log(
            '   Set ADMIN_USERNAME env var to designate which user gets admin privileges on registration.'
        );
    }

    console.log('\n✅ Database seeded successfully!');
}

seed().catch(console.error);
