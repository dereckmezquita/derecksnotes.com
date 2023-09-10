import React, { useState } from 'react';
import TagFilter from '@components/ui/TagFilter';

import {
    PostContainer, SideBarContainer, SideBarSiteName, SideBarEntriesContainer, SideEntryLink, SideBarAboutContainer, SideBarAboutH2, Article, PostContent
} from '@components/ui/DisplayContent';

import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

interface PostPageProps {
    content: string;
    post: PostMetadata;
    posts: PostMetadata[];
};

// reminder this returns a function
// this function is used in [slug].tsx and uses post, posts which are global variables
// these variables are passed by getStaticProps
export default function withPostPage(section: string): React.FC<PostPageProps> {
    const PostPage: React.FC<PostPageProps> = ({ content, post, posts }) => {
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

        // redux control for tag filter visibility
        const tagsFilterVisible = useSelector((state: RootState) => state.visibility.tagsFilterVisible);

        return (
            <>
                <TagFilter
                    tags={allTags}
                    selectedTags={selectedTags}
                    onTagSelect={handleTagSelect}
                    onTagDeselect={handleTagDeselect}
                    visible={tagsFilterVisible}
                />
                <PostContainer>
                    <SideBarContainer>
                        <SideBarSiteName fontSize='20px'>{`Dereck's Notes`}</SideBarSiteName>
                        <SideBarEntriesContainer>
                            {filteredPosts.map((meta) => (
                                <SideEntryLink
                                    key={meta.slug}
                                    href={`/${section}/${meta.slug}`}
                                    passHref
                                >
                                    <span style={{ fontWeight: 'bold' }}>{meta.date}</span>: {meta.title}
                                </SideEntryLink>
                            ))}
                        </SideBarEntriesContainer>
                        <SideBarAboutContainer>
                            <SideBarAboutH2>About</SideBarAboutH2>
                            <p>
                                This website is custom made by Dereck using React, Next.js, and TypeScript. It incorporates progressive web app technologies an relies on a NodeJS backend along with a MongoDB database.
                            </p>
                            <p>
                                If you'd like to know more you can find the full source code on <a href='https://github.com/dereckmezquita/derecksnotes.com'>github.com/dereckmezquita/derecksnotes.com</a>
                            </p>
                        </SideBarAboutContainer>
                    </SideBarContainer>
                    <Article>
                        <h1>{post.title}</h1>
                        <PostContent dangerouslySetInnerHTML={{ __html: content }} />
                    </Article>
                </PostContainer>
            </>
        );
    };

    return PostPage;
};