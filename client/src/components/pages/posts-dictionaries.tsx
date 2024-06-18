// components that are common between displaying a post and dictionaries
import styled from 'styled-components';
import Link from 'next/link';

import { SiteName } from '@components/components/ui/Logo';

const minWidthSnapUp = (props: any) =>
    props.theme.container.widths.min_width_snap_up;

export const PostContainer = styled.div`
    display: flex;
    justify-content: center;
    margin: 0 auto 50px;

    width: 80%;
    background-color: ${(props) =>
        props.theme.container.background.colour.content()};

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow:
        1px 1px 20px rgba(153, 153, 153, 0.5),
        0 0 20px rgba(100, 100, 40, 0.2) inset;

    @media (max-width: ${minWidthSnapUp}) {
        flex-direction: column;
        width: 95%;
    }
`;

export const SideBarContainer = styled.div`
    width: 25%;
    text-align: center;
    padding-top: 20px;

    @media (max-width: ${minWidthSnapUp}) {
        display: none;
    }
`;

export const SideBarSiteName = styled(SiteName)<{ fontSize: string }>`
    font-size: 20px;
    border-bottom: 1px dashed
        ${(props) => props.theme.container.border.colour.primary()};
    margin-bottom: 30px;
`;

export const SideBarEntriesContainer = styled.div`
    text-align: left;
`;

export const SideEntryLink = styled(Link)`
    display: block;
    font-size: 13px;
    text-decoration: none;
    color: ${(props) => props.theme.text.colour.light_grey()};

    &:hover {
        color: ${(props) => props.theme.text.colour.anchor()};
        text-decoration: underline;
    }
`;

export const SideBarAboutContainer = styled.div`
    display: block;
    text-align: justify;
    text-justify: auto;

    p {
        font-size: 0.9rem;
        padding-right: 10px;
        margin-right: 10px;
    }
`;

export const SideBarAboutH2 = styled.h2`
    padding-top: 10px;
    font-size: 20px;
    color: ${(props) =>
        props.theme.text.colour.light_grey(undefined, undefined, 50)};
`;

export function SideBarAbout(): JSX.Element {
    return (
        <SideBarAboutContainer>
            <SideBarAboutH2>About</SideBarAboutH2>
            <p>
                This website is custom made by Dereck using React, Next.js, and
                TypeScript. It incorporates progressive web app technologies an
                relies on a NodeJS backend along with a MongoDB database.
            </p>
            <p>
                If you would like to know more you can find the full source code
                on{' '}
                <Link href="https://github.com/dereckmezquita/derecksnotes.com">
                    github.com/dereckmezquita/derecksnotes.com
                </Link>
            </p>
        </SideBarAboutContainer>
    );
}

export const Article = styled.article<{ sideBar?: boolean }>`
    width: 70%;
    margin-top: 30px;
    margin-bottom: 30px;
    padding-left: 40px;
    padding-right: 40px;
    border-left: ${(props) =>
        props.sideBar === false
            ? 'none'
            : `1px dashed ${props.theme.container.border.colour.primary()}`};

    text-align: justify;
    text-justify: auto;

    @media (max-width: ${minWidthSnapUp}) {
        width: 100%;
        border-left: none;
    }
`;

export const PostContentWrapper = styled.div`
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

    .anchor-copy-link {
        opacity: 0; // by default it's hidden
        transition: opacity 0.3s;

        &:hover {
            opacity: 1;
        }
    }

    table {
        background-color: ${(props) =>
            props.theme.container.background.colour.primary()};

        font-family: sans-serif;
        font-size: 0.9em;
        text-align: center;

        margin: 0px auto;

        border-collapse: collapse;

        border: 1px solid
            ${(props) => props.theme.container.border.colour.primary()};
        box-shadow: ${(props) => props.theme.container.shadow.primary};

        @media only screen and (max-width: 600px) {
            font-size: 0.5em;
        }

        td {
            padding: 5px;
            text-align: center;
            border: 1px solid
                ${(props) => props.theme.container.border.colour.primary()};
        }

        th {
            padding: 5px;
            border: 1px solid
                ${(props) => props.theme.container.border.colour.primary()};
        }
    }
`;
