import React from 'react';
import {
    SideBarContainer,
    SideBarSiteName,
    SideBarEntriesContainer,
    SideEntryLink,
    SideBarAbout,
} from '@components/pages/post';

interface FrontMatter {
    slug?: string;
    title: string;
    blurb: string;
    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    published: boolean;
    comments: boolean;
}

interface SideBarProps {
    section: string;
    posts: FrontMatter[];
}

const SideBar: React.FC<SideBarProps> = ({ section, posts }) => {
    return (
        <SideBarContainer>
            <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
            {posts.length > 0 ? posts.map((meta) => (
                <SideBarEntriesContainer key={meta.slug}>
                    <SideEntryLink
                        key={meta.slug}
                        href={`/${section}/${meta.slug}`}
                        passHref
                    >
                        <span style={{ fontWeight: 'bold' }}>{meta.date}</span>: {meta.title}
                    </SideEntryLink>
                </SideBarEntriesContainer>
            )) : null}
            <SideBarAbout />
        </SideBarContainer>
    );
}

export default SideBar;