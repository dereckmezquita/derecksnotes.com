import React from 'react';
import path from 'path';

import { APPLICATION_DESCRIPTION } from '@lib/constants';
import { ROOT_DIR_APP } from '@lib/constants.server';
import { Metadata } from 'next';

import { PostMetadata, getSectionPosts } from '@utils/mdx/fetchPostsMetadata';
import {
    getAllCourses,
    CourseCardMetadata
} from '@utils/courses/fetchCourseMetadata';
import { Index } from '@components/pages/index/Index';

export const metadata: Metadata = {
    title: 'Dn | Courses',
    description: APPLICATION_DESCRIPTION
};

async function Page() {
    const postsDir = path.join(ROOT_DIR_APP, 'courses', 'posts');

    // Get new-format courses (with course.mdx)
    const newCourses: CourseCardMetadata[] = getAllCourses(postsDir);

    // Get legacy posts (single MDX files and old multi-part format)
    const legacyPosts: PostMetadata[] = getSectionPosts('courses');

    // Filter out any legacy posts that are now handled by the new course system
    const newCourseSlugs = new Set(newCourses.map((c) => c.slug));
    const filteredLegacyPosts = legacyPosts.filter(
        (p) => !newCourseSlugs.has(p.slug)
    );

    // Combine and convert to PostMetadata format for the Index component
    const allPosts: PostMetadata[] = [
        ...newCourses.map(
            (course) =>
                ({
                    slug: course.slug,
                    title: course.title,
                    blurb: course.blurb,
                    summary: course.summary,
                    coverImage: course.coverImage,
                    author: course.author,
                    date: course.date,
                    tags: course.tags,
                    published: course.published,
                    section: 'courses',
                    path: course.path,
                    comments: true
                }) as PostMetadata
        ),
        ...filteredLegacyPosts
    ];

    // Sort by date (newest first)
    allPosts.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return <Index posts={allPosts} />;
}

export default Page;
