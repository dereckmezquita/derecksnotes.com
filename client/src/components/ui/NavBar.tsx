import Link from 'next/link';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaLinkedin, FaFilter, FaUser } from 'react-icons/fa';
import { theme } from '@styles/theme';

import { useDispatch } from 'react-redux';
import { toggleTagsFilter } from '@store/tagsFilterVisibilitySlice'; // control visibility of tag filter

import Auth from '../modals/auth/Auth';

const NavContainer = styled.nav`
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

const CommonNavItem = styled.div`
    cursor: pointer;
    display: block;
    color: inherit;
    text-align: center;
    padding: 14px 13px;
    text-decoration: none;
    font-size: 17px;
`;

// allows for argument to determine if align left or right
// inherit from Link component allows for linking to other pages
const NavLeftItem = styled(CommonNavItem).attrs({ as: Link }) <{ rightmost?: boolean }>`
    float: left;
    &:hover {
        color: ${theme.text.colour.white()};
        background-color: ${theme.theme_colours[5]()};
    }
`;

const NavRightItemLink = styled(CommonNavItem).attrs({ as: Link }) <{ rightmost?: boolean }>`
    float: right;
`;

const NavRightItem = styled(CommonNavItem) <{ rightmost?: boolean }>`
    float: right;
    &:hover {
        color: ${theme.text.colour.white()};
        background-color: ${theme.theme_colours[5]()};
    }
`;

const DropDownContainer = styled.div`
    float: left;
    overflow: hidden;
`;

// the same as NavItem but no link
const DropDownLabel = styled(CommonNavItem) <{ rightmost?: boolean }>`
    &:hover {
        color: ${theme.text.colour.white()};
        background-color: ${theme.theme_colours[5]()};
    }
`;

const DropDownContent = styled.div`
    display: none;
    position: absolute;
    min-width: 160px;
    z-index: 1;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 10px #ccc;
    background-color: ${theme.container.background.colour.primary()};

    ${DropDownContainer}:hover & {
        display: block;
    }

    ${NavLeftItem} {
        float: none;
        padding: 12px 16px;
        text-align: left;
    }

    /* TODO: still not working as intended */
    ${NavLeftItem}:first-child {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }

    ${NavLeftItem}:last-child {
        border-bottom-left-radius: 5px;
        border-bottom-right-radius: 5px;
    }
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
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // redux control of tag filter
    // Error: `useDispatch` was conditionally called inside an `if` statement. Fixed: Moved `useDispatch` to the top-level, ensuring consistent hook order across renders.
    const dispatch = useDispatch();

    const handleToggleFilterClick = () => {
        dispatch(toggleTagsFilter());
    };

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
            <NavLeftItem href='/'>Blog</NavLeftItem>
            <NavLeftItem href='/courses'>Courses</NavLeftItem>
            <NavLeftItem href='/references'>References</NavLeftItem>
            <DropDownContainer>
                <DropDownLabel>Dictionaries</DropDownLabel>
                <DropDownContent>
                    <NavLeftItem href='/dictionaries/biology'>Biology Dictionary</NavLeftItem>
                    <NavLeftItem href='/dictionaries/chemistry'>Chemistry Dictionary</NavLeftItem>
                </DropDownContent>
            </DropDownContainer>
{/* 
            <NavRightItemLink href='https://www.linkedin.com/in/dereck/' target='_blank' title='LinkedIn'>
                <FaLinkedin />
            </NavRightItemLink> */}
            <DateTimeDisplay>{dateTime || "00 Jan 00:00:00"}</DateTimeDisplay>
            <NavRightItem onClick={handleToggleFilterClick}>
                <FaFilter />
            </NavRightItem>
            <NavRightItem onClick={() => setIsAuthModalOpen(true)}>
                <FaUser />
            </NavRightItem>
            {isAuthModalOpen && <Auth onClose={() => setIsAuthModalOpen(false)} />}
        </NavContainer>
    )
}

export default NavBar;