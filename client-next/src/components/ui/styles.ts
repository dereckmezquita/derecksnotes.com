// styles.ts
import styled from 'styled-components';

export const NavContainer = styled.nav`
    background-color: white;
    overflow: hidden;
    margin: 20px auto;
    width: 90%;
    border: 1px solid #e1e1e1;
    border-radius: 5px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);

    &:hover {
        box-shadow: 1px 1px 20px rgba(0, 0, 0, 0.15);
    }
`;

export const NavItem = styled.a`
    cursor: pointer;
    float: left;
    display: block;
    color: black;
    text-align: center;
    padding: 14px 13px;
    text-decoration: none;
    font-size: 17px;

    &:hover {
        background-color: #333;
        color: white;
    }

    img {
        height: 20px; // or whatever size you need
    }
`;

// AuxItem is same as NavItem but right aligned instead
export const AuxItem = styled(NavItem)`
    float: right;
`;

export const DropdownContainer = styled.div`
    float: left;
    overflow: hidden;

    &:hover > div {
        display: block;
    }
`;

export const DropdownMenu = styled.div`
    display: none;
    position: absolute;
    background-color: white;
    min-width: 160px;
    z-index: 1;
    border: 1px solid #e1e1e1;
    border-radius: 5px;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
`;

export const DropdownItem = styled.a`
    float: none;
    padding: 12px 16px;
    text-decoration: none;
    display: block;
    text-align: left;
    color: black;

    &:hover {
        background-color: #333;
        color: white;
    }
`;

export const DateTimeDisplay = styled.div`
    float: right;
    padding: 14px 13px;
    font-size: 17px;
    color: black;
`;

// Add responsive styles if needed.
