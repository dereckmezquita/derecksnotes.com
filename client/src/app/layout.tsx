'use client';
// https://github.com/vercel/next.js/issues/49850
import './globals.css';
import { ThemeProvider } from 'styled-components';
import { theme } from '@components/styles/theme';

import StyledComponentsRegistry from '@components/lib/registry';
import GlobalStyles from '@components/styles/GlobalStyles';
import Logo from '@components/components/ui/Logo';

import '@public/fonts/roboto.css'; // sans-serif
import '@public/fonts/tangerine.css'; // cursive
import '@public/fonts/fjalla_one.css'; // block letters; main logo

// consider moving these styles to layout page of post display components
import '@components/styles/syntax-highlighter.scss';
import '@components/styles/footnotes.css';
import Footer from '@components/components/ui/Footer';
import Navbar from '@components/components/ui/Navbar';

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <StyledComponentsRegistry>
            <ThemeProvider theme={theme}>
                <html lang="en">
                    <body>
                        <GlobalStyles />
                        <Logo />
                        <Navbar />
                        {children}
                        <Footer />
                    </body>
                </html>
            </ThemeProvider>
        </StyledComponentsRegistry>
    );
}
