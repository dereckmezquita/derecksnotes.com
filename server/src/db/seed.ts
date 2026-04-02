import { db, schema } from './index';
import bcrypt from 'bcrypt';

function id(): string {
    return crypto.randomUUID();
}

function daysAgo(n: number): string {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d.toISOString();
}

function hoursAgo(n: number): string {
    const d = new Date();
    d.setHours(d.getHours() - n);
    return d.toISOString();
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

    // ---- Permissions & Groups ----
    await db.insert(schema.permissions).values(PERMISSIONS);

    const permMap = new Map<string, string>();
    for (const p of await db.query.permissions.findMany())
        permMap.set(p.name, p.id);

    await db.insert(schema.groups).values(GROUPS);

    const groupMap = new Map<string, string>();
    for (const g of await db.query.groups.findMany())
        groupMap.set(g.name, g.id);

    const gpInserts: Array<{
        id: string;
        groupId: string;
        permissionId: string;
    }> = [];
    for (const [groupName, permNames] of Object.entries(GROUP_PERMS)) {
        const groupId = groupMap.get(groupName)!;
        for (const permName of permNames) {
            const permId = permMap.get(permName);
            if (permId)
                gpInserts.push({ id: id(), groupId, permissionId: permId });
        }
    }
    await db.insert(schema.groupPermissions).values(gpInserts);

    // ---- Demo Users ----
    const passwordHash = await bcrypt.hash('DemoPass1', 12);

    const adminId = id();
    const modId = id();
    const trustedId = id();
    const userIds = [id(), id(), id(), id(), id()];

    const users = [
        {
            id: adminId,
            username: 'dereck',
            email: 'dereck@example.com',
            passwordHash,
            displayName: 'Dereck Mezquita',
            bio: 'Site owner and developer. I write about science, programming, and life.',
            createdAt: daysAgo(90),
            updatedAt: daysAgo(90)
        },
        {
            id: modId,
            username: 'moderator_jane',
            email: 'jane@example.com',
            passwordHash,
            displayName: 'Jane Doe',
            bio: 'Community moderator. Keeping things civil.',
            createdAt: daysAgo(60),
            updatedAt: daysAgo(60)
        },
        {
            id: trustedId,
            username: 'trusted_alex',
            email: 'alex@example.com',
            passwordHash,
            displayName: 'Alex Kim',
            bio: 'Regular contributor and biology enthusiast.',
            createdAt: daysAgo(45),
            updatedAt: daysAgo(45)
        },
        {
            id: userIds[0],
            username: 'new_user_sam',
            email: null,
            passwordHash,
            displayName: 'Sam',
            bio: null,
            createdAt: daysAgo(5),
            updatedAt: daysAgo(5)
        },
        {
            id: userIds[1],
            username: 'science_nerd',
            email: 'nerd@example.com',
            passwordHash,
            displayName: 'Dr. Science',
            bio: 'PhD in molecular biology. Love discussing papers.',
            createdAt: daysAgo(30),
            updatedAt: daysAgo(30)
        },
        {
            id: userIds[2],
            username: 'code_monkey',
            email: null,
            passwordHash,
            displayName: null,
            bio: 'Full stack dev. TypeScript enthusiast.',
            createdAt: daysAgo(20),
            updatedAt: daysAgo(20)
        },
        {
            id: userIds[3],
            username: 'bookworm_42',
            email: 'books@example.com',
            passwordHash,
            displayName: 'Bookworm',
            bio: null,
            createdAt: daysAgo(15),
            updatedAt: daysAgo(15)
        },
        {
            id: userIds[4],
            username: 'banned_troll',
            email: null,
            passwordHash,
            displayName: 'Banned User',
            bio: 'Was causing trouble.',
            createdAt: daysAgo(25),
            updatedAt: daysAgo(25)
        }
    ];

    await db.insert(schema.users).values(users);

    // Assign groups
    const groupAssignments = [
        { userId: adminId, group: 'admin' },
        { userId: modId, group: 'moderator' },
        { userId: trustedId, group: 'trusted' },
        ...userIds.map((uid) => ({ userId: uid, group: 'user' }))
    ];

    for (const { userId, group } of groupAssignments) {
        await db
            .insert(schema.userGroups)
            .values({ id: id(), userId, groupId: groupMap.get(group)! });
    }

    // Ban the troll
    await db.insert(schema.userBans).values({
        id: id(),
        userId: userIds[4],
        bannedBy: adminId,
        reason: 'Spam and harassment',
        createdAt: daysAgo(10)
    });

    // ---- Posts ----
    const posts = [
        {
            id: id(),
            slug: 'blog/20250208_async-programming-in-R-for-JS-devs',
            title: 'Async Programming in R for JS Devs',
            createdAt: daysAgo(60)
        },
        {
            id: id(),
            slug: 'blog/20241220_bioinformatics-cheat-sheet',
            title: 'Bioinformatics Comprehensive Cheat Sheet',
            createdAt: daysAgo(45)
        },
        {
            id: id(),
            slug: 'blog/20241214_new-blog-feature-canvases',
            title: 'New Blog Feature: Canvases',
            createdAt: daysAgo(30)
        },
        {
            id: id(),
            slug: 'blog/20210730_copper-and-infectious-diseases',
            title: 'Copper and Infectious Diseases',
            createdAt: daysAgo(50)
        },
        {
            id: id(),
            slug: 'demo/api',
            title: 'Demo Page',
            createdAt: daysAgo(1)
        }
    ];

    await db.insert(schema.posts).values(posts);

    // ---- Comments (mix of approved, pending, threaded, edited) ----
    const commentData = [
        // Post 1 - async programming
        {
            id: id(),
            postId: posts[0].id,
            userId: trustedId,
            content:
                "Great article! I never thought about using **async patterns** in R like this. The comparison with JavaScript's `Promise.all()` was really helpful.",
            depth: 0,
            approved: 1,
            createdAt: daysAgo(55)
        },
        {
            id: id(),
            postId: posts[0].id,
            userId: userIds[1],
            content:
                'This is exactly what I needed for my bioinformatics pipeline. Processing multiple FASTA files concurrently is a game changer.',
            depth: 0,
            approved: 1,
            createdAt: daysAgo(50)
        },
        {
            id: id(),
            postId: posts[0].id,
            userId: userIds[2],
            content:
                'As a JS dev learning R, this bridged a huge gap for me. Would love to see a follow-up on error handling in async R.',
            depth: 0,
            approved: 1,
            createdAt: daysAgo(48)
        },
        // Post 2 - bioinformatics
        {
            id: id(),
            postId: posts[1].id,
            userId: userIds[1],
            content:
                'This cheat sheet is incredible. Bookmarked for daily reference. The section on **sequence alignment** algorithms is particularly well-written.',
            depth: 0,
            approved: 1,
            createdAt: daysAgo(40)
        },
        {
            id: id(),
            postId: posts[1].id,
            userId: trustedId,
            content:
                'One small correction: BLAST uses a heuristic approach, not dynamic programming directly. The E-value explanation is spot on though.',
            depth: 0,
            approved: 1,
            createdAt: daysAgo(38),
            editedAt: daysAgo(37)
        },
        {
            id: id(),
            postId: posts[1].id,
            userId: modId,
            content:
                'Pinning this as a community resource. Really well done, Dereck.',
            depth: 0,
            approved: 1,
            createdAt: daysAgo(35),
            pinnedAt: daysAgo(35),
            pinnedBy: modId
        },
        // Post 3 - canvases
        {
            id: id(),
            postId: posts[2].id,
            userId: userIds[2],
            content:
                'The Canvas API examples are clean. I used this approach in my portfolio site. One question: how do you handle **retina displays** with canvas?',
            depth: 0,
            approved: 1,
            createdAt: daysAgo(25)
        },
        {
            id: id(),
            postId: posts[2].id,
            userId: userIds[3],
            content:
                'Beautiful visualizations! Is there a performance comparison between Canvas and SVG for the kind of animations shown here?',
            depth: 0,
            approved: 1,
            createdAt: daysAgo(22)
        },
        // Pending comments (from new users)
        {
            id: id(),
            postId: posts[0].id,
            userId: userIds[0],
            content:
                'Thanks for this tutorial! Quick question: does this work with R version 4.3?',
            depth: 0,
            approved: 0,
            createdAt: hoursAgo(12)
        },
        {
            id: id(),
            postId: posts[1].id,
            userId: userIds[0],
            content:
                'Could you add a section on _proteomics_ workflows? That would make this guide even more complete.',
            depth: 0,
            approved: 0,
            createdAt: hoursAgo(6)
        },
        {
            id: id(),
            postId: posts[2].id,
            userId: userIds[0],
            content:
                'I tried the code examples but got an error. Is `CanvasRenderingContext2D` supported in all browsers?',
            depth: 0,
            approved: 0,
            createdAt: hoursAgo(2)
        },
        // Demo page comments
        {
            id: id(),
            postId: posts[4].id,
            userId: adminId,
            content:
                'This is a test comment on the **demo page**. Everything seems to be working!',
            depth: 0,
            approved: 1,
            createdAt: daysAgo(1)
        },
        {
            id: id(),
            postId: posts[4].id,
            userId: trustedId,
            content:
                'Confirmed — comments with `markdown` rendering look great.',
            depth: 0,
            approved: 1,
            createdAt: hoursAgo(18)
        }
    ];

    await db.insert(schema.comments).values(commentData);

    // Threaded replies
    const reply1Id = id();
    const replies = [
        // Reply to first comment on post 1
        {
            id: reply1Id,
            postId: posts[0].id,
            userId: adminId,
            parentId: commentData[0].id,
            content:
                "Thanks! I'm planning a follow-up on error handling. Stay tuned.",
            depth: 1,
            approved: 1,
            createdAt: daysAgo(54)
        },
        // Reply to the reply
        {
            id: id(),
            postId: posts[0].id,
            userId: trustedId,
            parentId: reply1Id,
            content:
                'Looking forward to it! Will you cover `tryCatch` patterns too?',
            depth: 2,
            approved: 1,
            createdAt: daysAgo(53)
        },
        // Reply on post 2
        {
            id: id(),
            postId: posts[1].id,
            userId: adminId,
            parentId: commentData[4].id,
            content:
                "Good catch on the BLAST detail! I've updated the article. Thanks for the correction.",
            depth: 1,
            approved: 1,
            createdAt: daysAgo(36)
        },
        // Reply on canvas post
        {
            id: id(),
            postId: posts[2].id,
            userId: adminId,
            parentId: commentData[6].id,
            content:
                "For retina: use `window.devicePixelRatio` to scale the canvas. I'll add an example to the article.",
            depth: 1,
            approved: 1,
            createdAt: daysAgo(24)
        },
        // Reply on demo page
        {
            id: id(),
            postId: posts[4].id,
            userId: modId,
            parentId: commentData[11].id,
            content: 'Looks good! The threading works nicely.',
            depth: 1,
            approved: 1,
            createdAt: hoursAgo(16)
        }
    ];

    await db.insert(schema.comments).values(replies);

    // Comment history for the edited comment
    await db.insert(schema.commentHistory).values({
        id: id(),
        commentId: commentData[4].id,
        content:
            'One small correction: BLAST uses a heuristic approach, not dynamic programming. The E-value explanation is spot on though.',
        editedAt: daysAgo(37),
        editedBy: trustedId
    });

    // ---- Reactions ----
    const allComments = [...commentData, ...replies];
    const allUserIds = [adminId, modId, trustedId, ...userIds.slice(0, 4)];
    const reactionInserts: Array<{
        id: string;
        commentId: string;
        userId: string;
        type: string;
        createdAt: string;
    }> = [];

    // Give likes to good comments
    for (const c of allComments.filter((c) => c.approved)) {
        const likeCount = Math.floor(Math.random() * 4) + 1;
        const shuffled = [...allUserIds].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(likeCount, shuffled.length); i++) {
            if (shuffled[i] !== c.userId) {
                reactionInserts.push({
                    id: id(),
                    commentId: c.id,
                    userId: shuffled[i],
                    type: 'like',
                    createdAt: c.createdAt
                });
            }
        }
    }

    if (reactionInserts.length > 0) {
        await db.insert(schema.commentReactions).values(reactionInserts);
    }

    // Post reactions
    const postReactionInserts: Array<{
        id: string;
        postId: string;
        userId: string;
        type: string;
        createdAt: string;
    }> = [];
    for (const p of posts.slice(0, 3)) {
        for (const uid of allUserIds.slice(0, 5)) {
            postReactionInserts.push({
                id: id(),
                postId: p.id,
                userId: uid,
                type: 'like',
                createdAt: daysAgo(Math.floor(Math.random() * 30))
            });
        }
    }
    await db.insert(schema.postReactions).values(postReactionInserts);

    // ---- Read History ----
    const readInserts: Array<{
        id: string;
        userId: string;
        postId: string;
        readAt: string;
    }> = [];
    for (const uid of allUserIds) {
        const readCount = Math.floor(Math.random() * 4) + 1;
        const shuffledPosts = [...posts].sort(() => Math.random() - 0.5);
        for (let i = 0; i < Math.min(readCount, shuffledPosts.length); i++) {
            readInserts.push({
                id: id(),
                userId: uid,
                postId: shuffledPosts[i].id,
                readAt: daysAgo(Math.floor(Math.random() * 30))
            });
        }
    }
    await db.insert(schema.readHistory).values(readInserts);

    // ---- Audit Log ----
    const auditEntries = [
        {
            id: id(),
            adminId,
            action: 'comment.approve',
            targetType: 'comment',
            targetId: commentData[0].id,
            details: JSON.stringify({ username: 'trusted_alex' }),
            ipAddress: '192.168.1.1',
            createdAt: daysAgo(55)
        },
        {
            id: id(),
            adminId,
            action: 'comment.approve',
            targetType: 'comment',
            targetId: commentData[1].id,
            details: JSON.stringify({ username: 'science_nerd' }),
            ipAddress: '192.168.1.1',
            createdAt: daysAgo(50)
        },
        {
            id: id(),
            adminId,
            action: 'comment.bulk-approve',
            targetType: 'comment',
            targetId: null,
            details: JSON.stringify({ count: 5 }),
            ipAddress: '192.168.1.1',
            createdAt: daysAgo(48)
        },
        {
            id: id(),
            adminId,
            action: 'user.ban',
            targetType: 'user',
            targetId: userIds[4],
            details: JSON.stringify({
                username: 'banned_troll',
                reason: 'Spam and harassment'
            }),
            ipAddress: '192.168.1.1',
            createdAt: daysAgo(10)
        },
        {
            id: id(),
            adminId: modId,
            action: 'comment.approve',
            targetType: 'comment',
            targetId: commentData[6].id,
            details: JSON.stringify({ username: 'code_monkey' }),
            ipAddress: '10.0.0.5',
            createdAt: daysAgo(25)
        },
        {
            id: id(),
            adminId: modId,
            action: 'comment.approve',
            targetType: 'comment',
            targetId: commentData[7].id,
            details: JSON.stringify({ username: 'bookworm_42' }),
            ipAddress: '10.0.0.5',
            createdAt: daysAgo(22)
        },
        {
            id: id(),
            adminId,
            action: 'comment.reject',
            targetType: 'comment',
            targetId: id(),
            details: JSON.stringify({ reason: 'Spam content' }),
            ipAddress: '192.168.1.1',
            createdAt: daysAgo(8)
        },
        {
            id: id(),
            adminId,
            action: 'admin.groups.manage',
            targetType: 'group',
            targetId: groupMap.get('trusted')!,
            details: JSON.stringify({
                action: 'promoted user',
                username: 'trusted_alex'
            }),
            ipAddress: '192.168.1.1',
            createdAt: daysAgo(40)
        }
    ];

    await db.insert(schema.auditLog).values(auditEntries);

    console.log('Seed complete:');
    console.log(
        `  ${users.length} users (1 admin, 1 mod, 1 trusted, ${userIds.length} regular, 1 banned)`
    );
    console.log(`  ${posts.length} posts`);
    console.log(
        `  ${allComments.length} comments (${commentData.filter((c) => !c.approved).length} pending)`
    );
    console.log(`  ${reactionInserts.length} comment reactions`);
    console.log(`  ${postReactionInserts.length} post reactions`);
    console.log(`  ${readInserts.length} read history entries`);
    console.log(`  ${auditEntries.length} audit log entries`);
}

seed().catch(console.error);
