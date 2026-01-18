'use client';

import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useCallback
} from 'react';
import { ContentCardMetadata } from '@utils/mdx/contentTypes';

interface BlogFilterContextType {
    posts: ContentCardMetadata[];
    filteredPosts: ContentCardMetadata[];
    allTags: string[];
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
    isFilterVisible: boolean;
    setIsFilterVisible: React.Dispatch<React.SetStateAction<boolean>>;
    setPosts: React.Dispatch<React.SetStateAction<ContentCardMetadata[]>>;
    resetFilter: () => void;
}

const BlogFilterContext = createContext<BlogFilterContextType | undefined>(
    undefined
);

export function BlogFilterProvider({ children }: { children: ReactNode }) {
    const [posts, setPosts] = useState<ContentCardMetadata[]>([]);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);

    const allTags: string[] = Array.from(
        new Set(posts.flatMap((post) => post.tags))
    ).sort();

    const filteredPosts =
        selectedTags.length > 0
            ? posts.filter((post) =>
                  post.tags.some((tag) => selectedTags.includes(tag))
              )
            : posts;

    const resetFilter = useCallback(() => {
        setSelectedTags([]);
        setIsFilterVisible(false);
    }, []);

    return (
        <BlogFilterContext.Provider
            value={{
                posts,
                filteredPosts,
                allTags,
                selectedTags,
                setSelectedTags,
                isFilterVisible,
                setIsFilterVisible,
                setPosts,
                resetFilter
            }}
        >
            {children}
        </BlogFilterContext.Provider>
    );
}

export const useBlogFilter = () => {
    const context = useContext(BlogFilterContext);
    if (context === undefined) {
        throw new Error(
            'useBlogFilter must be used within a BlogFilterProvider'
        );
    }
    return context;
};
