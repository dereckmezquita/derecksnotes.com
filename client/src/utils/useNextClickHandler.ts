// https://stackoverflow.com/questions/64216712/nextjs-link-to-without-refreshing
// I have links created in markdown documents and some of these internal
// I don't want to have to refresh when click on internal links so this allows us to generally handle all internal links by just using the regular a tag

import type { Router } from 'next/router';
import { useEffect } from 'react';

/**
 * Place this in a Next.js's _app.tsx component to use regular anchor elements
 * instead of Next.js's <code>Link</code> component.
 *
 * @param router - the Next.js router
 */
export default function useNextClickHandler(router: Router): void {
    useEffect(() => {
        async function onClick(event: MouseEvent) {
            // Only handle primary button click
            if (event.button !== 0) {
                return;
            }

            // Use default handling of modifier+click events
            if (
                event.metaKey ||
                event.ctrlKey ||
                event.altKey ||
                event.shiftKey
            ) {
                return;
            }

            const anchor = containingAnchor(event.target);

            // Only handle anchor clicks
            if (!anchor) {
                return;
            }

            // Use default handling of target="_blank" anchors
            if (anchor.target === '_blank') {
                return;
            }

            // If the link is internal, prevent default handling
            // and push the address (minus origin) to the router.
            if (anchor.href.startsWith(location.origin)) {
                event.preventDefault();
                await router.push(anchor.href.substr(location.origin.length));
            }
        }

        window.addEventListener('click', onClick);

        return () => window.removeEventListener('click', onClick);
    }, [router]);
}

function containingAnchor(
    target: EventTarget | null
): HTMLAnchorElement | undefined {
    let parent = target;

    while (
        parent instanceof HTMLElement &&
        !(parent instanceof HTMLAnchorElement)
    ) {
        parent = parent.parentElement;
    }

    return parent instanceof HTMLAnchorElement ? parent : undefined;
}
