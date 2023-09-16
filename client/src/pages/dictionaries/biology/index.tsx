import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';

import {
    PostContainer, SideBarContainer, SideBarSiteName, SideBarEntriesContainer, SideEntryLink, SideBarAboutContainer, SideBarAboutH2, Article, PostContentWrapper
} from '@components/ui/DisplayContent';

import Figure from '@components/ui/post-elements/Figure';
import Alert from '@components/ui/post-elements/Alert';
import Blockquote from '@components/ui/post-elements/Blockquote';

const components = {
    Figure: Figure,
    Alert: Alert,
    Blockquote: Blockquote,
};

const dictionary: string = 'biology';

interface DefFrontMatter {
    slug?: string;
    letter: string;
    word: string;
    dictionary: string;
    category: string;
    dataSource: string;

    date?: string;

    linksTo: string[];
    linkedFrom: string[];
}

interface DictionaryPageProps {
    sources: any[]; // an array of processed mdx
}

const DictionaryPage: React.FC<DictionaryPageProps> = ({ sources }) => {
    // https://nextjs.org/docs/messages/react-hydration-error
    // Solution 1: Using useEffect to run on the client only; used to fix mathjax not rendering
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])


    return (
        <>
            <PostContainer>
                <Article sideBar={false} style={{width: "90%"}}>
                    <h1>Biology Dictionary</h1>
                    <ol>
                        {
                            isClient
                                &&
                            sources.map((source, i) => {
                                return (
                                    <li key={source.frontmatter.word}>
                                        <MDXRemote {...source} components={components} />
                                    </li>
                                )
                            })
                        }
                    </ol>
                </Article>
            </PostContainer>
        </>
    )
}

// ----------------------------------------
import path from 'path';
import fs from 'fs';
import { ROOT } from '@constants/misc';

import { serialize } from 'next-mdx-remote/serialize';

// rehype remark plugins
import remarkGfm from 'remark-gfm'; // github flavoured markdown
import remarkUnwrapImages from 'remark-unwrap-images'; // removes p tag around images
import remarkExternalLinks from 'remark-external-links'; // adds target="_blank" to external links
import remarkMath from 'remark-math'; // allows math in mdx

// TOOD: uninstall: import rehypeRaw from 'rehype-raw'; // allows html in mdx
import rehypePrettyCode from 'rehype-pretty-code'; // syntax highlighting
import rehypeSlug from 'rehype-slug'; // adds id to headers
import rehypeMathjax from 'rehype-mathjax';

export const getStaticProps: GetStaticProps = async () => {
    // get post content and process
    const defs_folder_path: string = path.join(ROOT, 'content', 'dictionaries', dictionary);
    const defs_paths: string[] = fs.readdirSync(defs_folder_path, 'utf8');

    // get def content and process
    const mdxSources = defs_paths.map(async (file_name) => {
        const file_path: string = path.join(defs_folder_path, file_name);
        const file_content: string = fs.readFileSync(file_path, 'utf8');
        const mdxSource = await serialize<string, DefFrontMatter>(file_content, {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [
                    remarkGfm,
                    remarkUnwrapImages,
                    remarkExternalLinks,
                    remarkMath,
                ],
                rehypePlugins: [
                    rehypePrettyCode,
                    rehypeSlug,
                    rehypeMathjax,
                ]
            }
        });

        if (mdxSource.frontmatter.date) {
            // format date as 2023-12-31
            mdxSource.frontmatter.date = new Date(mdxSource.frontmatter.date).toISOString().slice(0, 10);
        }

        return mdxSource;
    });

    // wait for all promises to resolve
    const sources = await Promise.all(mdxSources);

    console.log(sources);

    return {
        props: {
            sources
        }
    };
}

export default DictionaryPage;