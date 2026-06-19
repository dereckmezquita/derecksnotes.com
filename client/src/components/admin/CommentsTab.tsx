'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import styled from 'styled-components';
import { api } from '@/utils/api';
import {
  Card,
  CardTitle,
  Button,
  ButtonRow,
  EmptyState
} from '@/components/ui/PageStyles';
import {
  DataTable,
  DataTableWrapper,
  DataTableCheckbox,
  SelectAllCheckbox
} from '@/components/ui/DataTable';
import { BulkActionBar } from '@/components/ui/BulkActionBar';
import { useRangeSelect } from '@/components/ui/useRangeSelect';
import type {
  AdminPendingComment,
  PaginatedResponse
} from '@derecksnotes/shared';
import { AdminBadge } from './_shared/styles';

const InlineActions = styled.div`
  display: flex;
  gap: 4px;
  flex-wrap: nowrap;
  white-space: nowrap;
`;

const MiniButton = styled.button<{ $variant?: 'approve' | 'reject' }>`
  font-family: ${(p) => p.theme.text.font.roboto};
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 3px;
  cursor: pointer;
  border: 1px solid ${(p) => (p.$variant === 'reject' ? '#c62828' : '#0F9960')};
  background: ${(p) =>
    p.$variant === 'reject' ? 'rgba(198,40,40,0.08)' : 'rgba(15,153,96,0.08)'};
  color: ${(p) => (p.$variant === 'reject' ? '#c62828' : '#0F9960')};
  &:hover {
    background: ${(p) =>
      p.$variant === 'reject'
        ? 'rgba(198,40,40,0.18)'
        : 'rgba(15,153,96,0.18)'};
  }
`;

const Sparkline = styled.span`
  font-family: ${(p) => p.theme.text.font.roboto};
  white-space: nowrap;
`;

/**
 * Per-author flavour pill. Order matters: explicit-group labels first so
 * an admin/mod with an irregular history still reads as their role rather
 * than "has rejections".
 */
function reputationFlavour(c: AdminPendingComment): {
  label: string;
  colour: string;
} {
  if (c.authorGroups.includes('admin'))
    return { label: 'admin', colour: '#c62828' };
  if (c.authorGroups.includes('moderator'))
    return { label: 'moderator', colour: '#106BA3' };
  if (c.authorGroups.includes('trusted'))
    return { label: 'trusted', colour: '#0F9960' };
  if (c.authorAccountAgeDays < 1)
    return { label: 'brand new', colour: '#c62828' };
  if (c.authorTotalComments <= 1)
    return { label: 'first comment', colour: '#996f0f' };
  if (
    c.authorRejectedCount > 0 &&
    c.authorRejectedCount >= c.authorApprovedCount
  )
    return { label: 'has rejections', colour: '#c62828' };
  if (c.authorApprovedCount >= 5 && c.authorRejectedCount === 0)
    return { label: 'clean history', colour: '#0F9960' };
  return { label: 'unranked', colour: '#999' };
}

export function CommentsTab() {
  const [comments, setComments] = useState<AdminPendingComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const sel = useRangeSelect(comments);

  const load = async (p: number) => {
    const data = await api.get<PaginatedResponse<AdminPendingComment>>(
      `/admin/comments/pending?page=${p}&limit=20`
    );
    setComments(p === 1 ? data.data : [...comments, ...data.data]);
    setHasMore(data.hasMore);
    setPage(p);
    sel.resetAnchor();
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeFromList = (ids: string[]) => {
    setComments((prev) => prev.filter((c) => !ids.includes(c.id)));
    sel.setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) next.delete(id);
      return next;
    });
  };

  const approve = async (id: string) => {
    try {
      await api.post(`/admin/comments/${id}/approve`);
      removeFromList([id]);
      toast.success('Comment approved');
    } catch {
      toast.error('Failed to approve');
    }
  };

  const reject = async (id: string) => {
    try {
      await api.post(`/admin/comments/${id}/reject`);
      removeFromList([id]);
      toast.success('Comment rejected');
    } catch {
      toast.error('Failed to reject');
    }
  };

  const bulkApprove = async () => {
    if (sel.count === 0) return;
    if (!confirm(`Approve ${sel.count} comment(s)?`)) return;
    const ids = Array.from(sel.selected);
    try {
      await api.post('/admin/comments/bulk-approve', { commentIds: ids });
      removeFromList(ids);
      toast.success(`${ids.length} comment(s) approved`);
    } catch {
      toast.error('Failed to approve comments');
    }
  };

  const bulkReject = async () => {
    if (sel.count === 0) return;
    if (!confirm(`Reject ${sel.count} comment(s)?`)) return;
    const ids = Array.from(sel.selected);
    try {
      await api.post('/admin/comments/bulk-reject', { commentIds: ids });
      removeFromList(ids);
      toast.success(`${ids.length} comment(s) rejected`);
    } catch {
      toast.error('Failed to reject comments');
    }
  };

  return (
    <Card>
      <CardTitle>Pending Comments</CardTitle>
      <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.5rem 0' }}>
        Unapproved comments are hidden from everyone except their author until
        you approve them. Tip: click a checkbox, then shift-click another row to
        (de)select the whole range.
      </p>
      <BulkActionBar count={sel.count} onClear={sel.clear}>
        <Button onClick={bulkApprove}>Approve ({sel.count})</Button>
        <Button $variant="danger" onClick={bulkReject}>
          Reject ({sel.count})
        </Button>
      </BulkActionBar>
      {comments.length === 0 ? (
        <EmptyState>No pending comments.</EmptyState>
      ) : (
        <DataTableWrapper>
          <DataTable>
            <thead>
              <tr>
                <th style={{ width: 28 }}>
                  <SelectAllCheckbox
                    checked={sel.isAllSelected}
                    indeterminate={sel.isIndeterminate}
                    onChange={sel.toggleAll}
                  />
                </th>
                <th>Author</th>
                <th>Account</th>
                <th>History</th>
                <th>Karma</th>
                <th>Comment</th>
                <th>Posted</th>
                <th style={{ width: 130 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((c, idx) => {
                const flavour = reputationFlavour(c);
                const isSel = sel.isSelected(c.id);
                return (
                  <tr key={c.id} className={isSel ? 'selected' : ''}>
                    <td>
                      <DataTableCheckbox
                        checked={isSel}
                        onChange={() => {
                          /* handled in onClick to capture shiftKey */
                        }}
                        onClick={(e) => sel.onCheckboxClick(c.id, idx, e)}
                      />
                    </td>
                    <td>
                      <a
                        href={`/profile/${c.user?.username || ''}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {c.user?.username || '(unknown)'}
                      </a>
                      <div>
                        <AdminBadge $color={flavour.colour}>
                          {flavour.label}
                        </AdminBadge>
                      </div>
                    </td>
                    <td>
                      <div className="meta">
                        {c.authorAccountAgeDays === 0
                          ? '<1 day'
                          : `${c.authorAccountAgeDays} day${c.authorAccountAgeDays === 1 ? '' : 's'}`}
                      </div>
                    </td>
                    <td>
                      <Sparkline>
                        <span style={{ color: '#0F9960' }}>
                          ✓ {c.authorApprovedCount}
                        </span>{' '}
                        <span style={{ color: '#c62828' }}>
                          ✗ {c.authorRejectedCount}
                        </span>{' '}
                        <span style={{ color: '#996f0f' }}>
                          … {c.authorPendingCount}
                        </span>
                      </Sparkline>
                      <div className="meta">{c.authorTotalComments} total</div>
                    </td>
                    <td>
                      <Sparkline>
                        <span style={{ color: '#0F9960' }}>
                          ▲ {c.authorTotalLikesReceived}
                        </span>{' '}
                        <span style={{ color: '#c62828' }}>
                          ▼ {c.authorTotalDislikesReceived}
                        </span>
                      </Sparkline>
                      <div className="meta">
                        net{' '}
                        {c.authorTotalLikesReceived -
                          c.authorTotalDislikesReceived}
                      </div>
                    </td>
                    <td>
                      <div className="content-preview">
                        {c.content.length > 200
                          ? c.content.substring(0, 200) + '…'
                          : c.content}
                      </div>
                      <div className="meta">
                        on{' '}
                        <a href={`/${c.slug}`} target="_blank" rel="noreferrer">
                          {c.postTitle || c.slug}
                        </a>{' '}
                        · this comment: ▲ {c.commentLikes} ▼ {c.commentDislikes}
                      </div>
                    </td>
                    <td>
                      <div className="meta">
                        {new Date(c.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td>
                      <InlineActions>
                        <MiniButton onClick={() => approve(c.id)}>
                          Approve
                        </MiniButton>
                        <MiniButton
                          $variant="reject"
                          onClick={() => reject(c.id)}
                        >
                          Reject
                        </MiniButton>
                      </InlineActions>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        </DataTableWrapper>
      )}
      {hasMore && (
        <ButtonRow>
          <Button $variant="secondary" onClick={() => load(page + 1)}>
            Load More
          </Button>
        </ButtonRow>
      )}
    </Card>
  );
}
