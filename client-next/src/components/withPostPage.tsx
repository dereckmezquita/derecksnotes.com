import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { SiteName } from '@components/ui/Logo';

const PostContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 auto 50px;

    width: 80%;
    background-color: ${theme.container.background.colour.content()};

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5), 0 0 20px rgba(100, 100, 40, 0.2) inset;

    @media (max-width: 1096px) {
        flex-direction: column;
        width: 95%;
    }
`;

const SideBarContainer = styled.div`
    width: 25%;
    text-align: center;
    padding-top: 20px;

    @media (max-width: 1096px) {
        display: none;
    }
`;
const SideBarSiteName = styled(SiteName)<{ fontSize: string }>`
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
    
    @media (max-width: 1096px) {
        width: 100%;
    }
`;

const PostContent = styled.div`
    margin: 0 auto;
    padding: 0px;
`;


export const withPostPage = (section: string) => {
    const PostPage: React.FC<{
        content: string; post: PostMetadata, postsMetadata: PostMetadata[]
    }> = ({
        content, post, postsMetadata
    }) => {
        // postsMetadata should already be sorted
        return (
            <PostContainer>
                <SideBarContainer>
                    <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
                    <SideBarEntriesContainer>
                        {postsMetadata.map((postMetadata) => (
                            <SideEntryLink
                                key={postMetadata.slug}
                                href={`/${section}/${postMetadata.slug}`}
                                passHref
                            >
                                <span style={{ fontWeight: 'bold' }}>{postMetadata.date}</span>: {postMetadata.title}
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
        );
    };

    return PostPage;
};