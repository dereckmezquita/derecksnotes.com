/**
 * Script to assign an existing user to the admin group
 * Usage: bun run src/db/assign-admin.ts <username>
 * Example: bun run src/db/assign-admin.ts dereckmezquita
 */

import { db, schema } from './index';
import { eq, and } from 'drizzle-orm';

function generateId(): string {
    return crypto.randomUUID();
}

async function assignAdmin(username: string) {
    console.log(`\nAssigning admin role to user: ${username}\n`);

    // Find user by username
    const user = await db.query.users.findFirst({
        where: eq(schema.users.username, username)
    });

    if (!user) {
        console.error(`❌ User "${username}" not found!`);
        console.log('\nAvailable users:');
        const allUsers = await db.query.users.findMany({
            columns: { username: true, displayName: true }
        });
        for (const u of allUsers) {
            console.log(
                `  - ${u.username} (${u.displayName || 'no display name'})`
            );
        }
        process.exit(1);
    }

    console.log(
        `✅ Found user: ${user.username} (${user.displayName || user.username})`
    );

    // Find admin group
    const adminGroup = await db.query.groups.findFirst({
        where: eq(schema.groups.name, 'admin')
    });

    if (!adminGroup) {
        console.error(
            '❌ Admin group not found! Run the main seed script first.'
        );
        console.log('   Example: bun run db:seed');
        process.exit(1);
    }

    console.log(`✅ Found admin group: ${adminGroup.name}`);

    // Check if already assigned
    const existingAssignment = await db.query.userGroups.findFirst({
        where: and(
            eq(schema.userGroups.userId, user.id),
            eq(schema.userGroups.groupId, adminGroup.id)
        )
    });

    if (existingAssignment) {
        console.log(`\n⚠️  User "${username}" is already an admin!`);
        process.exit(0);
    }

    // Assign user to admin group
    await db.insert(schema.userGroups).values({
        id: generateId(),
        userId: user.id,
        groupId: adminGroup.id
    });

    console.log(`\n✅ Successfully assigned "${username}" to admin group!`);

    // List all groups the user now belongs to
    const userGroups = await db.query.userGroups.findMany({
        where: eq(schema.userGroups.userId, user.id),
        with: { group: true }
    });

    console.log('\nUser groups:');
    for (const ug of userGroups) {
        console.log(`  - ${ug.group?.name}`);
    }

    console.log('\n✅ Done!');
}

// Get username from command line args
const username = process.argv[2];

if (!username) {
    console.error('Usage: bun run src/db/assign-admin.ts <username>');
    console.error('Example: bun run src/db/assign-admin.ts dereckmezquita');
    process.exit(1);
}

assignAdmin(username).catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});
