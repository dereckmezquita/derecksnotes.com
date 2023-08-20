// styles.ts
import styled from 'styled-components';

const nav_bar_height = 50;
const mobile = '768px';

export const NavContainer = styled.nav`
    display: flex;  
    justify-content: space-between;
    background-color: white;
    margin: 20px auto;
    width: 90%;
    border: 1px solid #e1e1e1;
    border-radius: 5px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);

    height: ${nav_bar_height}px;

    a {
        text-decoration: none;
        color: inherit; // This ensures that the links inherit the color of their parent container
    }

    &:hover {
        box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.15);
    }
`;

export const NavItem = styled.a<{ leftmost?: boolean }>`
    cursor: pointer;
    color: black;
    font-size: 17px;

    border-top-left-radius: ${({ leftmost }) => (leftmost ? "5px" : "0")};
    border-bottom-left-radius: ${({ leftmost }) => (leftmost ? "5px" : "0")};
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    height: ${nav_bar_height}px;
    display: flex;
    align-items: center;
    padding: 0 13px; // Removed vertical padding

    &:hover {
        background-color: #333;
        color: white;
    }

    img {
        padding: 0;
        margin: 0;
        height: 36px; // Use fixed height, adjust this based on your image
        width: 36px;  // Use fixed width, adjust this based on your image
    }
`;

export const MainNav = styled.div`
    display: flex;
    align-items: center;
    height: 100%;
`;

export const AuxiliaryContainer = styled.div`
    display: flex;
    align-items: center;
    height: 100%;

    & > *:not(:last-child) {
        margin-right: 20px;
    }
`;

export const DropdownContainer = styled.div`
    display: flex;
    position: relative;
    &:hover > div {
        display: block;
    }
`;

export const DropdownMenu = styled.div`
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    background-color: white;
    z-index: 1;
    border: 1px solid #e1e1e1;
    border-top-left-radius: 0; // This line
    border-top-right-radius: 0; // This line
    border-bottom-left-radius: 5px; // This line
    border-bottom-right-radius: 5px; // This line
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
`;

export const DropdownItem = styled.a`
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
    color: black;
    white-space: nowrap;

    &:hover {
        background-color: #333;
        color: white;
    }
`;

export const DateTimeDisplay = styled.div`
    padding: 0 13px;  // Adjusted the padding
    font-size: 17px;
    color: black;
    height: 100%;  // Added to make sure it takes the full height
    display: flex;
    align-items: center;  // Vertically center the content
`;