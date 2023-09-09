import styled from 'styled-components';
import { theme } from '@styles/theme';
import { useRef, useState } from 'react';

const FilterContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    background-color: ${theme.container.background.colour.primary()};
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${theme.container.shadow.primary};
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 1;
    display: flex;
    flex-wrap: wrap; // Allow tags to wrap to the next line if needed
    gap: 10px; // Provides consistent spacing between the tags

    &:hover {
        opacity: 1;
    }
`;

const BaseButton = styled.span`
    user-select: none; // Prevent text selection
    font-family: ${theme.text.font.times};
    padding: 0px 7px 1px;
    cursor: pointer;
    border-radius: 5px;
    white-space: nowrap; // Prevents the tag from breaking into two lines
    transition: opacity 0.3s;

    &:hover {
        opacity: 0.3;
    }
`;

const FilterTag = styled(BaseButton) <{ selected: boolean }>`
    background-color: ${props => props.selected ? 'hsl(205, 70%, 50%)' : 'hsl(190, 15%, 90%)'};
    color: ${props => props.selected ? 'white' : 'black'};
`;

// css X
const ClearAllButton = styled(BaseButton)`
    background-color: hsl(0, 70%, 50%); // Shade of red
    color: white;
    position: relative;
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::before, &::after {
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
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagSelect, onTagDeselect }) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);  // To reference the filter container

    const clearAllTags = () => {
        selectedTags.forEach(tag => onTagDeselect(tag));
    };

    const handleMouseDown = (event: React.MouseEvent, tag: string) => {
        event.preventDefault(); // prevent text selection
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
        <FilterContainer ref={containerRef} onMouseUp={endDrag} onMouseLeave={endDrag}>
            {tags.map(tag => (
                <FilterTag
                    key={tag}
                    selected={selectedTags.includes(tag)}
                    onMouseDown={(ev) => handleMouseDown(ev, tag)}
                    onMouseEnter={(ev) => handleMouseEnter(ev, tag)}
                >
                    {tag}
                </FilterTag>
            ))}
            <ClearAllButton onClick={clearAllTags} />
        </FilterContainer>
    );
};

export default TagFilter;