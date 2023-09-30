import React from 'react';
import { useEffect, useState } from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';

// redux for tag filter visibility
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

import TagFilter from '@components/ui/TagFilter';
import {
    PostContainer, SideBarContainer, SideBarSiteName,
    SideBarEntriesContainer, SideEntryLink, SideBarAbout,
    Article, PostContentWrapper
} from '@components/post-elements/post';

import CommentSection from '@components/comments-section/CommentSection';

// ------------------------------------
// component imports to be used in MDX
import Figure from '@components/post-elements/Figure';
import DropCap from '@components/ui/DropCap';
import Alert from '@components/post-elements/Alert';
import Blockquote from '@components/post-elements/Blockquote';

const dictionary: string = 'chemistry';

// ------------------------------------
// ------------------------------------

const components = {
    Figure: Figure,
    DropCap: DropCap,
    Alert: Alert,
    Blockquote: Blockquote,
};

interface DefFrontMatter {
    slug?: string;
    letter: string;
    word: string;
    dictionary: string;
    category: string;
    dataSource: string;

    published: boolean;
    comments: boolean;

    date?: string;

    linksTo: string[];
    linkedFrom: string[];
}

interface PostPageProps {
    slug: string;
    word: string;
    source: any;
    side_bar_data: DefFrontMatter[];
}

const PostPage: React.FC<PostPageProps> = ({ slug, word, source, side_bar_data }) => {
    // https://nextjs.org/docs/messages/react-hydration-error
    // Solution 1: Using useEffect to run on the client only; used to fix mathjax not rendering
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    // sort by letter descending with symbols at the end
    const isLetter = (char: string) => char >= 'a' && char <= 'z';

    // remove the side_bar_data with published: false
    side_bar_data = side_bar_data.filter(post => post.published)
        .sort((a, b) => {
            const aLetter = a.word[0].toLowerCase();
            const bLetter = b.word[0].toLowerCase();

            if (aLetter == bLetter) return a.word.localeCompare(b.word);
            if (!isLetter(aLetter)) return 1;
            if (!isLetter(bLetter)) return -1;

            return aLetter.localeCompare(bLetter);
        });

    const alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz#'.split('');

    // get all linksTo and LinkedFrom in a single array
    let all_tags: string[] = Array.from(new Set(side_bar_data.flatMap(def => {
        return [...def.linksTo, ...def.linkedFrom];
    }))).sort();

    all_tags = [...alphabet, ...all_tags];

    // remove any empty
    all_tags = all_tags.filter(tag => tag !== '');

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // if no tags selected, show all posts
    const filteredPosts: DefFrontMatter[] = selectedTags.length > 0 ? side_bar_data.filter(
        post => selectedTags.some(tag => post.linksTo.includes(tag) ||
            post.linkedFrom.includes(tag) || // or if matches letter
            post.letter.toLowerCase() === tag
        )
    ) : side_bar_data;

    const handleTagSelect = (tag: string) => {
        setSelectedTags(prev => [...prev, tag]);
    };

    const handleTagDeselect = (tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    };

    // redux control for tag filter visibility
    const tagsFilterVisible = useSelector((state: RootState) => state.visibility.tagsFilterVisible);

    return (
        <>
            <TagFilter
                tags={all_tags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onTagDeselect={handleTagDeselect}
                visible={tagsFilterVisible}
                styleContainer={{ width: '80%' }}
            />
            <PostContainer>
                <SideBarContainer>
                    <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
                    <SideBarEntriesContainer>
                        {filteredPosts.map((meta) => (
                            <SideEntryLink
                                key={meta.slug}
                                href={`/dictionaries/${dictionary}/${meta.slug}`}
                                passHref
                            >
                                {meta.word}
                            </SideEntryLink>
                        ))}
                    </SideBarEntriesContainer>
                    <SideBarAbout />
                </SideBarContainer>
                <Article>
                    <h1>{word}</h1>
                    {isClient &&
                        <PostContentWrapper>
                            <MDXRemote {...source} components={components} />
                        </PostContentWrapper>
                    }
                    <CommentSection slug={slug} allowComments />
                </Article>
            </PostContainer>
        </>
    );
}

// ----------------------------------------
import { serialize } from 'next-mdx-remote/serialize';
import matter from 'gray-matter';

// rehype remark plugins
import remarkGfm from 'remark-gfm'; // github flavoured markdown
import remarkUnwrapImages from 'remark-unwrap-images'; // removes p tag around images
import remarkExternalLinks from 'remark-external-links'; // adds target="_blank" to external links
import remarkMath from 'remark-math'; // allows math in mdx

// TOOD: uninstall: import rehypeRaw from 'rehype-raw'; // allows html in mdx
import rehypePrettyCode from 'rehype-pretty-code'; // syntax highlighting
import rehypeSlug from 'rehype-slug'; // adds id to headers
import rehypeMathjax from 'rehype-mathjax';


export const getStaticProps: GetStaticProps = async ({ params }) => {
    // get side bar metadata
    const sidebar_files: string[] = fs.readdirSync(path.join(ROOT, 'content', 'dictionaries', dictionary))
        .filter((fn) => fn.endsWith('.mdx'));
    const side_bar_data = sidebar_files.map((file_name) => {
        const file_content: string = fs.readFileSync(path.join(ROOT, 'content', 'dictionaries', dictionary, file_name), 'utf8');
        const { data, content } = matter(file_content) as matter.GrayMatterFile<string>;

        // data.date = data.date.toString();
        // format date as 2023-12-31
        if (data.date) data.date = new Date(data.date).toISOString().slice(0, 10);

        return {
            slug: file_name.replace('.mdx', ''),
            ...data as DefFrontMatter
        }
    })

    // get post content and process
    const post_file_path: string = path.join(ROOT, 'content', 'dictionaries', dictionary, `${params!.slug}.mdx`);
    const file_content: string = fs.readFileSync(post_file_path, 'utf8');
    const mdxSource = await serialize(file_content, {
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

    // if not published, return 404
    if (!mdxSource.frontmatter.published) {
        return {
            notFound: true
        };
    }

    return {
        props: {
            slug: params!.slug,
            word: mdxSource.frontmatter.word,
            source: JSON.parse(JSON.stringify(mdxSource)),
            side_bar_data: side_bar_data
        },
    };
}

// ----------------------------------------
// the goal of this function getStaticPaths is to
// return a list of all possible values for slug
// so that nextjs can pre-render all the possible
import path from 'path';
import fs from 'fs';
import { ROOT } from '@constants/config';

export const getStaticPaths: GetStaticPaths = async () => {
    const posts: string[] = fs.readdirSync(path.join(ROOT, 'content', 'dictionaries', dictionary));
    const paths = posts.map(post => ({
        params: { slug: post.replace('.mdx', '') }
    }));

    return {
        paths,
        fallback: false
    };
}

export default React.memo(PostPage);