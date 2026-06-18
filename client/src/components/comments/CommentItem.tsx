'use client';
import React, { useState } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import type {
  CommentData,
  CommentHistoryEntry,
  RepliesResponse
} from '@derecksnotes/shared';
import { CommentForm } from './CommentForm';
import { renderCommentMarkdown } from './markdown';
import {
  CommentCard,
  CommentHeader,
  CommentAuthor,
  CommentTimestamp,
  EditedBadge,
  PendingBadge,
  DeletedMessage,
  CommentBody,
  CommentActions,
  ActionButton,
  ReplyLink,
  CommentTextarea,
  CommentSubmitButton,
  HistoryModal,
  HistoryContent,
  HistoryEntry,
  HistoryMeta,
  HistoryCloseButton,
  LoadMoreReplies
} from './CommentStyles';

interface CommentItemProps {
  comment: CommentData;
  slug: string;
  title: string;
  onRefresh: () => void;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

const renderMarkdown = renderCommentMarkdown;

export function CommentItem({
  comment,
  slug,
  title,
  onRefresh
}: CommentItemProps) {
  const { user } = useAuth();
  const [showReply, setShowReply] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [history, setHistory] = useState<CommentHistoryEntry[]>([]);
  const [reactions, setReactions] = useState(comment.reactions);
  const [replies, setReplies] = useState(comment.replies);
  const [hasMoreReplies, setHasMoreReplies] = useState(comment.hasMoreReplies);
  const [replyPage, setReplyPage] = useState(1);
  const [loadingReplies, setLoadingReplies] = useState(false);

  // Both sides can be undefined (anonymous viewer + tombstoned comment) —
  // the loose `===` would treat that as ownership and surface Edit/Delete
  // to a logged-out viewer if either action ever became un-gated. Anchor
  // on `!!user` so the predicate can never go truthy on the undefined
  // path.
  const isOwner = !!user && !!comment.user && user.id === comment.user.id;

  const handleReaction = async (type: 'like' | 'dislike') => {
    if (!user) return;
    try {
      const result = await api.post<{
        likes: number;
        dislikes: number;
        userReaction: 'like' | 'dislike' | null;
      }>(`/comments/${comment.id}/reactions`, { type });
      setReactions(result);
    } catch {
      toast.error('Failed to react');
    }
  };

  const handleEdit = async () => {
    if (!editContent.trim()) return;
    setEditSubmitting(true);
    try {
      await api.patch(`/comments/${comment.id}`, {
        content: editContent.trim()
      });
      setEditing(false);
      onRefresh();
    } catch {
      toast.error('Failed to save edit');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${comment.id}`);
      onRefresh();
    } catch {
      toast.error('Failed to delete comment');
    }
  };

  const handleReport = async () => {
    const reason = prompt(
      'Why are you reporting this comment? (spam / harassment / misinformation / other)',
      'spam'
    );
    if (!reason) return;
    const normalised = [
      'spam',
      'harassment',
      'misinformation',
      'other'
    ].includes(reason)
      ? reason
      : 'other';
    const details = prompt(
      'Optional: add a brief note for the moderators.',
      ''
    );
    try {
      await api.post('/reports', {
        targetType: 'comment',
        targetId: comment.id,
        reason: normalised,
        details: details || undefined
      });
      toast.success('Reported — thanks. A moderator will take a look.');
    } catch {
      toast.error('Failed to submit report');
    }
  };

  const handleShowHistory = async () => {
    setHistoryLoading(true);
    try {
      const data = await api.get<CommentHistoryEntry[]>(
        `/comments/${comment.id}/history`
      );
      setHistory(data);
      setShowHistory(true);
    } catch {
      toast.error('Failed to load edit history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleLoadMoreReplies = async () => {
    setLoadingReplies(true);
    try {
      const nextPage = replyPage + 1;
      const data = await api.get<RepliesResponse>(
        `/comments/${comment.id}/replies?page=${nextPage}&limit=5`
      );
      setReplies((prev) => [...prev, ...data.replies]);
      setHasMoreReplies(data.hasMore);
      setReplyPage(nextPage);
    } catch {
      toast.error('Failed to load replies');
    } finally {
      setLoadingReplies(false);
    }
  };

  return (
    <>
      <CommentCard $depth={comment.depth}>
        <CommentHeader>
          {comment.isDeleted ? (
            <CommentTimestamp>[deleted]</CommentTimestamp>
          ) : (
            <>
              <CommentAuthor href={`/profile/${comment.user?.username}`}>
                {comment.user?.displayName ||
                  comment.user?.username ||
                  'Unknown'}
              </CommentAuthor>
              <CommentTimestamp>
                {formatDate(comment.createdAt)}
              </CommentTimestamp>
              {comment.editedAt && (
                <EditedBadge onClick={handleShowHistory}>
                  {historyLoading ? '(loading...)' : '(edited)'}
                </EditedBadge>
              )}
              {!comment.approved && (
                <PendingBadge title="Only you can see this comment until a moderator approves it. New accounts are queued by default; trusted users post directly.">
                  pending review — only visible to you
                </PendingBadge>
              )}
            </>
          )}
        </CommentHeader>

        {comment.isDeleted ? (
          <DeletedMessage>[This comment has been deleted]</DeletedMessage>
        ) : editing ? (
          <div>
            <CommentTextarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              disabled={editSubmitting}
            />
            <div
              style={{
                display: 'flex',
                gap: '0.5rem',
                marginTop: '0.25rem'
              }}
            >
              <CommentSubmitButton
                onClick={handleEdit}
                disabled={editSubmitting}
              >
                {editSubmitting ? 'Saving...' : 'Save'}
              </CommentSubmitButton>
              <CommentSubmitButton
                onClick={() => {
                  setEditing(false);
                  setEditContent(comment.content);
                }}
                style={{
                  background: 'transparent',
                  color: '#999',
                  border: '1px solid #ccc'
                }}
              >
                Cancel
              </CommentSubmitButton>
            </div>
          </div>
        ) : (
          <CommentBody
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(comment.content)
            }}
          />
        )}

        {!comment.isDeleted && (
          <CommentActions>
            <ActionButton
              $active={reactions.userReaction === 'like'}
              onClick={() => handleReaction('like')}
              title="Like"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={
                  reactions.userReaction === 'like' ? 'currentColor' : 'none'
                }
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
              </svg>
              {reactions.likes > 0 && reactions.likes}
            </ActionButton>
            <ActionButton
              $active={reactions.userReaction === 'dislike'}
              onClick={() => handleReaction('dislike')}
              title="Dislike"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill={
                  reactions.userReaction === 'dislike' ? 'currentColor' : 'none'
                }
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
              </svg>
              {reactions.dislikes > 0 && reactions.dislikes}
            </ActionButton>
            {user && comment.depth < 5 && (
              <ReplyLink onClick={() => setShowReply(!showReply)}>
                Reply
              </ReplyLink>
            )}
            {isOwner && !editing && (
              <>
                <ReplyLink onClick={() => setEditing(true)}>Edit</ReplyLink>
                <ReplyLink onClick={handleDelete}>Delete</ReplyLink>
              </>
            )}
            {user && !isOwner && (
              <ReplyLink onClick={handleReport}>Report</ReplyLink>
            )}
          </CommentActions>
        )}

        {showReply && (
          <div style={{ marginTop: '0.25rem' }}>
            <CommentForm
              slug={slug}
              title={title}
              parentId={comment.id}
              onSubmitted={() => {
                setShowReply(false);
                onRefresh();
              }}
              onCancel={() => setShowReply(false)}
              placeholder="Write a reply..."
            />
          </div>
        )}

        {replies.map((reply) => (
          <CommentItem
            key={reply.id}
            comment={reply}
            slug={slug}
            title={title}
            onRefresh={onRefresh}
          />
        ))}

        {hasMoreReplies && (
          <LoadMoreReplies
            onClick={handleLoadMoreReplies}
            disabled={loadingReplies}
          >
            {loadingReplies
              ? 'Loading...'
              : `Show more replies (${Math.max(0, comment.replyCount - replies.length)} remaining)`}
          </LoadMoreReplies>
        )}
      </CommentCard>

      {showHistory && (
        <HistoryModal onClick={() => setShowHistory(false)}>
          <HistoryContent onClick={(e) => e.stopPropagation()}>
            <HistoryCloseButton onClick={() => setShowHistory(false)}>
              &times;
            </HistoryCloseButton>
            <h3 style={{ marginTop: 0 }}>Edit History</h3>
            {history.map((entry, i) => (
              <HistoryEntry key={entry.id}>
                <HistoryMeta>
                  <span>
                    {i === 0
                      ? 'Current version'
                      : `Version ${history.length - i}`}
                  </span>
                  <span>{formatDate(entry.editedAt)}</span>
                </HistoryMeta>
                <CommentBody
                  dangerouslySetInnerHTML={{
                    __html: renderMarkdown(entry.content)
                  }}
                />
              </HistoryEntry>
            ))}
          </HistoryContent>
        </HistoryModal>
      )}
    </>
  );
}
