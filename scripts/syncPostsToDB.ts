import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { glob } from 'glob';
import matter from 'gray-matter'; // parse frontmatter

import { db } from '../server/src/db/DataBase';
import { Post } from '../server/src/db/models/Post';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', 'server', '.env') });

// Root directory for pages
const ROOT_DIR = join(__dirname, '..', 'client', 'src', 'app');
// Pattern to find MDX files
const pattern = '**/*.mdx';

// Ignore files containing .deprecated or .ignore
function shouldIgnore(filePath: string): boolean {
    return filePath.includes('.deprecated') || filePath.includes('.ignore');
}

// Derive slug from MDX file path
function deriveSlug(fullPath: string): string {
    const relative = fullPath.replace(ROOT_DIR, '');
    const withoutExt = relative.replace(/\.mdx$/, '');
    // If it's a blog post under /blog/posts/, remove the "posts" segment
    // For example: /blog/posts/20210730_something -> /blog/20210730_something
    const finalSlug = withoutExt.replace('/posts/', '/');
    if (finalSlug.startsWith('/')) {
        return finalSlug.slice(1);
    }
    return finalSlug;
}

async function main() {
    console.log('Syncing posts to DB...');

    await db.mongooseClient; // Ensure DB connected

    const mdxFiles: string[] = glob.sync(pattern, {
        cwd: ROOT_DIR,
        absolute: true
    });

    console.log(`Found ${mdxFiles.length} MDX files before filtering.`);

    const filteredFiles = mdxFiles.filter((f) => !shouldIgnore(f));
    console.log(`After ignoring, we have ${filteredFiles.length} MDX files.`);

    // Collect all slugs
    const allSlugs = filteredFiles.map((file) => deriveSlug(file));

    // Find which slugs already exist
    const existingPosts = await Post.find(
        { slug: { $in: allSlugs } },
        { slug: 1 }
    );
    const existingSlugs = new Set(existingPosts.map((p) => p.slug));

    // Determine which slugs are new
    const newSlugsAndFiles = filteredFiles
        .map((file) => ({ file, slug: deriveSlug(file) }))
        .filter(({ slug }) => !existingSlugs.has(slug));

    if (newSlugsAndFiles.length > 0) {
        // For each new slug, read file, parse frontmatter
        const docsToInsert = [];
        for (const { file, slug } of newSlugsAndFiles) {
            const content = fs.readFileSync(file, 'utf-8');
            const { data } = matter(content);

            // Extract relevant fields from frontmatter
            const published =
                typeof data.published === 'boolean' ? data.published : false;
            const comments =
                typeof data.comments === 'boolean' ? data.comments : false;

            docsToInsert.push({
                slug,
                views: 0,
                likes: 0,
                published,
                comments
            });
        }

        await Post.insertMany(docsToInsert, { ordered: false });
        console.log(`Inserted ${docsToInsert.length} new posts`);
    } else {
        console.log('No new posts to insert.');
    }

    console.log(`Already existed: ${existingSlugs.size}`);
    console.log('All posts synced!');
    await db.disconnect();
    process.exit(0);
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
