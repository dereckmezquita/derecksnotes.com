/**
 * We were having google add parameters to the slug, so we need to remove them
 * @param slug
 * @returns
 */
export function decodeSlug(slug: string): string {
    return decodeURIComponent(slug);
}
