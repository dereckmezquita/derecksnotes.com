'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import styled from 'styled-components';
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
    Alert
} from '../components/AdminStyles';

// Chart components
const ChartContainer = styled.div`
    padding: 1rem;
    height: 250px;
    display: flex;
    flex-direction: column;
`;

const ChartTitle = styled.h4`
    margin: 0 0 1rem 0;
    font-size: 0.875rem;
    color: ${(p) => p.theme.text.colour.primary()};
`;

const BarChartWrapper = styled.div`
    flex: 1;
    display: flex;
    align-items: flex-end;
    gap: 2px;
    padding-bottom: 1.5rem;
    position: relative;
`;

const Bar = styled.div<{ $height: number; $color?: string }>`
    flex: 1;
    min-width: 8px;
    max-width: 20px;
    height: ${(p) => p.$height}%;
    background: ${(p) => p.$color || p.theme.theme_colours[5]()};
    border-radius: 2px 2px 0 0;
    transition: height 0.3s ease;
    cursor: pointer;
    position: relative;

    &:hover {
        opacity: 0.8;
    }

    &:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: ${(p) => p.theme.container.background.colour.solid()};
        border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        white-space: nowrap;
        z-index: 10;
    }
`;

const ChartLabels = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.625rem;
    color: ${(p) => p.theme.text.colour.light_grey()};
    margin-top: 0.5rem;
`;

const MetricToggle = styled.div`
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
`;

const MetricButton = styled.button<{ $active?: boolean }>`
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
    border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    border-radius: 4px;
    background: ${(p) =>
        p.$active
            ? p.theme.theme_colours[5]()
            : p.theme.container.background.colour.solid()};
    color: ${(p) => (p.$active ? '#fff' : p.theme.text.colour.primary())};
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
        border-color: ${(p) => p.theme.theme_colours[5]()};
    }
`;

const StatsRow = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
`;

const MiniStat = styled.div`
    text-align: center;
    padding: 0.75rem;
    background: ${(p) => p.theme.container.background.colour.light_contrast()};
    border-radius: 8px;
    border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
`;

const MiniStatValue = styled.div`
    font-size: 1.25rem;
    font-weight: 600;
    color: ${(p) => p.theme.theme_colours[5]()};
`;

const MiniStatLabel = styled.div`
    font-size: 0.75rem;
    color: ${(p) => p.theme.text.colour.light_grey()};
`;

const TopList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const TopListItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    background: ${(p) => p.theme.container.background.colour.light_contrast()};
    border-radius: 4px;
    font-size: 0.875rem;
`;

const TopListRank = styled.span`
    color: ${(p) => p.theme.text.colour.light_grey()};
    margin-right: 0.5rem;
    font-size: 0.75rem;
`;

const TopListName = styled.span`
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const TopListValue = styled.span`
    font-weight: 600;
    color: ${(p) => p.theme.theme_colours[5]()};
    margin-left: 0.5rem;
`;

// Types
interface OverviewData {
    totals: {
        users: number;
        comments: number;
        reactions: number;
    };
    users: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
    comments: {
        today: number;
        thisWeek: number;
        thisMonth: number;
    };
    engagement: {
        reactionsThisWeek: number;
        approvalRate: number;
    };
}

interface TimeseriesData {
    metric: string;
    days: number;
    data: Array<{ date: string; count: number }>;
}

interface TopPost {
    postSlug: string;
    commentCount: number;
    reactionCount: number;
    engagementScore: number;
}

interface ActiveUser {
    user: {
        id: string;
        username: string;
        displayName: string | null;
    };
    commentCount: number;
    reactionsGiven: number;
    activityScore: number;
}

interface ModerationData {
    pending: {
        comments: number;
        reports: number;
    };
    thisWeek: {
        commentsApproved: number;
        commentsRejected: number;
        reportsResolved: number;
    };
    thisMonth: {
        usersBanned: number;
    };
    reportReasons: Array<{ reason: string; count: number }>;
}

export default function AnalyticsPage() {
    const [overview, setOverview] = useState<OverviewData | null>(null);
    const [timeseries, setTimeseries] = useState<TimeseriesData | null>(null);
    const [topPosts, setTopPosts] = useState<TopPost[]>([]);
    const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
    const [moderation, setModeration] = useState<ModerationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [metric, setMetric] = useState<'comments' | 'users' | 'reactions'>(
        'comments'
    );
    const [days, setDays] = useState(30);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [
                overviewRes,
                timeseriesRes,
                topPostsRes,
                activeUsersRes,
                moderationRes
            ] = await Promise.all([
                api.get<OverviewData>('/admin/analytics/overview'),
                api.get<TimeseriesData>(
                    `/admin/analytics/timeseries?metric=${metric}&days=${days}`
                ),
                api.get<{ posts: TopPost[] }>(
                    '/admin/analytics/top-posts?days=30&limit=5'
                ),
                api.get<{ users: ActiveUser[] }>(
                    '/admin/analytics/active-users?days=30&limit=5'
                ),
                api.get<ModerationData>('/admin/analytics/moderation')
            ]);

            setOverview(overviewRes.data);
            setTimeseries(timeseriesRes.data);
            setTopPosts(topPostsRes.data.posts);
            setActiveUsers(activeUsersRes.data.users);
            setModeration(moderationRes.data);
        } catch (err: any) {
            console.error('Error fetching analytics:', err);
            setError(err.response?.data?.error || 'Failed to load analytics');
            toast.error('Failed to load analytics');
        } finally {
            setLoading(false);
        }
    }, [metric, days]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Calculate max value for chart scaling
    const maxValue = timeseries
        ? Math.max(...timeseries.data.map((d) => d.count), 1)
        : 1;

    if (loading) {
        return (
            <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Loading analytics...</LoadingText>
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
                    onClick={fetchData}
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
                <AdminTitle>Analytics</AdminTitle>
                <AdminSubtitle>
                    Site activity and engagement metrics
                </AdminSubtitle>
            </AdminHeader>

            {/* Overview Stats */}
            <StatsGrid>
                <StatCard>
                    <StatIcon $variant="primary">
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
                    <StatValue>{overview?.totals.users ?? 0}</StatValue>
                    <StatLabel>Total Users</StatLabel>
                </StatCard>

                <StatCard>
                    <StatIcon $variant="success">
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
                    <StatValue>{overview?.totals.comments ?? 0}</StatValue>
                    <StatLabel>Total Comments</StatLabel>
                </StatCard>

                <StatCard>
                    <StatIcon $variant="warning">
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
                                d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                            />
                        </svg>
                    </StatIcon>
                    <StatValue>{overview?.totals.reactions ?? 0}</StatValue>
                    <StatLabel>Total Reactions</StatLabel>
                </StatCard>

                <StatCard>
                    <StatIcon $variant="success">
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
                    </StatIcon>
                    <StatValue>
                        {overview?.engagement.approvalRate ?? 0}%
                    </StatValue>
                    <StatLabel>Approval Rate</StatLabel>
                </StatCard>
            </StatsGrid>

            {/* Activity This Period */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                </CardHeader>
                <StatsRow>
                    <MiniStat>
                        <MiniStatValue>
                            {overview?.users.today ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>New Users Today</MiniStatLabel>
                    </MiniStat>
                    <MiniStat>
                        <MiniStatValue>
                            {overview?.users.thisWeek ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>This Week</MiniStatLabel>
                    </MiniStat>
                    <MiniStat>
                        <MiniStatValue>
                            {overview?.users.thisMonth ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>This Month</MiniStatLabel>
                    </MiniStat>
                    <MiniStat>
                        <MiniStatValue>
                            {overview?.comments.today ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>Comments Today</MiniStatLabel>
                    </MiniStat>
                    <MiniStat>
                        <MiniStatValue>
                            {overview?.comments.thisWeek ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>This Week</MiniStatLabel>
                    </MiniStat>
                    <MiniStat>
                        <MiniStatValue>
                            {overview?.engagement.reactionsThisWeek ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>Reactions This Week</MiniStatLabel>
                    </MiniStat>
                </StatsRow>
            </Card>

            {/* Time Series Chart */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <CardHeader>
                    <CardTitle>Activity Over Time</CardTitle>
                </CardHeader>
                <ChartContainer>
                    <MetricToggle>
                        <MetricButton
                            $active={metric === 'comments'}
                            onClick={() => setMetric('comments')}
                        >
                            Comments
                        </MetricButton>
                        <MetricButton
                            $active={metric === 'users'}
                            onClick={() => setMetric('users')}
                        >
                            Users
                        </MetricButton>
                        <MetricButton
                            $active={metric === 'reactions'}
                            onClick={() => setMetric('reactions')}
                        >
                            Reactions
                        </MetricButton>
                        <span
                            style={{ marginLeft: 'auto', fontSize: '0.75rem' }}
                        >
                            <MetricButton
                                $active={days === 7}
                                onClick={() => setDays(7)}
                            >
                                7d
                            </MetricButton>
                            <MetricButton
                                $active={days === 30}
                                onClick={() => setDays(30)}
                                style={{ marginLeft: '0.25rem' }}
                            >
                                30d
                            </MetricButton>
                            <MetricButton
                                $active={days === 90}
                                onClick={() => setDays(90)}
                                style={{ marginLeft: '0.25rem' }}
                            >
                                90d
                            </MetricButton>
                        </span>
                    </MetricToggle>
                    <BarChartWrapper>
                        {timeseries?.data.map((item, i) => (
                            <Bar
                                key={item.date}
                                $height={(item.count / maxValue) * 100}
                                data-tooltip={`${item.date}: ${item.count}`}
                            />
                        ))}
                    </BarChartWrapper>
                    <ChartLabels>
                        <span>
                            {timeseries?.data[0]?.date?.substring(5) || ''}
                        </span>
                        <span>
                            {timeseries?.data[
                                timeseries.data.length - 1
                            ]?.date?.substring(5) || ''}
                        </span>
                    </ChartLabels>
                </ChartContainer>
            </Card>

            {/* Top Posts and Active Users */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '1.5rem'
                }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Top Posts (30 days)</CardTitle>
                    </CardHeader>
                    <TopList>
                        {topPosts.length === 0 ? (
                            <div
                                style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    opacity: 0.6
                                }}
                            >
                                No data yet
                            </div>
                        ) : (
                            topPosts.map((post, i) => (
                                <TopListItem key={post.postSlug}>
                                    <TopListRank>#{i + 1}</TopListRank>
                                    <TopListName title={post.postSlug}>
                                        {post.postSlug.replace(/-/g, ' ')}
                                    </TopListName>
                                    <TopListValue>
                                        {post.engagementScore}
                                    </TopListValue>
                                </TopListItem>
                            ))
                        )}
                    </TopList>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Most Active Users (30 days)</CardTitle>
                    </CardHeader>
                    <TopList>
                        {activeUsers.length === 0 ? (
                            <div
                                style={{
                                    padding: '1rem',
                                    textAlign: 'center',
                                    opacity: 0.6
                                }}
                            >
                                No data yet
                            </div>
                        ) : (
                            activeUsers.map((item, i) => (
                                <TopListItem key={item.user.id}>
                                    <TopListRank>#{i + 1}</TopListRank>
                                    <TopListName>
                                        {item.user.displayName ||
                                            item.user.username}
                                    </TopListName>
                                    <TopListValue>
                                        {item.activityScore}
                                    </TopListValue>
                                </TopListItem>
                            ))
                        )}
                    </TopList>
                </Card>
            </div>

            {/* Moderation Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Moderation Activity</CardTitle>
                </CardHeader>
                <StatsRow>
                    <MiniStat>
                        <MiniStatValue>
                            {moderation?.pending.comments ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>Pending Comments</MiniStatLabel>
                    </MiniStat>
                    <MiniStat>
                        <MiniStatValue>
                            {moderation?.pending.reports ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>Pending Reports</MiniStatLabel>
                    </MiniStat>
                    <MiniStat>
                        <MiniStatValue>
                            {moderation?.thisWeek.commentsApproved ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>Approved (Week)</MiniStatLabel>
                    </MiniStat>
                    <MiniStat>
                        <MiniStatValue>
                            {moderation?.thisWeek.commentsRejected ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>Rejected (Week)</MiniStatLabel>
                    </MiniStat>
                    <MiniStat>
                        <MiniStatValue>
                            {moderation?.thisWeek.reportsResolved ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>Reports Resolved</MiniStatLabel>
                    </MiniStat>
                    <MiniStat>
                        <MiniStatValue>
                            {moderation?.thisMonth.usersBanned ?? 0}
                        </MiniStatValue>
                        <MiniStatLabel>Bans (Month)</MiniStatLabel>
                    </MiniStat>
                </StatsRow>

                {moderation?.reportReasons &&
                    moderation.reportReasons.length > 0 && (
                        <>
                            <CardTitle
                                style={{
                                    fontSize: '0.875rem',
                                    margin: '1rem 0 0.5rem'
                                }}
                            >
                                Report Reasons (30 days)
                            </CardTitle>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    flexWrap: 'wrap'
                                }}
                            >
                                {moderation.reportReasons.map((r) => (
                                    <Badge key={r.reason} $variant="secondary">
                                        {r.reason}: {r.count}
                                    </Badge>
                                ))}
                            </div>
                        </>
                    )}
            </Card>
        </>
    );
}
