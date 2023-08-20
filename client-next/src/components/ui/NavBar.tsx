// src/components/NavBar/NavBar.tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
    NavContainer,
    NavItem,
    MainNav,
    AuxiliaryContainer,
    DropdownContainer,
    DropdownMenu,
    DropdownItem,
    DateTimeDisplay
} from './styles';

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
            <MainNav>
                <Link href="/blog" passHref>
                    <NavItem leftmost>Blog</NavItem>
                </Link>
                <DropdownContainer>
                    <NavItem>Dictionaries</NavItem>
                    <DropdownMenu>
                        <Link href="/dictionaries/biology" passHref>
                            <DropdownItem>Biology Dictionary</DropdownItem>
                        </Link>
                        <Link href="/dictionaries/chemistry" passHref>
                            <DropdownItem>Chemistry Dictionary</DropdownItem>
                        </Link>
                    </DropdownMenu>
                </DropdownContainer>
            </MainNav>
            <AuxiliaryContainer>
                <DateTimeDisplay>{dateTime || "00 Jan 00:00:00"}</DateTimeDisplay>
                <Link href="https://www.linkedin.com" passHref>
                    <NavItem>
                        <img src="/path-to-your-image/linkedin-icon.png" alt="LinkedIn" />
                    </NavItem>
                </Link>
            </AuxiliaryContainer>
        </NavContainer>
    );
}

export default NavBar;
