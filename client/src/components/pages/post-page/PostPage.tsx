import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { MDXRemote } from 'next-mdx-remote';

// redux for tag filter visibility
import { useSelector } from 'react-redux';
import { RootState } from '@store/store';

import { APPLICATION_METADATA, APPLICATION_URL } from '@constants/config';
import TagFilter from '@components/ui/TagFilter';
import {
    PostContainer,
    Article,
    PostContentWrapper
} from '@components/pages/post';
import SideBar from '@components/pages/post-page/SideBar';
import CommentSection from '@components/comments-section/CommentSection';

// ------------------------------------
// component imports to be used in MDX
import { mdxComponents } from '@components/pages/post-page/mdxComponents';
import MetaTags from '@components/atomic/MetaTags';

interface FrontMatter {
    slug?: string;
    title: string;
    blurb: string;
    coverImage: string;
    author: string;
    date: string;
    tags: string[];
    published: boolean;
    comments: boolean;
}

interface PostPageProps {
    section: string;
    frontmatter: FrontMatter;
    summary: string;
    source: any;
    side_bar_data: FrontMatter[];
}

const PostPage: React.FC<PostPageProps> = ({
    section,
    frontmatter,
    summary,
    source,
    side_bar_data
}) => {
    const router = useRouter();

    APPLICATION_METADATA.title = `DN | ${frontmatter.title}`;
    APPLICATION_METADATA.description = summary;
    APPLICATION_METADATA.image =
        APPLICATION_URL +
        '/site-images/card-covers/' +
        frontmatter.coverImage +
        '.png';
    APPLICATION_METADATA.url = APPLICATION_URL + router.asPath;

    // https://nextjs.org/docs/messages/react-hydration-error
    // Solution 1: Using useEffect to run on the client only; used to fix mathjax not rendering
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // remove the side_bar_data with published: false
    side_bar_data = side_bar_data.filter((post) => post.published);

    // tag filter
    const all_tags: string[] = Array.from(
        new Set(side_bar_data.flatMap((post) => post.tags))
    ).sort();
    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    // if no tags selected, show all posts
    const filteredPosts: FrontMatter[] =
        selectedTags.length > 0
            ? side_bar_data.filter((post) =>
                  selectedTags.some((tag) => post.tags.includes(tag))
              )
            : side_bar_data;

    const handleTagSelect = (tag: string) => {
        setSelectedTags((prev) => [...prev, tag]);
    };

    const handleTagDeselect = (tag: string) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
    };

    // redux control for tag filter visibility
    const tagsFilterVisible = useSelector(
        (state: RootState) => state.visibility.tagsFilterVisible
    );

    return (
        <>
            <MetaTags {...APPLICATION_METADATA} />
            <TagFilter
                tags={all_tags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onTagDeselect={handleTagDeselect}
                visible={tagsFilterVisible}
                styleContainer={{ width: '80%' }}
            />
            <PostContainer>
                <SideBar section={section} posts={filteredPosts} />
                <Article>
                    <h1>{frontmatter.title}</h1>
                    {isClient && (
                        <PostContentWrapper>
                            <MDXRemote {...source} components={mdxComponents} />
                        </PostContentWrapper>
                    )}
                    <CommentSection allowComments={frontmatter.comments} />
                </Article>
            </PostContainer>
        </>
    );
};

export default PostPage;
