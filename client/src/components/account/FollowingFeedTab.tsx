'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import { InfoLabel, InfoValue, Button } from '@/components/ui/PageStyles';
import { RecordList } from '@/components/ui/RecordList';
import { formatAccountDate } from './_shared/formatDate';

interface FeedItem {
  id: string;
  content: string;
  createdAt: string;
  slug: string;
  postTitle: string;
  user: {
    id: string;
    username: string;
    displayName: string | null;
    avatarUrl: string | null;
  } | null;
}

export function FollowingFeedTab() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ data: FeedItem[] }>(
        '/users/me/following-feed?limit=30'
      );
      setItems(data.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unfollow = async (it: FeedItem) => {
    const username = it.user?.username;
    if (!username) return;
    if (!confirm(`Unfollow @${username}?`)) return;
    try {
      await api.delete(`/users/${username}/follow`);
      setItems((prev) => prev.filter((x) => x.user?.username !== username));
      toast.success(`Unfollowed @${username}`);
    } catch {
      toast.error('Failed to unfollow');
    }
  };

  const unfollowSelected = async (selected: FeedItem[]) => {
    const usernames = Array.from(
      new Set(selected.map((s) => s.user?.username).filter(Boolean))
    ) as string[];
    let removed = 0;
    for (const u of usernames) {
      try {
        await api.delete(`/users/${u}/follow`);
        removed++;
      } catch {
        // continue
      }
    }
    setItems((prev) =>
      prev.filter((x) => !usernames.includes(x.user?.username || ''))
    );
    if (removed === usernames.length)
      toast.success(`Unfollowed ${removed} user(s)`);
    else if (removed > 0)
      toast.warning(`Unfollowed ${removed} of ${usernames.length}`);
    else toast.error('No users unfollowed');
  };

  return (
    <RecordList<FeedItem>
      title="Following feed"
      items={items}
      loading={loading}
      emptyMessage="Nothing yet — find users to follow and their recent comments will show up here."
      hint="Tip: click a checkbox, then shift-click another to select a range."
      bulkActions={[
        {
          label: 'Unfollow author',
          variant: 'danger',
          onAction: unfollowSelected,
          confirm: (n) =>
            `Unfollow ${n} author${n === 1 ? '' : 's'}? Their comments will stop appearing here.`
        }
      ]}
      renderRow={(it) => (
        <>
          <InfoValue>
            <a href={`/profile/${it.user?.username}`}>
              @{it.user?.username || 'unknown'}
            </a>{' '}
            commented on <a href={`/${it.slug}`}>{it.postTitle || it.slug}</a>
          </InfoValue>
          <br />
          <InfoLabel>
            {it.content.length > 200
              ? it.content.substring(0, 200) + '…'
              : it.content}
          </InfoLabel>
          <br />
          <InfoLabel>{formatAccountDate(it.createdAt)}</InfoLabel>
        </>
      )}
      rowAction={(it) =>
        it.user?.username ? (
          <Button $variant="secondary" onClick={() => unfollow(it)}>
            Unfollow
          </Button>
        ) : null
      }
    />
  );
}
