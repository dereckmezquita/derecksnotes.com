import styled from 'styled-components';
import Image from 'next/image';
import { theme } from '@styles/theme';

const Figure = styled.figure`
    background-color: ${theme.container.background.colour.content()};
    border: 1px solid ${theme.container.border.colour.primary()};
    box-shadow: ${theme.container.shadow.box};

    max-width: 100%;
    display: block;
    margin: auto;
    padding: 10px;
`;

// inherits from Image; requires width and height
interface CaptionedFigureProps {
    src: string;
    alt: string;
    width: number;
    height: number;
}

const CaptionedFigure = ({ src, alt, width, height }: CaptionedFigureProps) => {
    return(
        <Figure>
            <Image src={src} alt={alt} width={width} height={height} />
            <figcaption>{alt}</figcaption>
        </Figure>
    )
}

export default CaptionedFigure;