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
import type { DashboardResponse } from '@derecksnotes/shared';
import {
  StatGrid,
  StatCard,
  StatNumber,
  StatLabel,
  AdminBadge
} from './_shared/styles';
import { formatAdminDate } from './_shared/formatDate';

export function OverviewTab() {
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
                <AdminBadge $color="#106BA3">{entry.action}</AdminBadge>
                <br />
                <InfoLabel>
                  {entry.targetType}
                  {entry.targetId ? ` #${entry.targetId.substring(0, 8)}` : ''}
                </InfoLabel>
              </div>
              <InfoLabel>{formatAdminDate(entry.createdAt)}</InfoLabel>
            </InfoRow>
          ))
        )}
      </Card>
    </>
  );
}
