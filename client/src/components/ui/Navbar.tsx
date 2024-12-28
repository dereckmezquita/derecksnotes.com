'use client';
import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';
import { FaBars, FaFilter, FaUser } from 'react-icons/fa';
import { useBlogFilter } from '../pages/index/BlogFilterContext';
import { AuthModal } from './modal/auth/AuthModal';

// TODO: create a type for theme; so we can have intellisense
const minWidthMobile = (props: any) =>
    props.theme.container.widths.min_width_mobile;

const HamburgerIcon = styled.div`
    display: none;
    float: right;
    cursor: pointer;
    padding: 14px 13px;

    @media screen and (max-width: ${minWidthMobile}) {
        display: block;
    }
`;

const ResponsiveMenu = styled.div<{ open: boolean }>`
    display: ${(props) => (props.open ? 'block' : 'none')};

    @media screen and (max-width: ${minWidthMobile}) {
        display: ${(props) => (props.open ? 'block' : 'none')};
    }

    @media screen and (min-width: ${minWidthMobile}) {
        display: block;
    }
`;

const minWidthSnapUp = (props: any) =>
    props.theme.container.widths.min_width_snap_up;

const NavContainer = styled.nav`
    background-color: ${(props) =>
        props.theme.container.background.colour.primary()};
    overflow: hidden;
    margin: 20px auto;
    width: 90%;
    color: ${(props) => props.theme.theme_colours[5]()};

    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow:
        1px 1px 20px rgba(153, 153, 153, 0.5),
        0 0 20px rgba(100, 100, 40, 0.2) inset;

    &:hover {
        box-shadow: 1px 1px 20px rgba(153, 153, 153, 0.5);
    }

    @media screen and (max-width: ${minWidthSnapUp}) {
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

    @media screen and (max-width: ${minWidthMobile}) {
        width: 100%;
        float: none;
        text-align: left;
    }
`;

// allows for argument to determine if align left or right
// inherit from Link component allows for linking to other pages
// prettier-ignore
const NavLeftItem = styled(CommonNavItem).attrs({ as: Link }) <{ rightmost?: boolean; }>`
    float: left;
    &:hover {
        color: ${(props) => props.theme.text.colour.white()};
        background-color: ${(props) => props.theme.theme_colours[5]()};
    }

    @media screen and (max-width: ${minWidthMobile}) {
        float: none;
    }
`;

// prettier-ignore
const NavRightItemLink = styled(CommonNavItem).attrs({ as: Link }) <{ rightmost?: boolean; }>`
    float: right;
`;

const NavRightItem = styled(CommonNavItem)<{ rightmost?: boolean }>`
    float: right;
    &:hover {
        color: ${(props) => props.theme.text.colour.white()};
        background-color: ${(props) => props.theme.theme_colours[5]()};
    }

    @media screen and (max-width: ${minWidthMobile}) {
        float: none;
    }
`;

const DropDownContainer = styled.div`
    float: left;
    overflow: hidden;

    @media screen and (max-width: ${minWidthMobile}) {
        width: 100%;
        float: none;
        text-align: left;
    }
`;

// the same as NavItem but no link
const DropDownLabel = styled(CommonNavItem)<{ rightmost?: boolean }>`
    &:hover {
        color: ${(props) => props.theme.text.colour.white()};
        background-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

const DropDownContent = styled.div`
    display: none;
    position: absolute;
    min-width: 160px;
    z-index: 1;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 10px #ccc;
    background-color: ${(props) =>
        props.theme.container.background.colour.primary()};

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

    @media screen and (max-width: ${minWidthMobile}) {
        border: none;
        width: 100%;
        position: relative;
        float: none;
        text-align: left;
        box-shadow: none;

        ${NavLeftItem} {
            padding-left: 30px;
        }
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
    @media screen and (max-width: ${minWidthMobile}) {
        width: 100%;
        position: relative;
        float: none;
        text-align: left;
    }
`;

// since using conditionals in components we must ensure that the component is mounted before rendering
// either this or use dynamic from next/dynamic
function Navbar() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { isFilterVisible, setIsFilterVisible } = useBlogFilter();

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const toggleFilter = () => {
        setIsFilterVisible(!isFilterVisible);
    };

    return (
        <NavContainer>
            <HamburgerIcon onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <FaBars />
            </HamburgerIcon>

            <NavLeftItem onClick={closeMenu} href="/">
                Blog
            </NavLeftItem>
            <ResponsiveMenu open={isMenuOpen}>
                <NavLeftItem onClick={closeMenu} href="/courses">
                    Courses
                </NavLeftItem>
                <NavLeftItem onClick={closeMenu} href="/references">
                    References
                </NavLeftItem>
                <DropDownContainer>
                    <DropDownLabel>Dictionaries</DropDownLabel>
                    <DropDownContent>
                        <NavLeftItem
                            onClick={closeMenu}
                            href="/dictionaries/biology"
                        >
                            Biology Dictionary
                        </NavLeftItem>
                        <NavLeftItem
                            onClick={closeMenu}
                            href="/dictionaries/chemistry"
                        >
                            Chemistry Dictionary
                        </NavLeftItem>
                        <NavLeftItem
                            onClick={closeMenu}
                            href="/dictionaries/mathematics"
                        >
                            Mathematics Dictionary
                        </NavLeftItem>
                    </DropDownContent>
                </DropDownContainer>
                <NavRightItem onClick={() => setIsAuthModalOpen(true)}>
                    <FaUser />
                    <AuthModal
                        isOpen={isAuthModalOpen}
                        onClose={() => setIsAuthModalOpen(false)}
                    />
                </NavRightItem>
                <NavRightItem onClick={toggleFilter}>
                    <FaFilter />
                </NavRightItem>
            </ResponsiveMenu>
        </NavContainer>
    );
}

export default Navbar;
