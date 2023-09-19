import fs from 'fs';
import path from "path";
import { ROOT } from "@constants/config";
import matter from "gray-matter";

export default function get_post_content(folder: string, slug: string): matter.GrayMatterFile<string> {
    const file: string = path.join(path.join(ROOT, 'content', folder), `${slug}.mdx`);
    const content: string = fs.readFileSync(file, 'utf8');
    return matter(content);
}