'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import {
  Card,
  CardTitle,
  EmptyState,
  InfoRow,
  InfoLabel,
  InfoValue
} from '@/components/ui/PageStyles';
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

  useEffect(() => {
    api
      .get<{ data: FeedItem[] }>('/users/me/following-feed?limit=30')
      .then((d) => setItems(d.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardTitle>Following feed</CardTitle>
        <EmptyState>Loading…</EmptyState>
      </Card>
    );
  }
  if (items.length === 0) {
    return (
      <Card>
        <CardTitle>Following feed</CardTitle>
        <EmptyState>
          Nothing yet — find users to follow and their recent comments will show
          up here.
        </EmptyState>
      </Card>
    );
  }
  return (
    <Card>
      <CardTitle>Following feed</CardTitle>
      {items.map((it) => (
        <InfoRow key={it.id}>
          <div>
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
          </div>
        </InfoRow>
      ))}
    </Card>
  );
}
