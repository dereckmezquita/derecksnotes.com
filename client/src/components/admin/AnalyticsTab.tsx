'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import { Card, CardTitle, EmptyState } from '@/components/ui/PageStyles';
import type { AnalyticsData } from '@derecksnotes/shared';
import {
  BarChart,
  BarRow,
  BarLabel,
  Bar,
  BarValue,
  RankList,
  RankRow,
  RankNumber
} from './_shared/styles';

function shortDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

interface RankCardProps<T extends { slug: string; title: string }> {
  title: string;
  rows: T[];
  valueOf: (row: T) => number;
  formatValue: (n: number) => string;
}

function TopPostsRankCard<T extends { slug: string; title: string }>({
  title,
  rows,
  valueOf,
  formatValue
}: RankCardProps<T>) {
  if (rows.length === 0) {
    return (
      <Card>
        <CardTitle>{title}</CardTitle>
        <EmptyState>No data.</EmptyState>
      </Card>
    );
  }
  const max = Math.max(1, ...rows.map(valueOf));
  return (
    <Card>
      <CardTitle>{title}</CardTitle>
      <RankList>
        {rows.map((row, i) => (
          <RankRow key={row.slug}>
            <RankNumber>{i + 1}</RankNumber>
            <div style={{ flex: 1 }}>
              <a href={`/${row.slug}`}>{row.title}</a>
            </div>
            <Bar
              $width={(valueOf(row) / max) * 60}
              style={{ minWidth: 0, maxWidth: '120px' }}
            />
            <BarValue>{formatValue(valueOf(row))}</BarValue>
          </RankRow>
        ))}
      </RankList>
    </Card>
  );
}

export function AnalyticsTab() {
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

      <TopPostsRankCard
        title="Top Commented Posts"
        rows={data.topCommentedPosts}
        valueOf={(p) => p.count}
        formatValue={(n) => `${n} comments`}
      />

      <TopPostsRankCard
        title="Top Liked Posts"
        rows={data.topLikedPosts}
        valueOf={(p) => p.likes}
        formatValue={(n) => `${n} likes`}
      />

      <TopPostsRankCard
        title="Top Bookmarked Posts"
        rows={data.topBookmarkedPosts}
        valueOf={(p) => p.count}
        formatValue={(n) => `${n} saves`}
      />
    </>
  );
}
