import React from 'react';
import {
    SideBarContainer,
    SideBarSiteName,
    SideBarEntriesContainer,
    SideEntryLink,
    SideBarAbout
} from './posts-dictionaries';
import { PostMetadata } from '@components/utils/mdx/fetchPostsMetadata';

interface SideBarProps {
    posts: PostMetadata[];
}

function SideBar({ posts }: SideBarProps) {
    return (
        <SideBarContainer>
            <SideBarSiteName fontSize="20px">{`Dereck's Notes`}</SideBarSiteName>
            {posts.length > 0
                ? posts.map((meta) => (
                    <SideBarEntriesContainer key={meta.slug}>
                        <SideEntryLink
                            key={meta.slug}
                            href={`/${meta.section}/${meta.slug}`}
                            passHref
                        >
                            <span style={{ fontWeight: 'bold' }}>
                                {meta.date}
                            </span>
                            : {meta.title}
                        </SideEntryLink>
                    </SideBarEntriesContainer>
                ))
                : null}
            <SideBarAbout />
        </SideBarContainer>
    );
};

export default SideBar;
