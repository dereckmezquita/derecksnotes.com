import { db, schema } from './index';

function id(): string {
    return crypto.randomUUID();
}

const PERMISSIONS = [
    {
        id: id(),
        name: 'comment.create',
        description: 'Create comments',
        category: 'comment'
    },
    {
        id: id(),
        name: 'comment.edit.own',
        description: 'Edit own comments',
        category: 'comment'
    },
    {
        id: id(),
        name: 'comment.delete.own',
        description: 'Delete own comments',
        category: 'comment'
    },
    {
        id: id(),
        name: 'comment.edit.any',
        description: 'Edit any comment',
        category: 'comment'
    },
    {
        id: id(),
        name: 'comment.delete.any',
        description: 'Delete any comment',
        category: 'comment'
    },
    {
        id: id(),
        name: 'comment.approve',
        description: 'Approve/reject comments',
        category: 'comment'
    },
    {
        id: id(),
        name: 'comment.view.unapproved',
        description: 'View unapproved comments',
        category: 'comment'
    },
    {
        id: id(),
        name: 'user.view',
        description: 'View user profiles',
        category: 'user'
    },
    {
        id: id(),
        name: 'user.edit.own',
        description: 'Edit own profile',
        category: 'user'
    },
    {
        id: id(),
        name: 'user.edit.any',
        description: 'Edit any profile',
        category: 'user'
    },
    {
        id: id(),
        name: 'user.ban',
        description: 'Ban/unban users',
        category: 'user'
    },
    {
        id: id(),
        name: 'user.delete.own',
        description: 'Delete own account',
        category: 'user'
    },
    {
        id: id(),
        name: 'user.delete.any',
        description: 'Delete any account',
        category: 'user'
    },
    {
        id: id(),
        name: 'report.create',
        description: 'Report comments',
        category: 'report'
    },
    {
        id: id(),
        name: 'report.view',
        description: 'View reports',
        category: 'report'
    },
    {
        id: id(),
        name: 'report.resolve',
        description: 'Resolve reports',
        category: 'report'
    },
    {
        id: id(),
        name: 'admin.dashboard',
        description: 'Access admin dashboard',
        category: 'admin'
    },
    {
        id: id(),
        name: 'admin.audit.view',
        description: 'View audit logs',
        category: 'admin'
    },
    {
        id: id(),
        name: 'admin.groups.manage',
        description: 'Manage groups',
        category: 'admin'
    },
    {
        id: id(),
        name: 'admin.permissions.assign',
        description: 'Assign permissions',
        category: 'admin'
    },
    {
        id: id(),
        name: 'admin.users.manage',
        description: 'Manage users',
        category: 'admin'
    }
];

const GROUPS = [
    {
        id: id(),
        name: 'user',
        description: 'Default user group — comments require approval',
        isDefault: 1
    },
    {
        id: id(),
        name: 'trusted',
        description: 'Trusted users — comments auto-approved',
        isDefault: 0
    },
    {
        id: id(),
        name: 'moderator',
        description: 'Moderators — can approve comments and manage reports',
        isDefault: 0
    },
    {
        id: id(),
        name: 'admin',
        description: 'Administrators — full access',
        isDefault: 0
    }
];

const GROUP_PERMS: Record<string, string[]> = {
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
    admin: PERMISSIONS.map((p) => p.name)
};

async function seed() {
    const existing = await db.query.permissions.findMany({ limit: 1 });
    if (existing.length > 0) {
        console.log('Database already seeded.');
        return;
    }

    console.log('Seeding database...');

    await db.insert(schema.permissions).values(PERMISSIONS);

    const permMap = new Map<string, string>();
    for (const p of await db.query.permissions.findMany()) {
        permMap.set(p.name, p.id);
    }

    await db.insert(schema.groups).values(GROUPS);

    const groupMap = new Map<string, string>();
    for (const g of await db.query.groups.findMany()) {
        groupMap.set(g.name, g.id);
    }

    const gpInserts: Array<{
        id: string;
        groupId: string;
        permissionId: string;
    }> = [];
    for (const [groupName, permNames] of Object.entries(GROUP_PERMS)) {
        const groupId = groupMap.get(groupName);
        if (!groupId) continue;
        for (const permName of permNames) {
            const permId = permMap.get(permName);
            if (!permId) continue;
            gpInserts.push({ id: id(), groupId, permissionId: permId });
        }
    }

    await db.insert(schema.groupPermissions).values(gpInserts);
    console.log('Seed complete.');
}

seed().catch(console.error);
