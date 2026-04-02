'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';
import type {
    DashboardResponse,
    AdminPendingComment,
    AdminUser,
    AuditLogEntry,
    PaginatedResponse
} from '@derecksnotes/shared';
import {
    PageContainer,
    PageTitle,
    Card,
    CardTitle,
    Button,
    ButtonRow,
    InfoRow,
    InfoLabel,
    InfoValue,
    EmptyState,
    TabBar,
    Tab,
    ErrorMessage,
    Input
} from '@/components/ui/PageStyles';
import styled from 'styled-components';

const StatGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: ${(p) => p.theme.container.spacing.small};
    margin-bottom: ${(p) => p.theme.container.spacing.medium};
`;

const StatCard = styled.div`
    text-align: center;
    padding: ${(p) => p.theme.container.spacing.medium};
    border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    border-radius: ${(p) => p.theme.container.border.radius};
`;

const StatNumber = styled.div`
    font-size: ${(p) => p.theme.text.size.xlarge};
    font-weight: ${(p) => p.theme.text.weight.bold};
    color: ${(p) => p.theme.text.colour.header()};
`;

const StatLabel = styled.div`
    font-size: ${(p) => p.theme.text.size.small};
    color: ${(p) => p.theme.text.colour.light_grey()};
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

const Badge = styled.span<{ $color: string }>`
    display: inline-block;
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 0.7rem;
    font-weight: 600;
    background: ${(p) => p.$color}20;
    color: ${(p) => p.$color};
    margin-left: 4px;
`;

type ActiveTab = 'overview' | 'comments' | 'users' | 'audit';

export default function AdminPage() {
    const { user, isAdmin } = useAuth();
    const [tab, setTab] = useState<ActiveTab>('overview');

    if (!user || !isAdmin()) {
        return (
            <PageContainer>
                <EmptyState>
                    Access denied. Admin privileges required.
                </EmptyState>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageTitle>Admin Dashboard</PageTitle>
            <TabBar>
                <Tab
                    $active={tab === 'overview'}
                    onClick={() => setTab('overview')}
                >
                    Overview
                </Tab>
                <Tab
                    $active={tab === 'comments'}
                    onClick={() => setTab('comments')}
                >
                    Comments
                </Tab>
                <Tab $active={tab === 'users'} onClick={() => setTab('users')}>
                    Users
                </Tab>
                <Tab $active={tab === 'audit'} onClick={() => setTab('audit')}>
                    Audit Log
                </Tab>
            </TabBar>

            {tab === 'overview' && <OverviewTab />}
            {tab === 'comments' && <CommentsTab />}
            {tab === 'users' && <UsersTab />}
            {tab === 'audit' && <AuditTab />}
        </PageContainer>
    );
}

// ============================================================================
// Overview
// ============================================================================

function OverviewTab() {
    const [data, setData] = useState<DashboardResponse | null>(null);

    useEffect(() => {
        api.get<DashboardResponse>('/admin/dashboard')
            .then(setData)
            .catch(() => {});
    }, []);

    if (!data) return <EmptyState>Loading...</EmptyState>;

    return (
        <>
            <StatGrid>
                <StatCard>
                    <StatNumber>{data.stats.pendingComments}</StatNumber>
                    <StatLabel>Pending Comments</StatLabel>
                </StatCard>
                <StatCard>
                    <StatNumber>{data.stats.totalUsers}</StatNumber>
                    <StatLabel>Total Users</StatLabel>
                </StatCard>
                <StatCard>
                    <StatNumber>{data.stats.totalComments}</StatNumber>
                    <StatLabel>Total Comments</StatLabel>
                </StatCard>
                <StatCard>
                    <StatNumber>{data.stats.totalPosts}</StatNumber>
                    <StatLabel>Posts with Activity</StatLabel>
                </StatCard>
            </StatGrid>

            <Card>
                <CardTitle>Recent Admin Activity</CardTitle>
                {data.recentAudit.length === 0 ? (
                    <EmptyState>No recent activity.</EmptyState>
                ) : (
                    data.recentAudit.map((entry) => (
                        <InfoRow key={entry.id}>
                            <div>
                                <InfoValue>
                                    {entry.admin?.username || 'System'}
                                </InfoValue>
                                <Badge $color="#106BA3">{entry.action}</Badge>
                                <br />
                                <InfoLabel>
                                    {entry.targetType}
                                    {entry.targetId
                                        ? ` #${entry.targetId.substring(0, 8)}`
                                        : ''}
                                </InfoLabel>
                            </div>
                            <InfoLabel>{formatDate(entry.createdAt)}</InfoLabel>
                        </InfoRow>
                    ))
                )}
            </Card>
        </>
    );
}

// ============================================================================
// Comments Moderation
// ============================================================================

function CommentsTab() {
    const [comments, setComments] = useState<AdminPendingComment[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    useEffect(() => {
        load(1);
    }, []);

    const load = async (p: number) => {
        const data = await api.get<PaginatedResponse<AdminPendingComment>>(
            `/admin/comments/pending?page=${p}&limit=20`
        );
        setComments(p === 1 ? data.data : [...comments, ...data.data]);
        setHasMore(data.hasMore);
        setPage(p);
    };

    const approve = async (id: string) => {
        await api.post(`/admin/comments/${id}/approve`);
        setComments((prev) => prev.filter((c) => c.id !== id));
    };

    const reject = async (id: string) => {
        await api.post(`/admin/comments/${id}/reject`);
        setComments((prev) => prev.filter((c) => c.id !== id));
    };

    const bulkApprove = async () => {
        await api.post('/admin/comments/bulk-approve', {
            commentIds: Array.from(selected)
        });
        setSelected(new Set());
        load(1);
    };

    const bulkReject = async () => {
        if (!confirm(`Reject ${selected.size} comment(s)?`)) return;
        await api.post('/admin/comments/bulk-reject', {
            commentIds: Array.from(selected)
        });
        setSelected(new Set());
        load(1);
    };

    const toggle = (id: string) => {
        setSelected((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });
    };

    return (
        <Card>
            <CardTitle>Pending Comments</CardTitle>
            {selected.size > 0 && (
                <ButtonRow>
                    <Button onClick={bulkApprove}>
                        Approve ({selected.size})
                    </Button>
                    <Button $variant="danger" onClick={bulkReject}>
                        Reject ({selected.size})
                    </Button>
                    <Button
                        $variant="secondary"
                        onClick={() => setSelected(new Set())}
                    >
                        Clear
                    </Button>
                </ButtonRow>
            )}
            {comments.length === 0 ? (
                <EmptyState>No pending comments.</EmptyState>
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
                            />
                            <div style={{ flex: 1 }}>
                                <InfoValue>
                                    {c.user?.username || 'Unknown'}
                                </InfoValue>
                                <Badge $color="#999">
                                    on {c.postTitle || c.slug}
                                </Badge>
                                <br />
                                <InfoLabel>
                                    {c.content.substring(0, 150)}
                                    {c.content.length > 150 ? '...' : ''}
                                </InfoLabel>
                            </div>
                        </div>
                        <ButtonRow>
                            <Button onClick={() => approve(c.id)}>
                                Approve
                            </Button>
                            <Button
                                $variant="danger"
                                onClick={() => reject(c.id)}
                            >
                                Reject
                            </Button>
                        </ButtonRow>
                    </InfoRow>
                ))
            )}
            {hasMore && (
                <ButtonRow>
                    <Button $variant="secondary" onClick={() => load(page + 1)}>
                        Load More
                    </Button>
                </ButtonRow>
            )}
        </Card>
    );
}

// ============================================================================
// Users
// ============================================================================

function UsersTab() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        load(1);
    }, []);

    const load = async (p: number) => {
        const data = await api.get<PaginatedResponse<AdminUser>>(
            `/admin/users?page=${p}&limit=20`
        );
        setUsers(p === 1 ? data.data : [...users, ...data.data]);
        setHasMore(data.hasMore);
        setPage(p);
    };

    const ban = async (id: string) => {
        const reason = prompt('Ban reason (optional):');
        await api.post(`/admin/users/${id}/ban`, { reason });
        load(1);
    };

    const unban = async (id: string) => {
        await api.post(`/admin/users/${id}/unban`);
        load(1);
    };

    return (
        <Card>
            <CardTitle>Users</CardTitle>
            {users.map((u) => (
                <InfoRow key={u.id}>
                    <div>
                        <InfoValue>
                            <a
                                href={`/profile/${u.username}`}
                                style={{ color: 'inherit' }}
                            >
                                {u.username}
                            </a>
                        </InfoValue>
                        {u.groups.map((g) => (
                            <Badge
                                key={g}
                                $color={
                                    g === 'admin'
                                        ? '#c62828'
                                        : g === 'moderator'
                                          ? '#106BA3'
                                          : '#999'
                                }
                            >
                                {g}
                            </Badge>
                        ))}
                        {u.isBanned && <Badge $color="#c62828">banned</Badge>}
                        <br />
                        <InfoLabel>
                            {u.email || 'No email'} — joined{' '}
                            {formatDate(u.createdAt)}
                        </InfoLabel>
                    </div>
                    {u.isBanned ? (
                        <Button
                            $variant="secondary"
                            onClick={() => unban(u.id)}
                        >
                            Unban
                        </Button>
                    ) : (
                        <Button $variant="danger" onClick={() => ban(u.id)}>
                            Ban
                        </Button>
                    )}
                </InfoRow>
            ))}
            {users.length === 0 && <EmptyState>No users found.</EmptyState>}
            {hasMore && (
                <ButtonRow>
                    <Button $variant="secondary" onClick={() => load(page + 1)}>
                        Load More
                    </Button>
                </ButtonRow>
            )}
        </Card>
    );
}

// ============================================================================
// Audit Log
// ============================================================================

function AuditTab() {
    const [entries, setEntries] = useState<AuditLogEntry[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        load(1);
    }, []);

    const load = async (p: number) => {
        const data = await api.get<PaginatedResponse<AuditLogEntry>>(
            `/admin/audit?page=${p}&limit=30`
        );
        setEntries(p === 1 ? data.data : [...entries, ...data.data]);
        setHasMore(data.hasMore);
        setPage(p);
    };

    return (
        <Card>
            <CardTitle>Audit Log</CardTitle>
            {entries.length === 0 ? (
                <EmptyState>No audit entries.</EmptyState>
            ) : (
                entries.map((e) => (
                    <InfoRow key={e.id}>
                        <div>
                            <InfoValue>
                                {e.admin?.username || 'System'}
                            </InfoValue>
                            <Badge $color="#106BA3">{e.action}</Badge>
                            <Badge $color="#999">{e.targetType}</Badge>
                            <br />
                            <InfoLabel>
                                {e.targetId &&
                                    `Target: ${e.targetId.substring(0, 8)}... `}
                                {e.ipAddress && `IP: ${e.ipAddress} `}
                            </InfoLabel>
                        </div>
                        <InfoLabel>{formatDate(e.createdAt)}</InfoLabel>
                    </InfoRow>
                ))
            )}
            {hasMore && (
                <ButtonRow>
                    <Button $variant="secondary" onClick={() => load(page + 1)}>
                        Load More
                    </Button>
                </ButtonRow>
            )}
        </Card>
    );
}

function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
