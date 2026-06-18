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

type ActiveTab = 'overview' | 'comments' | 'users' | 'audit' | 'analytics';

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
      </TabBar>

      {tab === 'overview' && <OverviewTab />}
      {tab === 'comments' && <CommentsTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'audit' && <AuditTab />}
      {tab === 'analytics' && <AnalyticsTab />}
    </PageContainer>
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
// having to click into the user's profile. Shift-click on a checkbox selects
// the range from the last clicked row to the current row (toggling all of
// them to the current row's new state) — the standard table-multiselect
// keyboard convention.

const PendingTableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

const PendingTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  font-family: ${(p) => p.theme.text.font.roboto};

  th,
  td {
    padding: 6px 8px;
    text-align: left;
    border-bottom: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    vertical-align: top;
  }

  th {
    font-weight: ${(p) => p.theme.text.weight.bold};
    color: ${(p) => p.theme.text.colour.light_grey()};
    text-transform: uppercase;
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    border-bottom: 2px solid ${(p) => p.theme.text.colour.header()};
    white-space: nowrap;
  }

  tbody tr.selected {
    background: ${(p) => p.theme.text.colour.header()}10;
  }

  td .content-preview {
    max-width: 340px;
    color: ${(p) => p.theme.text.colour.primary()};
    line-height: 1.35;
  }

  td .meta {
    color: ${(p) => p.theme.text.colour.light_grey()};
    font-size: 0.7rem;
  }
`;

const TableCheckbox = styled.input.attrs({ type: 'checkbox' })`
  cursor: pointer;
  /* Big hit area so shift-clicking on a fiddly checkbox isn't a sniper shot. */
  width: 16px;
  height: 16px;
`;

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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  // Index of the last checkbox-clicked row. Shift-click reads this to compute
  // the range. Reset on data reloads so we can't anchor to a now-stale row.
  const [anchorIdx, setAnchorIdx] = useState<number | null>(null);

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
    setAnchorIdx(null);
  };

  const removeFromList = (ids: string[]) =>
    setComments((prev) => prev.filter((c) => !ids.includes(c.id)));

  const approve = async (id: string) => {
    try {
      await api.post(`/admin/comments/${id}/approve`);
      removeFromList([id]);
      setSelected((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      toast.success('Comment approved');
    } catch {
      toast.error('Failed to approve');
    }
  };

  const reject = async (id: string) => {
    try {
      await api.post(`/admin/comments/${id}/reject`);
      removeFromList([id]);
      setSelected((prev) => {
        const n = new Set(prev);
        n.delete(id);
        return n;
      });
      toast.success('Comment rejected');
    } catch {
      toast.error('Failed to reject');
    }
  };

  const bulkApprove = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Approve ${selected.size} comment(s)?`)) return;
    const ids = Array.from(selected);
    try {
      await api.post('/admin/comments/bulk-approve', { commentIds: ids });
      removeFromList(ids);
      setSelected(new Set());
      toast.success(`${ids.length} comment(s) approved`);
    } catch {
      toast.error('Failed to approve comments');
    }
  };

  const bulkReject = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Reject ${selected.size} comment(s)?`)) return;
    const ids = Array.from(selected);
    try {
      await api.post('/admin/comments/bulk-reject', { commentIds: ids });
      removeFromList(ids);
      setSelected(new Set());
      toast.success(`${ids.length} comment(s) rejected`);
    } catch {
      toast.error('Failed to reject comments');
    }
  };

  /**
   * onClick fires BEFORE the native checkbox flips its checked state, so
   * `selected.has(id)` here is the pre-click state. We invert it ourselves
   * and (for shift-click) propagate that target state across the range —
   * the standard email/file-manager shift-click behaviour.
   */
  const onCheckboxClick = (
    id: string,
    idx: number,
    e: React.MouseEvent<HTMLInputElement>
  ) => {
    const isCurrentlySelected = selected.has(id);
    const targetState = !isCurrentlySelected;
    const next = new Set(selected);

    if (e.shiftKey && anchorIdx !== null && anchorIdx !== idx) {
      const [lo, hi] = [Math.min(anchorIdx, idx), Math.max(anchorIdx, idx)];
      for (let i = lo; i <= hi; i++) {
        const cid = comments[i]?.id;
        if (!cid) continue;
        if (targetState) next.add(cid);
        else next.delete(cid);
      }
    } else {
      if (targetState) next.add(id);
      else next.delete(id);
    }
    setSelected(next);
    setAnchorIdx(idx);
  };

  const toggleAll = () => {
    if (selected.size === comments.length) setSelected(new Set());
    else setSelected(new Set(comments.map((c) => c.id)));
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
      {selected.size > 0 && (
        <ButtonRow>
          <Button onClick={bulkApprove}>Approve ({selected.size})</Button>
          <Button $variant="danger" onClick={bulkReject}>
            Reject ({selected.size})
          </Button>
          <Button $variant="secondary" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </ButtonRow>
      )}
      {comments.length === 0 ? (
        <EmptyState>No pending comments.</EmptyState>
      ) : (
        <PendingTableWrapper>
          <PendingTable>
            <thead>
              <tr>
                <th style={{ width: 28 }}>
                  <TableCheckbox
                    checked={
                      selected.size > 0 && selected.size === comments.length
                    }
                    ref={(el) => {
                      // Indeterminate state when some-but-not-all selected.
                      if (el)
                        el.indeterminate =
                          selected.size > 0 && selected.size < comments.length;
                    }}
                    onChange={toggleAll}
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
                const isSel = selected.has(c.id);
                return (
                  <tr key={c.id} className={isSel ? 'selected' : ''}>
                    <td>
                      <TableCheckbox
                        checked={isSel}
                        onChange={() => {
                          /* handled in onClick to capture shiftKey */
                        }}
                        onClick={(e) => onCheckboxClick(c.id, idx, e)}
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
          </PendingTable>
        </PendingTableWrapper>
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
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filterGroup, setFilterGroup] = useState<string>('all');

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

  const toggle = (id: string) => {
    setSelected((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  };

  const bulkBan = async () => {
    if (!confirm(`Ban ${selected.size} user(s)?`)) return;
    const reason = prompt('Ban reason (optional):');
    for (const id of selected)
      await api.post(`/admin/users/${id}/ban`, { reason });
    setSelected(new Set());
    load(1);
  };

  const filteredUsers =
    filterGroup === 'all'
      ? users
      : filterGroup === 'banned'
        ? users.filter((u) => u.isBanned)
        : users.filter((u) => u.groups.includes(filterGroup));

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
      {selected.size > 0 && (
        <ButtonRow>
          <Button $variant="danger" onClick={bulkBan}>
            Ban Selected ({selected.size})
          </Button>
          <Button $variant="secondary" onClick={() => setSelected(new Set())}>
            Clear
          </Button>
        </ButtonRow>
      )}
      {filteredUsers.map((u) => (
        <InfoRow key={u.id}>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              alignItems: 'flex-start',
              flex: 1
            }}
          >
            <input
              type="checkbox"
              checked={selected.has(u.id)}
              onChange={() => toggle(u.id)}
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
