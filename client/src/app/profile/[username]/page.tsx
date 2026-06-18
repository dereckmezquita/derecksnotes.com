'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { api, ApiError } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import {
  PageContainer,
  Card,
  Avatar,
  ProfileHeader,
  ProfileInfo,
  Username,
  DisplayName,
  Bio,
  JoinDate,
  EmptyState,
  Button
} from '@/components/ui/PageStyles';

interface PublicProfile {
  id: string;
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl: string | null;
  createdAt: string;
  followerCount: number;
  followingCount: number;
}

const Counts = styled.div`
  display: flex;
  gap: 18px;
  margin-top: 6px;
  font-size: 0.85rem;
  color: ${(p) => p.theme.text.colour.light_grey()};
`;

const Count = styled.span`
  & strong {
    color: ${(p) => p.theme.text.colour.primary()};
    font-weight: 700;
    margin-right: 4px;
  }
`;

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const { user, isAuthenticated } = useAuth();
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [following, setFollowing] = useState<boolean | null>(null);
  const [pending, setPending] = useState(false);

  const isSelf = user?.username === username;

  const refreshFollow = useCallback(async () => {
    if (!isAuthenticated() || isSelf) {
      setFollowing(null);
      return;
    }
    try {
      const data = await api.get<{ following: boolean }>(
        `/users/${username}/follow-status`,
        { silent: true }
      );
      setFollowing(data.following);
    } catch {
      // silent
    }
  }, [isAuthenticated, isSelf, username]);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.get<PublicProfile>(`/users/${username}`);
        setProfile(data);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setError('User not found');
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
    refreshFollow();
  }, [username, refreshFollow]);

  const toggleFollow = async () => {
    if (pending || following === null) return;
    setPending(true);
    const next = !following;
    setFollowing(next); // optimistic
    setProfile((p) =>
      p
        ? {
            ...p,
            followerCount: Math.max(0, p.followerCount + (next ? 1 : -1))
          }
        : p
    );
    try {
      if (next) {
        await api.post(`/users/${username}/follow`);
        toast.success(`Following @${username}`);
      } else {
        await api.delete(`/users/${username}/follow`);
        toast.success(`Unfollowed @${username}`);
      }
    } catch {
      // revert on error
      setFollowing(!next);
      setProfile((p) =>
        p
          ? {
              ...p,
              followerCount: Math.max(0, p.followerCount + (next ? -1 : 1))
            }
          : p
      );
    } finally {
      setPending(false);
    }
  };

  if (loading)
    return (
      <PageContainer>
        <EmptyState>Loading...</EmptyState>
      </PageContainer>
    );
  if (error)
    return (
      <PageContainer>
        <EmptyState>{error}</EmptyState>
      </PageContainer>
    );
  if (!profile) return null;

  const initials = (profile.displayName || profile.username)
    .charAt(0)
    .toUpperCase();

  return (
    <PageContainer>
      <Card>
        <ProfileHeader>
          <Avatar $size={80}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.username} />
            ) : (
              initials
            )}
          </Avatar>
          <ProfileInfo>
            <Username>{profile.username}</Username>
            {profile.displayName && (
              <DisplayName>{profile.displayName}</DisplayName>
            )}
            <JoinDate>Joined {formatDate(profile.createdAt)}</JoinDate>
            <Counts>
              <Count>
                <strong>{profile.followerCount}</strong> followers
              </Count>
              <Count>
                <strong>{profile.followingCount}</strong> following
              </Count>
            </Counts>
          </ProfileInfo>
          {!isSelf && isAuthenticated() && following !== null && (
            <Button
              $variant={following ? 'secondary' : undefined}
              onClick={toggleFollow}
              disabled={pending}
              style={{ alignSelf: 'flex-start' }}
            >
              {following ? 'Unfollow' : 'Follow'}
            </Button>
          )}
        </ProfileHeader>
        {profile.bio && <Bio>{profile.bio}</Bio>}
      </Card>
    </PageContainer>
  );
}
