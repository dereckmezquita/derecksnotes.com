import fs from 'fs';
import path from 'path';
import { APPLICATION_DEFAULT_METADATA } from '@lib/constants';
import { ROOT_DIR_APP } from '@lib/constants.server';
import { processMdx } from '@utils/mdx/processMdx';
import { notFound } from 'next/navigation';
import { Post } from '@components/pages/Post';
import {
    PostMetadata,
    extractSinglePostMetadata,
    getSideBarPosts
} from '@utils/mdx/fetchPostsMetadata';
import {
    isCourseDirectory,
    loadCourseMetadata,
    findPartByPath,
    getPartNavigation,
    CourseMetadata
} from '@utils/courses/fetchCourseMetadata';
import { CourseOverview } from '@components/courses/CourseOverview';
import { CoursePost } from '@components/courses/CoursePost';
import { accessReadFile } from '@utils/accessReadFile';
import { Metadata } from 'next';
import { decodeSlug } from '@utils/helpers';

const section: string = 'courses';
const relDir = path.join(section, 'posts');
const absDir = path.join(ROOT_DIR_APP, relDir);

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Recursively collect all MDX file paths from a course hierarchy
 */
function collectCoursePaths(courseSlug: string, courseDir: string): string[][] {
    const course = loadCourseMetadata(courseDir);
    if (!course) return [];

    const paths: string[][] = [];

    // Add the course overview page (just the course slug)
    paths.push([courseSlug]);

    // Add all published parts
    for (const part of course.allParts) {
        if (part.published) {
            // Split the part path into segments
            const segments = part.path.split('/');
            paths.push([courseSlug, ...segments]);
        }
    }

    return paths;
}

/**
 * Check if a directory is a legacy multi-part course (no course.mdx)
 */
function isLegacyMultiPartDir(dirPath: string): boolean {
    const stat = fs.statSync(dirPath);
    if (!stat.isDirectory()) return false;

    // If it has course.mdx, it's the new format
    if (fs.existsSync(path.join(dirPath, 'course.mdx'))) return false;

    // Check if it contains MDX files (legacy format)
    const items = fs.readdirSync(dirPath);
    return items.some((item) => item.endsWith('.mdx'));
}

// ============================================================================
// Static Params Generation
// ============================================================================

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
    const items: string[] = fs.readdirSync(absDir);
    const params: { slug: string[] }[] = [];

    for (const item of items) {
        const itemPath = path.join(absDir, item);
        const stat = fs.statSync(itemPath);

        if (stat.isDirectory()) {
            // Skip ignored directories
            if (
                ['drafts', 'deprecated', 'ignore', 'src', 'data'].includes(item)
            ) {
                continue;
            }

            // Check if it's a new-format course (has course.mdx)
            if (isCourseDirectory(itemPath)) {
                const coursePaths = collectCoursePaths(item, itemPath);
                params.push(
                    ...coursePaths.map((segments) => ({ slug: segments }))
                );
            } else if (isLegacyMultiPartDir(itemPath)) {
                // Legacy multi-part handling
                const seriesItems = fs.readdirSync(itemPath);
                const mdxFiles = seriesItems.filter((f) => f.endsWith('.mdx'));

                if (mdxFiles.length > 0) {
                    mdxFiles.sort();
                    // For legacy, just add the first file as representative
                    const noExt = mdxFiles[0].replace('.mdx', '');
                    params.push({ slug: [item, noExt] });
                }
            }
        } else if (item.endsWith('.mdx')) {
            // Single-file course
            const noExt = item.replace('.mdx', '');
            params.push({ slug: [noExt] });
        }
    }

    return params;
}

// ============================================================================
// Page Component
// ============================================================================

async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
    const decodedSegments = (await params).slug.map(decodeSlug);
    const courseSlug = decodedSegments[0];
    const courseDir = path.join(absDir, courseSlug);

    // Check if this is a new-format course
    if (fs.existsSync(courseDir) && isCourseDirectory(courseDir)) {
        const course = loadCourseMetadata(courseDir);

        if (!course || !course.published) {
            notFound();
        }

        // Is this the course overview page?
        if (decodedSegments.length === 1) {
            // Process the preface content from course.mdx
            const courseMdxPath = path.join(courseDir, 'course.mdx');
            const courseMdxContent = await accessReadFile(courseMdxPath);

            if (!courseMdxContent) {
                notFound();
            }

            const { source: prefaceSource } =
                await processMdx<any>(courseMdxContent);

            return (
                <CourseOverview course={course} prefaceSource={prefaceSource} />
            );
        }

        // This is a specific part within the course
        const partPath = decodedSegments.slice(1).join('/');
        const part = findPartByPath(course, partPath);

        if (!part || !part.published) {
            notFound();
        }

        // Read and process the part content
        const partMdxPath = part.absolutePath;
        const partContent = await accessReadFile(partMdxPath);

        if (!partContent) {
            notFound();
        }

        const { source } = await processMdx<any>(partContent);
        const { previous, next } = getPartNavigation(course, partPath);

        return (
            <CoursePost
                course={course}
                currentPart={part}
                source={source}
                previousPart={previous}
                nextPart={next}
            />
        );
    }

    // Fall back to legacy handling for old-format posts
    const absPath: string = path.join(absDir, ...decodedSegments) + '.mdx';
    const sideBarPosts = getSideBarPosts(section);
    const markdown = await accessReadFile(absPath);

    if (!markdown) {
        notFound();
    }

    const { source, frontmatter } = await processMdx<PostMetadata>(markdown);

    if (!frontmatter.published) {
        notFound();
    }

    const decodedSlug = decodedSegments.join('/');
    const url = new URL(
        path.join(section, decodedSlug),
        APPLICATION_DEFAULT_METADATA.url
    ).toString();

    const frontmatter2: PostMetadata = {
        ...extractSinglePostMetadata(absPath),
        section,
        url: url
    };

    if (!frontmatter2.summary) {
        throw new Error(`Post ${frontmatter.slug} is missing a summary`);
    }

    APPLICATION_DEFAULT_METADATA.title = frontmatter2.title;
    APPLICATION_DEFAULT_METADATA.description = frontmatter2.summary;
    APPLICATION_DEFAULT_METADATA.image =
        '/site-images/card-covers/' + frontmatter2.coverImage + '.png';

    return (
        <Post
            source={source}
            frontmatter={frontmatter2}
            sideBarPosts={sideBarPosts}
        />
    );
}

export default Page;

// ============================================================================
// Metadata Generation
// ============================================================================

export async function generateMetadata({
    params
}: {
    params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
    const decodedSegments = (await params).slug.map(decodeSlug);
    const courseSlug = decodedSegments[0];
    const courseDir = path.join(absDir, courseSlug);

    // Handle new-format courses
    if (fs.existsSync(courseDir) && isCourseDirectory(courseDir)) {
        const course = loadCourseMetadata(courseDir);

        if (!course) {
            return {
                title: 'Course Not Found'
            };
        }

        // Course overview page
        if (decodedSegments.length === 1) {
            return {
                metadataBase: new URL(APPLICATION_DEFAULT_METADATA.url!),
                title: `Dn | ${course.title}`,
                description: course.blurb,
                openGraph: {
                    title: course.title,
                    description: course.blurb,
                    images: [
                        {
                            url: course.coverImage,
                            width: 800,
                            height: 600,
                            alt: "Dereck's Notes Logo"
                        }
                    ]
                },
                twitter: {
                    card: 'summary_large_image',
                    title: course.title,
                    description: course.blurb,
                    images: [course.coverImage]
                }
            };
        }

        // Specific part
        const partPath = decodedSegments.slice(1).join('/');
        const part = findPartByPath(course, partPath);

        if (part) {
            const description = `${part.displayTitle} - ${course.title}`;
            return {
                metadataBase: new URL(APPLICATION_DEFAULT_METADATA.url!),
                title: `Dn | ${part.title}`,
                description: description,
                openGraph: {
                    title: part.title,
                    description: description,
                    images: [
                        {
                            url: course.coverImage,
                            width: 800,
                            height: 600,
                            alt: "Dereck's Notes Logo"
                        }
                    ]
                },
                twitter: {
                    card: 'summary_large_image',
                    title: part.title,
                    description: description,
                    images: [course.coverImage]
                }
            };
        }
    }

    // Fall back to legacy metadata handling
    const filePath: string = path.join(absDir, ...decodedSegments) + '.mdx';
    const post: PostMetadata = extractSinglePostMetadata(filePath);

    return {
        metadataBase: new URL(APPLICATION_DEFAULT_METADATA.url!),
        title: `Dn | ${post.title}`,
        description: post.summary,
        openGraph: {
            title: post.title,
            description: post.summary,
            images: [
                {
                    url: post.coverImage,
                    width: 800,
                    height: 600,
                    alt: "Dereck's Notes Logo"
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.summary,
            images: [post.coverImage]
        }
    };
}
