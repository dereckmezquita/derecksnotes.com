'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/utils/api';
import { toast } from 'sonner';
import type {
    DashboardResponse,
    AdminPendingComment,
    AdminUser,
    AuditLogEntry,
    AnalyticsData,
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
    Tab
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
    background: ${(p) => p.theme.container.background.colour.card()};
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

const BarChart = styled.div`
    display: flex;
    flex-direction: column;
    gap: 3px;
    margin: ${(p) => p.theme.container.spacing.small} 0;
`;

const BarRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${(p) => p.theme.container.spacing.small};
    font-size: 0.75rem;
    font-family: ${(p) => p.theme.text.font.roboto};
`;

const BarLabel = styled.span`
    width: 60px;
    text-align: right;
    color: ${(p) => p.theme.text.colour.light_grey()};
    flex-shrink: 0;
`;

const Bar = styled.div<{ $width: number }>`
    height: 14px;
    width: ${(p) => Math.max(2, p.$width)}%;
    background: ${(p) => p.theme.text.colour.header()};
    border-radius: 1px;
    opacity: 0.7;
    transition: width 0.3s ease;
`;

const BarValue = styled.span`
    color: ${(p) => p.theme.text.colour.primary()};
    font-size: 0.7rem;
    min-width: 20px;
`;

const RankList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const RankRow = styled.div`
    display: flex;
    align-items: center;
    gap: ${(p) => p.theme.container.spacing.small};
    padding: 4px 0;
    font-size: ${(p) => p.theme.text.size.small};
    border-bottom: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    &:last-child {
        border-bottom: none;
    }
`;

const RankNumber = styled.span`
    font-weight: ${(p) => p.theme.text.weight.bold};
    color: ${(p) => p.theme.text.colour.header()};
    width: 20px;
`;

type ActiveTab = 'overview' | 'comments' | 'users' | 'audit' | 'analytics';

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
                <Tab
                    $active={tab === 'analytics'}
                    onClick={() => setTab('analytics')}
                >
                    Analytics
                </Tab>
            </TabBar>

            {tab === 'overview' && <OverviewTab />}
            {tab === 'comments' && <CommentsTab />}
            {tab === 'users' && <UsersTab />}
            {tab === 'audit' && <AuditTab />}
            {tab === 'analytics' && <AnalyticsTab />}
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
        try {
            await api.post(`/admin/comments/${id}/approve`);
            setComments((prev) => prev.filter((c) => c.id !== id));
            toast.success('Comment approved');
        } catch {
            toast.error('Failed to approve');
        }
    };

    const reject = async (id: string) => {
        try {
            await api.post(`/admin/comments/${id}/reject`);
            setComments((prev) => prev.filter((c) => c.id !== id));
            toast.success('Comment rejected');
        } catch {
            toast.error('Failed to reject');
        }
    };

    const bulkApprove = async () => {
        if (!confirm(`Approve ${selected.size} comment(s)?`)) return;
        try {
            await api.post('/admin/comments/bulk-approve', {
                commentIds: Array.from(selected)
            });
            toast.success(`${selected.size} comment(s) approved`);
            setSelected(new Set());
            load(1);
        } catch {
            toast.error('Failed to approve comments');
        }
    };

    const bulkReject = async () => {
        if (!confirm(`Reject ${selected.size} comment(s)?`)) return;
        try {
            await api.post('/admin/comments/bulk-reject', {
                commentIds: Array.from(selected)
            });
            toast.success(`${selected.size} comment(s) rejected`);
            setSelected(new Set());
            load(1);
        } catch {
            toast.error('Failed to reject comments');
        }
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
    const [selected, setSelected] = useState<Set<string>>(new Set());
    const [filterGroup, setFilterGroup] = useState<string>('all');

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

    const toggle = (id: string) => {
        setSelected((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });
    };

    const bulkBan = async () => {
        if (!confirm(`Ban ${selected.size} user(s)?`)) return;
        const reason = prompt('Ban reason (optional):');
        for (const id of selected)
            await api.post(`/admin/users/${id}/ban`, { reason });
        setSelected(new Set());
        load(1);
    };

    const filteredUsers =
        filterGroup === 'all'
            ? users
            : filterGroup === 'banned'
              ? users.filter((u) => u.isBanned)
              : users.filter((u) => u.groups.includes(filterGroup));

    const groupCounts = {
        all: users.length,
        admin: users.filter((u) => u.groups.includes('admin')).length,
        moderator: users.filter((u) => u.groups.includes('moderator')).length,
        trusted: users.filter((u) => u.groups.includes('trusted')).length,
        user: users.filter((u) => u.groups.includes('user')).length,
        banned: users.filter((u) => u.isBanned).length
    };

    return (
        <Card>
            <CardTitle>Users</CardTitle>
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.25rem',
                    marginBottom: '0.75rem'
                }}
            >
                {Object.entries(groupCounts).map(([group, count]) => (
                    <button
                        key={group}
                        onClick={() => setFilterGroup(group)}
                        style={{
                            padding: '2px 8px',
                            fontSize: '0.7rem',
                            fontFamily: 'Roboto, sans-serif',
                            border: `1px solid ${filterGroup === group ? 'hsla(22, 80%, 45%, 1)' : '#ccc'}`,
                            borderRadius: '3px',
                            background:
                                filterGroup === group
                                    ? 'hsla(22, 80%, 45%, 0.1)'
                                    : 'transparent',
                            color:
                                filterGroup === group
                                    ? 'hsla(22, 80%, 45%, 1)'
                                    : '#666',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {group} ({count})
                    </button>
                ))}
            </div>
            {selected.size > 0 && (
                <ButtonRow>
                    <Button $variant="danger" onClick={bulkBan}>
                        Ban Selected ({selected.size})
                    </Button>
                    <Button
                        $variant="secondary"
                        onClick={() => setSelected(new Set())}
                    >
                        Clear
                    </Button>
                </ButtonRow>
            )}
            {filteredUsers.map((u) => (
                <InfoRow key={u.id}>
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
                            checked={selected.has(u.id)}
                            onChange={() => toggle(u.id)}
                        />
                        <div>
                            <InfoValue>
                                <a href={`/profile/${u.username}`}>
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
                                              : g === 'trusted'
                                                ? '#0F9960'
                                                : '#999'
                                    }
                                >
                                    {g}
                                </Badge>
                            ))}
                            {u.isBanned && (
                                <Badge $color="#c62828">banned</Badge>
                            )}
                            <br />
                            <InfoLabel>
                                {u.email || 'No email'} — joined{' '}
                                {formatDate(u.createdAt)}
                            </InfoLabel>
                        </div>
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
            {filteredUsers.length === 0 && (
                <EmptyState>No users in this category.</EmptyState>
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

// ============================================================================
// Analytics
// ============================================================================

function AnalyticsTab() {
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        api.get<AnalyticsData>('/admin/analytics')
            .then(setData)
            .catch(() => {
                toast.error('Failed to load analytics');
            });
    }, []);

    if (!data) return <EmptyState>Loading analytics...</EmptyState>;

    const maxComments = Math.max(1, ...data.commentsPerDay.map((d) => d.count));
    const maxUsers = Math.max(1, ...data.usersPerDay.map((d) => d.count));
    const maxCommentCount = Math.max(
        1,
        ...data.topCommentedPosts.map((p) => p.count)
    );
    const maxLikes = Math.max(1, ...data.topLikedPosts.map((p) => p.likes));

    function shortDate(iso: string) {
        const d = new Date(iso);
        return `${d.getMonth() + 1}/${d.getDate()}`;
    }

    return (
        <>
            <Card>
                <CardTitle>Comments per Day (30 days)</CardTitle>
                {data.commentsPerDay.length === 0 ? (
                    <EmptyState>
                        No comment activity in the last 30 days.
                    </EmptyState>
                ) : (
                    <BarChart>
                        {data.commentsPerDay.map((d) => (
                            <BarRow key={d.date}>
                                <BarLabel>{shortDate(d.date)}</BarLabel>
                                <Bar $width={(d.count / maxComments) * 100} />
                                <BarValue>{d.count}</BarValue>
                            </BarRow>
                        ))}
                    </BarChart>
                )}
            </Card>

            <Card>
                <CardTitle>User Registrations per Day (30 days)</CardTitle>
                {data.usersPerDay.length === 0 ? (
                    <EmptyState>
                        No registrations in the last 30 days.
                    </EmptyState>
                ) : (
                    <BarChart>
                        {data.usersPerDay.map((d) => (
                            <BarRow key={d.date}>
                                <BarLabel>{shortDate(d.date)}</BarLabel>
                                <Bar $width={(d.count / maxUsers) * 100} />
                                <BarValue>{d.count}</BarValue>
                            </BarRow>
                        ))}
                    </BarChart>
                )}
            </Card>

            <Card>
                <CardTitle>Top Commented Posts</CardTitle>
                {data.topCommentedPosts.length === 0 ? (
                    <EmptyState>No data.</EmptyState>
                ) : (
                    <RankList>
                        {data.topCommentedPosts.map((p, i) => (
                            <RankRow key={p.slug}>
                                <RankNumber>{i + 1}</RankNumber>
                                <div style={{ flex: 1 }}>
                                    <a href={`/${p.slug}`}>{p.title}</a>
                                </div>
                                <Bar
                                    $width={(p.count / maxCommentCount) * 60}
                                    style={{ minWidth: 0, maxWidth: '120px' }}
                                />
                                <BarValue>{p.count} comments</BarValue>
                            </RankRow>
                        ))}
                    </RankList>
                )}
            </Card>

            <Card>
                <CardTitle>Top Liked Posts</CardTitle>
                {data.topLikedPosts.length === 0 ? (
                    <EmptyState>No data.</EmptyState>
                ) : (
                    <RankList>
                        {data.topLikedPosts.map((p, i) => (
                            <RankRow key={p.slug}>
                                <RankNumber>{i + 1}</RankNumber>
                                <div style={{ flex: 1 }}>
                                    <a href={`/${p.slug}`}>{p.title}</a>
                                </div>
                                <Bar
                                    $width={(p.likes / maxLikes) * 60}
                                    style={{ minWidth: 0, maxWidth: '120px' }}
                                />
                                <BarValue>{p.likes} likes</BarValue>
                            </RankRow>
                        ))}
                    </RankList>
                )}
            </Card>
        </>
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
