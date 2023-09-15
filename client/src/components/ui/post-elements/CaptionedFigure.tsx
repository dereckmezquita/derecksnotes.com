import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image, { ImageProps } from 'next/image';
import { theme } from '@styles/theme';
import { convertMarkdownLinksToHTML } from '@utils/helpers';

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

interface CaptionedFigureProps extends ImageProps {
    alt: string;
}

const CaptionedFigure: React.FC<CaptionedFigureProps> = ({ alt, ...props }) => {
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

    const defaultImageProps = {
        width: 0,
        height: 0,
        sizes: "100vw",
        style: { width: '100%', height: 'auto' }
    };

    const altHtml = convertMarkdownLinksToHTML(alt);

    // https://stackoverflow.com/questions/69230343/nextjs-image-component-with-fixed-witdth-and-auto-height
    return (
        <div style={{ width: '100%', position: 'relative' }}>
            <Figure onClick={openLightbox}>
                <Image {...defaultImageProps} {...props} alt={alt} />
                <figcaption dangerouslySetInnerHTML={{ __html: altHtml }} />
            </Figure>
            {lightboxOpen && (
                <LightboxOverlay onClick={closeLightbox}>
                    <Image src={props.src} alt={alt} layout="fill" objectFit="contain" />
                </LightboxOverlay>
            )}
        </div>
    );
};

export default CaptionedFigure;