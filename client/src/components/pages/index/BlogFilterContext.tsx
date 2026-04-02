'use client';

import React, {
    createContext,
    useState,
    useContext,
    ReactNode,
    useCallback
} from 'react';
import { ContentCardMetadata } from '@/utils/mdx/contentTypes';

interface BlogFilterContextType {
    posts: ContentCardMetadata[];
    filteredPosts: ContentCardMetadata[];
    allTags: string[];
    selectedTags: string[];
    setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
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
    const [searchQuery, setSearchQuery] = useState('');
    const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);

    const allTags: string[] = Array.from(
        new Set(posts.flatMap((post) => post.tags))
    ).sort();

    const filteredPosts = posts.filter((post) => {
        // Tag filter
        if (
            selectedTags.length > 0 &&
            !post.tags.some((tag) => selectedTags.includes(tag))
        ) {
            return false;
        }
        // Search filter
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            return (
                post.title.toLowerCase().includes(q) ||
                (post.blurb && post.blurb.toLowerCase().includes(q)) ||
                (post.summary && post.summary.toLowerCase().includes(q)) ||
                post.tags.some((t) => t.toLowerCase().includes(q)) ||
                post.author.toLowerCase().includes(q)
            );
        }
        return true;
    });

    const resetFilter = useCallback(() => {
        setSelectedTags([]);
        setSearchQuery('');
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
                searchQuery,
                setSearchQuery,
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
