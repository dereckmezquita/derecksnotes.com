'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    AdminHeader,
    AdminTitle,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeader,
    TableCell,
    Badge,
    Button,
    ButtonGroup,
    ActionBar,
    ActionBarLeft,
    ActionBarRight,
    LoadingContainer,
    LoadingSpinner,
    LoadingText,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateText,
    Alert,
    Pagination,
    PageButton,
    AccessDenied
} from '../components/AdminStyles';
import SearchBar from '@components/atomic/SearchBar';

interface AdminUser {
    id: string;
    username: string;
    email: string | null;
    displayName: string | null;
    groups: string[];
    isBanned: boolean;
    banExpiresAt: string | null;
    createdAt: string;
}

interface UsersResponse {
    users: AdminUser[];
    page: number;
    limit: number;
}

export default function AdminUsersPage() {
    const { isAdmin, hasPermission } = useAuth();
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [processing, setProcessing] = useState<string | null>(null);

    const canManageUsers = isAdmin() || hasPermission('admin.users.manage');

    const fetchUsers = useCallback(
        async (pageNum: number = 1, searchQuery: string = '') => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({
                    page: pageNum.toString(),
                    limit: '20'
                });
                if (searchQuery) {
                    params.append('search', searchQuery);
                }
                const res = await api.get<UsersResponse>(
                    `/admin/users?${params.toString()}`
                );
                setUsers(res.data.users);
                setPage(res.data.page);
                // Server doesn't return total, so calculate pages based on whether we got a full page
                const hasMore = res.data.users.length === res.data.limit;
                if (hasMore && res.data.page >= totalPages) {
                    setTotalPages(res.data.page + 1);
                } else if (!hasMore) {
                    setTotalPages(res.data.page);
                }
            } catch (err: any) {
                console.error('Error fetching users:', err);
                setError(err.response?.data?.error || 'Failed to load users');
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        if (canManageUsers) {
            fetchUsers(1, search);
        }
    }, [fetchUsers, canManageUsers, search]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        setPage(1);
    };

    const handleBan = async (userId: string) => {
        setProcessing(userId);
        try {
            await api.post(`/admin/users/${userId}/ban`);
            toast.success('User banned');
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId ? { ...u, isBanned: true } : u
                )
            );
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to ban user');
        } finally {
            setProcessing(null);
        }
    };

    const handleUnban = async (userId: string) => {
        setProcessing(userId);
        try {
            await api.post(`/admin/users/${userId}/unban`);
            toast.success('User unbanned');
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId
                        ? { ...u, isBanned: false, banExpiresAt: null }
                        : u
                )
            );
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to unban user');
        } finally {
            setProcessing(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
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

    if (error) {
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
                {error}
                <Button
                    variant="secondary"
                    size="small"
                    onClick={() => fetchUsers(1, search)}
                    style={{ marginLeft: 'auto' }}
                >
                    Retry
                </Button>
            </Alert>
        );
    }

    return (
        <>
            <AdminHeader>
                <AdminTitle>User Management</AdminTitle>
            </AdminHeader>

            <ActionBar>
                <ActionBarLeft>
                    <form onSubmit={handleSearch}>
                        <SearchBar
                            placeholder="Search users..."
                            value={searchInput}
                            onChange={setSearchInput}
                            styleContainer={{ width: '250px', margin: 0 }}
                        />
                    </form>
                </ActionBarLeft>
                <ActionBarRight>
                    {search && (
                        <Button
                            variant="secondary"
                            size="small"
                            onClick={() => {
                                setSearch('');
                                setSearchInput('');
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </ActionBarRight>
            </ActionBar>

            {loading ? (
                <LoadingContainer>
                    <LoadingSpinner />
                    <LoadingText>Loading users...</LoadingText>
                </LoadingContainer>
            ) : users.length === 0 ? (
                <EmptyState>
                    <EmptyStateIcon>
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
                                d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                            />
                        </svg>
                    </EmptyStateIcon>
                    <EmptyStateTitle>No users found</EmptyStateTitle>
                    <EmptyStateText>
                        {search
                            ? 'Try a different search term'
                            : 'No users have registered yet'}
                    </EmptyStateText>
                </EmptyState>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader $width="150px">
                                        Username
                                    </TableHeader>
                                    <TableHeader $width="200px">
                                        Email
                                    </TableHeader>
                                    <TableHeader $width="150px">
                                        Groups
                                    </TableHeader>
                                    <TableHeader $width="100px" $align="center">
                                        Status
                                    </TableHeader>
                                    <TableHeader $width="100px">
                                        Joined
                                    </TableHeader>
                                    <TableHeader $width="140px" $align="center">
                                        Actions
                                    </TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <strong>{user.username}</strong>
                                            {user.displayName && (
                                                <div
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        opacity: 0.6
                                                    }}
                                                >
                                                    {user.displayName}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell $truncate>
                                            {user.email || (
                                                <span style={{ opacity: 0.4 }}>
                                                    -
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    gap: '4px',
                                                    flexWrap: 'wrap'
                                                }}
                                            >
                                                {user.groups.length > 0 ? (
                                                    user.groups.map((group) => (
                                                        <Badge
                                                            key={group}
                                                            $variant={getGroupBadgeVariant(
                                                                group
                                                            )}
                                                        >
                                                            {group}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <Badge $variant="secondary">
                                                        user
                                                    </Badge>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell $align="center">
                                            {user.isBanned ? (
                                                <Badge $variant="danger">
                                                    Banned
                                                </Badge>
                                            ) : (
                                                <Badge $variant="success">
                                                    Active
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(user.createdAt)}
                                        </TableCell>
                                        <TableCell $align="center">
                                            <ButtonGroup>
                                                <Link
                                                    href={`/admin/users/${user.id}`}
                                                >
                                                    <Button
                                                        variant="secondary"
                                                        size="small"
                                                    >
                                                        View
                                                    </Button>
                                                </Link>
                                                {user.isBanned ? (
                                                    <Button
                                                        variant="warning"
                                                        size="small"
                                                        onClick={() =>
                                                            handleUnban(user.id)
                                                        }
                                                        disabled={
                                                            processing ===
                                                            user.id
                                                        }
                                                    >
                                                        Unban
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="danger"
                                                        size="small"
                                                        onClick={() =>
                                                            handleBan(user.id)
                                                        }
                                                        disabled={
                                                            processing ===
                                                                user.id ||
                                                            user.groups.includes(
                                                                'admin'
                                                            )
                                                        }
                                                    >
                                                        Ban
                                                    </Button>
                                                )}
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {totalPages > 1 && (
                        <Pagination>
                            <PageButton
                                disabled={page === 1}
                                onClick={() => fetchUsers(page - 1, search)}
                            >
                                Previous
                            </PageButton>
                            {Array.from(
                                { length: Math.min(totalPages, 5) },
                                (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (page <= 3) {
                                        pageNum = i + 1;
                                    } else if (page >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = page - 2 + i;
                                    }
                                    return pageNum;
                                }
                            ).map((p) => (
                                <PageButton
                                    key={p}
                                    $active={p === page}
                                    onClick={() => fetchUsers(p, search)}
                                >
                                    {p}
                                </PageButton>
                            ))}
                            <PageButton
                                disabled={page === totalPages}
                                onClick={() => fetchUsers(page + 1, search)}
                            >
                                Next
                            </PageButton>
                        </Pagination>
                    )}
                </>
            )}
        </>
    );
}
