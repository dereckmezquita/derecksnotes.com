'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    AdminHeader,
    AdminTitle,
    AdminSubtitle,
    Card,
    CardHeader,
    CardTitle,
    Badge,
    Button,
    ButtonGroup,
    FormGroup,
    Label,
    Input,
    Select,
    LoadingContainer,
    LoadingSpinner,
    LoadingText,
    Alert,
    AccessDenied,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter,
    CloseButton,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableCell
} from '../../components/AdminStyles';
import styled from 'styled-components';

const UserInfoGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${(props) => props.theme.container.spacing.medium};
    margin-bottom: ${(props) => props.theme.container.spacing.large};
`;

const InfoItem = styled.div`
    h4 {
        margin: 0 0 ${(props) => props.theme.container.spacing.xsmall} 0;
        color: ${(props) => props.theme.text.colour.light_grey()};
        font-size: ${(props) => props.theme.text.size.small};
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }
    p {
        margin: 0;
        font-size: ${(props) => props.theme.text.size.normal};
        color: ${(props) => props.theme.text.colour.primary()};
    }
`;

const GroupsList = styled.div`
    display: flex;
    gap: ${(props) => props.theme.container.spacing.small};
    flex-wrap: wrap;
    margin-bottom: ${(props) => props.theme.container.spacing.medium};
`;

const DangerZone = styled.div`
    margin-top: ${(props) => props.theme.container.spacing.xlarge};
    padding: ${(props) => props.theme.container.spacing.large};
    border: 1px solid ${(props) => props.theme.colours.error}40;
    border-radius: ${(props) => props.theme.container.border.radius};
    background: ${(props) => props.theme.colours.error}10;

    h3 {
        color: ${(props) => props.theme.colours.error};
        margin: 0 0 ${(props) => props.theme.container.spacing.small} 0;
    }

    p {
        color: ${(props) => props.theme.text.colour.light_grey()};
        margin: 0 0 ${(props) => props.theme.container.spacing.medium} 0;
    }
`;

interface UserDetail {
    id: string;
    username: string;
    email: string | null;
    displayName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    groups: string[];
    isBanned: boolean;
    banExpiresAt: string | null;
    banReason: string | null;
    createdAt: string;
    emailVerified: boolean;
}

interface Group {
    id: string;
    name: string;
    description: string | null;
}

export default function AdminUserDetailPage() {
    const params = useParams();
    const router = useRouter();
    const userId = params.id as string;
    const { isAdmin, hasPermission, user: currentUser } = useAuth();

    const [user, setUser] = useState<UserDetail | null>(null);
    const [groups, setGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    // Modal states
    const [showBanModal, setShowBanModal] = useState(false);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Ban form
    const [banReason, setBanReason] = useState('');
    const [banDuration, setBanDuration] = useState<string>('permanent');

    // Group form
    const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

    const canManageUsers = isAdmin() || hasPermission('admin.users.manage');

    const fetchUser = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [userRes, groupsRes] = await Promise.all([
                api.get<{ user: UserDetail }>(`/admin/users/${userId}`),
                api.get<{ groups: Group[] }>('/admin/groups')
            ]);
            setUser(userRes.data.user);
            setGroups(groupsRes.data.groups);
            setSelectedGroups(userRes.data.user.groups);
        } catch (err: any) {
            console.error('Error fetching user:', err);
            setError(err.response?.data?.error || 'Failed to load user');
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        if (canManageUsers && userId) {
            fetchUser();
        }
    }, [fetchUser, canManageUsers, userId]);

    const handleBan = async () => {
        if (!user) return;
        setProcessing(true);
        try {
            let expiresAt: string | null = null;
            if (banDuration !== 'permanent') {
                const days = parseInt(banDuration);
                const date = new Date();
                date.setDate(date.getDate() + days);
                expiresAt = date.toISOString();
            }

            await api.post(`/admin/users/${userId}/ban`, {
                reason: banReason || undefined,
                expiresAt
            });
            toast.success('User banned');
            setUser({
                ...user,
                isBanned: true,
                banReason,
                banExpiresAt: expiresAt
            });
            setShowBanModal(false);
            setBanReason('');
            setBanDuration('permanent');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to ban user');
        } finally {
            setProcessing(false);
        }
    };

    const handleUnban = async () => {
        if (!user) return;
        setProcessing(true);
        try {
            await api.post(`/admin/users/${userId}/unban`);
            toast.success('User unbanned');
            setUser({
                ...user,
                isBanned: false,
                banReason: null,
                banExpiresAt: null
            });
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to unban user');
        } finally {
            setProcessing(false);
        }
    };

    const handleUpdateGroups = async () => {
        if (!user) return;
        setProcessing(true);
        try {
            await api.post(`/admin/users/${userId}/groups`, {
                groups: selectedGroups
            });
            toast.success('Groups updated');
            setUser({ ...user, groups: selectedGroups });
            setShowGroupModal(false);
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to update groups');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async () => {
        setProcessing(true);
        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success('User deleted');
            router.push('/admin/users');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to delete user');
            setProcessing(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getGroupBadgeVariant = (
        group: string
    ): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
        switch (group) {
            case 'admin':
                return 'danger';
            case 'moderator':
                return 'warning';
            case 'trusted':
                return 'success';
            default:
                return 'secondary';
        }
    };

    if (!canManageUsers) {
        return (
            <AccessDenied>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                </svg>
                <h1>Access Denied</h1>
                <p>You do not have permission to manage users.</p>
            </AccessDenied>
        );
    }

    if (loading) {
        return (
            <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Loading user...</LoadingText>
            </LoadingContainer>
        );
    }

    if (error || !user) {
        return (
            <Alert $variant="error">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    width={20}
                    height={20}
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                    />
                </svg>
                {error || 'User not found'}
                <Link href="/admin/users" style={{ marginLeft: 'auto' }}>
                    <Button variant="secondary" size="small">
                        Back to Users
                    </Button>
                </Link>
            </Alert>
        );
    }

    const isOwnAccount = currentUser?.id === user.id;
    const isTargetAdmin = user.groups.includes('admin');

    return (
        <>
            <AdminHeader>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                    }}
                >
                    <Link href="/admin/users">
                        <Button variant="secondary" size="small">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                width={16}
                                height={16}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                                />
                            </svg>
                            Back
                        </Button>
                    </Link>
                    <div>
                        <AdminTitle>{user.username}</AdminTitle>
                        <AdminSubtitle>User Details</AdminSubtitle>
                    </div>
                </div>
            </AdminHeader>

            {/* User Info Card */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {user.isBanned ? (
                            <Badge $variant="danger">Banned</Badge>
                        ) : (
                            <Badge $variant="success">Active</Badge>
                        )}
                        {user.emailVerified && (
                            <Badge $variant="primary">Email Verified</Badge>
                        )}
                    </div>
                </CardHeader>

                <UserInfoGrid>
                    <InfoItem>
                        <h4>Username</h4>
                        <p>{user.username}</p>
                    </InfoItem>
                    <InfoItem>
                        <h4>Display Name</h4>
                        <p>{user.displayName || '—'}</p>
                    </InfoItem>
                    <InfoItem>
                        <h4>Email</h4>
                        <p>{user.email || '—'}</p>
                    </InfoItem>
                    <InfoItem>
                        <h4>Joined</h4>
                        <p>{formatDate(user.createdAt)}</p>
                    </InfoItem>
                </UserInfoGrid>

                {user.bio && (
                    <InfoItem style={{ marginBottom: '1rem' }}>
                        <h4>Bio</h4>
                        <p>{user.bio}</p>
                    </InfoItem>
                )}

                <InfoItem>
                    <h4>Groups</h4>
                    <GroupsList>
                        {user.groups.length > 0 ? (
                            user.groups.map((group) => (
                                <Badge
                                    key={group}
                                    $variant={getGroupBadgeVariant(group)}
                                >
                                    {group}
                                </Badge>
                            ))
                        ) : (
                            <span style={{ opacity: 0.5 }}>No groups</span>
                        )}
                    </GroupsList>
                </InfoItem>

                <ButtonGroup>
                    <Button
                        variant="primary"
                        onClick={() => {
                            setSelectedGroups(user.groups);
                            setShowGroupModal(true);
                        }}
                        disabled={isOwnAccount}
                    >
                        Manage Groups
                    </Button>
                    {user.isBanned ? (
                        <Button
                            variant="warning"
                            onClick={handleUnban}
                            disabled={processing}
                        >
                            Unban User
                        </Button>
                    ) : (
                        <Button
                            variant="danger"
                            onClick={() => setShowBanModal(true)}
                            disabled={isOwnAccount || isTargetAdmin}
                        >
                            Ban User
                        </Button>
                    )}
                </ButtonGroup>
            </Card>

            {/* Ban Info */}
            {user.isBanned && (
                <Card style={{ marginBottom: '1.5rem' }}>
                    <CardHeader>
                        <CardTitle>Ban Information</CardTitle>
                    </CardHeader>
                    <UserInfoGrid>
                        <InfoItem>
                            <h4>Reason</h4>
                            <p>{user.banReason || 'No reason provided'}</p>
                        </InfoItem>
                        <InfoItem>
                            <h4>Expires</h4>
                            <p>
                                {user.banExpiresAt
                                    ? formatDate(user.banExpiresAt)
                                    : 'Permanent'}
                            </p>
                        </InfoItem>
                    </UserInfoGrid>
                </Card>
            )}

            {/* Danger Zone */}
            {isAdmin() && !isOwnAccount && !isTargetAdmin && (
                <DangerZone>
                    <h3>Danger Zone</h3>
                    <p>
                        Permanently delete this user account. This action cannot
                        be undone.
                    </p>
                    <Button
                        variant="danger"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete User
                    </Button>
                </DangerZone>
            )}

            {/* Ban Modal */}
            {showBanModal && (
                <ModalBackdrop onClick={() => setShowBanModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Ban User</ModalTitle>
                            <CloseButton onClick={() => setShowBanModal(false)}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    width={20}
                                    height={20}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </CloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label>Reason (optional)</Label>
                                <Input
                                    value={banReason}
                                    onChange={(e) =>
                                        setBanReason(e.target.value)
                                    }
                                    placeholder="Enter ban reason..."
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label>Duration</Label>
                                <Select
                                    value={banDuration}
                                    onChange={(e) =>
                                        setBanDuration(e.target.value)
                                    }
                                >
                                    <option value="permanent">Permanent</option>
                                    <option value="1">1 day</option>
                                    <option value="7">7 days</option>
                                    <option value="30">30 days</option>
                                    <option value="90">90 days</option>
                                    <option value="365">1 year</option>
                                </Select>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="secondary"
                                onClick={() => setShowBanModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleBan}
                                disabled={processing}
                            >
                                {processing ? 'Banning...' : 'Ban User'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </ModalBackdrop>
            )}

            {/* Group Modal */}
            {showGroupModal && (
                <ModalBackdrop onClick={() => setShowGroupModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Manage Groups</ModalTitle>
                            <CloseButton
                                onClick={() => setShowGroupModal(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    width={20}
                                    height={20}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </CloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <p style={{ marginBottom: '1rem', opacity: 0.7 }}>
                                Select the groups this user should belong to:
                            </p>
                            {groups.map((group) => (
                                <FormGroup
                                    key={group.id}
                                    style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        marginBottom: '0.5rem'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        id={`group-${group.id}`}
                                        checked={selectedGroups.includes(
                                            group.name
                                        )}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedGroups([
                                                    ...selectedGroups,
                                                    group.name
                                                ]);
                                            } else {
                                                setSelectedGroups(
                                                    selectedGroups.filter(
                                                        (g) => g !== group.name
                                                    )
                                                );
                                            }
                                        }}
                                        style={{
                                            width: '18px',
                                            height: '18px',
                                            marginRight: '0.75rem'
                                        }}
                                    />
                                    <Label
                                        htmlFor={`group-${group.id}`}
                                        style={{ marginBottom: 0 }}
                                    >
                                        <Badge
                                            $variant={getGroupBadgeVariant(
                                                group.name
                                            )}
                                            style={{ marginRight: '0.5rem' }}
                                        >
                                            {group.name}
                                        </Badge>
                                        {group.description && (
                                            <span style={{ opacity: 0.7 }}>
                                                {group.description}
                                            </span>
                                        )}
                                    </Label>
                                </FormGroup>
                            ))}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="secondary"
                                onClick={() => setShowGroupModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={handleUpdateGroups}
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </ModalBackdrop>
            )}

            {/* Delete Modal */}
            {showDeleteModal && (
                <ModalBackdrop onClick={() => setShowDeleteModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Delete User</ModalTitle>
                            <CloseButton
                                onClick={() => setShowDeleteModal(false)}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    width={20}
                                    height={20}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </CloseButton>
                        </ModalHeader>
                        <ModalBody>
                            <Alert $variant="warning">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    width={20}
                                    height={20}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                    />
                                </svg>
                                This action cannot be undone!
                            </Alert>
                            <p>
                                Are you sure you want to permanently delete user{' '}
                                <strong>{user.username}</strong>? All their data
                                will be removed.
                            </p>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="danger"
                                onClick={handleDelete}
                                disabled={processing}
                            >
                                {processing
                                    ? 'Deleting...'
                                    : 'Yes, Delete User'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </>
    );
}
