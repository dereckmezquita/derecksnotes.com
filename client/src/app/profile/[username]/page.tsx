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
  location: string | null;
  socialLinks: { label: string; url: string }[];
  createdAt: string;
  followerCount: number;
  followingCount: number;
}

interface ActivityItem {
  type: 'comment' | 'reaction';
  id: string;
  createdAt: string;
  slug: string;
  postTitle: string;
  content?: string;
  reaction?: 'like' | 'dislike';
}

interface TopComment {
  id: string;
  slug: string;
  postTitle: string;
  content: string;
  createdAt: string;
  likes: number;
  dislikes: number;
  score: number;
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

const EmptyBio = styled.p`
  margin: 0.75rem 0 0;
  color: ${(p) => p.theme.text.colour.light_grey()};
  font-style: italic;
  font-size: 0.9rem;
`;

const SocialLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 0.75rem;
`;

const SocialChip = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  font-size: 0.8rem;
  border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
  border-radius: 12px;
  color: ${(p) => p.theme.text.colour.primary()};
  text-decoration: none;

  &:hover {
    border-color: ${(p) => p.theme.text.colour.header()};
    color: ${(p) => p.theme.text.colour.header()};
  }

  /* Tiny external-link affordance — drawn in pure CSS so we don't need
     to add another react-icons import just for this hint. */
  &::after {
    content: '↗';
    font-size: 0.7em;
    opacity: 0.6;
  }
`;

const TopCommentRow = styled.div`
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  &:last-child {
    border-bottom: none;
  }
`;

const Score = styled.span`
  font-weight: 700;
  color: ${(p) => p.theme.text.colour.header()};
  margin-right: 0.5rem;
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
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [topComments, setTopComments] = useState<TopComment[]>([]);

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
    api
      .get<{ data: ActivityItem[] }>(`/users/${username}/activity`, {
        silent: true
      })
      .then((d) => setActivity(d.data))
      .catch(() => {});
    api
      .get<{ data: TopComment[]; hasMore: boolean; total: number }>(
        `/users/${username}/top-comments?page=1&limit=5`,
        { silent: true }
      )
      .then((d) => setTopComments(d.data))
      .catch(() => {});
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
        {profile.bio ? (
          <Bio>{profile.bio}</Bio>
        ) : (
          <EmptyBio>
            @{profile.username} hasn&apos;t written a bio yet.
          </EmptyBio>
        )}
        {profile.location && (
          <Counts>
            <Count>📍 {profile.location}</Count>
          </Counts>
        )}
        {profile.socialLinks.length > 0 && (
          <SocialLinks>
            {profile.socialLinks.map((l) => (
              <SocialChip
                key={l.url}
                href={l.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {l.label}
              </SocialChip>
            ))}
          </SocialLinks>
        )}
      </Card>
      {topComments.length > 0 && (
        <Card>
          <h3 style={{ marginTop: 0 }}>Top comments</h3>
          {topComments.map((c) => (
            <TopCommentRow key={c.id}>
              <div style={{ fontSize: '0.95rem' }}>
                <Score>+{c.score}</Score>
                {c.content.length > 240
                  ? c.content.substring(0, 240) + '…'
                  : c.content}
              </div>
              <div
                style={{
                  color: '#888',
                  fontSize: '0.75rem',
                  marginTop: '0.25rem'
                }}
              >
                on <a href={`/${c.slug}`}>{c.postTitle || c.slug}</a> ·{' '}
                {formatDate(c.createdAt)}
              </div>
            </TopCommentRow>
          ))}
        </Card>
      )}
      {activity.length > 0 && (
        <Card>
          <h3 style={{ marginTop: 0 }}>Activity</h3>
          {activity.map((a) => (
            <div
              key={a.id}
              style={{
                padding: '6px 0',
                borderBottom: '1px solid rgba(0,0,0,0.08)'
              }}
            >
              {a.type === 'comment' ? (
                <>
                  Commented on{' '}
                  <a href={`/${a.slug}`}>{a.postTitle || a.slug}</a>
                  {a.content && (
                    <div style={{ color: '#555', fontSize: '0.85rem' }}>
                      {a.content.length > 200
                        ? a.content.substring(0, 200) + '…'
                        : a.content}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {a.reaction === 'like' ? '👍 Liked' : '👎 Disliked'}{' '}
                  <a href={`/${a.slug}`}>{a.postTitle || a.slug}</a>
                </>
              )}
              <div style={{ color: '#999', fontSize: '0.72rem' }}>
                {formatDate(a.createdAt)}
              </div>
            </div>
          ))}
        </Card>
      )}
    </PageContainer>
  );
}
