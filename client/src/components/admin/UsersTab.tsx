'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import {
  Card,
  CardTitle,
  EmptyState,
  Button,
  ButtonRow,
  InfoRow,
  InfoLabel,
  InfoValue
} from '@/components/ui/PageStyles';
import { DataTableCheckbox } from '@/components/ui/DataTable';
import { BulkActionBar } from '@/components/ui/BulkActionBar';
import { useRangeSelect } from '@/components/ui/useRangeSelect';
import type { AdminUser, PaginatedResponse } from '@derecksnotes/shared';
import { AdminBadge } from './_shared/styles';
import { formatAdminDate } from './_shared/formatDate';

const FILTER_GROUPS = [
  'all',
  'admin',
  'moderator',
  'trusted',
  'user',
  'banned'
] as const;
type FilterGroup = (typeof FILTER_GROUPS)[number];

function groupColour(g: string): string {
  switch (g) {
    case 'admin':
      return '#c62828';
    case 'moderator':
      return '#106BA3';
    case 'trusted':
      return '#0F9960';
    default:
      return '#999';
  }
}

export function UsersTab() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [filterGroup, setFilterGroup] = useState<FilterGroup>('all');

  const filteredUsers =
    filterGroup === 'all'
      ? users
      : filterGroup === 'banned'
        ? users.filter((u) => u.isBanned)
        : users.filter((u) => u.groups.includes(filterGroup));

  // Bind selection to the visible (filtered) list — the standard mental
  // model for "select all" when a filter is applied.
  const sel = useRangeSelect(filteredUsers);

  const load = async (p: number) => {
    const data = await api.get<PaginatedResponse<AdminUser>>(
      `/admin/users?page=${p}&limit=20`
    );
    setUsers(p === 1 ? data.data : [...users, ...data.data]);
    setHasMore(data.hasMore);
    setPage(p);
    sel.resetAnchor();
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ban = async (id: string) => {
    const reason = prompt('Ban reason (optional):');
    await api.post(`/admin/users/${id}/ban`, { reason });
    load(1);
  };

  const unban = async (id: string) => {
    await api.post(`/admin/users/${id}/unban`);
    load(1);
  };

  const toggleMentionMute = async (u: AdminUser) => {
    try {
      await api.post(`/admin/users/${u.id}/mention-mute`, {
        muted: !u.mentionMuted
      });
      toast.success(
        `@-mentions ${!u.mentionMuted ? 'muted' : 'unmuted'} for ${u.username}`
      );
      load(1);
    } catch {
      // toast handled by api util
    }
  };

  const bulkBan = async () => {
    if (!confirm(`Ban ${sel.count} user(s)?`)) return;
    const reason = prompt('Ban reason (optional):');
    for (const id of sel.selected)
      await api.post(`/admin/users/${id}/ban`, { reason });
    sel.clear();
    load(1);
  };

  const groupCounts: Record<FilterGroup, number> = {
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
        {FILTER_GROUPS.map((group) => (
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
            {group} ({groupCounts[group]})
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
                <AdminBadge key={g} $color={groupColour(g)}>
                  {g}
                </AdminBadge>
              ))}
              {u.isBanned && <AdminBadge $color="#c62828">banned</AdminBadge>}
              {u.mentionMuted && (
                <AdminBadge $color="#996f0f">mention-muted</AdminBadge>
              )}
              <br />
              <InfoLabel>
                {u.email || 'No email'} — joined {formatAdminDate(u.createdAt)}
              </InfoLabel>
            </div>
          </div>
          <ButtonRow>
            <Button
              $variant="secondary"
              onClick={() => toggleMentionMute(u)}
              title="Suppress @mention notifications targeting this user; they can still type @-mentions but no one is notified."
            >
              {u.mentionMuted ? 'Unmute mentions' : 'Mute mentions'}
            </Button>
            {u.isBanned ? (
              <Button $variant="secondary" onClick={() => unban(u.id)}>
                Unban
              </Button>
            ) : (
              <Button $variant="danger" onClick={() => ban(u.id)}>
                Ban
              </Button>
            )}
          </ButtonRow>
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
