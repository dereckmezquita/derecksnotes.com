import React, { useState } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { SiteName } from '@components/ui/Logo';

import TagFilter from '@components/ui/TagFilter';

import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

const PostContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 auto 50px;

    width: 80%;
    background-color: ${theme.container.background.colour.content()};

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5), 0 0 20px rgba(100, 100, 40, 0.2) inset;

    @media (max-width: ${theme.container.widths.min_width_snap_up}) {
        flex-direction: column;
        width: 95%;
    }
`;

const SideBarContainer = styled.div`
    width: 25%;
    text-align: center;
    padding-top: 20px;

    @media (max-width: ${theme.container.widths.min_width_snap_up}) {
        display: none;
    }
`;
const SideBarSiteName = styled(SiteName) <{ fontSize: string }>`
    font-size: 20px;
    border-bottom: 1px dashed ${theme.container.border.colour.primary()};
`;

const SideBarEntriesContainer = styled.div`
    margin-top: 30px;
    text-align: left;
`;

const SideEntryLink = styled(Link)`
    display: block;
    font-size: 13px;
    text-decoration: none;
    color: ${theme.text.colour.light_grey()};

    &:hover {
        color: ${theme.text.colour.anchor()};
        text-decoration: underline;
    }
`;

const SideBarAboutContainer = styled.div`
    display: block;
    margin-top: 30px;
    padding-top: 30px;
    text-align: justify;
    text-justify: auto;

    p {
        font-size: 0.9rem;
        padding-right: 10px;
        margin-right: 10px;
    }
`;

const SideBarAboutH2 = styled.h2`
    padding-top: 10px;
    font-size: 20px;
    color: ${theme.text.colour.light_grey(undefined, undefined, 50)};
`;

const Article = styled.article`
    width: 70%;
    margin-top: 30px;
    margin-bottom: 30px;
    padding-left: 40px;
    padding-right: 40px;
    border-left: 1px dashed ${theme.container.border.colour.primary()};
    
    text-align: justify;
    text-justify: auto;
    
    @media (max-width: ${theme.container.widths.min_width_snap_up}) {
        width: 100%;
        border-left: none;
    }
`;

const PostContent = styled.div`
    margin: 0 auto;
    padding: 0px;

    /* style img but exclude any that have class .link-icon-image */
    img:not(.link-icon-image) {
        display: block;
        margin: 0 auto;
        max-width: 100%;
        height: auto;
    }

    iframe {
        display: block;
        margin: 0 auto;
        max-width: 100%;
    }

    table {
        background-color: ${theme.container.background.colour.primary()};

        font-family: sans-serif;
        font-size: 0.9em;
        text-align: center;

        margin: 0px auto;

        border-collapse: collapse;

        border: 1px solid ${theme.container.border.colour.primary()};
        box-shadow: ${theme.container.shadow.primary};

        @media only screen and (max-width: 600px) {
            font-size: 0.5em;
        }

        td {
            padding: 5px;
            text-align: center;
            border: 1px solid ${theme.container.border.colour.primary()};
        }

        th {
            padding: 5px;
            border: 1px solid ${theme.container.border.colour.primary()};
        }
    }
`;

interface PostPageProps {
    content: string;
    post: PostMetadata;
    posts: PostMetadata[];
};

// reminder this returns a function
// this function is used in [slug].tsx and uses post, posts which are global variables
// these variables are passed by getStaticProps
export const withPostPage = (section: string) => {
    const PostPage: React.FC<PostPageProps> = ({ content, post, posts }) => {
        const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();

        const [selectedTags, setSelectedTags] = useState<string[]>([]);

        // if no tags selected, show all posts
        const filteredPosts: PostMetadata[] = selectedTags.length > 0 ? posts.filter(
            post => selectedTags.some(tag => post.tags.includes(tag))
        ) : posts;

        const handleTagSelect = (tag: string) => {
            setSelectedTags(prev => [...prev, tag]);
        };

        const handleTagDeselect = (tag: string) => {
            setSelectedTags(prev => prev.filter(t => t !== tag));
        };

        // redux control for tag filter visibility
        const tagsFilterVisible = useSelector((state: RootState) => state.visibility.tagsFilterVisible);

        return (
            <>
                <TagFilter
                    tags={allTags}
                    selectedTags={selectedTags}
                    onTagSelect={handleTagSelect}
                    onTagDeselect={handleTagDeselect}
                    visible={tagsFilterVisible}
                />
                <PostContainer>
                    <SideBarContainer>
                        <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
                        <SideBarEntriesContainer>
                            {filteredPosts.map((meta) => (
                                <SideEntryLink
                                    key={meta.slug}
                                    href={`/${section}/${meta.slug}`}
                                    passHref
                                >
                                    <span style={{ fontWeight: 'bold' }}>{meta.date}</span>: {meta.title}
                                </SideEntryLink>
                            ))}
                        </SideBarEntriesContainer>
                        <SideBarAboutContainer>
                            <SideBarAboutH2>About</SideBarAboutH2>
                            <p>
                                This website is custom made by Dereck using React, Next.js, and TypeScript. It incorporates progressive web app technologies an relies on a NodeJS backend along with a MongoDB database.
                            </p>
                            <p>
                                If you'd like to know more you can find the full source code on <a href='https://github.com/dereckmezquita/derecksnotes.com'>github.com/dereckmezquita/derecksnotes.com</a>
                            </p>
                        </SideBarAboutContainer>
                    </SideBarContainer>
                    <Article>
                        <h1>{post.title}</h1>
                        <PostContent dangerouslySetInnerHTML={{ __html: content }} />
                    </Article>
                </PostContainer>
            </>
        );
    };

    return PostPage;
};