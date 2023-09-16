import React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image, { ImageProps } from 'next/image';
import { theme } from '@styles/theme';

const Figure = styled.figure`
    background-color: ${theme.container.background.colour.content()};
    border: 1px solid ${theme.container.border.colour.primary()};
    box-shadow: ${theme.container.shadow.box};
    width: 100%;  // Modified this line
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

interface CaptionedFigureProps extends ImageProps { }

const CaptionedFigure: React.FC<CaptionedFigureProps> = ({ children, ...props }) => {
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
            <Figure>
                <Image 
                    {...defaultImageProps} 
                    {...props} 
                    alt={alt} 
                    onClick={openLightbox}
                />
                <figcaption>
                    {children}
                </figcaption>
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