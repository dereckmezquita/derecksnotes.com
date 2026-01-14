'use client';
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { toast } from 'sonner';
import { api } from '@utils/api/api';
import { useAuth } from '@context/AuthContext';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const Container = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
`;

const ReactionButton = styled.button<{ $isActive?: boolean }>`
    background: ${(props) =>
        props.$isActive ? props.theme.theme_colours[9]() : 'none'};
    border: 1px solid
        ${(props) =>
            props.$isActive
                ? props.theme.theme_colours[5]()
                : props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    padding: ${(props) => props.theme.container.spacing.small}
        ${(props) => props.theme.container.spacing.medium};
    display: inline-flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
    color: ${(props) =>
        props.$isActive
            ? props.theme.theme_colours[5]()
            : props.theme.text.colour.light_grey()};
    font-size: ${(props) => props.theme.text.size.normal};
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 40px;

    svg {
        transition: transform 0.2s ease;
        flex-shrink: 0;
    }

    &:hover:not(:disabled) {
        color: ${(props) => props.theme.theme_colours[5]()};
        background-color: ${(props) => props.theme.theme_colours[9]()};
        border-color: ${(props) => props.theme.theme_colours[5]()};

        svg {
            transform: scale(1.1);
        }
    }

    &:focus {
        outline: 2px solid ${(props) => props.theme.theme_colours[5]()};
        outline-offset: 2px;
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: none;
        border-color: ${(props) =>
            props.theme.container.border.colour.primary()};
    }

    @media (max-width: ${(props) =>
            props.theme.container.widths.min_width_mobile}) {
        min-height: 44px;
        padding: ${(props) => props.theme.container.spacing.small};
    }
`;

const ReactionCount = styled.span`
    font-size: ${(props) => props.theme.text.size.normal};
    font-weight: ${(props) => props.theme.text.weight.medium};
    min-width: 1.5em;
    text-align: center;
`;

// ============================================================================
// TYPES
// ============================================================================

interface PostReactionButtonsProps {
    slug: string;
    title: string;
}

interface PostStats {
    likes: number;
    dislikes: number;
    userReaction: 'like' | 'dislike' | null;
    views: number;
}

// ============================================================================
// COMPONENT
// ============================================================================

export function PostReactionButtons({ slug, title }: PostReactionButtonsProps) {
    const { user } = useAuth();
    const [stats, setStats] = useState<PostStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch initial stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get<PostStats>(
                    `/posts/stats?slug=${encodeURIComponent(slug)}`
                );
                setStats(response.data);
            } catch {
                // Silently fail - stats are non-critical
                setStats({
                    likes: 0,
                    dislikes: 0,
                    userReaction: null,
                    views: 0
                });
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchStats();
        }
    }, [slug]);

    const handleReaction = useCallback(
        async (type: 'like' | 'dislike') => {
            if (!user || !stats) return;

            // Optimistic update
            const previousStats = { ...stats };
            const wasActive = stats.userReaction === type;

            setStats((prev) => {
                if (!prev) return prev;

                // Calculate new counts
                let newLikes = prev.likes;
                let newDislikes = prev.dislikes;

                // Remove previous reaction
                if (prev.userReaction === 'like') newLikes--;
                if (prev.userReaction === 'dislike') newDislikes--;

                // Add new reaction (if not toggling off)
                if (!wasActive) {
                    if (type === 'like') newLikes++;
                    if (type === 'dislike') newDislikes++;
                }

                return {
                    ...prev,
                    likes: newLikes,
                    dislikes: newDislikes,
                    userReaction: wasActive ? null : type
                };
            });

            try {
                if (wasActive) {
                    // Remove reaction
                    await api.delete('/posts/react', {
                        data: { slug, title }
                    });
                } else {
                    // Add/change reaction
                    await api.post('/posts/react', {
                        slug,
                        title,
                        type
                    });
                }
            } catch {
                // Revert on error
                setStats(previousStats);
                toast.error('Failed to update reaction');
            }
        },
        [user, stats, slug, title]
    );

    if (loading) {
        return (
            <Container>
                <ReactionButton disabled>
                    <ThumbsUpIcon />
                    <ReactionCount>-</ReactionCount>
                </ReactionButton>
                <ReactionButton disabled>
                    <ThumbsDownIcon />
                    <ReactionCount>-</ReactionCount>
                </ReactionButton>
            </Container>
        );
    }

    const hasUserLiked = stats?.userReaction === 'like';
    const hasUserDisliked = stats?.userReaction === 'dislike';

    return (
        <Container>
            <ReactionButton
                $isActive={hasUserLiked}
                onClick={() => handleReaction('like')}
                disabled={!user}
                title={
                    !user
                        ? 'Log in to like'
                        : hasUserLiked
                          ? 'Remove like'
                          : 'Like this post'
                }
                aria-label={hasUserLiked ? 'Remove like' : 'Like this post'}
                aria-pressed={hasUserLiked}
            >
                <ThumbsUpIcon />
                <ReactionCount>{stats?.likes || 0}</ReactionCount>
            </ReactionButton>

            <ReactionButton
                $isActive={hasUserDisliked}
                onClick={() => handleReaction('dislike')}
                disabled={!user}
                title={
                    !user
                        ? 'Log in to dislike'
                        : hasUserDisliked
                          ? 'Remove dislike'
                          : 'Dislike this post'
                }
                aria-label={
                    hasUserDisliked ? 'Remove dislike' : 'Dislike this post'
                }
                aria-pressed={hasUserDisliked}
            >
                <ThumbsDownIcon />
                <ReactionCount>{stats?.dislikes || 0}</ReactionCount>
            </ReactionButton>
        </Container>
    );
}

// ============================================================================
// SVG ICONS
// ============================================================================

function ThumbsUpIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
    );
}

function ThumbsDownIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 14V2" />
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
        </svg>
    );
}
