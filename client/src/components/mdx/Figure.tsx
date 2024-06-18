'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image, { ImageProps } from 'next/image';

const CaptionedFigure = styled.figure`
    background-color: ${(props) =>
        props.theme.container.background.colour.content()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    box-shadow: ${(props) => props.theme.container.shadow.box};
    width: 100%; // Modified this line
    display: block;
    margin: auto;
    padding: 10px;

    img,
    Image {
        border: 1px solid
            ${(props) => props.theme.container.border.colour.primary()};
    }
`;

const Caption = styled.figcaption`
    padding-bottom: 10px;
    text-align: right;
    margin-top: 10px;
    font-size: 0.8em;
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
    border: 7px solid
        ${(props) => props.theme.container.border.colour.primary()};
`;

const Figure: React.FC<ImageProps> = ({ children, ...props }) => {
    let isPdf: boolean = false;
    if (props.src.toString().endsWith('.pdf')) {
        isPdf = true;
    }

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
        sizes: '100vw',
        style: { width: '100%', height: 'auto' }
    };

    const alt = extractTextFromChildren(children);

    return (
        <div style={{ width: '100%', position: 'relative' }}>
            <CaptionedFigure>
                {isPdf ? (
                    <img
                        src={props.src as string}
                        alt={alt}
                        onClick={openLightbox}
                        style={{ width: '100%', height: 'auto' }}
                    />
                ) : (
                    <Image
                        {...defaultImageProps}
                        {...props}
                        alt={alt}
                        onClick={openLightbox}
                    />
                )}
                <Caption>{children}</Caption>
            </CaptionedFigure>
            {lightboxOpen && (
                <LightboxOverlay onClick={closeLightbox}>
                    <LightboxImageContainer>
                        <img
                            src={props.src as string}
                            alt={alt}
                            style={{
                                maxWidth: '100%',
                                height: '100%',
                                display: 'block'
                            }}
                        />
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
