import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '@styles/theme';

const CarouselContainer = styled.div`
    background-color: ${theme.container.background.colour.content()};
    border: 1px solid ${theme.container.border.colour.primary()};
    box-shadow: ${theme.container.shadow.box};
    position: relative;
    height: 400px; // Adjust the height as per your preference
    overflow: hidden;
    padding: 10px;
    width: 100%;
    margin: auto;
`;

const ImageContainer = styled.div`
    height: 100%;
    display: flex;
    align-items: center; // vertically center the image
    justify-content: center; // horizontally center the image
`;

const CarouselImage = styled.img`
    max-height: 100%;
    max-width: 100%;
    border: 1px solid ${theme.container.border.colour.primary()};
`;

const Caption = styled.figcaption`
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding-bottom: 10px;
    text-align: right;
    margin-top: 10px;
    font-size: 0.8em;
    color: white; // Made it white for better visibility against the overlay
    background-color: rgba(
        0,
        0,
        0,
        0.6
    ); // Semi-transparent background for the caption
    padding: 5px;
    border-radius: 3px;
`;

const NavigationButton = styled.button`
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border: none;
    cursor: pointer;
    font-size: 1.5em;
    z-index: 10;
`;

const PrevButton = styled(NavigationButton)`
    left: 10px;
`;

const NextButton = styled(NavigationButton)`
    right: 10px;
`;

interface CarouselItem {
    src: string;
    caption?: string;
}

interface CarouselProps {
    items: CarouselItem[];
    interval?: number; // in milliseconds
}

const Carousel: React.FC<CarouselProps> = ({ items, interval = 5000 }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
        }, interval);

        return () => clearInterval(timer); // Cleanup on component unmount
    }, [items, interval]);

    const goToNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
    };

    const goToPrev = () => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + items.length) % items.length
        );
    };

    const currentItem = items[currentIndex];

    return (
        <CarouselContainer>
            <ImageContainer>
                <CarouselImage
                    src={currentItem.src}
                    alt={currentItem.caption || 'Carousel Image'}
                />
            </ImageContainer>
            {currentItem.caption && <Caption>{currentItem.caption}</Caption>}
            <PrevButton onClick={goToPrev}>&lt;</PrevButton>
            <NextButton onClick={goToNext}>&gt;</NextButton>
        </CarouselContainer>
    );
};

export default Carousel;

/*
<Carousel
    items={[
        { src: '/references/biography_antoine-de-lavoisier/lavoisier-statue-cour-napoleon-louvre.jpg', caption: 'Statue of Lavoisier located in Cour de Napoléon au Louvre.' },
        { src: '/references/biography_antoine-de-lavoisier/lavoisier-statue.jpg', caption: 'Statue of Lavoisier.' },
        { src: '/references/biography_antoine-de-lavoisier/lavoisier-decomposition-air.png' },
        { src: '/references/biography_antoine-de-lavoisier/mort-de-marat_charlotte-corday.jpg' }
    ]}
/>
*/
