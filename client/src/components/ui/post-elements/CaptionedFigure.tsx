import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { theme } from '@styles/theme';

const Figure = styled.figure`
    background-color: ${theme.container.background.colour.content()};
    border: 1px solid ${theme.container.border.colour.primary()};
    box-shadow: ${theme.container.shadow.box};

    width: fit-content;
    display: block;
    margin: auto;
    padding: 10px;
`;

const LightboxOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    border: 7px solid ${theme.container.border.colour.primary()};
`;

interface CaptionedFigureProps {
    src: string;
    alt: string;
    width: number;
    height: number;
}

const CaptionedFigure = ({ src, alt, width, height }: CaptionedFigureProps) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const openLightbox = () => setLightboxOpen(true);
    const closeLightbox = () => setLightboxOpen(false);

    // Listen for escape key to close lightbox
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
        };

        document.addEventListener('keydown', handleKeydown);
        return () => document.removeEventListener('keydown', handleKeydown);
    }, []);

    return (
        <>
            <Figure onClick={openLightbox}>
                <Image src={src} alt={alt} width={width} height={height} />
                <figcaption>{alt}</figcaption>
            </Figure>
            {lightboxOpen && (
                <LightboxOverlay onClick={closeLightbox}>
                    <Image src={src} alt={alt} layout="fill" objectFit="contain" />
                </LightboxOverlay>
            )}
        </>
    );
};

export default CaptionedFigure;