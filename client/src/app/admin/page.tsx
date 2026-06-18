'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';
import { toast } from 'sonner';
import type {
  DashboardResponse,
  AdminPendingComment,
  AdminUser,
  AuditLogEntry,
  AnalyticsData,
  NotificationStats,
  PaginatedResponse
} from '@derecksnotes/shared';
import {
  PageContainer,
  PageTitle,
  Card,
  CardTitle,
  Button,
  ButtonRow,
  InfoRow,
  InfoLabel,
  InfoValue,
  EmptyState,
  TabBar,
  Tab
} from '@/components/ui/PageStyles';
import {
  DataTable,
  DataTableWrapper,
  DataTableCheckbox,
  SelectAllCheckbox
} from '@/components/ui/DataTable';
import { BulkActionBar } from '@/components/ui/BulkActionBar';
import { useRangeSelect } from '@/components/ui/useRangeSelect';
import styled from 'styled-components';

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: ${(p) => p.theme.container.spacing.small};
  margin-bottom: ${(p) => p.theme.container.spacing.medium};
`;

const StatCard = styled.div`
  text-align: center;
  padding: ${(p) => p.theme.container.spacing.medium};
  border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  border-radius: ${(p) => p.theme.container.border.radius};
  background: ${(p) => p.theme.container.background.colour.card()};
`;

const StatNumber = styled.div`
  font-size: ${(p) => p.theme.text.size.xlarge};
  font-weight: ${(p) => p.theme.text.weight.bold};
  color: ${(p) => p.theme.text.colour.header()};
`;

const StatLabel = styled.div`
  font-size: ${(p) => p.theme.text.size.small};
  color: ${(p) => p.theme.text.colour.light_grey()};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const Badge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 1px 6px;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${(p) => p.$color}20;
  color: ${(p) => p.$color};
  margin-left: 4px;
`;

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3px;
  margin: ${(p) => p.theme.container.spacing.small} 0;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.container.spacing.small};
  font-size: 0.75rem;
  font-family: ${(p) => p.theme.text.font.roboto};
`;

const BarLabel = styled.span`
  width: 60px;
  text-align: right;
  color: ${(p) => p.theme.text.colour.light_grey()};
  flex-shrink: 0;
`;

const Bar = styled.div<{ $width: number }>`
  height: 14px;
  width: ${(p) => Math.max(2, p.$width)}%;
  background: ${(p) => p.theme.text.colour.header()};
  border-radius: 1px;
  opacity: 0.7;
  transition: width 0.3s ease;
`;

const BarValue = styled.span`
  color: ${(p) => p.theme.text.colour.primary()};
  font-size: 0.7rem;
  min-width: 20px;
`;

const RankList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const RankRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${(p) => p.theme.container.spacing.small};
  padding: 4px 0;
  font-size: ${(p) => p.theme.text.size.small};
  border-bottom: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  &:last-child {
    border-bottom: none;
  }
`;

const RankNumber = styled.span`
  font-weight: ${(p) => p.theme.text.weight.bold};
  color: ${(p) => p.theme.text.colour.header()};
  width: 20px;
`;

type ActiveTab =
  | 'overview'
  | 'comments'
  | 'users'
  | 'audit'
  | 'analytics'
  | 'notifications';

export default function AdminPage() {
  const { user, isAdmin } = useAuth();
  const [tab, setTab] = useState<ActiveTab>('overview');

  if (!user || !isAdmin()) {
    return (
      <PageContainer>
        <EmptyState>Access denied. Admin privileges required.</EmptyState>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>Admin Dashboard</PageTitle>
      <TabBar>
        <Tab $active={tab === 'overview'} onClick={() => setTab('overview')}>
          Overview
        </Tab>
        <Tab $active={tab === 'comments'} onClick={() => setTab('comments')}>
          Comments
        </Tab>
        <Tab $active={tab === 'users'} onClick={() => setTab('users')}>
          Users
        </Tab>
        <Tab $active={tab === 'audit'} onClick={() => setTab('audit')}>
          Audit Log
        </Tab>
        <Tab $active={tab === 'analytics'} onClick={() => setTab('analytics')}>
          Analytics
        </Tab>
        <Tab
          $active={tab === 'notifications'}
          onClick={() => setTab('notifications')}
        >
          Notifications
        </Tab>
      </TabBar>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'comments' && <CommentsTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'audit' && <AuditTab />}
      {tab === 'analytics' && <AnalyticsTab />}
      {tab === 'notifications' && <NotificationsTab />}
    </PageContainer>
  );
}

// ============================================================================
// Notifications (admin: send / broadcast / stats)
// ============================================================================

function NotificationsTab() {
  const [stats, setStats] = useState<NotificationStats | null>(null);
  const [sendUsername, setSendUsername] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [broadcasting, setBroadcasting] = useState(false);

  const reload = async () => {
    try {
      const data = await api.get<NotificationStats>(
        '/admin/notifications/stats'
      );
      setStats(data);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const handleSend = async () => {
    if (!sendUsername.trim() || !sendMessage.trim()) {
      toast.error('Username and message required');
      return;
    }
    setSending(true);
    try {
      await api.post('/admin/notifications/send', {
        username: sendUsername.trim(),
        message: sendMessage.trim()
      });
      toast.success(`Notification sent to @${sendUsername.trim()}`);
      setSendUsername('');
      setSendMessage('');
      reload();
    } catch {
      // toast handled by api util for 4xx/5xx
    } finally {
      setSending(false);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) {
      toast.error('Message required');
      return;
    }
    if (
      !confirm(
        `Broadcast this message to every active user? It cannot be unsent.`
      )
    )
      return;
    setBroadcasting(true);
    try {
      const result = await api.post<{ success: boolean; recipients: number }>(
        '/admin/notifications/broadcast',
        { message: broadcastMessage.trim() }
      );
      toast.success(`Broadcast sent to ${result.recipients} users`);
      setBroadcastMessage('');
      reload();
    } catch {
      // toast handled by api util
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <>
      <Card>
        <CardTitle>Volume</CardTitle>
        {!stats ? (
          <EmptyState>Loading…</EmptyState>
        ) : (
          <>
            <StatGrid>
              <StatCard>
                <StatNumber>{stats.total}</StatNumber>
                <StatLabel>Total</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.unread}</StatNumber>
                <StatLabel>Unread</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{stats.last7Days}</StatNumber>
                <StatLabel>Last 7 days</StatLabel>
              </StatCard>
            </StatGrid>
            {stats.perType.length > 0 && (
              <RankList>
                {stats.perType.map((t) => (
                  <RankRow key={t.type}>
                    <RankNumber>·</RankNumber>
                    <div style={{ flex: 1 }}>{t.type}</div>
                    <BarValue>{t.count}</BarValue>
                  </RankRow>
                ))}
              </RankList>
            )}
          </>
        )}
      </Card>
      <Card>
        <CardTitle>Send to user</CardTitle>
        <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.5rem' }}>
          Delivers a notification with type <code>admin.message</code> to the
          named user. Cannot be unsent.
        </p>
        <input
          type="text"
          placeholder="username"
          value={sendUsername}
          onChange={(e) => setSendUsername(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 8px',
            marginBottom: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: 3,
            fontFamily: 'inherit'
          }}
        />
        <textarea
          placeholder="message"
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
          rows={3}
          maxLength={1000}
          style={{
            width: '100%',
            padding: '6px 8px',
            marginBottom: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: 3,
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
        <ButtonRow>
          <Button onClick={handleSend} disabled={sending}>
            {sending ? 'Sending…' : 'Send'}
          </Button>
        </ButtonRow>
      </Card>
      <Card>
        <CardTitle>Broadcast to all users</CardTitle>
        <p style={{ fontSize: '0.75rem', color: '#888', margin: '0 0 0.5rem' }}>
          Delivers <code>admin.broadcast</code> to every active user (one row
          per user, batched). Cannot be unsent — confirm before sending.
        </p>
        <textarea
          placeholder="announcement"
          value={broadcastMessage}
          onChange={(e) => setBroadcastMessage(e.target.value)}
          rows={3}
          maxLength={1000}
          style={{
            width: '100%',
            padding: '6px 8px',
            marginBottom: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: 3,
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
        <ButtonRow>
          <Button
            $variant="danger"
            onClick={handleBroadcast}
            disabled={broadcasting}
          >
            {broadcasting ? 'Broadcasting…' : 'Broadcast'}
          </Button>
        </ButtonRow>
      </Card>
    </>
  );
}

// ============================================================================
// Overview
// ============================================================================

function OverviewTab() {
  const [data, setData] = useState<DashboardResponse | null>(null);

  useEffect(() => {
    api
      .get<DashboardResponse>('/admin/dashboard')
      .then(setData)
      .catch(() => {});
  }, []);

  if (!data) return <EmptyState>Loading...</EmptyState>;

  return (
    <>
      <StatGrid>
        <StatCard>
          <StatNumber>{data.stats.pendingComments}</StatNumber>
          <StatLabel>Pending Comments</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{data.stats.totalUsers}</StatNumber>
          <StatLabel>Total Users</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{data.stats.totalComments}</StatNumber>
          <StatLabel>Total Comments</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{data.stats.totalPosts}</StatNumber>
          <StatLabel>Posts with Activity</StatLabel>
        </StatCard>
      </StatGrid>

      <Card>
        <CardTitle>Recent Admin Activity</CardTitle>
        {data.recentAudit.length === 0 ? (
          <EmptyState>No recent activity.</EmptyState>
        ) : (
          data.recentAudit.map((entry) => (
            <InfoRow key={entry.id}>
              <div>
                <InfoValue>{entry.admin?.username || 'System'}</InfoValue>
                <Badge $color="#106BA3">{entry.action}</Badge>
                <br />
                <InfoLabel>
                  {entry.targetType}
                  {entry.targetId ? ` #${entry.targetId.substring(0, 8)}` : ''}
                </InfoLabel>
              </div>
              <InfoLabel>{formatDate(entry.createdAt)}</InfoLabel>
            </InfoRow>
          ))
        )}
      </Card>
    </>
  );
}

// ============================================================================
// Comments Moderation
// ============================================================================

// ── Pending Comments: rich table + shift-click multi-select ────────────────
//
// Reputation columns surface the cursory information an admin needs without
// having to click into the user's profile. Shift-click range select is
// provided by the shared useRangeSelect hook so other moderation surfaces
// (Users tab, future moderator queues) reuse the same behaviour.

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

function CommentsTab() {
  const [comments, setComments] = useState<AdminPendingComment[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const sel = useRangeSelect(comments);

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async (p: number) => {
    const data = await api.get<PaginatedResponse<AdminPendingComment>>(
      `/admin/comments/pending?page=${p}&limit=20`
    );
    setComments(p === 1 ? data.data : [...comments, ...data.data]);
    setHasMore(data.hasMore);
    setPage(p);
    sel.resetAnchor();
  };

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
      <p
        style={{
          fontSize: '0.75rem',
          color: '#888',
          margin: '0 0 0.5rem 0'
        }}
      >
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
                        <Badge $color={flavour.colour}>{flavour.label}</Badge>
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

// ============================================================================
// Users
// ============================================================================

function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filterGroup, setFilterGroup] = useState<string>('all');

  const filteredUsers =
    filterGroup === 'all'
      ? users
      : filterGroup === 'banned'
        ? users.filter((u) => u.isBanned)
        : users.filter((u) => u.groups.includes(filterGroup));

  // Bind selection to the visible (filtered) list — the standard mental model
  // for "select all" when a filter is applied.
  const sel = useRangeSelect(filteredUsers);

  useEffect(() => {
    load(1);
  }, []);

  const load = async (p: number) => {
    const data = await api.get<PaginatedResponse<AdminUser>>(
      `/admin/users?page=${p}&limit=20`
    );
    setUsers(p === 1 ? data.data : [...users, ...data.data]);
    setHasMore(data.hasMore);
    setPage(p);
    sel.resetAnchor();
  };

  const ban = async (id: string) => {
    const reason = prompt('Ban reason (optional):');
    await api.post(`/admin/users/${id}/ban`, { reason });
    load(1);
  };

  const unban = async (id: string) => {
    await api.post(`/admin/users/${id}/unban`);
    load(1);
  };

  const bulkBan = async () => {
    if (!confirm(`Ban ${sel.count} user(s)?`)) return;
    const reason = prompt('Ban reason (optional):');
    for (const id of sel.selected)
      await api.post(`/admin/users/${id}/ban`, { reason });
    sel.clear();
    load(1);
  };

  const groupCounts = {
    all: users.length,
    admin: users.filter((u) => u.groups.includes('admin')).length,
    moderator: users.filter((u) => u.groups.includes('moderator')).length,
    trusted: users.filter((u) => u.groups.includes('trusted')).length,
    user: users.filter((u) => u.groups.includes('user')).length,
    banned: users.filter((u) => u.isBanned).length
  };

  return (
    <Card>
      <CardTitle>Users</CardTitle>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.25rem',
          marginBottom: '0.75rem'
        }}
      >
        {Object.entries(groupCounts).map(([group, count]) => (
          <button
            key={group}
            onClick={() => setFilterGroup(group)}
            style={{
              padding: '2px 8px',
              fontSize: '0.7rem',
              fontFamily: 'Roboto, sans-serif',
              border: `1px solid ${filterGroup === group ? 'hsla(22, 80%, 45%, 1)' : '#ccc'}`,
              borderRadius: '3px',
              background:
                filterGroup === group
                  ? 'hsla(22, 80%, 45%, 0.1)'
                  : 'transparent',
              color: filterGroup === group ? 'hsla(22, 80%, 45%, 1)' : '#666',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {group} ({count})
          </button>
        ))}
      </div>
      <BulkActionBar count={sel.count} onClear={sel.clear}>
        <Button $variant="danger" onClick={bulkBan}>
          Ban Selected ({sel.count})
        </Button>
      </BulkActionBar>
      {filteredUsers.map((u, idx) => (
        <InfoRow key={u.id}>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start',
              flex: 1
            }}
          >
            <DataTableCheckbox
              checked={sel.isSelected(u.id)}
              onChange={() => {
                /* handled in onClick to capture shiftKey */
              }}
              onClick={(e) => sel.onCheckboxClick(u.id, idx, e)}
            />
            <div>
              <InfoValue>
                <a href={`/profile/${u.username}`}>{u.username}</a>
              </InfoValue>
              {u.groups.map((g) => (
                <Badge
                  key={g}
                  $color={
                    g === 'admin'
                      ? '#c62828'
                      : g === 'moderator'
                        ? '#106BA3'
                        : g === 'trusted'
                          ? '#0F9960'
                          : '#999'
                  }
                >
                  {g}
                </Badge>
              ))}
              {u.isBanned && <Badge $color="#c62828">banned</Badge>}
              <br />
              <InfoLabel>
                {u.email || 'No email'} — joined {formatDate(u.createdAt)}
              </InfoLabel>
            </div>
          </div>
          {u.isBanned ? (
            <Button $variant="secondary" onClick={() => unban(u.id)}>
              Unban
            </Button>
          ) : (
            <Button $variant="danger" onClick={() => ban(u.id)}>
              Ban
            </Button>
          )}
        </InfoRow>
      ))}
      {filteredUsers.length === 0 && (
        <EmptyState>No users in this category.</EmptyState>
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

// ============================================================================
// Audit Log
// ============================================================================

function AuditTab() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    load(1);
  }, []);

  const load = async (p: number) => {
    const data = await api.get<PaginatedResponse<AuditLogEntry>>(
      `/admin/audit?page=${p}&limit=30`
    );
    setEntries(p === 1 ? data.data : [...entries, ...data.data]);
    setHasMore(data.hasMore);
    setPage(p);
  };

  return (
    <Card>
      <CardTitle>Audit Log</CardTitle>
      {entries.length === 0 ? (
        <EmptyState>No audit entries.</EmptyState>
      ) : (
        entries.map((e) => (
          <InfoRow key={e.id}>
            <div>
              <InfoValue>{e.admin?.username || 'System'}</InfoValue>
              <Badge $color="#106BA3">{e.action}</Badge>
              <Badge $color="#999">{e.targetType}</Badge>
              <br />
              <InfoLabel>
                {e.targetId && `Target: ${e.targetId.substring(0, 8)}... `}
                {e.ipAddress && `IP: ${e.ipAddress} `}
              </InfoLabel>
            </div>
            <InfoLabel>{formatDate(e.createdAt)}</InfoLabel>
          </InfoRow>
        ))
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

// ============================================================================
// Analytics
// ============================================================================

function AnalyticsTab() {
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    api
      .get<AnalyticsData>('/admin/analytics')
      .then(setData)
      .catch(() => {
        toast.error('Failed to load analytics');
      });
  }, []);

  if (!data) return <EmptyState>Loading analytics...</EmptyState>;

  const maxComments = Math.max(1, ...data.commentsPerDay.map((d) => d.count));
  const maxUsers = Math.max(1, ...data.usersPerDay.map((d) => d.count));
  const maxCommentCount = Math.max(
    1,
    ...data.topCommentedPosts.map((p) => p.count)
  );
  const maxLikes = Math.max(1, ...data.topLikedPosts.map((p) => p.likes));

  function shortDate(iso: string) {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  return (
    <>
      <Card>
        <CardTitle>Comments per Day (30 days)</CardTitle>
        {data.commentsPerDay.length === 0 ? (
          <EmptyState>No comment activity in the last 30 days.</EmptyState>
        ) : (
          <BarChart>
            {data.commentsPerDay.map((d) => (
              <BarRow key={d.date}>
                <BarLabel>{shortDate(d.date)}</BarLabel>
                <Bar $width={(d.count / maxComments) * 100} />
                <BarValue>{d.count}</BarValue>
              </BarRow>
            ))}
          </BarChart>
        )}
      </Card>

      <Card>
        <CardTitle>User Registrations per Day (30 days)</CardTitle>
        {data.usersPerDay.length === 0 ? (
          <EmptyState>No registrations in the last 30 days.</EmptyState>
        ) : (
          <BarChart>
            {data.usersPerDay.map((d) => (
              <BarRow key={d.date}>
                <BarLabel>{shortDate(d.date)}</BarLabel>
                <Bar $width={(d.count / maxUsers) * 100} />
                <BarValue>{d.count}</BarValue>
              </BarRow>
            ))}
          </BarChart>
        )}
      </Card>

      <Card>
        <CardTitle>Top Commented Posts</CardTitle>
        {data.topCommentedPosts.length === 0 ? (
          <EmptyState>No data.</EmptyState>
        ) : (
          <RankList>
            {data.topCommentedPosts.map((p, i) => (
              <RankRow key={p.slug}>
                <RankNumber>{i + 1}</RankNumber>
                <div style={{ flex: 1 }}>
                  <a href={`/${p.slug}`}>{p.title}</a>
                </div>
                <Bar
                  $width={(p.count / maxCommentCount) * 60}
                  style={{ minWidth: 0, maxWidth: '120px' }}
                />
                <BarValue>{p.count} comments</BarValue>
              </RankRow>
            ))}
          </RankList>
        )}
      </Card>

      <Card>
        <CardTitle>Top Liked Posts</CardTitle>
        {data.topLikedPosts.length === 0 ? (
          <EmptyState>No data.</EmptyState>
        ) : (
          <RankList>
            {data.topLikedPosts.map((p, i) => (
              <RankRow key={p.slug}>
                <RankNumber>{i + 1}</RankNumber>
                <div style={{ flex: 1 }}>
                  <a href={`/${p.slug}`}>{p.title}</a>
                </div>
                <Bar
                  $width={(p.likes / maxLikes) * 60}
                  style={{ minWidth: 0, maxWidth: '120px' }}
                />
                <BarValue>{p.likes} likes</BarValue>
              </RankRow>
            ))}
          </RankList>
        )}
      </Card>
    </>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}
