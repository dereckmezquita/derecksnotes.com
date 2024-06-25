import styled from 'styled-components';

export const StyledForm = styled.form`
    margin-bottom: 20px;
`;

export const InputField = styled.div`
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    padding-bottom: 5px;
    &:focus-within {
        border-bottom: 2px solid ${(props) => props.theme.theme_colours[5]()};
    }
`;

export const Input = styled.input`
    width: 100%;
    padding: 5px 5px 5px 10px;
    font-family: ${(props) => props.theme.text.font.times};
    font-size: 1em;
    color: ${(props) => props.theme.text.colour.primary()};
    border: none;
    outline: none;
    background-color: transparent;
    &::placeholder {
        opacity: 0.7;
    }
`;

export const SubmitButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: ${(props) => props.theme.theme_colours[5]()};
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 1em;
    font-weight: bold;
    margin-top: 10px;
    &:hover {
        background-color: ${(props) =>
            props.theme.theme_colours[5](undefined, undefined, 80)};
    }
`;

export const SwitchViewButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.text.colour.anchor()};
    cursor: pointer;
    font-size: 0.9em;
    text-decoration: underline;
    margin-top: 10px;

    &:hover {
        color: ${(props) =>
            props.theme.text.colour.anchor(undefined, undefined, 80)};
    }
`;
