'use client';
import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface BookmarkButtonProps {
  slug: string;
  title: string;
}

const ToggleButton = styled.button<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: 0.85rem;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid
    ${(p) => (p.$on ? '#c87137' : p.theme.container.border.colour.primary())};
  background: ${(p) => (p.$on ? 'rgba(200, 113, 55, 0.12)' : 'transparent')};
  color: ${(p) => (p.$on ? '#c87137' : p.theme.text.colour.primary())};
  cursor: pointer;
  &:hover {
    background: ${(p) =>
      p.$on ? 'rgba(200, 113, 55, 0.18)' : 'rgba(0, 0, 0, 0.04)'};
  }
  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

export function BookmarkButton({ slug, title }: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);

  const refresh = useCallback(async () => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    try {
      const data = await api.get<{ bookmarked: boolean }>(
        `/posts/bookmark-status?slug=${encodeURIComponent(slug)}`,
        { silent: true }
      );
      setBookmarked(data.bookmarked);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!isAuthenticated()) return null;

  const toggle = async () => {
    if (pending) return;
    setPending(true);
    const next = !bookmarked;
    setBookmarked(next); // optimistic
    try {
      if (next) {
        await api.post('/posts/bookmark', { slug, title });
        toast.success('Bookmarked');
      } else {
        await api.delete('/posts/bookmark', { slug });
        toast.success('Removed from bookmarks');
      }
    } catch {
      setBookmarked(!next); // revert
    } finally {
      setPending(false);
    }
  };

  return (
    <ToggleButton
      type="button"
      onClick={toggle}
      disabled={loading || pending}
      $on={bookmarked}
      title={bookmarked ? 'Remove bookmark' : 'Save for later'}
    >
      {bookmarked ? <FaBookmark /> : <FaRegBookmark />}
      {bookmarked ? 'Saved' : 'Save'}
    </ToggleButton>
  );
}
