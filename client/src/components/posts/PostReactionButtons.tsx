'use client';
import React, { useState, useEffect } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import styled from 'styled-components';

interface PostReactionButtonsProps {
  slug: string;
  title: string;
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.container.spacing.medium};
  padding: ${(p) => p.theme.container.spacing.small} 0;
`;

const ReactionBtn = styled.button<{ $active?: boolean }>`
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: 1px solid
    ${(p) =>
      p.$active
        ? p.theme.text.colour.header()
        : p.theme.container.border.colour.primary()};
  border-radius: ${(p) => p.theme.container.border.radius};
  padding: 4px 10px;
  cursor: pointer;
  font-size: ${(p) => p.theme.text.size.small};
  font-family: ${(p) => p.theme.text.font.roboto};
  color: ${(p) =>
    p.$active
      ? p.theme.text.colour.header()
      : p.theme.text.colour.light_grey()};

  &:hover {
    border-color: ${(p) => p.theme.text.colour.header()};
    color: ${(p) => p.theme.text.colour.header()};
  }
`;

interface Stats {
  likes: number;
  dislikes: number;
  userReaction: 'like' | 'dislike' | null;
}

export function PostReactionButtons({ slug, title }: PostReactionButtonsProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    likes: 0,
    dislikes: 0,
    userReaction: null
  });

  useEffect(() => {
    api
      .get<Stats>(`/posts/stats?slug=${encodeURIComponent(slug)}`)
      .then(setStats)
      .catch(() => {});
  }, [slug]);

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) return;
    try {
      const result = await api.post<Stats>('/posts/react', {
        slug,
        title,
        type
      });
      setStats(result);
    } catch {
      /* ignore */
    }
  };

  return (
    <Container>
      <ReactionBtn
        $active={stats.userReaction === 'like'}
        onClick={() => handleReaction('like')}
        title={user ? 'Like' : 'Log in to like'}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={stats.userReaction === 'like' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
        </svg>
        {stats.likes}
      </ReactionBtn>
      <ReactionBtn
        $active={stats.userReaction === 'dislike'}
        onClick={() => handleReaction('dislike')}
        title={user ? 'Dislike' : 'Log in to dislike'}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={stats.userReaction === 'dislike' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
        </svg>
        {stats.dislikes}
      </ReactionBtn>
    </Container>
  );
}
