'use client';
// https://github.com/vercel/next.js/issues/49850
import './globals.css';
import { ThemeProvider } from 'styled-components';
import { theme } from '@styles/theme';

import StyledComponentsRegistry from '@lib/registry'; // eliminates FOUC forcing styled-components to render on server
import GlobalStyles from '@styles/GlobalStyles';
import Logo from '@components/ui/Logo';

import '@public/fonts/roboto.css'; // sans-serif
import '@public/fonts/tangerine.css'; // cursive
import '@public/fonts/fjalla_one.css'; // block letters; main logo

// consider moving these styles to layout page of post display components
import '@styles/syntax-highlighter.scss';
import '@styles/footnotes.css';
import Footer from '@components/ui/Footer';
import Navbar from '@components/ui/Navbar';
import { BlogFilterProvider } from '@components/pages/index/BlogFilterContext';
import { AuthProvider } from '@context/AuthContext';

import { Toaster } from 'sonner';

export default function RootLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return (
        <StyledComponentsRegistry>
            <ThemeProvider theme={theme}>
                <BlogFilterProvider>
                    <AuthProvider>
                        <html lang="en">
                            <body>
                                <Toaster
                                    richColors
                                    closeButton
                                    theme={'light'}
                                />
                                <GlobalStyles />
                                <Logo />
                                <Navbar />
                                {children}
                                <Footer />
                            </body>
                        </html>
                    </AuthProvider>
                </BlogFilterProvider>
            </ThemeProvider>
        </StyledComponentsRegistry>
    );
}
