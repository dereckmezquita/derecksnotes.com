'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import Link from 'next/link';
import {
    AdminHeader,
    AdminTitle,
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
    Alert,
    AttentionSection,
    AttentionHeader,
    AttentionItem,
    AttentionIcon,
    AttentionText,
    AttentionCount,
    AttentionLink,
    AttentionEmpty,
    SiteOverviewSection,
    SiteOverviewDivider,
    InlineStats,
    InlineStat,
    StatSeparator
} from './components/AdminStyles';

import type {
    DashboardStats,
    AuditLogDetails,
    AuditLogEntry,
    DashboardResponse
} from '@/types/api';

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
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
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

    const getDetailsPreview = (entry: AuditLogEntry): string | null => {
        if (!entry.details) return null;

        // For comment actions, show content preview
        if (entry.details.contentPreview) {
            const preview = entry.details.contentPreview;
            return preview.length > 50 ? `${preview.slice(0, 50)}...` : preview;
        }

        // For bulk operations, show count
        if (
            entry.details.count !== undefined &&
            typeof entry.details.count === 'number'
        ) {
            return `${entry.details.count} ${entry.targetType}${entry.details.count !== 1 ? 's' : ''}`;
        }

        // For user actions, show username and reason
        if (entry.details.username) {
            if (entry.details.reason) {
                return `@${entry.details.username}: ${entry.details.reason.slice(0, 30)}${entry.details.reason.length > 30 ? '...' : ''}`;
            }
            return `@${entry.details.username}`;
        }

        // For post-related actions, show postSlug
        if (entry.details.postSlug) {
            const slug = entry.details.postSlug as string;
            const shortSlug = slug.split('/').pop() || slug;
            return shortSlug.length > 30
                ? `${shortSlug.slice(0, 30)}...`
                : shortSlug;
        }

        return null;
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
                    onClick={fetchDashboard}
                    style={{ marginLeft: 'auto' }}
                >
                    Retry
                </Button>
            </Alert>
        );
    }

    const stats = data?.stats;
    const recentActivity = data?.recentActivity || [];

    const hasPendingItems =
        (stats?.pendingComments ?? 0) > 0 || (stats?.pendingReports ?? 0) > 0;

    return (
        <>
            <AdminHeader>
                <AdminTitle>Dashboard</AdminTitle>
            </AdminHeader>

            {/* Needs Attention Section */}
            <AttentionSection>
                <AttentionHeader>Needs Attention</AttentionHeader>
                {!hasPendingItems ? (
                    <AttentionEmpty>
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
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        All clear! No pending items require your attention.
                    </AttentionEmpty>
                ) : (
                    <>
                        {(isAdmin() || hasPermission('comment.approve')) &&
                            (stats?.pendingComments ?? 0) > 0 && (
                                <AttentionItem $variant="warning">
                                    <AttentionIcon $variant="warning">
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
                                    </AttentionIcon>
                                    <AttentionText>
                                        <AttentionCount>
                                            {stats?.pendingComments}
                                        </AttentionCount>{' '}
                                        comment
                                        {(stats?.pendingComments ?? 0) !== 1
                                            ? 's'
                                            : ''}{' '}
                                        awaiting approval
                                    </AttentionText>
                                    <Link
                                        href="/admin/comments"
                                        passHref
                                        legacyBehavior
                                    >
                                        <AttentionLink>
                                            Review
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                />
                                            </svg>
                                        </AttentionLink>
                                    </Link>
                                </AttentionItem>
                            )}

                        {(isAdmin() || hasPermission('report.view')) &&
                            (stats?.pendingReports ?? 0) > 0 && (
                                <AttentionItem $variant="danger">
                                    <AttentionIcon $variant="danger">
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
                                    </AttentionIcon>
                                    <AttentionText>
                                        <AttentionCount>
                                            {stats?.pendingReports}
                                        </AttentionCount>{' '}
                                        report
                                        {(stats?.pendingReports ?? 0) !== 1
                                            ? 's'
                                            : ''}{' '}
                                        need review
                                    </AttentionText>
                                    <Link
                                        href="/admin/reports"
                                        passHref
                                        legacyBehavior
                                    >
                                        <AttentionLink>
                                            Review
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                                                />
                                            </svg>
                                        </AttentionLink>
                                    </Link>
                                </AttentionItem>
                            )}
                    </>
                )}
            </AttentionSection>

            {/* Site Overview - Inline Stats */}
            <SiteOverviewSection>
                <SiteOverviewDivider>
                    <span>Site Overview</span>
                </SiteOverviewDivider>
                <InlineStats>
                    {(isAdmin() || hasPermission('admin.users.manage')) && (
                        <>
                            <Link href="/admin/users" passHref legacyBehavior>
                                <InlineStat>
                                    <strong>{stats?.totalUsers ?? 0}</strong>{' '}
                                    users
                                </InlineStat>
                            </Link>
                            <StatSeparator>&bull;</StatSeparator>
                        </>
                    )}
                    <Link href="/admin/comments" passHref legacyBehavior>
                        <InlineStat>
                            <strong>{stats?.totalComments ?? 0}</strong>{' '}
                            comments
                        </InlineStat>
                    </Link>
                </InlineStats>
            </SiteOverviewSection>

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

                    {recentActivity.length === 0 ? (
                        <AttentionEmpty>
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
                            No activity yet. Admin actions will appear here.
                        </AttentionEmpty>
                    ) : (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>Admin</TableHeader>
                                    <TableHeader>Action</TableHeader>
                                    <TableHeader>Details</TableHeader>
                                    <TableHeader>When</TableHeader>
                                </TableRow>
                            </TableHead>
                            <tbody>
                                {recentActivity.slice(0, 8).map((entry) => {
                                    const preview = getDetailsPreview(entry);
                                    return (
                                        <TableRow key={entry.id}>
                                            <TableCell>
                                                {entry.admin?.username ||
                                                    'Unknown'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    $variant={getActionBadgeVariant(
                                                        entry.action
                                                    )}
                                                >
                                                    {entry.action}
                                                </Badge>
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    maxWidth: '200px',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                    color: preview
                                                        ? 'inherit'
                                                        : '#999',
                                                    fontStyle: preview
                                                        ? 'normal'
                                                        : 'italic'
                                                }}
                                                title={preview || undefined}
                                            >
                                                {preview ||
                                                    `${entry.targetType}: ${entry.targetId?.substring(0, 8) || 'N/A'}...`}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(entry.createdAt)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                </Card>
            )}
        </>
    );
}
