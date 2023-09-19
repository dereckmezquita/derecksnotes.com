// src/components/PostPreview.tsx
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { theme } from '@styles/theme';

import path from 'path';
import DropCap from './DropCap';

const Card = styled.div`
    background-color: ${(props) => props.theme.container.background.colour.content()};

    padding: 15px;
    text-decoration: none;
    cursor: pointer;

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5), 0 0 20px rgba(100, 100, 40, 0.2) inset;
    text-align: center;

    &:hover {
        box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.8), 0 0 20px rgba(100, 100, 40, 0.2) inset;
    }
`;

const PostMeta = styled.div`
    font-size: 15px;
    color: ${theme.text.colour.light_grey()};
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

const PostImage = styled.img`
    display: block;
    margin: auto;
    max-height: 140px;
    max-width: 90%;

    filter: sepia(20%); // adds yellow tint
`;

const Summary = styled.p`
    text-align: left;
    text-justify: none;
    font-size: 13px;
    padding-left: 10px;
    padding-right: 10px;
`;

const Date = styled.span`
    display: inline;
    padding-left: 5px;
    color: ${theme.theme_colours[5]()};
`;

const CardPreview = (props: PostMetadata) => {
    const router = useRouter();

    const handleClick = () => {
        router.push(path.join("/", props.section, props.slug));
    }

    const firstLetter = props.summary.charAt(0);
    const restOfSummary = props.summary.slice(1, 150);

    return (
        <Card onClick={handleClick}>
            <PostMeta>{props.blurb}</PostMeta>
            <PostTitle>{props.title}</PostTitle>
            <PostImage src={props.coverImage} alt={props.title} />
            <PostMeta>{props.author}</PostMeta>
            <Summary>
                <DropCap>{firstLetter}</DropCap>{restOfSummary}... <Date>{props.date}</Date>
            </Summary>
        </Card>
    )
}

export default CardPreview;