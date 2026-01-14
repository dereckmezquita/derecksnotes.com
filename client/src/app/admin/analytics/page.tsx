'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import styled from 'styled-components';
import Link from 'next/link';
import {
    AdminHeader,
    AdminTitle,
    Card,
    CardHeader,
    CardTitle,
    Badge,
    Button,
    LoadingContainer,
    LoadingSpinner,
    LoadingText,
    Alert,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateText
} from '../components/AdminStyles';
import type {
    AnalyticsOverviewData,
    AnalyticsTimeseriesData,
    AnalyticsTopPost,
    AnalyticsActiveUser,
    AnalyticsTopCommentDetailed,
    AnalyticsTopCommentsData,
    AnalyticsEngagementTrends,
    AnalyticsSparklineData
} from '@/types/api';

// ============================================================================
// STYLED COMPONENTS
// ============================================================================

const Section = styled.div`
    margin-bottom: ${(p) => p.theme.container.spacing.large};
`;

const SectionTitle = styled.h2`
    font-size: ${(p) => p.theme.text.size.large};
    font-weight: ${(p) => p.theme.text.weight.bold};
    color: ${(p) => p.theme.text.colour.header()};
    margin: 0 0 ${(p) => p.theme.container.spacing.medium} 0;
    display: flex;
    align-items: center;
    gap: ${(p) => p.theme.container.spacing.small};
`;

const TrendBadge = styled.span<{ $positive?: boolean }>`
    display: inline-flex;
    align-items: center;
    gap: 2px;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    background: ${(p) =>
        p.$positive
            ? p.theme.colours.success + '20'
            : p.theme.colours.error + '20'};
    color: ${(p) =>
        p.$positive ? p.theme.colours.success : p.theme.colours.error};
`;

// Engagement Overview Cards
const EngagementGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: ${(p) => p.theme.container.spacing.medium};
    margin-bottom: ${(p) => p.theme.container.spacing.large};

    @media (max-width: 900px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 500px) {
        grid-template-columns: 1fr;
    }
`;

const EngagementCard = styled.div`
    background: ${(p) => p.theme.container.background.colour.solid()};
    border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    border-radius: ${(p) => p.theme.container.border.radius};
    padding: ${(p) => p.theme.container.spacing.large};
    display: flex;
    flex-direction: column;
`;

const EngagementValue = styled.div`
    font-size: 2rem;
    font-weight: 700;
    color: ${(p) => p.theme.text.colour.header()};
    margin-bottom: 4px;
`;

const EngagementLabel = styled.div`
    font-size: 0.875rem;
    color: ${(p) => p.theme.text.colour.light_grey()};
    margin-bottom: ${(p) => p.theme.container.spacing.small};
`;

const EngagementMeta = styled.div`
    display: flex;
    align-items: center;
    gap: ${(p) => p.theme.container.spacing.small};
    font-size: 0.75rem;
    color: ${(p) => p.theme.text.colour.light_grey()};
    margin-top: auto;
`;

// Sparkline
const SparklineContainer = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 32px;
    margin-top: ${(p) => p.theme.container.spacing.small};
`;

const SparklineBar = styled.div<{ $height: number; $active?: boolean }>`
    flex: 1;
    height: ${(p) => p.$height}%;
    min-height: 2px;
    background: ${(p) =>
        p.$active ? p.theme.theme_colours[5]() : p.theme.theme_colours[7]()};
    border-radius: 1px;
    transition: height 0.3s ease;
`;

// Two Column Grid
const TwoColumnGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${(p) => p.theme.container.spacing.large};
    margin-bottom: ${(p) => p.theme.container.spacing.large};

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }

    /* Ensure children don't overflow */
    & > * {
        min-width: 0;
        overflow: hidden;
    }
`;

// List Items
const LeaderboardItem = styled.div`
    display: flex;
    align-items: center;
    padding: ${(p) => p.theme.container.spacing.small};
    border-bottom: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    min-width: 0; /* Allow flex items to shrink below content size */

    &:last-child {
        border-bottom: none;
    }
`;

const Rank = styled.span<{ $top?: boolean }>`
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: ${(p) =>
        p.$top
            ? p.theme.theme_colours[5]()
            : p.theme.container.background.colour.light_contrast()};
    color: ${(p) => (p.$top ? '#fff' : p.theme.text.colour.light_grey())};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    margin-right: ${(p) => p.theme.container.spacing.small};
    flex-shrink: 0;
`;

const ItemContent = styled.div`
    flex: 1;
    min-width: 0;
    overflow: hidden;
`;

const ItemTitle = styled.div`
    font-weight: 500;
    color: ${(p) => p.theme.text.colour.primary()};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ItemMeta = styled.div`
    font-size: 0.75rem;
    color: ${(p) => p.theme.text.colour.light_grey()};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const ItemStats = styled.div`
    display: flex;
    gap: ${(p) => p.theme.container.spacing.small};
    margin-left: ${(p) => p.theme.container.spacing.small};
    flex-shrink: 0;
`;

const StatPill = styled.span<{ $variant?: 'success' | 'danger' | 'neutral' }>`
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
    background: ${(p) => {
        switch (p.$variant) {
            case 'success':
                return p.theme.colours.success + '20';
            case 'danger':
                return p.theme.colours.error + '20';
            default:
                return p.theme.container.background.colour.light_contrast();
        }
    }};
    color: ${(p) => {
        switch (p.$variant) {
            case 'success':
                return p.theme.colours.success;
            case 'danger':
                return p.theme.colours.error;
            default:
                return p.theme.text.colour.primary();
        }
    }};
`;

// Comment Preview
const CommentPreview = styled.div`
    padding: ${(p) => p.theme.container.spacing.medium};
    background: ${(p) => p.theme.container.background.colour.light_contrast()};
    border-radius: ${(p) => p.theme.container.border.radius};
    margin-bottom: ${(p) => p.theme.container.spacing.small};

    &:last-child {
        margin-bottom: 0;
    }
`;

const CommentText = styled.p`
    margin: 0 0 ${(p) => p.theme.container.spacing.small} 0;
    font-size: 0.875rem;
    color: ${(p) => p.theme.text.colour.primary()};
    line-height: 1.4;
`;

const CommentFooter = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.75rem;
    color: ${(p) => p.theme.text.colour.light_grey()};
`;

const CommentReactions = styled.div`
    display: flex;
    gap: ${(p) => p.theme.container.spacing.small};
`;

// Sentiment Bar
const SentimentContainer = styled.div`
    margin-top: ${(p) => p.theme.container.spacing.medium};
`;

const SentimentBar = styled.div`
    height: 8px;
    background: ${(p) => p.theme.colours.error + '40'};
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: ${(p) => p.theme.container.spacing.xsmall};
`;

const SentimentFill = styled.div<{ $percent: number }>`
    height: 100%;
    width: ${(p) => p.$percent}%;
    background: ${(p) => p.theme.colours.success};
    border-radius: 4px;
    transition: width 0.5s ease;
`;

const SentimentLabels = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: ${(p) => p.theme.text.colour.light_grey()};
`;

// Activity Chart
const ChartContainer = styled.div`
    padding: ${(p) => p.theme.container.spacing.medium};
`;

const ChartToggle = styled.div`
    display: flex;
    gap: ${(p) => p.theme.container.spacing.xsmall};
    margin-bottom: ${(p) => p.theme.container.spacing.medium};
`;

const ToggleButton = styled.button<{ $active?: boolean }>`
    padding: 6px 12px;
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

const BarChart = styled.div`
    display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 200px;
    padding-bottom: 24px;
`;

const ChartBar = styled.div<{ $height: number }>`
    flex: 1;
    height: ${(p) => p.$height}%;
    min-height: 2px;
    background: ${(p) => p.theme.theme_colours[5]()};
    border-radius: 2px 2px 0 0;
    position: relative;
    cursor: pointer;

    &:hover {
        background: ${(p) => p.theme.theme_colours[4]()};
    }

    &:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: ${(p) => p.theme.container.background.colour.solid()};
        border: 1px solid ${(p) => p.theme.container.border.colour.primary()};
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.7rem;
        white-space: nowrap;
        z-index: 10;
    }
`;

const ChartAxis = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 0.625rem;
    color: ${(p) => p.theme.text.colour.light_grey()};
`;

// Types imported from @/types/api

// ============================================================================
// COMPONENT
// ============================================================================

export default function AnalyticsPage() {
    const [overview, setOverview] = useState<AnalyticsOverviewData | null>(
        null
    );
    const [timeseries, setTimeseries] =
        useState<AnalyticsTimeseriesData | null>(null);
    const [topPosts, setTopPosts] = useState<AnalyticsTopPost[]>([]);
    const [activeUsers, setActiveUsers] = useState<AnalyticsActiveUser[]>([]);
    const [topComments, setTopComments] =
        useState<AnalyticsTopCommentsData | null>(null);
    const [trends, setTrends] = useState<AnalyticsEngagementTrends | null>(
        null
    );
    const [sparklines, setSparklines] = useState<AnalyticsSparklineData | null>(
        null
    );
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
                topCommentsRes,
                trendsRes,
                sparklinesRes
            ] = await Promise.all([
                api.get<AnalyticsOverviewData>('/admin/analytics/overview'),
                api.get<AnalyticsTimeseriesData>(
                    `/admin/analytics/timeseries?metric=${metric}&days=${days}`
                ),
                api.get<{ posts: AnalyticsTopPost[] }>(
                    '/admin/analytics/top-posts?days=30&limit=5'
                ),
                api.get<{ users: AnalyticsActiveUser[] }>(
                    '/admin/analytics/active-users?days=30&limit=5'
                ),
                api.get<AnalyticsTopCommentsData>(
                    '/admin/analytics/top-comments?days=30&limit=5'
                ),
                api.get<AnalyticsEngagementTrends>(
                    '/admin/analytics/engagement-trends?days=30'
                ),
                api.get<AnalyticsSparklineData>(
                    '/admin/analytics/sparklines?days=7'
                )
            ]);

            setOverview(overviewRes.data);
            setTimeseries(timeseriesRes.data);
            setTopPosts(topPostsRes.data.posts);
            setActiveUsers(activeUsersRes.data.users);
            setTopComments(topCommentsRes.data);
            setTrends(trendsRes.data);
            setSparklines(sparklinesRes.data);
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

    // Helper: render sparkline
    const renderSparkline = (data: number[]) => {
        const max = Math.max(...data, 1);
        return (
            <SparklineContainer>
                {data.map((val, i) => (
                    <SparklineBar
                        key={i}
                        $height={(val / max) * 100}
                        $active={i === data.length - 1}
                    />
                ))}
            </SparklineContainer>
        );
    };

    // Calculate max for chart
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
            </AdminHeader>

            {/* Engagement Overview with Sparklines */}
            <EngagementGrid>
                <EngagementCard>
                    <EngagementValue>
                        {trends?.current.comments ?? 0}
                    </EngagementValue>
                    <EngagementLabel>Comments (30 days)</EngagementLabel>
                    <EngagementMeta>
                        {trends && (
                            <TrendBadge $positive={trends.trends.comments >= 0}>
                                {trends.trends.comments >= 0 ? '+' : ''}
                                {trends.trends.comments}%
                            </TrendBadge>
                        )}
                        <span>vs previous period</span>
                    </EngagementMeta>
                    {sparklines && renderSparkline(sparklines.comments)}
                </EngagementCard>

                <EngagementCard>
                    <EngagementValue>
                        {trends?.current.users ?? 0}
                    </EngagementValue>
                    <EngagementLabel>New Users (30 days)</EngagementLabel>
                    <EngagementMeta>
                        {trends && (
                            <TrendBadge $positive={trends.trends.users >= 0}>
                                {trends.trends.users >= 0 ? '+' : ''}
                                {trends.trends.users}%
                            </TrendBadge>
                        )}
                        <span>vs previous period</span>
                    </EngagementMeta>
                    {sparklines && renderSparkline(sparklines.users)}
                </EngagementCard>

                <EngagementCard>
                    <EngagementValue>
                        {trends?.current.reactions ?? 0}
                    </EngagementValue>
                    <EngagementLabel>Reactions (30 days)</EngagementLabel>
                    <EngagementMeta>
                        {trends && (
                            <TrendBadge
                                $positive={trends.trends.reactions >= 0}
                            >
                                {trends.trends.reactions >= 0 ? '+' : ''}
                                {trends.trends.reactions}%
                            </TrendBadge>
                        )}
                        <span>vs previous period</span>
                    </EngagementMeta>
                    {sparklines && renderSparkline(sparklines.reactions)}
                </EngagementCard>

                <EngagementCard>
                    <EngagementValue>
                        {trends?.sentiment.likeRatio ?? 100}%
                    </EngagementValue>
                    <EngagementLabel>Positive Sentiment</EngagementLabel>
                    <EngagementMeta>
                        <span>{trends?.sentiment.likes ?? 0} likes</span>
                        <span>/</span>
                        <span>{trends?.sentiment.dislikes ?? 0} dislikes</span>
                    </EngagementMeta>
                    <SentimentContainer>
                        <SentimentBar>
                            <SentimentFill
                                $percent={trends?.sentiment.likeRatio ?? 100}
                            />
                        </SentimentBar>
                    </SentimentContainer>
                </EngagementCard>
            </EngagementGrid>

            {/* Activity Chart */}
            <Section>
                <Card>
                    <CardHeader>
                        <CardTitle>Activity Over Time</CardTitle>
                    </CardHeader>
                    <ChartContainer>
                        <ChartToggle>
                            <ToggleButton
                                $active={metric === 'comments'}
                                onClick={() => setMetric('comments')}
                            >
                                Comments
                            </ToggleButton>
                            <ToggleButton
                                $active={metric === 'users'}
                                onClick={() => setMetric('users')}
                            >
                                Users
                            </ToggleButton>
                            <ToggleButton
                                $active={metric === 'reactions'}
                                onClick={() => setMetric('reactions')}
                            >
                                Reactions
                            </ToggleButton>
                            <div
                                style={{
                                    marginLeft: 'auto',
                                    display: 'flex',
                                    gap: '4px'
                                }}
                            >
                                <ToggleButton
                                    $active={days === 7}
                                    onClick={() => setDays(7)}
                                >
                                    7d
                                </ToggleButton>
                                <ToggleButton
                                    $active={days === 30}
                                    onClick={() => setDays(30)}
                                >
                                    30d
                                </ToggleButton>
                                <ToggleButton
                                    $active={days === 90}
                                    onClick={() => setDays(90)}
                                >
                                    90d
                                </ToggleButton>
                            </div>
                        </ChartToggle>
                        <BarChart>
                            {timeseries?.data.map((item) => (
                                <ChartBar
                                    key={item.date}
                                    $height={(item.count / maxValue) * 100}
                                    data-tooltip={`${item.date}: ${item.count}`}
                                />
                            ))}
                        </BarChart>
                        <ChartAxis>
                            <span>
                                {timeseries?.data[0]?.date?.substring(5) || ''}
                            </span>
                            <span>
                                {timeseries?.data[
                                    timeseries.data.length - 1
                                ]?.date?.substring(5) || ''}
                            </span>
                        </ChartAxis>
                    </ChartContainer>
                </Card>
            </Section>

            {/* Top Content & Top Users */}
            <TwoColumnGrid>
                <Card>
                    <CardHeader>
                        <CardTitle>Top Content</CardTitle>
                    </CardHeader>
                    {topPosts.length === 0 ? (
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
                                        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
                                    />
                                </svg>
                            </EmptyStateIcon>
                            <EmptyStateTitle>No data yet</EmptyStateTitle>
                            <EmptyStateText>
                                Post engagement will appear here
                            </EmptyStateText>
                        </EmptyState>
                    ) : (
                        topPosts.map((post, i) => (
                            <LeaderboardItem key={post.slug}>
                                <Rank $top={i < 3}>{i + 1}</Rank>
                                <ItemContent>
                                    <ItemTitle title={post.title || post.slug}>
                                        {post.title ||
                                            post.slug.replace(/-/g, ' ')}
                                    </ItemTitle>
                                    <ItemMeta>
                                        {post.commentCount} comments,{' '}
                                        {post.views} views
                                    </ItemMeta>
                                </ItemContent>
                                <ItemStats>
                                    <StatPill $variant="success">
                                        {post.postLikes}
                                    </StatPill>
                                    <StatPill $variant="danger">
                                        {post.postDislikes}
                                    </StatPill>
                                </ItemStats>
                            </LeaderboardItem>
                        ))
                    )}
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Contributors</CardTitle>
                    </CardHeader>
                    {activeUsers.length === 0 ? (
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
                            <EmptyStateTitle>No data yet</EmptyStateTitle>
                            <EmptyStateText>
                                Active users will appear here
                            </EmptyStateText>
                        </EmptyState>
                    ) : (
                        activeUsers.map((item, i) => (
                            <LeaderboardItem key={item.user.id}>
                                <Rank $top={i < 3}>{i + 1}</Rank>
                                <ItemContent>
                                    <ItemTitle>
                                        {item.user.displayName ||
                                            item.user.username}
                                    </ItemTitle>
                                    <ItemMeta>
                                        {item.commentCount} comments,{' '}
                                        {item.reactionsGiven} reactions given
                                    </ItemMeta>
                                </ItemContent>
                                <ItemStats>
                                    <StatPill
                                        $variant="success"
                                        title="Likes received"
                                    >
                                        +{item.likesReceived}
                                    </StatPill>
                                </ItemStats>
                            </LeaderboardItem>
                        ))
                    )}
                </Card>
            </TwoColumnGrid>

            {/* Top Comments */}
            <TwoColumnGrid>
                <Card>
                    <CardHeader>
                        <CardTitle>Most Liked Comments</CardTitle>
                    </CardHeader>
                    {!topComments?.topLiked?.length ? (
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
                                        d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"
                                    />
                                </svg>
                            </EmptyStateIcon>
                            <EmptyStateTitle>
                                No liked comments yet
                            </EmptyStateTitle>
                            <EmptyStateText>
                                Popular comments will appear here
                            </EmptyStateText>
                        </EmptyState>
                    ) : (
                        topComments.topLiked.map((comment) => (
                            <CommentPreview key={comment.id}>
                                <CommentText>{comment.content}</CommentText>
                                <CommentFooter>
                                    <span>
                                        by{' '}
                                        {comment.user?.displayName ||
                                            comment.user?.username ||
                                            'Unknown'}{' '}
                                        on{' '}
                                        <Link
                                            href={`/${comment.slug}`}
                                            style={{ color: 'inherit' }}
                                        >
                                            {comment.postTitle || comment.slug}
                                        </Link>
                                    </span>
                                    <CommentReactions>
                                        <StatPill $variant="success">
                                            {comment.likes}
                                        </StatPill>
                                        <StatPill $variant="danger">
                                            {comment.dislikes}
                                        </StatPill>
                                    </CommentReactions>
                                </CommentFooter>
                            </CommentPreview>
                        ))
                    )}
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Controversial Comments</CardTitle>
                    </CardHeader>
                    {!topComments?.controversial?.length ? (
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
                                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                                    />
                                </svg>
                            </EmptyStateIcon>
                            <EmptyStateTitle>
                                No controversial comments
                            </EmptyStateTitle>
                            <EmptyStateText>
                                Comments with mixed reactions will appear here
                            </EmptyStateText>
                        </EmptyState>
                    ) : (
                        topComments.controversial.map((comment) => (
                            <CommentPreview key={comment.id}>
                                <CommentText>{comment.content}</CommentText>
                                <CommentFooter>
                                    <span>
                                        by{' '}
                                        {comment.user?.displayName ||
                                            comment.user?.username ||
                                            'Unknown'}
                                    </span>
                                    <CommentReactions>
                                        <StatPill $variant="success">
                                            {comment.likes}
                                        </StatPill>
                                        <StatPill $variant="danger">
                                            {comment.dislikes}
                                        </StatPill>
                                    </CommentReactions>
                                </CommentFooter>
                            </CommentPreview>
                        ))
                    )}
                </Card>
            </TwoColumnGrid>

            {/* Quick Stats */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                </CardHeader>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem',
                        padding: '1rem'
                    }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--text-header)'
                            }}
                        >
                            {overview?.totals.users ?? 0}
                        </div>
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-grey)'
                            }}
                        >
                            Total Users
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--text-header)'
                            }}
                        >
                            {overview?.totals.comments ?? 0}
                        </div>
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-grey)'
                            }}
                        >
                            Total Comments
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--text-header)'
                            }}
                        >
                            {overview?.totals.reactions ?? 0}
                        </div>
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-grey)'
                            }}
                        >
                            Total Reactions
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--text-header)'
                            }}
                        >
                            {overview?.engagement.approvalRate ?? 0}%
                        </div>
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-grey)'
                            }}
                        >
                            Approval Rate
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--text-header)'
                            }}
                        >
                            {trends?.averages.commentsPerDay ?? 0}
                        </div>
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-grey)'
                            }}
                        >
                            Comments/Day
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div
                            style={{
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: 'var(--text-header)'
                            }}
                        >
                            {trends?.averages.activeDays ?? 0}
                        </div>
                        <div
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-grey)'
                            }}
                        >
                            Active Days (30d)
                        </div>
                    </div>
                </div>
            </Card>
        </>
    );
}
