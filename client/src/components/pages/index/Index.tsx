import styled from 'styled-components';
import { theme } from '@components/styles/theme';

const Container = styled.div`
    width: 70%;
    height: auto;
    margin: 0 auto;
    padding: 10px;
    position: relative;
    @media (max-width: ${theme.container.widths.min_width_snap_up}) {
        width: 95%;
    }
`;

const Grid = styled.div`
    margin: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
    grid-gap: 20px;
`;

interface IndexProps {
    posts: any[]; // PostMetadata[]
    meta: {
        title: string;
        description: string;
        image: string;
        url: string;
    };
}

function Index({ posts, meta }: IndexProps) {}
