'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  PageContainer,
  Card,
  Avatar,
  ProfileHeader,
  ProfileInfo,
  Username,
  DisplayName,
  JoinDate,
  EmptyState,
  TabBar,
  Tab
} from '@/components/ui/PageStyles';
import { ProfileTab } from '@/components/account/ProfileTab';
import { SecurityTab } from '@/components/account/SecurityTab';
import { CommentsTab } from '@/components/account/CommentsTab';
import { HistoryTab } from '@/components/account/HistoryTab';
import { BookmarksTab } from '@/components/account/BookmarksTab';
import { FollowingFeedTab } from '@/components/account/FollowingFeedTab';
import { NotificationsTab } from '@/components/account/NotificationsTab';
import { formatAccountDate } from '@/components/account/_shared/formatDate';

type ActiveTab =
  | 'profile'
  | 'security'
  | 'notifications'
  | 'comments'
  | 'history'
  | 'bookmarks'
  | 'feed';

const TABS: { key: ActiveTab; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'security', label: 'Security' },
  { key: 'notifications', label: 'Notifs' },
  { key: 'comments', label: 'Comments' },
  { key: 'history', label: 'History' },
  { key: 'bookmarks', label: 'Bookmarks' },
  { key: 'feed', label: 'Following' }
];

const VALID_TABS = new Set<ActiveTab>([
  'profile',
  'security',
  'notifications',
  'comments',
  'history',
  'bookmarks',
  'feed'
]);

function parseTab(raw: string | null): ActiveTab {
  if (raw && VALID_TABS.has(raw as ActiveTab)) return raw as ActiveTab;
  return 'profile';
}

/**
 * Next 15 forces any client component that calls useSearchParams() to be
 * wrapped in a Suspense boundary at the page level so the build-time
 * static shell can render without bailing. We keep the search-params logic
 * inside `AccountPageInner` and the exported page is just a Suspense shell.
 */
export default function AccountPage() {
  return (
    <Suspense
      fallback={
        <PageContainer>
          <EmptyState>Loading...</EmptyState>
        </PageContainer>
      }
    >
      <AccountPageInner />
    </Suspense>
  );
}

function AccountPageInner() {
  const {
    user,
    loading: authLoading,
    updateProfile,
    changeUsername,
    changePassword,
    deleteAccount,
    logout
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<ActiveTab>(() =>
    parseTab(searchParams.get('tab'))
  );

  // Keep the URL in sync when the user clicks a tab so deep links + back/
  // forward work. The notification toast's "Open" action navigates to
  // /account?tab=notifications so we honour it on mount too.
  useEffect(() => {
    const fromUrl = parseTab(searchParams.get('tab'));
    if (fromUrl !== tab) setTab(fromUrl);
    // searchParams change is the trigger; we intentionally don't list `tab`
    // to avoid a re-entrant loop with the click handler below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleTabClick = (key: ActiveTab) => {
    setTab(key);
    const next = new URLSearchParams(searchParams.toString());
    if (key === 'profile') next.delete('tab');
    else next.set('tab', key);
    const qs = next.toString();
    router.replace(`/account${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  if (authLoading)
    return (
      <PageContainer>
        <EmptyState>Loading...</EmptyState>
      </PageContainer>
    );
  if (!user)
    return (
      <PageContainer>
        <EmptyState>Please log in to access your account.</EmptyState>
      </PageContainer>
    );

  const initials = (user.displayName || user.username).charAt(0).toUpperCase();

  return (
    <PageContainer>
      <Card>
        <ProfileHeader>
          <Avatar $size={64}>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={user.username} />
            ) : (
              initials
            )}
          </Avatar>
          <ProfileInfo>
            <Username>{user.username}</Username>
            {user.displayName && <DisplayName>{user.displayName}</DisplayName>}
            <JoinDate>Joined {formatAccountDate(user.createdAt)}</JoinDate>
          </ProfileInfo>
        </ProfileHeader>
      </Card>

      <TabBar>
        {TABS.map((t) => (
          <Tab
            key={t.key}
            $active={tab === t.key}
            onClick={() => handleTabClick(t.key)}
          >
            {t.label}
          </Tab>
        ))}
      </TabBar>

      {tab === 'profile' && (
        <ProfileTab
          user={user}
          updateProfile={updateProfile}
          changeUsername={changeUsername}
        />
      )}
      {tab === 'security' && (
        <SecurityTab
          changePassword={changePassword}
          deleteAccount={deleteAccount}
          logout={logout}
        />
      )}
      {tab === 'notifications' && <NotificationsTab />}
      {tab === 'comments' && <CommentsTab />}
      {tab === 'history' && <HistoryTab />}
      {tab === 'bookmarks' && <BookmarksTab />}
      {tab === 'feed' && <FollowingFeedTab />}
    </PageContainer>
  );
}
