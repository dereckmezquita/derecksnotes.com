/**
 * Decodes the slug and removes unwanted trailing parameters that Google or other referrers might add.
 * For example:
 *   "20191025_productivity-and-computers%26sa%3DU%26ved%3D..."
 * Decodes to:
 *   "20191025_productivity-and-computers&sa=U&ved=..."
 * We then strip anything after the first '&' or '?'.
 */
export function decodeSlug(slug: string): string {
    const decoded = decodeURIComponent(slug);
    // Strip at the first occurrence of & or ?
    // This assumes all legitimate slugs don't contain these chars.
    // If you do ever need these chars in filenames, adjust the logic accordingly.
    const index = decoded.search(/[&?]/);
    if (index !== -1) {
        return decoded.slice(0, index);
    }
    return decoded;
}
