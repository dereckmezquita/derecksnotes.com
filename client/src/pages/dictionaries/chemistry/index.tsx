import React from 'react';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { GetStaticProps } from 'next';
import { MDXRemote } from 'next-mdx-remote';

import TagFilter from '@components/ui/TagFilter';
import SearchBar from '@components/atomic/SearchBar';
import SelectDropDown from '@components/atomic/SelectDropDown';
import {
    PostContainer, SideBarContainer, SideBarSiteName,
    SideBarAbout, Article, PostContentWrapper
} from '@components/post-elements/post';

import Figure from '@components/post-elements/Figure';
import Alert from '@components/post-elements/Alert';
import Blockquote from '@components/post-elements/Blockquote';

const dictionary: string = 'chemistry';

// ------------------------------------
// ------------------------------------

const components = {
    Figure: Figure,
    Alert: Alert,
    Blockquote: Blockquote,
    a: Link
};

interface DefFrontMatter {
    slug?: string;
    letter: string;
    word: string;
    dictionary: string;
    category: string;
    dataSource: string;

    published: boolean;

    date?: string;

    linksTo: string[];
    linkedFrom: string[];
}

interface Source {
    mdxSource: any;
    frontmatter: DefFrontMatter;
}

interface DictionaryPageProps {
    sources: Source[]; // an array of processed mdx
}

const DictionaryPage: React.FC<DictionaryPageProps> = ({ sources }) => {
    // https://nextjs.org/docs/messages/react-hydration-error
    // Solution 1: Using useEffect to run on the client only; used to fix mathjax not rendering
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    const isLetter = (char: string) => char >= 'a' && char <= 'z';

    sources = sources.filter(def => def.frontmatter.published)
        .sort((a, b) => {
            const aLetter = a.frontmatter.letter;
            const bLetter = b.frontmatter.letter;

            if (aLetter === bLetter) return a.frontmatter.word.localeCompare(b.frontmatter.word);
            if (!isLetter(aLetter)) return 1;
            if (!isLetter(bLetter)) return -1;

            return aLetter.localeCompare(bLetter);
        });

    const alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz#'.split('');

    // get all linksTo and linkedFrom in a single array
    let all_tags: string[] = Array.from(new Set(sources.flatMap(def => {
        return [...def.frontmatter.linksTo, ...def.frontmatter.linkedFrom];
    }))).sort();

    all_tags = [...alphabet, ...all_tags];

    // remove any tags that are just an empty string
    all_tags = all_tags.filter(tag => tag !== '');

    const [searchMode, setSearchMode] = useState<"words" | "tags">("words");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // allow for search
    const displayedTags = searchMode === "tags" && searchTerm
        ? all_tags.filter(tag => tag.toLowerCase().includes(searchTerm))
        : all_tags;

    const filteredDefsByWord = searchTerm && searchMode === "words"
        ? sources.filter(def => def.frontmatter.word.toLowerCase().includes(searchTerm))
        : sources;

    // if none selected then show all definitions
    const displayedDefs = selectedTags.length > 0
        ? sources.filter(
            def => def.frontmatter.word.toLowerCase().startsWith(selectedTags[0]) ||
                def.frontmatter.linksTo.some((tag: any) => selectedTags.includes(tag)) ||
                def.frontmatter.linkedFrom.some((tag: any) => selectedTags.includes(tag)) ||
                selectedTags.includes(def.frontmatter.letter)
        )
        : filteredDefsByWord;

    const handleTagSelect = (tag: string) => {
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    }

    const handleTagDeselect = (tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    }

    // for separating definitions by letter with a header
    const renderDefinitions = () => {
        let currentLetter = "";

        return displayedDefs.map((source, i) => {
            const startNewLetter = source.frontmatter.letter !== currentLetter;
            if (startNewLetter) {
                currentLetter = source.frontmatter.letter;
            }

            return (
                <React.Fragment key={source.frontmatter.word}>
                    {startNewLetter && <h2>{currentLetter.toUpperCase()}</h2>}
                    <li>
                        <PostContentWrapper>
                            <MDXRemote {...source as any} components={components} />
                        </PostContentWrapper>
                    </li>
                </React.Fragment>
            );
        });
    };

    return (
        <PostContainer>
            <SideBarContainer>
                <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
                <SelectDropDown
                    options={["Search words", "Search tags"]}
                    value={searchMode}
                    onChange={(value) => setSearchMode(value as "words" | "tags")}
                />
                <SearchBar
                    value={searchTerm}
                    onChange={(value: string) => setSearchTerm(value.toLowerCase())}
                    placeholder="Search tags..."
                />
                <TagFilter
                    tags={displayedTags}
                    selectedTags={selectedTags}
                    onTagSelect={handleTagSelect}
                    onTagDeselect={handleTagDeselect}
                    visible={true}
                    styleContainer={{
                        backgroundColor: 'inherit',
                        boxShadow: 'none',
                        border: 'none'
                    }}
                />
                <SideBarAbout />
            </SideBarContainer>
            <Article>
                <h1>Biology Dictionary</h1>
                <ol>
                    {
                        isClient && renderDefinitions()
                    }
                </ol>
            </Article>
        </PostContainer>
    )
}

// ------------------------------------
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

// custom rehype plugins
import rehypeLinkToDefinition from '@utils/rehype/rehypeLinkToDefinition'; // adds href to word anchor

export const getStaticProps: GetStaticProps = async () => {
    // get post content and process
    const defs_folder_path: string = path.join(ROOT, 'content', 'dictionaries', dictionary);
    const defs_paths: string[] = fs.readdirSync(defs_folder_path, 'utf8');

    // get def content and process
    const mdxSources = defs_paths.map(async (file_name) => {
        const file_path: string = path.join(defs_folder_path, file_name);
        const file_content: string = fs.readFileSync(file_path, 'utf8');
        // Extract frontmatter using gray-matter
        // const { data: frontmatter, content } = matter(file_content);

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
                    // [rehypeInsertAnchorTag, {
                    //     frontmatter: frontmatter,
                    //     slug: file_name.replace(/\.mdx$/, '')
                    // }],
                    [rehypeLinkToDefinition, {
                        slug: file_name.replace(/\.mdx$/, ''),
                        dictionary: dictionary
                    }]
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

    return {
        props: {
            sources
        }
    };
}

export default DictionaryPage;