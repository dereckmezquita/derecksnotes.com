'use client';
import { useEffect, useRef } from 'react';
import { api } from '@/utils/api';

/**
 * Tracks reading progress. When the user scrolls past 75% of the page,
 * sends a POST to mark the post as read in their history.
 */
export function usePageView(options: {
    slug: string;
    title: string;
    enabled?: boolean;
}) {
    const { slug, title, enabled = true } = options;
    const sentRef = useRef(false);

    useEffect(() => {
        if (!enabled || sentRef.current) return;

        function onScroll() {
            if (sentRef.current) return;

            const scrollTop =
                window.scrollY || document.documentElement.scrollTop;
            const docHeight =
                document.documentElement.scrollHeight - window.innerHeight;
            if (docHeight <= 0) return;

            const scrollPercent = scrollTop / docHeight;

            if (scrollPercent >= 0.75) {
                sentRef.current = true;
                api.post('/posts/read', { slug, title }).catch(() => {});
                window.removeEventListener('scroll', onScroll);
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, [slug, title, enabled]);
}
