'use client';
import React, { useState } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import {
  CommentFormWrapper,
  CommentTextarea,
  CommentSubmitButton,
  LoginPrompt
} from './CommentStyles';

interface CommentFormProps {
  slug: string;
  title: string;
  parentId?: string;
  onSubmitted: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

export function CommentForm({
  slug,
  title,
  parentId,
  onSubmitted,
  onCancel,
  placeholder = 'Write a comment... (markdown supported)'
}: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user) {
    return <LoginPrompt>Log in to leave a comment.</LoginPrompt>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      await api.post('/comments', {
        slug,
        title,
        content: content.trim(),
        parentId
      });
      setContent('');
      onSubmitted();
    } catch (err: any) {
      setError(err.data?.error || 'Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CommentFormWrapper>
      <form onSubmit={handleSubmit}>
        <CommentTextarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          maxLength={10000}
          disabled={submitting}
        />
        {error && (
          <p
            style={{
              color: '#c62828',
              fontSize: '0.85rem',
              margin: '0.25rem 0'
            }}
          >
            {error}
          </p>
        )}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <CommentSubmitButton
            type="submit"
            disabled={submitting || !content.trim()}
          >
            {submitting ? 'Posting...' : parentId ? 'Reply' : 'Post Comment'}
          </CommentSubmitButton>
          {onCancel && (
            <CommentSubmitButton
              type="button"
              onClick={onCancel}
              style={{
                background: 'transparent',
                color: '#999',
                border: '1px solid #ccc'
              }}
            >
              Cancel
            </CommentSubmitButton>
          )}
        </div>
      </form>
    </CommentFormWrapper>
  );
}
