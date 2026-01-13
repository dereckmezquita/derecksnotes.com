'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import Link from 'next/link';
import styled from 'styled-components';
import {
    AdminHeader,
    AdminTitle,
    AdminSubtitle,
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

// Dashboard-specific styled components
const DashboardGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${(props) => props.theme.container.spacing.medium};
    margin-bottom: ${(props) => props.theme.container.spacing.large};

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const QuickStatCard = styled(Link)`
    display: flex;
    align-items: center;
    padding: ${(props) => props.theme.container.spacing.medium};
    background: ${(props) => props.theme.container.background.colour.solid()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    text-decoration: none;
    transition: all 0.2s ease;

    &:hover {
        border-color: ${(props) => props.theme.theme_colours[5]()};
        box-shadow: ${(props) => props.theme.container.shadow.box};
    }
`;

const QuickStatIcon = styled.div<{
    $variant: 'warning' | 'danger' | 'primary' | 'success';
}>`
    width: 48px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: ${(props) => props.theme.container.spacing.medium};
    flex-shrink: 0;

    ${(props) => {
        switch (props.$variant) {
            case 'danger':
                return `background: ${props.theme.colours.error}15; color: ${props.theme.colours.error};`;
            case 'warning':
                return `background: ${props.theme.colours.warning}15; color: ${props.theme.colours.warning};`;
            case 'success':
                return `background: ${props.theme.colours.success}15; color: ${props.theme.colours.success};`;
            default:
                return `background: ${props.theme.theme_colours[9]()}; color: ${props.theme.theme_colours[5]()};`;
        }
    }}

    svg {
        width: 24px;
        height: 24px;
    }
`;

const QuickStatContent = styled.div`
    flex: 1;
`;

const QuickStatValue = styled.div`
    font-size: 1.75rem;
    font-weight: ${(props) => props.theme.text.weight.bold};
    color: ${(props) => props.theme.text.colour.header()};
    line-height: 1;
`;

const QuickStatLabel = styled.div`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
    margin-top: 4px;
`;

const QuickStatBadge = styled.div<{ $urgent?: boolean }>`
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: ${(props) => props.theme.text.weight.medium};
    background: ${(props) =>
        props.$urgent
            ? props.theme.colours.error + '20'
            : props.theme.colours.success + '20'};
    color: ${(props) =>
        props.$urgent
            ? props.theme.colours.error
            : props.theme.colours.success};
`;

const SectionTitle = styled.h2`
    font-size: ${(props) => props.theme.text.size.medium};
    color: ${(props) => props.theme.text.colour.header()};
    margin: 0 0 ${(props) => props.theme.container.spacing.medium} 0;
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};

    svg {
        width: 20px;
        height: 20px;
    }
`;

const TwoColumnLayout = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${(props) => props.theme.container.spacing.large};

    @media (max-width: 1100px) {
        grid-template-columns: 1fr;
    }
`;

const NavigationGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: ${(props) => props.theme.container.spacing.small};
    margin-bottom: ${(props) => props.theme.container.spacing.large};
`;

const NavCard = styled(Link)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: ${(props) => props.theme.container.spacing.medium};
    background: ${(props) => props.theme.container.background.colour.solid()};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    text-decoration: none;
    transition: all 0.2s ease;
    text-align: center;

    &:hover {
        border-color: ${(props) => props.theme.theme_colours[5]()};
        background: ${(props) => props.theme.theme_colours[9]()}30;
    }

    svg {
        width: 24px;
        height: 24px;
        color: ${(props) => props.theme.theme_colours[5]()};
        margin-bottom: ${(props) => props.theme.container.spacing.small};
    }

    span {
        font-size: ${(props) => props.theme.text.size.small};
        color: ${(props) => props.theme.text.colour.primary()};
        font-weight: ${(props) => props.theme.text.weight.medium};
    }
`;

interface DashboardStats {
    pendingComments: number;
    pendingReports: number;
    totalUsers: number;
    totalComments: number;
}

interface AuditLogEntry {
    id: string;
    adminId: string;
    admin: {
        id: string;
        username: string;
    };
    action: string;
    targetType: string;
    targetId: string | null;
    details: string | null;
    createdAt: string;
}

interface DashboardResponse {
    stats: DashboardStats;
    recentActivity: AuditLogEntry[];
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

    return (
        <>
            <AdminHeader>
                <AdminTitle>Admin Dashboard</AdminTitle>
                <AdminSubtitle>
                    Welcome back, {user?.displayName || user?.username}
                </AdminSubtitle>
            </AdminHeader>

            {/* Quick Stats - Actionable items */}
            <DashboardGrid>
                {(isAdmin() || hasPermission('comment.approve')) && (
                    <QuickStatCard href="/admin/comments">
                        <QuickStatIcon
                            $variant={
                                stats?.pendingComments ? 'warning' : 'success'
                            }
                        >
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
                        </QuickStatIcon>
                        <QuickStatContent>
                            <QuickStatValue>
                                {stats?.pendingComments ?? 0}
                            </QuickStatValue>
                            <QuickStatLabel>Pending Comments</QuickStatLabel>
                        </QuickStatContent>
                        <QuickStatBadge
                            $urgent={(stats?.pendingComments ?? 0) > 0}
                        >
                            {(stats?.pendingComments ?? 0) > 0
                                ? 'Needs Review'
                                : 'All Clear'}
                        </QuickStatBadge>
                    </QuickStatCard>
                )}

                {(isAdmin() || hasPermission('report.view')) && (
                    <QuickStatCard href="/admin/reports">
                        <QuickStatIcon
                            $variant={
                                stats?.pendingReports ? 'danger' : 'success'
                            }
                        >
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
                        </QuickStatIcon>
                        <QuickStatContent>
                            <QuickStatValue>
                                {stats?.pendingReports ?? 0}
                            </QuickStatValue>
                            <QuickStatLabel>Pending Reports</QuickStatLabel>
                        </QuickStatContent>
                        <QuickStatBadge
                            $urgent={(stats?.pendingReports ?? 0) > 0}
                        >
                            {(stats?.pendingReports ?? 0) > 0
                                ? 'Needs Action'
                                : 'All Clear'}
                        </QuickStatBadge>
                    </QuickStatCard>
                )}

                {(isAdmin() || hasPermission('admin.users.manage')) && (
                    <QuickStatCard href="/admin/users">
                        <QuickStatIcon $variant="primary">
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
                        </QuickStatIcon>
                        <QuickStatContent>
                            <QuickStatValue>
                                {stats?.totalUsers ?? 0}
                            </QuickStatValue>
                            <QuickStatLabel>Total Users</QuickStatLabel>
                        </QuickStatContent>
                    </QuickStatCard>
                )}

                <QuickStatCard href="/admin/comments">
                    <QuickStatIcon $variant="success">
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
                                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
                            />
                        </svg>
                    </QuickStatIcon>
                    <QuickStatContent>
                        <QuickStatValue>
                            {stats?.totalComments ?? 0}
                        </QuickStatValue>
                        <QuickStatLabel>Total Comments</QuickStatLabel>
                    </QuickStatContent>
                </QuickStatCard>
            </DashboardGrid>

            {/* Quick Navigation */}
            <SectionTitle>
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
                        d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                    />
                </svg>
                Quick Access
            </SectionTitle>
            <NavigationGrid>
                {(isAdmin() || hasPermission('comment.approve')) && (
                    <NavCard href="/admin/comments">
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
                        <span>Comments</span>
                    </NavCard>
                )}
                {(isAdmin() || hasPermission('admin.users.manage')) && (
                    <NavCard href="/admin/users">
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
                        <span>Users</span>
                    </NavCard>
                )}
                {(isAdmin() || hasPermission('report.view')) && (
                    <NavCard href="/admin/reports">
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
                        <span>Reports</span>
                    </NavCard>
                )}
                {(isAdmin() || hasPermission('admin.audit.view')) && (
                    <NavCard href="/admin/audit">
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
                        <span>Audit Log</span>
                    </NavCard>
                )}
                {(isAdmin() || hasPermission('admin.dashboard')) && (
                    <NavCard href="/admin/analytics">
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
                                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                            />
                        </svg>
                        <span>Analytics</span>
                    </NavCard>
                )}
                {(isAdmin() || hasPermission('admin.users.manage')) && (
                    <NavCard href="/admin/groups">
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
                                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                            />
                        </svg>
                        <span>Groups</span>
                    </NavCard>
                )}
            </NavigationGrid>

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
                                    <TableHeader>When</TableHeader>
                                </TableRow>
                            </TableHead>
                            <tbody>
                                {recentActivity.slice(0, 8).map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell>
                                            {entry.admin?.username || 'Unknown'}
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
