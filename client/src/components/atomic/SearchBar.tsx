import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

// TODO: type here
const minWidthSnapUp = (props: any) =>
    props.theme.container.widths.min_width_snap_up;

const SearchContainer = styled.div`
    width: 80%;
    margin: 0 auto;
    @media (max-width: ${minWidthSnapUp}) {
        width: 95%;
    }
    padding: 3px 10px;
    margin-bottom: 10px;
    background-color: ${(props) =>
        props.theme.container.background.colour.primary()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: 5px;
    display: flex;
    align-items: center;
`;

const SearchInput = styled.input`
    width: 100%;
    padding: 5px;
    font-family: ${(props) => props.theme.text.font.times};
    font-size: 0.8em;
    border: none;
    outline: none;
    background-color: transparent;
`;

const SearchIcon = styled(FaSearch)`
    margin-right: 5px;
    color: ${(props) => props.theme.icon.colour()};
`;

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    styleContainer?: React.CSSProperties; // If you want to style the container
}

const SearchBar: React.FC<SearchBarProps> = ({
    value,
    onChange,
    placeholder = 'Search...',
    styleContainer
}) => {
    return (
        <SearchContainer style={styleContainer}>
            <SearchIcon />
            <SearchInput
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        </SearchContainer>
    );
};

export default SearchBar;
