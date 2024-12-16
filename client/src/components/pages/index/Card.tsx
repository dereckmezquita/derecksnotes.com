'use client';
import Link from 'next/link';
import styled, { css } from 'styled-components';

import path from 'path';
import DropCap from './DropCap';
import { PostMetadata } from '@utils/mdx/fetchPostsMetadata';

const PostMeta = styled.div`
    font-size: 15px;
    color: ${(props) => props.theme.text.colour.light_grey()};
    font-style: italic;
    padding-top: 7px;
    padding-bottom: 7px;
`;
const PostTitle = styled.div`
    font-size: 15px;
    text-transform: uppercase;
    font-variant: small-caps;
    padding-bottom: 7px;
    padding-left: 7px;
    padding-right: 7px;
`;

const Summary = styled.p`
    text-align: left;
    text-justify: none;
    font-size: 13px;
    padding-left: 15px;
    padding-right: 15px;
`;

const CardContainerBase = css`
    text-decoration: none;
    color: inherit;
    &:hover,
    &:active,
    &:visited,
    &:focus {
        text-decoration: none;
        color: inherit;
    }

    background-color: ${(props) =>
        props.theme.container.background.colour.content()};

    padding: 5px;
    text-decoration: none;
    cursor: pointer;

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow:
        1px 1px 20px rgba(153, 153, 153, 0.5),
        0 0 20px rgba(100, 100, 40, 0.2) inset;
    text-align: center;

    &:hover {
        box-shadow:
            1px 1px 20px rgba(153, 153, 153, 0.8),
            0 0 20px rgba(100, 100, 40, 0.2) inset;
    }
`;

export const CardContainerDiv = styled.div`
    ${CardContainerBase}
    display: block;
`;

const CardContainer = styled(Link)`
    ${CardContainerBase}

    /* Add any additional styles or media queries here */
    @media screen and (max-width: 550px) {
        ${PostMeta}, ${PostTitle} {
            font-size: 1.2rem;
        }

        ${Summary} {
            font-size: 1rem;
        }

        ${DropCap} {
            line-height: 60px;
        }
    }
`;

const PostImage = styled.img`
    display: block;
    margin: auto;
    max-height: 140px;
    max-width: 90%;

    filter: sepia(20%);
`;

const Date = styled.span`
    display: inline;
    padding-left: 2px;
    color: ${(props) => props.theme.theme_colours[5]()};
`;

interface CardProps {
    post: PostMetadata;
    section: string;
}

function Card({ post, section }: CardProps) {
    if (!post.summary) {
        throw new Error('Post summary is empty');
    }

    if (!post.path) {
        throw new Error('Post path is empty');
    }

    const link: string = path.join('/', post.path);

    const firstLetter = post.summary.charAt(0);
    const restOfSummary = post.summary.slice(1, 100);

    return (
        <CardContainer key={post.slug} href={link}>
            <PostMeta>{post.blurb}</PostMeta>
            <PostTitle>{post.title}</PostTitle>
            <PostImage src={post.coverImage} alt={post.title} />
            <PostMeta>{post.author}</PostMeta>
            <Summary>
                <DropCap>{firstLetter}</DropCap>
                {restOfSummary}... <Date>{post.date}</Date>
            </Summary>
        </CardContainer>
    );
}

export default Card;
