import fs from 'fs';
import matter from 'gray-matter';

const get_post_metadata = (): PostMetadata[] => {
    const folder = 'blog/';
    const files = fs.readdirSync(folder);
    const md = files.filter((fn) => fn.endsWith('.md'));
    // get gray-matter metadata
    return md.map((file_name) => {
        const file_contents = fs.readFileSync(`${folder}${file_name}`, 'utf8');
        const { data } = matter(file_contents);
        return {
            title: data.title,
            subtitle: data.subtitle,
            // to date format YYYT-MM-DD HH:MM:SS
            date: typeof data.date === 'string' ? data.date : data.date.toISOString().split('T')[0],
            slug: file_name.replace('.md', '')
        };
    });
}
export default get_post_metadata;