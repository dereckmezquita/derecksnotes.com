'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';
import type {
    ReadHistoryEntry,
    SessionInfo,
    UserComment,
    PaginatedResponse
} from '@derecksnotes/shared';
import { toast } from 'sonner';
import {
    PageContainer,
    Card,
    CardTitle,
    Label,
    Input,
    TextArea,
    Button,
    ButtonRow,
    InfoRow,
    InfoLabel,
    InfoValue,
    Avatar,
    ProfileHeader,
    ProfileInfo,
    Username,
    DisplayName,
    JoinDate,
    EmptyState,
    SuccessMessage,
    ErrorMessage,
    TabBar,
    Tab
} from '@/components/ui/PageStyles';

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

type ActiveTab = 'profile' | 'security' | 'comments' | 'history';

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

    const initials = (user.displayName || user.username)
        .charAt(0)
        .toUpperCase();

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
                        {user.displayName && (
                            <DisplayName>{user.displayName}</DisplayName>
                        )}
                        <JoinDate>Joined {formatDate(user.createdAt)}</JoinDate>
                    </ProfileInfo>
                </ProfileHeader>
            </Card>

            <TabBar>
                <Tab
                    $active={tab === 'profile'}
                    onClick={() => setTab('profile')}
                >
                    Profile
                </Tab>
                <Tab
                    $active={tab === 'security'}
                    onClick={() => setTab('security')}
                >
                    Security
                </Tab>
                <Tab
                    $active={tab === 'comments'}
                    onClick={() => setTab('comments')}
                >
                    My Comments
                </Tab>
                <Tab
                    $active={tab === 'history'}
                    onClick={() => setTab('history')}
                >
                    Read History
                </Tab>
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
        </PageContainer>
    );
}

// ============================================================================
// Profile Tab
// ============================================================================

function ProfileTab({
    user,
    updateProfile,
    changeUsername
}: {
    user: { username: string; displayName: string | null; bio: string | null };
    updateProfile: (data: {
        displayName?: string;
        bio?: string;
    }) => Promise<void>;
    changeUsername: (username: string) => Promise<void>;
}) {
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [bio, setBio] = useState(user.bio || '');
    const [newUsername, setNewUsername] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSaveProfile = async () => {
        setSaving(true);
        setSuccess(null);
        setError(null);
        try {
            await updateProfile({
                displayName: displayName || undefined,
                bio: bio || undefined
            });
            setSuccess('Profile updated');
        } catch {
            setError('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleChangeUsername = async () => {
        if (!newUsername.trim()) return;
        setSaving(true);
        setSuccess(null);
        setError(null);
        try {
            await changeUsername(newUsername.trim());
            setNewUsername('');
            setSuccess('Username changed');
        } catch (err: any) {
            setError(err.data?.error || 'Failed to change username');
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Card>
                <CardTitle>Edit Profile</CardTitle>
                <Label>Display Name</Label>
                <Input
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                    maxLength={50}
                />
                <Label>Bio</Label>
                <TextArea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself"
                    maxLength={500}
                />
                {success && <SuccessMessage>{success}</SuccessMessage>}
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <ButtonRow>
                    <Button onClick={handleSaveProfile} disabled={saving}>
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </ButtonRow>
            </Card>

            <Card>
                <CardTitle>Change Username</CardTitle>
                <Label>New Username</Label>
                <Input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    placeholder="New username (3-30 chars)"
                    maxLength={30}
                />
                <ButtonRow>
                    <Button
                        onClick={handleChangeUsername}
                        disabled={saving || !newUsername.trim()}
                    >
                        Change Username
                    </Button>
                </ButtonRow>
            </Card>
        </>
    );
}

// ============================================================================
// Password Helpers
// ============================================================================

function isPasswordValid(password: string): boolean {
    return (
        password.length >= 8 &&
        /[A-Z]/.test(password) &&
        /[a-z]/.test(password) &&
        /[0-9]/.test(password)
    );
}

function PasswordStrength({ password }: { password: string }) {
    const checks = [
        { label: '8+ characters', pass: password.length >= 8 },
        { label: 'Uppercase letter', pass: /[A-Z]/.test(password) },
        { label: 'Lowercase letter', pass: /[a-z]/.test(password) },
        { label: 'Number', pass: /[0-9]/.test(password) }
    ];

    return (
        <div
            style={{
                fontSize: '0.75rem',
                margin: '0 0 0.5rem',
                display: 'flex',
                gap: '0.75rem',
                flexWrap: 'wrap'
            }}
        >
            {checks.map((c) => (
                <span
                    key={c.label}
                    style={{ color: c.pass ? '#0F9960' : '#999' }}
                >
                    {c.pass ? '\u2713' : '\u2717'} {c.label}
                </span>
            ))}
        </div>
    );
}

// ============================================================================
// Security Tab
// ============================================================================

function SecurityTab({
    changePassword,
    deleteAccount,
    logout
}: {
    changePassword: (current: string, newPass: string) => Promise<void>;
    deleteAccount: () => Promise<void>;
    logout: () => Promise<void>;
}) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleChangePassword = async () => {
        setSaving(true);
        setSuccess(null);
        setError(null);
        try {
            await changePassword(currentPassword, newPassword);
            setCurrentPassword('');
            setNewPassword('');
            setSuccess('Password changed. All other sessions revoked.');
        } catch (err: any) {
            setError(err.data?.error || 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (
            !confirm(
                'Are you sure you want to delete your account? This cannot be undone.'
            )
        )
            return;
        if (!confirm('Really delete your account?')) return;
        try {
            await deleteAccount();
        } catch {
            setError('Failed to delete account');
        }
    };

    return (
        <>
            <Card>
                <CardTitle>Change Password</CardTitle>
                <Label>Current Password</Label>
                <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Label>New Password</Label>
                <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 8 chars, 1 upper, 1 lower, 1 number"
                />
                {newPassword && <PasswordStrength password={newPassword} />}
                {success && <SuccessMessage>{success}</SuccessMessage>}
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <ButtonRow>
                    <Button
                        onClick={handleChangePassword}
                        disabled={
                            saving ||
                            !currentPassword ||
                            !newPassword ||
                            !isPasswordValid(newPassword)
                        }
                    >
                        {saving ? 'Changing...' : 'Change Password'}
                    </Button>
                </ButtonRow>
            </Card>

            <Card>
                <CardTitle>Sessions</CardTitle>
                <SessionList />
            </Card>

            <Card>
                <CardTitle>Danger Zone</CardTitle>
                <ButtonRow>
                    <Button $variant="secondary" onClick={logout}>
                        Log Out Everywhere
                    </Button>
                    <Button $variant="danger" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </ButtonRow>
            </Card>
        </>
    );
}

function SessionList() {
    const [sessions, setSessions] = useState<SessionInfo[]>([]);

    useEffect(() => {
        api.get<SessionInfo[]>('/auth/sessions')
            .then(setSessions)
            .catch(() => {
                toast.error('Failed to load sessions');
            });
    }, []);

    const revoke = async (id: string) => {
        try {
            await api.delete(`/auth/sessions/${id}`);
            setSessions((prev) => prev.filter((s) => s.id !== id));
            toast.success('Session revoked');
        } catch {
            toast.error('Failed to revoke session');
        }
    };

    return (
        <>
            {sessions.map((s) => (
                <InfoRow key={s.id}>
                    <div>
                        <InfoValue>
                            {s.isCurrent
                                ? 'Current session'
                                : s.userAgent?.substring(0, 40) ||
                                  'Unknown device'}
                        </InfoValue>
                        <br />
                        <InfoLabel>
                            {s.ipAddress} — expires {formatDate(s.expiresAt)}
                        </InfoLabel>
                    </div>
                    {!s.isCurrent && (
                        <Button
                            $variant="secondary"
                            onClick={() => revoke(s.id)}
                        >
                            Revoke
                        </Button>
                    )}
                </InfoRow>
            ))}
            {sessions.length === 0 && (
                <EmptyState>No active sessions.</EmptyState>
            )}
        </>
    );
}

// ============================================================================
// Comments Tab
// ============================================================================

function CommentsTab() {
    const [comments, setComments] = useState<UserComment[]>([]);
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        loadComments(1);
    }, []);

    const loadComments = async (p: number) => {
        const data = await api.get<PaginatedResponse<UserComment>>(
            `/users/me/comments?page=${p}&limit=20`
        );
        if (p === 1) setComments(data.data);
        else setComments((prev) => [...prev, ...data.data]);
        setHasMore(data.hasMore);
        setPage(p);
    };

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const bulkDelete = async () => {
        if (!confirm(`Delete ${selected.size} comment(s)?`)) return;
        try {
            await api.post('/users/me/comments/bulk-delete', {
                commentIds: Array.from(selected)
            });
            toast.success(`${selected.size} comment(s) deleted`);
            setSelected(new Set());
            loadComments(1);
        } catch {
            toast.error('Failed to delete comments');
        }
    };

    return (
        <Card>
            <CardTitle>My Comments</CardTitle>
            {selected.size > 0 && (
                <ButtonRow>
                    <Button $variant="danger" onClick={bulkDelete}>
                        Delete Selected ({selected.size})
                    </Button>
                    <Button
                        $variant="secondary"
                        onClick={() => setSelected(new Set())}
                    >
                        Clear Selection
                    </Button>
                </ButtonRow>
            )}
            {comments.length === 0 ? (
                <EmptyState>No comments yet.</EmptyState>
            ) : (
                comments.map((c) => (
                    <InfoRow key={c.id}>
                        <div
                            style={{
                                display: 'flex',
                                gap: '0.5rem',
                                alignItems: 'flex-start',
                                flex: 1
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={selected.has(c.id)}
                                onChange={() => toggle(c.id)}
                                disabled={c.isDeleted}
                            />
                            <div style={{ flex: 1 }}>
                                <InfoValue
                                    style={{
                                        textDecoration: c.isDeleted
                                            ? 'line-through'
                                            : 'none'
                                    }}
                                >
                                    {c.content.substring(0, 100)}
                                    {c.content.length > 100 ? '...' : ''}
                                </InfoValue>
                                <br />
                                <InfoLabel>
                                    on{' '}
                                    <a href={`/${c.slug}`}>
                                        {c.postTitle || c.slug}
                                    </a>{' '}
                                    — {formatDate(c.createdAt)}
                                    {!c.approved && ' — pending'}
                                    {c.isDeleted && ' — deleted'}
                                </InfoLabel>
                            </div>
                        </div>
                        <div
                            style={{
                                display: 'flex',
                                gap: '0.5rem',
                                fontSize: '0.75rem'
                            }}
                        >
                            <span title="Likes">+{c.likes}</span>
                            <span title="Dislikes">-{c.dislikes}</span>
                        </div>
                    </InfoRow>
                ))
            )}
            {hasMore && (
                <ButtonRow>
                    <Button
                        $variant="secondary"
                        onClick={() => loadComments(page + 1)}
                    >
                        Load More
                    </Button>
                </ButtonRow>
            )}
        </Card>
    );
}

// ============================================================================
// History Tab
// ============================================================================

function HistoryTab() {
    const [entries, setEntries] = useState<ReadHistoryEntry[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        loadHistory(1);
    }, []);

    const loadHistory = async (p: number) => {
        const data = await api.get<PaginatedResponse<ReadHistoryEntry>>(
            `/users/me/read-history?page=${p}&limit=20`
        );
        if (p === 1) setEntries(data.data);
        else setEntries((prev) => [...prev, ...data.data]);
        setHasMore(data.hasMore);
        setPage(p);
    };

    return (
        <Card>
            <CardTitle>Read History</CardTitle>
            {entries.length === 0 ? (
                <EmptyState>No reading history yet.</EmptyState>
            ) : (
                entries.map((e, i) => (
                    <InfoRow key={i}>
                        <div>
                            <InfoValue>
                                <a href={`/${e.postSlug}`}>
                                    {e.postTitle || e.postSlug}
                                </a>
                            </InfoValue>
                        </div>
                        <InfoLabel>{formatDate(e.readAt)}</InfoLabel>
                    </InfoRow>
                ))
            )}
            {hasMore && (
                <ButtonRow>
                    <Button
                        $variant="secondary"
                        onClick={() => loadHistory(page + 1)}
                    >
                        Load More
                    </Button>
                </ButtonRow>
            )}
        </Card>
    );
}
