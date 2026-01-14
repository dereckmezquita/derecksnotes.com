'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaBars, FaFilter, FaUser } from 'react-icons/fa';
import { useBlogFilter } from '../pages/index/BlogFilterContext';
import { AuthModal } from './modal/auth/AuthModal';
import { useAuth } from '@context/AuthContext';

// TODO: create a type for theme; so we can have intellisense
const minWidthMobile = (props: any) =>
    props.theme.container.widths.min_width_mobile;

const HamburgerIcon = styled.div`
    display: none;
    cursor: pointer;
    padding: 14px 13px;
    margin-left: auto;

    @media screen and (max-width: ${minWidthMobile}) {
        display: flex;
        align-items: center;
    }
`;

const ResponsiveMenu = styled.div<{ open: boolean }>`
    display: flex;
    align-items: stretch;
    flex: 1;

    @media screen and (max-width: ${minWidthMobile}) {
        display: ${(props) => (props.open ? 'flex' : 'none')};
        flex-direction: column;
        width: 100%;
    }
`;

const NavSpacer = styled.div`
    flex: 1;

    @media screen and (max-width: ${minWidthMobile}) {
        display: none;
    }
`;

const minWidthSnapUp = (props: any) =>
    props.theme.container.widths.min_width_snap_up;

const NavContainer = styled.nav`
    background-color: ${(props) =>
        props.theme.container.background.colour.card()};
    margin: 20px auto;
    width: 90%;
    color: ${(props) => props.theme.theme_colours[5]()};

    border: 1px solid #ccc;
    border-radius: 5px;

    /* Use flexbox to eliminate gap at bottom of nav items */
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;

    @media screen and (max-width: ${minWidthSnapUp}) {
        width: 95%;
    }
`;

const CommonNavItem = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    color: inherit;
    text-align: center;
    padding: 14px 13px;
    text-decoration: none;
    font-size: 17px;

    @media screen and (max-width: ${minWidthMobile}) {
        width: 100%;
        text-align: left;
    }
`;

// allows for argument to determine if align left or right
// inherit from Link component allows for linking to other pages
// prettier-ignore
const NavLeftItem = styled(CommonNavItem).attrs({ as: Link }) <{ rightmost?: boolean; }>`
    &:hover {
        color: ${(props) => props.theme.text.colour.white()};
        background-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

// prettier-ignore
const NavRightItemLink = styled(CommonNavItem).attrs({ as: Link }) <{ rightmost?: boolean; }>`
    &:hover {
        color: ${(props) => props.theme.text.colour.white()};
        background-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

const NavRightItem = styled(CommonNavItem)<{ rightmost?: boolean }>`
    &:hover {
        color: ${(props) => props.theme.text.colour.white()};
        background-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

const DropDownContainer = styled.div`
    display: flex;
    align-items: stretch;
    position: relative;

    @media screen and (max-width: ${minWidthMobile}) {
        width: 100%;
        flex-direction: column;
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
    top: 100%;
    left: 0;
    min-width: max-content;
    z-index: 1;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 10px #ccc;
    background-color: ${(props) =>
        props.theme.container.background.colour.card()};

    ${DropDownContainer}:hover & {
        display: block;
    }

    ${NavLeftItem} {
        padding: 12px 16px;
        text-align: left;
        white-space: nowrap;
    }

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
        top: auto;
        text-align: left;
        box-shadow: none;

        ${NavLeftItem} {
            padding-left: 30px;
            white-space: normal;
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
    const { isAuthenticated, user } = useAuth();

    const { isFilterVisible, setIsFilterVisible } = useBlogFilter();

    // Close the auth modal when user becomes authenticated
    useEffect(() => {
        if (user) {
            setIsAuthModalOpen(false);
        }
    }, [user]);

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
                <NavSpacer />
                {isAuthenticated() ? (
                    <NavRightItemLink href="/profile">
                        <FaUser />
                    </NavRightItemLink>
                ) : (
                    <NavRightItem onClick={() => setIsAuthModalOpen(true)}>
                        <FaUser />
                        <AuthModal
                            isOpen={isAuthModalOpen}
                            onClose={() => setIsAuthModalOpen(false)}
                        />
                    </NavRightItem>
                )}
                <NavRightItem onClick={toggleFilter}>
                    <FaFilter />
                </NavRightItem>
            </ResponsiveMenu>
        </NavContainer>
    );
}

export default Navbar;
