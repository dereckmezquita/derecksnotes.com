'use client';
import React, { useState } from 'react';
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
import { formatAccountDate } from '@/components/account/_shared/formatDate';

type ActiveTab =
  | 'profile'
  | 'security'
  | 'comments'
  | 'history'
  | 'bookmarks'
  | 'feed';

const TABS: { key: ActiveTab; label: string }[] = [
  { key: 'profile', label: 'Profile' },
  { key: 'security', label: 'Security' },
  { key: 'comments', label: 'My Comments' },
  { key: 'history', label: 'Read History' },
  { key: 'bookmarks', label: 'Bookmarks' },
  { key: 'feed', label: 'Following' }
];

export default function AccountPage() {
  const {
    user,
    loading: authLoading,
    updateProfile,
    changeUsername,
    changePassword,
    deleteAccount,
    logout
  } = useAuth();
  const [tab, setTab] = useState<ActiveTab>('profile');

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
            onClick={() => setTab(t.key)}
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
      {tab === 'comments' && <CommentsTab />}
      {tab === 'history' && <HistoryTab />}
      {tab === 'bookmarks' && <BookmarksTab />}
      {tab === 'feed' && <FollowingFeedTab />}
    </PageContainer>
  );
}
