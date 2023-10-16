import styled from 'styled-components';
import { theme } from '@styles/theme';

const SelectContainer = styled.div`
    width: 80%;
    margin: 0 auto;
    padding: 3px 10px;
    margin-bottom: 5px;
    background-color: ${theme.container.background.colour.primary()};
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    display: flex;
    align-items: center;
    position: relative;
`;

const CustomSelect = styled.select`
    width: 100%;
    padding: 5px;
    font-family: ${theme.text.font.arial};
    font-size: 0.8em;
    border: none;
    outline: none;
    background-color: transparent;
    appearance: none; // This is used to remove default browser styling of the select dropdown
`;

const DropdownIcon = styled.div`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;

    &::after {
        content: '▼';
        color: hsl(205, 70%, 50%);
    }
`;

interface Option {
    label: string;
    value: string;
}

interface CustomSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    styleContainer?: React.CSSProperties;
}

const SelectDropDown: React.FC<CustomSelectProps> = ({ options, value, onChange, styleContainer }) => {
    return (
        <SelectContainer style={styleContainer}>
            <CustomSelect value={value} onChange={(e) => onChange(e.target.value)}>
                {options.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </CustomSelect>
            <DropdownIcon />
        </SelectContainer>
    );
};

export default SelectDropDown;