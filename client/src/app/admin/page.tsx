'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    AdminHeader,
    AdminTitle,
    AdminSubtitle,
    StatsGrid,
    StatCard,
    StatValue,
    StatLabel,
    StatIcon,
    Card,
    CardHeader,
    CardTitle,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    Badge,
    Button,
    LoadingContainer,
    LoadingSpinner,
    LoadingText,
    EmptyState,
    Alert
} from './components/AdminStyles';

interface DashboardStats {
    pendingComments: number;
    pendingReports: number;
    totalUsers: number;
    totalComments: number;
    newUsersToday: number;
    newCommentsToday: number;
}

interface AuditLogEntry {
    id: string;
    adminId: string;
    adminUsername: string;
    action: string;
    targetType: string;
    targetId: string | null;
    details: string | null;
    createdAt: string;
}

interface DashboardResponse {
    stats: DashboardStats;
    recentAudit: AuditLogEntry[];
}

export default function AdminDashboard() {
    const { user, isAdmin, hasPermission } = useAuth();
    const [data, setData] = useState<DashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get<DashboardResponse>('/admin/dashboard');
            setData(res.data);
        } catch (err: any) {
            console.error('Error fetching dashboard:', err);
            setError(
                err.response?.data?.error || 'Failed to load dashboard data'
            );
            toast.error('Failed to load dashboard');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getActionBadgeVariant = (
        action: string
    ): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
        if (action.includes('approve')) return 'success';
        if (action.includes('reject') || action.includes('ban'))
            return 'danger';
        if (action.includes('delete')) return 'danger';
        if (action.includes('unban')) return 'warning';
        return 'secondary';
    };

    if (loading) {
        return (
            <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Loading dashboard...</LoadingText>
            </LoadingContainer>
        );
    }

    if (error) {
        return (
            <Alert variant="error">
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
                    onClick={fetchDashboard}
                    style={{ marginLeft: 'auto' }}
                >
                    Retry
                </Button>
            </Alert>
        );
    }

    const stats = data?.stats;
    const recentAudit = data?.recentAudit || [];

    return (
        <>
            <AdminHeader>
                <AdminTitle>Dashboard</AdminTitle>
                <AdminSubtitle>
                    Welcome back, {user?.displayName || user?.username}
                </AdminSubtitle>
            </AdminHeader>

            {/* Stats Grid */}
            <StatsGrid>
                {(isAdmin() || hasPermission('comment.approve')) && (
                    <StatCard>
                        <StatIcon variant="warning">
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
                                    d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                        </StatIcon>
                        <StatValue>{stats?.pendingComments ?? 0}</StatValue>
                        <StatLabel>Pending Comments</StatLabel>
                    </StatCard>
                )}

                {(isAdmin() || hasPermission('report.view')) && (
                    <StatCard>
                        <StatIcon variant="danger">
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
                                    d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
                                />
                            </svg>
                        </StatIcon>
                        <StatValue>{stats?.pendingReports ?? 0}</StatValue>
                        <StatLabel>Pending Reports</StatLabel>
                    </StatCard>
                )}

                {(isAdmin() || hasPermission('admin.users.manage')) && (
                    <StatCard>
                        <StatIcon variant="primary">
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
                        </StatIcon>
                        <StatValue>{stats?.totalUsers ?? 0}</StatValue>
                        <StatLabel>Total Users</StatLabel>
                    </StatCard>
                )}

                <StatCard>
                    <StatIcon variant="success">
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
                                d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                            />
                        </svg>
                    </StatIcon>
                    <StatValue>{stats?.totalComments ?? 0}</StatValue>
                    <StatLabel>Total Comments</StatLabel>
                </StatCard>
            </StatsGrid>

            {/* Quick Actions */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}
                >
                    {(isAdmin() || hasPermission('comment.approve')) && (
                        <Link href="/admin/comments">
                            <Button variant="primary">
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
                                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                                    />
                                </svg>
                                Review Comments
                                {stats?.pendingComments
                                    ? ` (${stats.pendingComments})`
                                    : ''}
                            </Button>
                        </Link>
                    )}
                    {(isAdmin() || hasPermission('report.view')) && (
                        <Link href="/admin/reports">
                            <Button variant="warning">
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
                                        d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
                                    />
                                </svg>
                                View Reports
                                {stats?.pendingReports
                                    ? ` (${stats.pendingReports})`
                                    : ''}
                            </Button>
                        </Link>
                    )}
                    {(isAdmin() || hasPermission('admin.users.manage')) && (
                        <Link href="/admin/users">
                            <Button variant="secondary">
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
                                        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                                    />
                                </svg>
                                Manage Users
                            </Button>
                        </Link>
                    )}
                </div>
            </Card>

            {/* Recent Audit Activity */}
            {(isAdmin() || hasPermission('admin.audit.view')) && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <Link href="/admin/audit">
                            <Button variant="secondary" size="small">
                                View All
                            </Button>
                        </Link>
                    </CardHeader>

                    {recentAudit.length === 0 ? (
                        <EmptyState>
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
                                    d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                                />
                            </svg>
                            <h3>No activity yet</h3>
                            <p>Admin actions will appear here.</p>
                        </EmptyState>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>Admin</TableHeader>
                                    <TableHeader>Action</TableHeader>
                                    <TableHeader>Target</TableHeader>
                                    <TableHeader>Date</TableHeader>
                                </TableRow>
                            </TableHead>
                            <tbody>
                                {recentAudit.slice(0, 10).map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>
                                            {entry.adminUsername}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getActionBadgeVariant(
                                                    entry.action
                                                )}
                                            >
                                                {entry.action}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {entry.targetType}
                                            {entry.targetId &&
                                                `: ${entry.targetId.substring(0, 8)}...`}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(entry.createdAt)}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>
                    )}
                </Card>
            )}
        </>
    );
}
