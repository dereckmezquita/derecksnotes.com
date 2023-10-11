import React from 'react';
import {
    SideBarContainer,
    SideBarSiteName,
    SideBarEntriesContainer,
    SideEntryLink,
    SideBarAbout,
} from '@components/post-elements/post';

interface FrontMatter {
    slug?: string;
    title: string;
    blurb: string;
    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    published: boolean;
}

interface SideBarProps {
    section: string;
    posts: FrontMatter[];
}

const SideBar: React.FC<SideBarProps> = ({ section, posts }) => {
    return (
        <SideBarContainer>
            <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
            <SideBarEntriesContainer>
                {posts.map((meta) => (
                    <SideEntryLink
                        key={meta.slug}
                        href={`/${section}/${meta.slug}`}
                        passHref
                    >
                        <span style={{ fontWeight: 'bold' }}>{meta.date}</span>: {meta.title}
                    </SideEntryLink>
                ))}
            </SideBarEntriesContainer>
            <SideBarAbout />
        </SideBarContainer>
    );
}

export default SideBar;