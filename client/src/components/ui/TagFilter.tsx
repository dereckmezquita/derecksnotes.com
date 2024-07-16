'use client';

import styled from 'styled-components';
import { theme } from '@styles/theme';
import { useRef, useState } from 'react';

const FilterContainer = styled.div`
    width: 100%;
    margin: 0 auto;
    padding: 10px;
    margin-bottom: 20px;
    background-color: ${theme.container.background.colour.primary()};
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${theme.container.shadow.primary};
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    @media (max-width: ${theme.container.widths.min_width_snap_up}) {
        width: 95%;
    }
`;

const BaseButton = styled.span`
    user-select: none;
    font-family: ${theme.text.font.times};
    padding: 0px 7px 1px;
    cursor: pointer;
    border-radius: 5px;
    transition: opacity 0.3s;

    &:hover {
        opacity: 0.3;
    }
`;

const FilterTag = styled(BaseButton)<{ selected: boolean }>`
    background-color: ${(props) =>
        props.selected ? 'hsl(205, 70%, 50%)' : 'hsl(190, 15%, 90%)'};
    color: ${(props) => (props.selected ? 'white' : 'black')};
    word-wrap: break-word;
    max-width: 100%;
`;

const ClearAllButton = styled(BaseButton)`
    background-color: hsl(0, 70%, 50%);
    color: white;
    position: relative;
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::before,
    &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 70%;
        height: 3px;
        background-color: white;
    }

    &::before {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    &::after {
        transform: translate(-50%, -50%) rotate(-45deg);
    }
`;

interface TagFilterProps {
    tags: string[];
    selectedTags: string[];
    onTagSelect: (tag: string) => void;
    onTagDeselect: (tag: string) => void;
    styleContainer?: React.CSSProperties;
}

export const TagFilter: React.FC<TagFilterProps> = ({
    tags,
    selectedTags,
    onTagSelect,
    onTagDeselect,
    styleContainer
}) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const clearAllTags = () => {
        selectedTags.forEach((tag) => onTagDeselect(tag));
    };

    const handleMouseDown = (event: React.MouseEvent, tag: string) => {
        event.preventDefault();
        if (!selectedTags.includes(tag)) {
            onTagSelect(tag);
        } else {
            onTagDeselect(tag);
        }
        setIsDragging(true);
    };

    const handleMouseEnter = (event: React.MouseEvent, tag: string) => {
        event.preventDefault();
        if (isDragging) {
            if (!selectedTags.includes(tag)) {
                onTagSelect(tag);
            } else {
                onTagDeselect(tag);
            }
        }
    };

    const endDrag = () => {
        setIsDragging(false);
    };

    return (
        <FilterContainer
            ref={containerRef}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            style={styleContainer}
        >
            <ClearAllButton onClick={clearAllTags} />
            {tags.map((tag) => (
                <FilterTag
                    key={tag}
                    selected={selectedTags.includes(tag)}
                    onMouseDown={(ev) => handleMouseDown(ev, tag)}
                    onMouseEnter={(ev) => handleMouseEnter(ev, tag)}
                >
                    {tag}
                </FilterTag>
            ))}
        </FilterContainer>
    );
};
