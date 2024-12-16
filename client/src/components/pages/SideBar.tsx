import React from 'react';
import path from 'path';
import {
    SideBarContainer,
    SideBarSiteName,
    SideBarEntriesContainer,
    SideEntryLink,
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

function isPostMetadata(
    meta: PostMetadata | DefinitionMetadata
): meta is PostMetadata {
    return (meta as PostMetadata).title !== undefined;
}

function renderSideBarContent(posts: PostMetadata[] | DefinitionMetadata[]) {
    const types: Set<'post' | 'definition'> = new Set(
        posts.map((meta) => {
            return isPostMetadata(meta) ? 'post' : 'definition';
        })
    );

    if (types.size !== 1) {
        throw new Error('All items in posts must be of the same type');
    }

    const type = types.has('post') ? 'post' : 'definition';

    if (type === 'post') {
        return (
            <>
                {(posts as PostMetadata[]).map((meta) => (
                    <SideBarEntriesContainer key={meta.slug}>
                        <SideEntryLink
                            key={meta.slug}
                            href={buildHref(meta)}
                            passHref
                        >
                            <span style={{ fontWeight: 'bold' }}>
                                {meta.date}
                            </span>
                            : {meta.title}
                        </SideEntryLink>
                    </SideBarEntriesContainer>
                ))}
            </>
        );
    } else {
        return (
            <>
                {(posts as DefinitionMetadata[]).map((meta) => (
                    <SideBarEntriesContainer key={meta.slug}>
                        <SideEntryLink
                            key={meta.slug}
                            href={buildHref(meta)}
                            passHref
                        >
                            {meta.word}
                        </SideEntryLink>
                    </SideBarEntriesContainer>
                ))}
            </>
        );
    }
}

function buildHref(meta: PostMetadata | DefinitionMetadata): string {
    if (isPostMetadata(meta)) {
        if (!meta.path) {
            throw new Error('Post metadata does not have a valid "path".');
        }
        return path.join('/', meta.path);
    } else {
        if (!meta.dictionary || !meta.slug) {
            throw new Error(
                'Definition metadata must include both "dictionary" and "slug".'
            );
        }
        return `/dictionaries/${meta.dictionary}/${meta.slug}`;
    }
}
