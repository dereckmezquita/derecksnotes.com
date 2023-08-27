import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { SiteName } from '@components/Logo';

const PostContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 auto 50px;

    width: 80%;
    background-color: ${theme.container.background.colour.primary()};

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
    font-size: 14px;
    text-decoration: none;
    color: ${theme.text.colour.light_grey()};

    &:hover {
        color: ${theme.text.colour.anchor()};
        text-decoration: underline;
    }
`;

const Article = styled.article`
    width: 70%;
    margin-top: 30px;
    margin-bottom: 30px;
    padding-left: 40px;
    padding-right: 40px;
    border-left: 1px dashed ${theme.container.border.colour.primary()};
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
                    <SideBarSiteName fontSize='20px'>Dereck's Notes</SideBarSiteName>
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