'use client';
import { useEffect, useRef, useCallback } from 'react';
import { api } from '@utils/api/api';

const HEARTBEAT_INTERVAL = 15000; // 15 seconds

interface PageViewOptions {
    slug: string;
    title: string;
    enabled?: boolean;
}

interface ViewResponse {
    viewId: string;
    isBot: boolean;
}

/**
 * Hook to track page views with heartbeat for duration and scroll depth.
 * Sends a view record on mount and periodically updates with scroll depth.
 * Uses beacon API to send final update on page exit.
 */
export function usePageView({ slug, title, enabled = true }: PageViewOptions) {
    const viewIdRef = useRef<string | null>(null);
    const scrollDepthRef = useRef(0);
    const heartbeatRef = useRef<NodeJS.Timeout | null>(null);

    // Track maximum scroll depth
    const updateScrollDepth = useCallback(() => {
        const scrollHeight =
            document.documentElement.scrollHeight - window.innerHeight;
        if (scrollHeight <= 0) {
            scrollDepthRef.current = 100;
            return;
        }
        const currentScroll = window.scrollY;
        const currentDepth = Math.min(
            100,
            Math.round((currentScroll / scrollHeight) * 100)
        );
        scrollDepthRef.current = Math.max(scrollDepthRef.current, currentDepth);
    }, []);

    // Send heartbeat update
    const sendHeartbeat = useCallback(async () => {
        if (!viewIdRef.current) return;

        try {
            await api.patch(`/posts/view/${viewIdRef.current}`, {
                scrollDepth: scrollDepthRef.current
            });
        } catch {
            // Silently fail - not critical
        }
    }, []);

    // Send final update using beacon API (for page exit)
    const sendFinalUpdate = useCallback(() => {
        if (!viewIdRef.current) return;

        const data = JSON.stringify({
            scrollDepth: scrollDepthRef.current,
            exitedAt: new Date().toISOString()
        });

        // Use beacon API for reliable delivery on page exit
        const blob = new Blob([data], { type: 'application/json' });
        navigator.sendBeacon(`/api/v1/posts/view/${viewIdRef.current}`, blob);
    }, []);

    useEffect(() => {
        if (!enabled || !slug || !title) return;

        let mounted = true;

        // Initial view registration
        const registerView = async () => {
            try {
                const response = await api.post<ViewResponse>('/posts/view', {
                    slug,
                    title
                });
                if (mounted) {
                    viewIdRef.current = response.data.viewId;
                }
            } catch {
                // Silently fail - view tracking is non-critical
            }
        };

        registerView();

        // Set up scroll tracking
        const handleScroll = () => {
            updateScrollDepth();
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Set up heartbeat
        heartbeatRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

        // Set up page exit handler
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                sendFinalUpdate();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Also handle beforeunload for immediate navigation
        const handleBeforeUnload = () => {
            sendFinalUpdate();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            mounted = false;

            // Clean up
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            );
            window.removeEventListener('beforeunload', handleBeforeUnload);

            if (heartbeatRef.current) {
                clearInterval(heartbeatRef.current);
            }

            // Send final update on unmount
            sendFinalUpdate();
        };
    }, [
        slug,
        title,
        enabled,
        updateScrollDepth,
        sendHeartbeat,
        sendFinalUpdate
    ]);

    return {
        viewId: viewIdRef.current
    };
}
