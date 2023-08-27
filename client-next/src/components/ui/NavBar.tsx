import Link from 'next/link';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { hsla_colour, theme } from '@styles/theme';

const NavContainer = styled.div`
    background-color: ${theme.container.background.colour.primary()};
    overflow: hidden;
    margin: 20px auto;
    width: 90%;
    color: ${theme.theme_colours[5]()};

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5), 0 0 20px rgba(100, 100, 40, 0.2) inset;

    &:hover {
        box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5);
    }

    @media screen and (max-width: 1024px) {
        width: 95%;
    }
`;

// allows for argument to determine if align left or right
// inherit from Link component allows for linking to other pages
const NavItem = styled(Link) <{ rightmost?: boolean }>`
    cursor: pointer;
    float: ${(props) => (props.rightmost ? 'right' : 'left')};

    display: block;
    color: inherit;
    text-align: center;
    padding: 14px 13px;
    text-decoration: none;
    font-size: 17px;

    &:hover {
        color: ${theme.text.colour.white()};
        background: ${theme.theme_colours[5]()};
    }
`;

const NavImage = styled.img`
    height: 16px;
    cursor: pointer;
`;

const DropDownContainer = styled.div`
    float: left;
    overflow: hidden;
`;

// the same as NavItem but no link
const DropDownLabel = styled.div <{ rightmost?: boolean }>`
    cursor: pointer;
    float: ${(props) => (props.rightmost ? 'right' : 'left')};

    display: block;
    color: inherit;
    text-align: center;
    padding: 14px 13px;
    text-decoration: none;
    font-size: 17px;

    &:hover {
        color: ${theme.text.colour.white()};
        background: ${theme.theme_colours[5]()};
    }
`;

const DropDownContent = styled.div`
    display: none;
    position: absolute;
    min-width: 160px;

    z-index: 1;

    border: 1px solid #ccc;
    border-radius: 5px;

    box-shadow: 1px 1px 10px #ccc;
`;

const DateTimeDisplay = styled.div`
    cursor: pointer;
    float: right;

    display: block;
    color: inherit;
    text-align: center;
    padding: 14px 13px;
    text-decoration: none;
    font-size: 17px;
`;

// since using conditionals in components we must ensure that the component is mounted before rendering
// either this or use dynamic from next/dynamic
function NavBar() {
    const [hasMounted, setHasMounted] = useState(false);
    const [dateTime, setDateTime] = useState<string | null>(null);

    useEffect(() => {
        setHasMounted(true);

        const updateDateTime = () => {
            const currentDate = new Date();
            const displayDate = currentDate.toLocaleDateString('en-US', {
                day: '2-digit',
                month: 'short'
            });
            const displayTime = currentDate.toLocaleTimeString('en-US', {
                hour12: false,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            setDateTime(`${displayDate} ${displayTime}`);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    if (!hasMounted) {
        return null;
    }
    return (
        <NavContainer>
            <NavItem href='/'>Blog</NavItem>
            <NavItem href='/courses'>Courses</NavItem>
            <DropDownContainer>
                <DropDownLabel>Dictionaries</DropDownLabel>
                <DropDownContent>
                    <NavItem href='/dictionaries/biology'>Biology Dictionary</NavItem>
                    <NavItem href='/dictionaries/chemistry'>Chemistry Dictionary</NavItem>
                </DropDownContent>
            </DropDownContainer>

            <NavItem rightmost href='https://www.linkedin.com/in/dereck/' target='_blank' title='LinkedIn'>
                <NavImage src='/site-images/icons/linkedin.png' />
            </NavItem>
            <DateTimeDisplay>{dateTime || "00 Jan 00:00:00"}</DateTimeDisplay>
        </NavContainer>
    )
}

export default NavBar;