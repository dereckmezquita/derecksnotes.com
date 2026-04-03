'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { api, ApiError } from '@/utils/api';
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
    EmptyState
} from '@/components/ui/PageStyles';

interface PublicProfile {
    id: string;
    username: string;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    createdAt: string;
}

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
    const [profile, setProfile] = useState<PublicProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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
    }, [username]);

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
                            <img
                                src={profile.avatarUrl}
                                alt={profile.username}
                            />
                        ) : (
                            initials
                        )}
                    </Avatar>
                    <ProfileInfo>
                        <Username>{profile.username}</Username>
                        {profile.displayName && (
                            <DisplayName>{profile.displayName}</DisplayName>
                        )}
                        <JoinDate>
                            Joined {formatDate(profile.createdAt)}
                        </JoinDate>
                    </ProfileInfo>
                </ProfileHeader>
                {profile.bio && <Bio>{profile.bio}</Bio>}
            </Card>
        </PageContainer>
    );
}
