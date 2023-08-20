// src/components/NavBar/NavBar.tsx
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
    NavContainer,
    NavItem,
    AuxItem,
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

    // Ensure client side components are not server rendered
    if (!hasMounted) {
        return null;
    }

    return (
        <NavContainer>
            <Link href="/blog" passHref>
                <NavItem>Blog</NavItem>
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
            <Link href="https://www.linkedin.com" passHref>
                <AuxItem>
                    <img src="/path-to-your-image/linkedin-icon.png" alt="LinkedIn" />
                </AuxItem>
            </Link>
            <DateTimeDisplay>{dateTime || "00 Jan 00:00:00"}</DateTimeDisplay>
        </NavContainer>
    );
}

export default NavBar;
