I have a next js using typescript and styled-components app I am building.

I build a home page that hosts a blog, this is the code for the home page:

```tsx
// src/pages/index.tsx
import { useState } from 'react';
import { GetStaticProps } from 'next';
import styled from 'styled-components';

import PostPreview from '@components/PostPreview';
import TagFilter from '@components/ui/TagFilter';
import { get_post_metadata } from '@utils/markdown';

const Container = styled.div`
    width: 70%;
    height: auto;
    margin: 0 auto;
    padding: 10px;
    position: relative;

`;

const Grid = styled.div`
    margin: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
    grid-gap: 20px;
`;

function Home({ posts }: { posts: PostMetadata[] }) {
    const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // if no tags selected, show all posts
    const filteredPosts: PostMetadata[] = selectedTags.length > 0 ? posts.filter(
        post => selectedTags.some(tag => post.tags.includes(tag))
    ) : posts;

    const handleTagSelect = (tag: string) => {
        setSelectedTags(prev => [...prev, tag]);
    };

    const handleTagDeselect = (tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    };

    return (
        <>
            <Container>
                <TagFilter
                    tags={allTags}
                    selectedTags={selectedTags}
                    onTagSelect={handleTagSelect}
                    onTagDeselect={handleTagDeselect}
                />
                <Grid>
                    {filteredPosts.map(post => (
                        <PostPreview key={post.slug} {...post} />
                    ))}
                </Grid>
            </Container>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    let posts: PostMetadata[] = get_post_metadata("blog");
    posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // filter out any posts with published false
    posts = posts.filter(post => post.published);

    return {
        props: {
            posts
        }
    };
};

export default Home;
```

And for context here is what `PostMetadata` looks like:

```ts
interface PostMetadata {
    slug: string; // filename
    section: string; // folder where content is; passed by function

    title: string;
    blurb: string; // random phrase
    coverImage: string; // stored in md as a single number
    author: string;
    date: string;

    summary: string; // derived from content

    tags: string[];

    published: boolean;
    subtitle?: string;
};
```

I have a nav bar that looks like this:

```tsx
// src/pages/index.tsx
import { useState } from 'react';
import { GetStaticProps } from 'next';
import styled from 'styled-components';

import PostPreview from '@components/PostPreview';
import TagFilter from '@components/ui/TagFilter';
import { get_post_metadata } from '@utils/markdown';

const Container = styled.div`
    width: 70%;
    height: auto;
    margin: 0 auto;
    padding: 10px;
    position: relative;

`;

const Grid = styled.div`
    margin: auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(225px, 1fr));
    grid-gap: 20px;
`;

function Home({ posts }: { posts: PostMetadata[] }) {
    const allTags = Array.from(new Set(posts.flatMap(post => post.tags))).sort();

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // if no tags selected, show all posts
    const filteredPosts: PostMetadata[] = selectedTags.length > 0 ? posts.filter(
        post => selectedTags.some(tag => post.tags.includes(tag))
    ) : posts;

    const handleTagSelect = (tag: string) => {
        setSelectedTags(prev => [...prev, tag]);
    };

    const handleTagDeselect = (tag: string) => {
        setSelectedTags(prev => prev.filter(t => t !== tag));
    };

    return (
        <>
            <Container>
                <TagFilter
                    tags={allTags}
                    selectedTags={selectedTags}
                    onTagSelect={handleTagSelect}
                    onTagDeselect={handleTagDeselect}
                />
                <Grid>
                    {filteredPosts.map(post => (
                        <PostPreview key={post.slug} {...post} />
                    ))}
                </Grid>
            </Container>
        </>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    let posts: PostMetadata[] = get_post_metadata("blog");
    posts = posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // filter out any posts with published false
    posts = posts.filter(post => post.published);

    return {
        props: {
            posts
        }
    };
};

export default Home;
```

Here is how the NavBar is used is the `_app.tsx` file. Note that the `NavBar` and the `TagFilter` are not used in the same component so we cannot pass a state variable from the `NavBar` to the `TagFilter`:

```tsx
import React from 'react';
import { AppProps } from 'next/app';

// components
import NavBar from '@components/ui/NavBar';
import Logo from '@components/ui/Logo';
import Footer from '@components/ui/Footer';

// styles
import GlobalStyles from '@styles/GlobalStyles';
import { ThemeProvider } from 'styled-components';
import { theme } from '@styles/theme';

import '@public/fonts/roboto.css'; // sans-serif
import '@public/fonts/tangerine.css'; // cursive
import '@public/fonts/fjalla_one.css'; // block letters; main logo

import '@styles/footnotes.css'; // markdown processed by @utils/markdown.ts
import useNextClickHandler from '@utils/useNextClickHandler'; // TODO: temp solution for handling internal links from markdown content


export default function App({ Component, pageProps, router }: AppProps) {
    useNextClickHandler(router)
    return (
        <ThemeProvider theme={ theme }>
            <GlobalStyles />
            <Logo />
            <NavBar />
            <Component {...pageProps} />
            <Footer />
        </ThemeProvider>
    )
}
```

And here is the code for the `TagFilter` component:

```tsx
import styled from 'styled-components';
import { theme } from '@styles/theme';
import { useRef, useState } from 'react';

const FilterContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px;
    background-color: ${theme.container.background.colour.primary()};
    border: 1px solid ${theme.container.border.colour.primary()};
    border-radius: 5px;
    box-shadow: ${theme.container.shadow.primary};
    opacity: 0;
    transition: opacity 0.3s;
    z-index: 1;
    display: flex;
    flex-wrap: wrap; // Allow tags to wrap to the next line if needed
    gap: 10px; // Provides consistent spacing between the tags

    &:hover {
        opacity: 1;
    }
`;

const BaseButton = styled.span`
    user-select: none; // Prevent text selection
    font-family: ${theme.text.font.times};
    padding: 0px 7px 1px;
    cursor: pointer;
    border-radius: 5px;
    white-space: nowrap; // Prevents the tag from breaking into two lines
    transition: opacity 0.3s;

    &:hover {
        opacity: 0.3;
    }
`;

const FilterTag = styled(BaseButton) <{ selected: boolean }>`
    background-color: ${props => props.selected ? 'hsl(205, 70%, 50%)' : 'hsl(190, 15%, 90%)'};
    color: ${props => props.selected ? 'white' : 'black'};
`;

// css X
const ClearAllButton = styled(BaseButton)`
    background-color: hsl(0, 70%, 50%); // Shade of red
    color: white;
    position: relative;
    width: 20px;
    height: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;

    &::before, &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 70%;
        height: 3px;
        background-color: white;
    }

    &::before {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    &::after {
        transform: translate(-50%, -50%) rotate(-45deg);
    }
`;

interface TagFilterProps {
    tags: string[];
    selectedTags: string[];
    onTagSelect: (tag: string) => void;
    onTagDeselect: (tag: string) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTags, onTagSelect, onTagDeselect }) => {
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const containerRef = useRef<HTMLDivElement>(null);  // To reference the filter container

    const clearAllTags = () => {
        selectedTags.forEach(tag => onTagDeselect(tag));
    };

    const handleMouseDown = (event: React.MouseEvent, tag: string) => {
        event.preventDefault(); // prevent text selection
        if (!selectedTags.includes(tag)) {
            onTagSelect(tag);
        } else {
            onTagDeselect(tag);
        }
        setIsDragging(true);
    };

    const handleMouseEnter = (event: React.MouseEvent, tag: string) => {
        event.preventDefault();
        if (isDragging) {
            if (!selectedTags.includes(tag)) {
                onTagSelect(tag);
            } else {
                onTagDeselect(tag);
            }
        }
    };

    const endDrag = () => {
        setIsDragging(false);
    };

    return (
        <FilterContainer ref={containerRef} onMouseUp={endDrag} onMouseLeave={endDrag}>
            {tags.map(tag => (
                <FilterTag
                    key={tag}
                    selected={selectedTags.includes(tag)}
                    onMouseDown={(ev) => handleMouseDown(ev, tag)}
                    onMouseEnter={(ev) => handleMouseEnter(ev, tag)}
                >
                    {tag}
                </FilterTag>
            ))}
            <ClearAllButton onClick={clearAllTags} />
        </FilterContainer>
    );
};

export default TagFilter;
```

I need your help. I am learning and need a teacher.

I want you to help me revise this code. I want to add a button to the nav bar that will toggle the visibility of the `TagFilter` component.

However I'm lost as to how to do this. 

I want us to use Redux to do this. Start from the begining and guide me through the process. Give me as much revised code and whatever code is necessary as you can so I can implement this.