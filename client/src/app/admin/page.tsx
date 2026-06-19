'use client';
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  PageContainer,
  PageTitle,
  EmptyState,
  TabBar,
  Tab
} from '@/components/ui/PageStyles';
import { OverviewTab } from '@/components/admin/OverviewTab';
import { CommentsTab } from '@/components/admin/CommentsTab';
import { UsersTab } from '@/components/admin/UsersTab';
import { AuditTab } from '@/components/admin/AuditTab';
import { AnalyticsTab } from '@/components/admin/AnalyticsTab';
import { NotificationsTab } from '@/components/admin/NotificationsTab';
import { ReportsTab } from '@/components/admin/ReportsTab';

type ActiveTab =
  | 'overview'
  | 'comments'
  | 'users'
  | 'audit'
  | 'analytics'
  | 'notifications'
  | 'reports';

const TABS: { key: ActiveTab; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'comments', label: 'Comments' },
  { key: 'users', label: 'Users' },
  { key: 'audit', label: 'Audit Log' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'notifications', label: 'Notifications' },
  { key: 'reports', label: 'Reports' }
];

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
        {TABS.map((t) => (
          <Tab
            key={t.key}
            $active={tab === t.key}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </Tab>
        ))}
      </TabBar>
      {tab === 'overview' && <OverviewTab />}
      {tab === 'comments' && <CommentsTab />}
      {tab === 'users' && <UsersTab />}
      {tab === 'audit' && <AuditTab />}
      {tab === 'analytics' && <AnalyticsTab />}
      {tab === 'notifications' && <NotificationsTab />}
      {tab === 'reports' && <ReportsTab />}
    </PageContainer>
  );
}
