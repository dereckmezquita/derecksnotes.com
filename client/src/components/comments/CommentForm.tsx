'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import styled from 'styled-components';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { linkifyMentions } from '@derecksnotes/shared';
import {
  CommentFormWrapper,
  CommentTextarea,
  CommentSubmitButton,
  LoginPrompt
} from './CommentStyles';

const TabRow = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 4px;
`;

const FormTab = styled.button<{ $active: boolean }>`
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: 0.75rem;
  padding: 3px 10px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid
    ${(p) => (p.$active ? p.theme.text.colour.header() : 'transparent')};
  background: ${(p) =>
    p.$active ? `${p.theme.text.colour.header()}10` : 'transparent'};
  color: ${(p) => p.theme.text.colour.primary()};
`;

const PreviewPane = styled.div`
  min-height: 80px;
  padding: 6px 8px;
  border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  border-radius: 4px;
  background: ${(p) => p.theme.container.background.colour.card()};
  font-size: 0.9rem;
  line-height: 1.5;
`;

function renderPreview(content: string): string {
  try {
    const withMentions = linkifyMentions(content);
    const raw = marked.parse(withMentions);
    const html = typeof raw === 'string' ? raw : content;
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        'p',
        'br',
        'strong',
        'em',
        'code',
        'pre',
        'blockquote',
        'ul',
        'ol',
        'li',
        'a',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'hr',
        'del'
      ],
      ALLOWED_ATTR: ['href', 'title', 'target', 'rel']
    });
  } catch {
    return DOMPurify.sanitize(content, { ALLOWED_TAGS: [] });
  }
}

interface CommentFormProps {
  slug: string;
  title: string;
  parentId?: string;
  onSubmitted: () => void;
  onCancel?: () => void;
  placeholder?: string;
}

interface UserMatch {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
}

// Mention autocomplete: triggered by `@` + 1–30 chars at the caret. The
// dropdown is positioned beneath the textarea (not at the caret) to avoid
// having to measure character offsets in a contenteditable-style way —
// that's a well-known source of bugs across browsers.
const MENTION_TRIGGER = /@([a-zA-Z0-9_-]{1,30})$/;

const MentionContainer = styled.div`
  position: relative;
`;

const SuggestionList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  margin: 4px 0 0 0;
  padding: 0;
  list-style: none;
  z-index: 100;
  background: ${(p) => p.theme.container.background.colour.card()};
  border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  border-radius: 4px;
  min-width: 200px;
  max-width: 320px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: 0.85rem;
  overflow: hidden;
`;

const SuggestionItem = styled.li<{ $active: boolean }>`
  padding: 6px 10px;
  cursor: pointer;
  background: ${(p) =>
    p.$active ? `${p.theme.text.colour.header()}18` : 'transparent'};
  &:hover {
    background: ${(p) => p.theme.text.colour.header()}10;
  }
`;

const SuggestionMeta = styled.span`
  color: ${(p) => p.theme.text.colour.light_grey()};
  font-size: 0.75rem;
  margin-left: 6px;
`;

export function CommentForm({
  slug,
  title,
  parentId,
  onSubmitted,
  onCancel,
  placeholder = 'Write a comment... (markdown supported, @-mention users)'
}: CommentFormProps) {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'write' | 'preview'>('write');
  const previewHtml = useMemo(() => renderPreview(content), [content]);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<UserMatch[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fetchSeq = useRef(0);

  // Debounced mention query → /users/search
  useEffect(() => {
    if (mentionStart === null) {
      setSuggestions([]);
      return;
    }
    const q = content
      .slice(
        mentionStart + 1,
        textareaRef.current?.selectionStart ?? content.length
      )
      .trim();
    if (q.length === 0) {
      setSuggestions([]);
      return;
    }
    const seq = ++fetchSeq.current;
    const t = setTimeout(async () => {
      try {
        const data = await api.get<{ data: UserMatch[] }>(
          `/users/search?q=${encodeURIComponent(q)}`,
          { silent: true }
        );
        if (seq !== fetchSeq.current) return; // stale response
        setSuggestions(data.data);
        setActiveIdx(0);
      } catch {
        setSuggestions([]);
      }
    }, 120);
    return () => clearTimeout(t);
    // content is the dependency that drives requery; reading caret from ref
    // each tick is intentional.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content, mentionStart]);

  if (!user) {
    return <LoginPrompt>Log in to leave a comment.</LoginPrompt>;
  }

  function recomputeMentionMode(text: string, caret: number) {
    // Look backwards from caret to nearest @ that starts a mention token.
    const slice = text.slice(0, caret);
    const m = slice.match(MENTION_TRIGGER);
    if (!m || m.index === undefined) {
      setMentionStart(null);
      return;
    }
    const atIdx = m.index;
    // Must be at start of input or preceded by a non-word, non-slash char
    // — matches the server-side MENTION_REGEX boundary check.
    if (atIdx > 0) {
      const prev = slice[atIdx - 1];
      if (prev && /[\w/]/.test(prev)) {
        setMentionStart(null);
        return;
      }
    }
    setMentionStart(atIdx);
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    setContent(next);
    recomputeMentionMode(next, e.target.selectionStart);
  };

  const insertSuggestion = (idx: number) => {
    if (mentionStart === null) return;
    const choice = suggestions[idx];
    if (!choice) return;
    const ta = textareaRef.current;
    const caret = ta?.selectionStart ?? content.length;
    const before = content.slice(0, mentionStart);
    const after = content.slice(caret);
    const inserted = `@${choice.username} `;
    const nextContent = before + inserted + after;
    setContent(nextContent);
    setMentionStart(null);
    setSuggestions([]);
    // Restore caret after the inserted mention.
    requestAnimationFrame(() => {
      if (!ta) return;
      const pos = before.length + inserted.length;
      ta.focus();
      ta.setSelectionRange(pos, pos);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(suggestions.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      insertSuggestion(activeIdx);
    } else if (e.key === 'Escape') {
      setMentionStart(null);
      setSuggestions([]);
    }
  };

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
      setMentionStart(null);
      setSuggestions([]);
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
        <TabRow>
          <FormTab
            type="button"
            $active={mode === 'write'}
            onClick={() => setMode('write')}
          >
            Write
          </FormTab>
          <FormTab
            type="button"
            $active={mode === 'preview'}
            onClick={() => setMode('preview')}
          >
            Preview
          </FormTab>
        </TabRow>
        <MentionContainer>
          {mode === 'write' ? (
            <CommentTextarea
              ref={textareaRef}
              value={content}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              maxLength={10000}
              disabled={submitting}
            />
          ) : (
            <PreviewPane
              dangerouslySetInnerHTML={{
                __html: content.trim()
                  ? previewHtml
                  : '<em>Nothing to preview yet.</em>'
              }}
            />
          )}
          {suggestions.length > 0 && (
            <SuggestionList role="listbox">
              {suggestions.map((s, i) => (
                <SuggestionItem
                  key={s.id}
                  $active={i === activeIdx}
                  role="option"
                  aria-selected={i === activeIdx}
                  onMouseDown={(ev) => {
                    // mousedown so we beat blur on the textarea
                    ev.preventDefault();
                    insertSuggestion(i);
                  }}
                  onMouseEnter={() => setActiveIdx(i)}
                >
                  @{s.username}
                  {s.displayName && (
                    <SuggestionMeta>{s.displayName}</SuggestionMeta>
                  )}
                </SuggestionItem>
              ))}
            </SuggestionList>
          )}
        </MentionContainer>
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
