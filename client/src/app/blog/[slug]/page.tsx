import fs from 'fs';
import { readFile, access } from 'fs/promises';
import path from 'path';
import { ROOT_DIR_APP } from "@components/lib/constants";

const postsDir = path.join(ROOT_DIR_APP, 'blog/posts');

async function readPostFile(slug: string) {
    const filePath = path.resolve(path.join(postsDir, `${slug}.mdx`));

    try {
        await access(filePath);
    } catch (err) {
        return undefined;
    }

    const fileContent = await readFile(filePath, { encoding: 'utf-8' });
    return fileContent;
}

// used at build time to generate which pages to render
export async function generateStaticParams() {
    const filenames: string[] = fs.readdirSync(postsDir);
    return filenames.map((filename) => {
        const slug = path.basename(filename, '.mdx');
        return { slug };
    });
}

async function Page({ params }: { params: { slug: string } }) {
  return (
    <div>
        <h1>Hello world!</h1>
    </div>
  );
}

export default Page;