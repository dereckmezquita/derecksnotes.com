import styled from 'styled-components';

const FilterContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    background-color: red;
    /* opacity: 0;
    transition: opacity 0.3s; */
    z-index: 1;

    &:hover {
        opacity: 1;
    }
`;

const FilterTag = styled.span<{ selected: boolean }>`
    margin: 5px;
    padding: 5px;
    cursor: pointer;
    background-color: ${props => props.selected ? '#3498db' : '#ecf0f1'};
    color: ${props => props.selected ? 'white' : 'black'};
    border-radius: 4px;

    &:hover {
        opacity: 0.7;
    }
`;

interface TagFilterProps {
    tags: string[];
    selectedTags: string[];
    onTagSelect: (tag: string) => void;
    onTagDeselect: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagSelect, onTagDeselect }) => {
    return (
        <FilterContainer>
            {tags.map(tag => (
                <FilterTag
                    key={tag}
                    selected={selectedTags.includes(tag)}
                    onClick={() => {
                        if (selectedTags.includes(tag)) {
                            onTagDeselect(tag);
                        } else {
                            onTagSelect(tag);
                        }
                    }}
                >
                    {tag}
                </FilterTag>
            ))}
        </FilterContainer>
    );
};

export default TagFilter;