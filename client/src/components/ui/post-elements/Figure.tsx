import React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image, { ImageProps } from 'next/image';
import { theme } from '@styles/theme';

const CaptionedFigure = styled.figure`
    background-color: ${theme.container.background.colour.content()};
    border: 1px solid ${theme.container.border.colour.primary()};
    box-shadow: ${theme.container.shadow.box};
    width: 100%;  // Modified this line
    display: block;
    margin: auto;
    padding: 10px;
`;

const LightboxImageContainer = styled.div`
    background-color: white;
    padding: 20px;
    border-radius: 5px;
    display: inline-flex; // for centering
    justify-content: center; // horizontal centering
    align-items: center; // vertical centering
    width: 95%;
    height: 95%;
    overflow: hidden;
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

const Figure: React.FC<ImageProps> = ({ children, ...props }) => {
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const openLightbox = () => setLightboxOpen(true);
    const closeLightbox = () => setLightboxOpen(false);

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

    const alt = extractTextFromChildren(children);

    return (
        <div style={{ width: '100%', position: 'relative' }}>
            <CaptionedFigure>
                <Image
                    {...defaultImageProps}
                    {...props}
                    alt={alt}
                    onClick={openLightbox}
                />
                <figcaption>
                    {children}
                </figcaption>
            </CaptionedFigure>
            {lightboxOpen && (
                <LightboxOverlay onClick={closeLightbox}>
                    <LightboxImageContainer>
                        <img src={props.src as string} alt={alt} style={{ width: '100%', maxHeight: '100%', display: 'block' }} />
                    </LightboxImageContainer>
                </LightboxOverlay>
            )}
        </div>
    );
};

export default Figure;


// Helper function to recursively extract text from React children
function extractTextFromChildren(children: React.ReactNode): string {
    if (typeof children === 'string') {
        return children;
    }

    if (Array.isArray(children)) {
        return children.map(extractTextFromChildren).join(' ');
    }

    if (React.isValidElement(children) && children.props.children) {
        return extractTextFromChildren(children.props.children);
    }

    return '';
}