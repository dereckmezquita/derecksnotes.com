import React, { ReactElement } from 'react';
import path from 'path';
import {
    SideBarContainer,
    SideBarSiteName,
    SideBarEntriesContainer,
    SideEntryLink,
    SideEntry,
    SideBarAbout
} from './posts-dictionaries';
import { PostMetadata } from '@utils/mdx/fetchPostsMetadata';
import { DefinitionMetadata } from '@utils/dictionaries/fetchDefinitionMetadata';

interface SideBarProps {
    posts: PostMetadata[] | DefinitionMetadata[];
}

function SideBar({ posts }: SideBarProps) {
    return (
        <SideBarContainer>
            <SideBarSiteName fontSize="20px">{`Dereck's Notes`}</SideBarSiteName>
            {posts.length > 0 && renderSideBarContent(posts)}
            <SideBarAbout />
        </SideBarContainer>
    );
}

export default SideBar;

function renderSideBarContent(posts: any) {
    // If the first item doesn't have 'title', treat them all as definitions
    if (!('title' in posts[0])) {
        return <>{renderAllDefinitions(posts)}</>;
    }

    // ---- 1. Group posts by title. ----
    const groupedPosts: Record<string, PostMetadata[]> = {};

    for (let i = 0; i < posts.length; i++) {
        const post = posts[i];
        if (!groupedPosts[post.title]) {
            groupedPosts[post.title] = [];
        }
        groupedPosts[post.title].push(post);
    }

    // ---- 2. Render each group. ----
    const renderedContent: ReactElement[] = [];
    const titleKeys = Object.keys(groupedPosts);

    for (let i = 0; i < titleKeys.length; i++) {
        const titleKey = titleKeys[i];
        const group = groupedPosts[titleKey];

        // Check if any post in this group has a `series` property
        let isSeries = false;
        for (let j = 0; j < group.length; j++) {
            if (group[j].series) {
                isSeries = true;
                break;
            }
        }

        // If not a series, or if there's only one post in the group
        // we render them individually.
        if (!isSeries || group.length < 2) {
            for (let j = 0; j < group.length; j++) {
                renderedContent.push(renderPost(group[j]));
            }
        } else {
            // Sort series by series.idx, then render as a list
            group.sort((a, b) => {
                const idxA = a.series?.idx ?? 0;
                const idxB = b.series?.idx ?? 0;
                return idxA - idxB;
            });
            renderedContent.push(renderSeriesList(group));
        }
    }

    return renderedContent;
}

// Helper function for definitions:
function renderAllDefinitions(defs: DefinitionMetadata[]) {
    const items: ReactElement[] = [];
    for (let i = 0; i < defs.length; i++) {
        items.push(renderDefinition(defs[i]));
    }
    return items;
}

function renderDefinition(def: DefinitionMetadata) {
    return (
        <SideBarEntriesContainer key={def.slug}>
            <SideEntryLink
                key={def.slug}
                href={path.join('/dictionaries', def.dictionary, def.slug)}
                passHref
            >
                {def.word}
            </SideEntryLink>
        </SideBarEntriesContainer>
    );
}

function renderPost(post: PostMetadata) {
    return (
        <SideBarEntriesContainer key={post.slug}>
            <SideEntryLink key={post.slug} href={post.slug} passHref>
                <span style={{ fontWeight: 'bold' }}>{post.date}</span>:{' '}
                {post.title}
            </SideEntryLink>
        </SideBarEntriesContainer>
    );
}

// Renders a series as an unordered list:
//  * First item: date + title
//  * Subsequent items: “Chapter i: title”
function renderSeriesList(series: PostMetadata[]) {
    const firstPost = series[0];
    const listItems: ReactElement[] = [];

    // Top item
    listItems.push(
        <SideEntry key={firstPost.slug}>
            <SideEntryLink href={firstPost.slug} passHref>
                <span style={{ fontWeight: 'bold' }}>{firstPost.date}</span>:{' '}
                {firstPost.title}
            </SideEntryLink>
        </SideEntry>
    );

    // Subsequent “Chapters”
    for (let i = 0; i < series.length; i++) {
        const post = series[i];
        listItems.push(
            <li key={`${i}-${post.title}-${post.subtitle}`}>
                <SideEntryLink href={post.slug} passHref>
                    <span style={{ fontWeight: 'bold' }}>Chp {i + 1}:</span>{' '}
                    {post.subtitle}
                </SideEntryLink>
            </li>
        );
    }

    return (
        <SideBarEntriesContainer key={firstPost.slug}>
            {listItems}
        </SideBarEntriesContainer>
    );
}
