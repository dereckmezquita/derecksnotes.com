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
        props.theme.container.background.colour.card()};

    padding: 5px;
    text-decoration: none;
    cursor: pointer;

    border: 1px solid #ccc;
    border-radius: 5px;

    text-align: center;
    position: relative;
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

/**
 * Tiny circular like badge
 * - Absolutely positioned in the bottom-right corner
 * - Uses theme colours if likes > 0 or likes < 0
 * - Not displayed at all if likes is undefined or 0
 */
const LikeBadge = styled.span<{ likes: number }>`
    position: absolute;
    bottom: 8px;
    right: 8px;

    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 50%;
    font-size: 0.8rem;
    /* font-weight: bold; */

    color: ${(props) =>
        props.likes > 0
            ? props.theme.likeBadge.positiveColour
            : props.theme.likeBadge.negativeColour};
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

            {typeof post.likes === 'number' && post.likes !== 0 && (
                <LikeBadge likes={post.likes}>{post.likes}</LikeBadge>
            )}
        </CardContainer>
    );
}

export default Card;
