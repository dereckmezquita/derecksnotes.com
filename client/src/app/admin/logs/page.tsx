'use client';

import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
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
    AccessDenied,
    StatCard,
    StatsGrid,
    StatValue,
    StatLabel,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalBody,
    CloseButton as AdminCloseButton,
    FormGroup,
    Label
} from '../components/AdminStyles';
import SelectDropDown from '@components/atomic/SelectDropDown';
import SearchBar from '@components/atomic/SearchBar';

// Types
interface LogEntry {
    id: string;
    level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
    message: string;
    source: string | null;
    context: Record<string, any> | null;
    stack: string | null;
    userId: string | null;
    requestId: string | null;
    ipAddress: string | null;
    userAgent: string | null;
    path: string | null;
    method: string | null;
    statusCode: number | null;
    duration: number | null;
    createdAt: string;
    clearedAt: string | null;
    clearedBy: string | null;
}

interface ErrorSummary {
    id: string;
    fingerprint: string;
    message: string;
    source: string | null;
    stack: string | null;
    firstSeenAt: string;
    lastSeenAt: string;
    count: number;
    resolved: boolean;
    resolvedAt: string | null;
    resolvedBy: string | null;
    notes: string | null;
}

interface LogStats {
    errorsToday: number;
    errorsThisWeek: number;
    unresolvedErrors: number;
    logsByLevel: Record<string, number>;
}

// Page-specific styled components using correct theme paths
const TabContainer = styled.div`
    display: flex;
    gap: ${(props) => props.theme.container.spacing.small};
    margin-bottom: ${(props) => props.theme.container.spacing.medium};
    border-bottom: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    padding-bottom: ${(props) => props.theme.container.spacing.small};
`;

const Tab = styled.button<{ $active: boolean }>`
    padding: ${(props) => props.theme.container.spacing.small}
        ${(props) => props.theme.container.spacing.medium};
    background: ${(props) =>
        props.$active ? props.theme.theme_colours[5]() : 'transparent'};
    color: ${(props) =>
        props.$active ? '#fff' : props.theme.text.colour.primary()};
    border: none;
    border-radius: ${(props) => props.theme.container.border.radius};
    cursor: pointer;
    font-size: 0.9rem;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
        background: ${(props) =>
            props.$active
                ? props.theme.theme_colours[5]()
                : props.theme.container.background.colour.light_contrast()};
    }
`;

const LogMessage = styled.div`
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: 0.8rem;
    white-space: pre-wrap;
    word-break: break-word;
    max-width: 400px;
`;

const StackTrace = styled.pre`
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    font-size: 0.7rem;
    background: ${(props) =>
        props.theme.container.background.colour.light_contrast()};
    padding: ${(props) => props.theme.container.spacing.small};
    border-radius: ${(props) => props.theme.container.border.radius};
    overflow-x: auto;
    max-height: 200px;
    white-space: pre-wrap;
    word-break: break-word;
    margin-top: ${(props) => props.theme.container.spacing.xsmall};
`;

const ViewButton = styled.button`
    background: none;
    border: none;
    color: ${(props) => props.theme.theme_colours[5]()};
    cursor: pointer;
    font-size: 0.75rem;
    padding: 0;
    text-decoration: underline;

    &:hover {
        opacity: 0.8;
    }
`;

const DetailRow = styled.div`
    display: flex;
    gap: ${(props) => props.theme.container.spacing.small};
    margin-bottom: ${(props) => props.theme.container.spacing.small};
    flex-wrap: wrap;
`;

const DetailLabel = styled.span`
    font-weight: 600;
    color: ${(props) => props.theme.text.colour.light_grey()};
    min-width: 100px;
`;

const DetailValue = styled.span`
    color: ${(props) => props.theme.text.colour.primary()};
`;

const NotesInput = styled.textarea`
    width: 100%;
    padding: ${(props) => props.theme.container.spacing.small};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    background: ${(props) => props.theme.container.background.colour.solid()};
    color: ${(props) => props.theme.text.colour.primary()};
    font-family: inherit;
    font-size: 0.9rem;
    resize: vertical;
    min-height: 80px;
    margin-top: ${(props) => props.theme.container.spacing.xsmall};

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

const WideModalContent = styled(ModalContent)`
    max-width: 800px;
`;

const DateInput = styled.input`
    padding: ${(props) => props.theme.container.spacing.small};
    border: 1px solid
        ${(props) => props.theme.container.border.colour.primary()};
    border-radius: ${(props) => props.theme.container.border.radius};
    background: ${(props) => props.theme.container.background.colour.solid()};
    color: ${(props) => props.theme.text.colour.primary()};
    font-size: 0.85rem;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: ${(props) => props.theme.theme_colours[5]()};
    }
`;

const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.xsmall};
`;

const FilterLabel = styled.span`
    font-size: 0.8rem;
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

const ClearedRow = styled(TableRow)<{ $isCleared: boolean }>`
    opacity: ${(props) => (props.$isCleared ? 0.5 : 1)};
    background: ${(props) =>
        props.$isCleared
            ? props.theme.container.background.colour.light_contrast()
            : 'inherit'};
`;

const CheckboxCell = styled(TableCell)`
    width: 40px;
    text-align: center;
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
    width: 16px;
    height: 16px;
    cursor: pointer;
`;

const LEVEL_OPTIONS = [
    { value: '', label: 'All Levels' },
    { value: 'debug', label: 'Debug' },
    { value: 'info', label: 'Info' },
    { value: 'warn', label: 'Warning' },
    { value: 'error', label: 'Error' },
    { value: 'fatal', label: 'Fatal' }
];

const CLEARED_OPTIONS = [
    { value: '', label: 'All Logs' },
    { value: 'false', label: 'Active Only' },
    { value: 'true', label: 'Cleared Only' }
];

export default function AdminLogsPage() {
    const { isAdmin, hasPermission } = useAuth();
    const [activeTab, setActiveTab] = useState<'logs' | 'errors'>('logs');
    const [stats, setStats] = useState<LogStats | null>(null);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [errors, setErrors] = useState<ErrorSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [levelFilter, setLevelFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [resolvedFilter, setResolvedFilter] = useState<string>('false');
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const [selectedError, setSelectedError] = useState<ErrorSummary | null>(
        null
    );
    const [resolveNotes, setResolveNotes] = useState('');
    const [downloading, setDownloading] = useState(false);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [clearedFilter, setClearedFilter] = useState<string>('false'); // Default to active only
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [clearing, setClearing] = useState(false);

    const canViewLogs = isAdmin() || hasPermission('admin.dashboard');

    // Fetch stats
    const fetchStats = useCallback(async () => {
        try {
            const res = await api.get<LogStats>('/admin/logs/stats');
            setStats(res.data);
        } catch (err) {
            console.error('Error fetching log stats:', err);
        }
    }, []);

    // Fetch logs
    const fetchLogs = useCallback(
        async (pageNum: number = 1) => {
            setLoading(true);
            setError(null);
            setSelectedIds(new Set()); // Clear selection on fetch
            try {
                const params = new URLSearchParams({
                    offset: ((pageNum - 1) * 25).toString(),
                    limit: '25'
                });
                if (levelFilter) {
                    params.append('level', levelFilter);
                }
                if (searchQuery) {
                    params.append('search', searchQuery);
                }
                if (startDate) {
                    params.append(
                        'startDate',
                        new Date(startDate).toISOString()
                    );
                }
                if (endDate) {
                    // Add one day to include the entire end date
                    const endDateTime = new Date(endDate);
                    endDateTime.setDate(endDateTime.getDate() + 1);
                    params.append('endDate', endDateTime.toISOString());
                }
                if (clearedFilter !== '') {
                    params.append('cleared', clearedFilter);
                }
                const res = await api.get<{
                    logs: LogEntry[];
                    total: number;
                    limit: number;
                    offset: number;
                }>(`/admin/logs?${params.toString()}`);
                setLogs(res.data.logs);
                setPage(pageNum);
                setTotalPages(Math.ceil(res.data.total / 25) || 1);
            } catch (err: any) {
                console.error('Error fetching logs:', err);
                setError(err.response?.data?.error || 'Failed to load logs');
            } finally {
                setLoading(false);
            }
        },
        [levelFilter, searchQuery, startDate, endDate, clearedFilter]
    );

    // Fetch error summaries
    const fetchErrors = useCallback(
        async (pageNum: number = 1) => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({
                    offset: ((pageNum - 1) * 25).toString(),
                    limit: '25'
                });
                if (resolvedFilter !== '') {
                    params.append('resolved', resolvedFilter);
                }
                const res = await api.get<{
                    summaries: ErrorSummary[];
                    total: number;
                    limit: number;
                    offset: number;
                }>(`/admin/logs/errors?${params.toString()}`);
                setErrors(res.data.summaries);
                setPage(pageNum);
                setTotalPages(Math.ceil(res.data.total / 25) || 1);
            } catch (err: any) {
                console.error('Error fetching errors:', err);
                setError(err.response?.data?.error || 'Failed to load errors');
            } finally {
                setLoading(false);
            }
        },
        [resolvedFilter]
    );

    // Initial load
    useEffect(() => {
        if (canViewLogs) {
            fetchStats();
        }
    }, [fetchStats, canViewLogs]);

    // Load data when tab changes
    useEffect(() => {
        if (canViewLogs) {
            setPage(1);
            if (activeTab === 'logs') {
                fetchLogs(1);
            } else {
                fetchErrors(1);
            }
        }
    }, [activeTab, canViewLogs, fetchLogs, fetchErrors]);

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        setPage(1);
    };

    // Resolve error
    const handleResolveError = async (errorId: string) => {
        try {
            await api.post(`/admin/logs/errors/${errorId}/resolve`, {
                notes: resolveNotes
            });
            setSelectedError(null);
            setResolveNotes('');
            fetchErrors(page);
            fetchStats();
        } catch (err: any) {
            console.error('Error resolving error:', err);
            setError(err.response?.data?.error || 'Failed to resolve error');
        }
    };

    // Unresolve error
    const handleUnresolveError = async (errorId: string) => {
        try {
            await api.post(`/admin/logs/errors/${errorId}/unresolve`);
            fetchErrors(page);
            fetchStats();
        } catch (err: any) {
            console.error('Error unresolving error:', err);
            setError(err.response?.data?.error || 'Failed to unresolve error');
        }
    };

    // Download logs as JSON
    const handleDownloadLogs = async (downloadAll: boolean = false) => {
        setDownloading(true);
        try {
            const params = new URLSearchParams();
            if (!downloadAll) {
                // Download current page only
                params.append('offset', ((page - 1) * 25).toString());
                params.append('limit', '25');
            } else {
                // Download up to 1000 logs
                params.append('offset', '0');
                params.append('limit', '1000');
            }
            if (levelFilter) {
                params.append('level', levelFilter);
            }
            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const res = await api.get<{
                logs: LogEntry[];
                total: number;
            }>(`/admin/logs?${params.toString()}`);

            const dataToDownload = {
                exportedAt: new Date().toISOString(),
                filters: {
                    level: levelFilter || 'all',
                    search: searchQuery || null,
                    downloadAll
                },
                total: res.data.total,
                count: res.data.logs.length,
                logs: res.data.logs
            };

            const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().split('T')[0];
            a.download = `server-logs-${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error('Error downloading logs:', err);
            setError(err.response?.data?.error || 'Failed to download logs');
        } finally {
            setDownloading(false);
        }
    };

    // Download errors as JSON
    const handleDownloadErrors = async () => {
        setDownloading(true);
        try {
            const params = new URLSearchParams({
                offset: '0',
                limit: '1000'
            });
            if (resolvedFilter !== '') {
                params.append('resolved', resolvedFilter);
            }

            const res = await api.get<{
                summaries: ErrorSummary[];
                total: number;
            }>(`/admin/logs/errors?${params.toString()}`);

            const dataToDownload = {
                exportedAt: new Date().toISOString(),
                filters: {
                    resolved: resolvedFilter || 'all'
                },
                total: res.data.total,
                count: res.data.summaries.length,
                errors: res.data.summaries
            };

            const blob = new Blob([JSON.stringify(dataToDownload, null, 2)], {
                type: 'application/json'
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const timestamp = new Date().toISOString().split('T')[0];
            a.download = `error-summaries-${timestamp}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err: any) {
            console.error('Error downloading errors:', err);
            setError(err.response?.data?.error || 'Failed to download errors');
        } finally {
            setDownloading(false);
        }
    };

    // Clear selected logs
    const handleClearSelected = async () => {
        if (selectedIds.size === 0) return;
        setClearing(true);
        try {
            await api.post('/admin/logs/clear', {
                ids: Array.from(selectedIds)
            });
            setSelectedIds(new Set());
            fetchLogs(page);
        } catch (err: any) {
            console.error('Error clearing logs:', err);
            setError(err.response?.data?.error || 'Failed to clear logs');
        } finally {
            setClearing(false);
        }
    };

    // Restore selected logs
    const handleUnclearSelected = async () => {
        if (selectedIds.size === 0) return;
        setClearing(true);
        try {
            await api.post('/admin/logs/unclear', {
                ids: Array.from(selectedIds)
            });
            setSelectedIds(new Set());
            fetchLogs(page);
        } catch (err: any) {
            console.error('Error restoring logs:', err);
            setError(err.response?.data?.error || 'Failed to restore logs');
        } finally {
            setClearing(false);
        }
    };

    // Clear all visible logs
    const handleClearAll = async () => {
        if (
            !confirm(
                'Are you sure you want to clear all logs matching the current filters?'
            )
        ) {
            return;
        }
        setClearing(true);
        try {
            const payload: Record<string, any> = {};
            if (levelFilter) payload.level = levelFilter;
            if (searchQuery) payload.search = searchQuery;
            if (startDate)
                payload.startDate = new Date(startDate).toISOString();
            if (endDate) {
                const endDateTime = new Date(endDate);
                endDateTime.setDate(endDateTime.getDate() + 1);
                payload.endDate = endDateTime.toISOString();
            }
            await api.post('/admin/logs/clear-all', payload);
            setSelectedIds(new Set());
            fetchLogs(page);
        } catch (err: any) {
            console.error('Error clearing all logs:', err);
            setError(err.response?.data?.error || 'Failed to clear logs');
        } finally {
            setClearing(false);
        }
    };

    // Toggle selection
    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    // Select all visible
    const toggleSelectAll = () => {
        if (selectedIds.size === logs.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(logs.map((l) => l.id)));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getLevelBadgeVariant = (
        level: string
    ): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
        switch (level) {
            case 'fatal':
                return 'danger';
            case 'error':
                return 'danger';
            case 'warn':
                return 'warning';
            case 'info':
                return 'primary';
            case 'debug':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    if (!canViewLogs) {
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
                <p>You do not have permission to view server logs.</p>
            </AccessDenied>
        );
    }

    return (
        <>
            <AdminHeader>
                <AdminTitle>Server Logs</AdminTitle>
            </AdminHeader>

            {/* Stats Cards */}
            {stats && (
                <StatsGrid>
                    <StatCard>
                        <StatValue
                            style={{
                                color:
                                    stats.errorsToday > 0
                                        ? '#e74c3c'
                                        : 'inherit'
                            }}
                        >
                            {stats.errorsToday}
                        </StatValue>
                        <StatLabel>Errors Today</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>{stats.errorsThisWeek}</StatValue>
                        <StatLabel>Errors This Week</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue
                            style={{
                                color:
                                    stats.unresolvedErrors > 0
                                        ? '#e67e22'
                                        : 'inherit'
                            }}
                        >
                            {stats.unresolvedErrors}
                        </StatValue>
                        <StatLabel>Unresolved Errors</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatValue>
                            {Object.values(stats.logsByLevel).reduce(
                                (a, b) => a + b,
                                0
                            )}
                        </StatValue>
                        <StatLabel>Logs This Week</StatLabel>
                    </StatCard>
                </StatsGrid>
            )}

            {/* Tabs */}
            <TabContainer>
                <Tab
                    $active={activeTab === 'logs'}
                    onClick={() => setActiveTab('logs')}
                >
                    All Logs
                </Tab>
                <Tab
                    $active={activeTab === 'errors'}
                    onClick={() => setActiveTab('errors')}
                >
                    Error Summary
                </Tab>
            </TabContainer>

            {/* Filters */}
            <ActionBar>
                <ActionBarLeft>
                    {activeTab === 'logs' ? (
                        <>
                            <SelectDropDown
                                value={levelFilter}
                                onChange={(value) => {
                                    setLevelFilter(value);
                                    setPage(1);
                                }}
                                options={LEVEL_OPTIONS}
                                styleContainer={{ width: '130px', margin: 0 }}
                            />
                            <SelectDropDown
                                value={clearedFilter}
                                onChange={(value) => {
                                    setClearedFilter(value);
                                    setPage(1);
                                }}
                                options={CLEARED_OPTIONS}
                                styleContainer={{ width: '130px', margin: 0 }}
                            />
                            <FilterGroup>
                                <FilterLabel>From:</FilterLabel>
                                <DateInput
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </FilterGroup>
                            <FilterGroup>
                                <FilterLabel>To:</FilterLabel>
                                <DateInput
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </FilterGroup>
                            <form onSubmit={handleSearch}>
                                <SearchBar
                                    placeholder="Search logs..."
                                    value={searchInput}
                                    onChange={setSearchInput}
                                    styleContainer={{
                                        width: '200px',
                                        margin: 0
                                    }}
                                />
                            </form>
                        </>
                    ) : (
                        <SelectDropDown
                            value={resolvedFilter}
                            onChange={(value) => {
                                setResolvedFilter(value);
                                setPage(1);
                            }}
                            options={[
                                { value: '', label: 'All Errors' },
                                { value: 'false', label: 'Unresolved' },
                                { value: 'true', label: 'Resolved' }
                            ]}
                            styleContainer={{ width: '180px', margin: 0 }}
                        />
                    )}
                </ActionBarLeft>
                <ActionBarRight>
                    {(levelFilter ||
                        searchQuery ||
                        startDate ||
                        endDate ||
                        clearedFilter !== 'false') &&
                        activeTab === 'logs' && (
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={() => {
                                    setLevelFilter('');
                                    setSearchQuery('');
                                    setSearchInput('');
                                    setStartDate('');
                                    setEndDate('');
                                    setClearedFilter('false');
                                }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    {activeTab === 'logs' && selectedIds.size > 0 && (
                        <>
                            {clearedFilter !== 'true' && (
                                <Button
                                    variant="warning"
                                    size="small"
                                    onClick={handleClearSelected}
                                    disabled={clearing}
                                >
                                    {clearing
                                        ? 'Clearing...'
                                        : `Clear ${selectedIds.size}`}
                                </Button>
                            )}
                            {clearedFilter === 'true' && (
                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={handleUnclearSelected}
                                    disabled={clearing}
                                >
                                    {clearing
                                        ? 'Restoring...'
                                        : `Restore ${selectedIds.size}`}
                                </Button>
                            )}
                        </>
                    )}
                    {activeTab === 'logs' &&
                        clearedFilter !== 'true' &&
                        logs.length > 0 && (
                            <Button
                                variant="danger"
                                size="small"
                                onClick={handleClearAll}
                                disabled={clearing}
                            >
                                Clear All Matching
                            </Button>
                        )}
                    {activeTab === 'logs' ? (
                        <>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={() => handleDownloadLogs(false)}
                                disabled={downloading || logs.length === 0}
                            >
                                {downloading
                                    ? 'Downloading...'
                                    : 'Download Page'}
                            </Button>
                            <Button
                                variant="primary"
                                size="small"
                                onClick={() => handleDownloadLogs(true)}
                                disabled={downloading}
                            >
                                {downloading
                                    ? 'Downloading...'
                                    : 'Download All'}
                            </Button>
                        </>
                    ) : (
                        <Button
                            variant="primary"
                            size="small"
                            onClick={handleDownloadErrors}
                            disabled={downloading || errors.length === 0}
                        >
                            {downloading ? 'Downloading...' : 'Download Errors'}
                        </Button>
                    )}
                </ActionBarRight>
            </ActionBar>

            {error && (
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
                        onClick={() =>
                            activeTab === 'logs'
                                ? fetchLogs(page)
                                : fetchErrors(page)
                        }
                        style={{ marginLeft: 'auto' }}
                    >
                        Retry
                    </Button>
                </Alert>
            )}

            {loading ? (
                <LoadingContainer>
                    <LoadingSpinner />
                    <LoadingText>Loading logs...</LoadingText>
                </LoadingContainer>
            ) : activeTab === 'logs' ? (
                /* Logs Tab */
                logs.length === 0 ? (
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
                                    d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z"
                                />
                            </svg>
                        </EmptyStateIcon>
                        <EmptyStateTitle>No logs found</EmptyStateTitle>
                        <EmptyStateText>
                            {levelFilter || searchQuery
                                ? 'No logs match these filters'
                                : 'Server logs will appear here'}
                        </EmptyStateText>
                    </EmptyState>
                ) : (
                    <>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableHeader $width="40px">
                                            <Checkbox
                                                checked={
                                                    selectedIds.size ===
                                                        logs.length &&
                                                    logs.length > 0
                                                }
                                                onChange={toggleSelectAll}
                                            />
                                        </TableHeader>
                                        <TableHeader $width="80px">
                                            Level
                                        </TableHeader>
                                        <TableHeader>Message</TableHeader>
                                        <TableHeader $width="120px">
                                            Path
                                        </TableHeader>
                                        <TableHeader $width="80px">
                                            Status
                                        </TableHeader>
                                        <TableHeader $width="150px">
                                            Date
                                        </TableHeader>
                                        <TableHeader $width="80px">
                                            Actions
                                        </TableHeader>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.map((log) => (
                                        <ClearedRow
                                            key={log.id}
                                            $isCleared={!!log.clearedAt}
                                        >
                                            <CheckboxCell>
                                                <Checkbox
                                                    checked={selectedIds.has(
                                                        log.id
                                                    )}
                                                    onChange={() =>
                                                        toggleSelection(log.id)
                                                    }
                                                />
                                            </CheckboxCell>
                                            <TableCell>
                                                <Badge
                                                    $variant={getLevelBadgeVariant(
                                                        log.level
                                                    )}
                                                >
                                                    {log.level.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <LogMessage>
                                                    {log.message.length > 100
                                                        ? log.message.substring(
                                                              0,
                                                              100
                                                          ) + '...'
                                                        : log.message}
                                                </LogMessage>
                                            </TableCell>
                                            <TableCell $truncate>
                                                {log.path ? (
                                                    <span
                                                        title={`${log.method} ${log.path}`}
                                                    >
                                                        {log.method} {log.path}
                                                    </span>
                                                ) : (
                                                    <span
                                                        style={{ opacity: 0.3 }}
                                                    >
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {log.statusCode ? (
                                                    <Badge
                                                        $variant={
                                                            log.statusCode >=
                                                            500
                                                                ? 'danger'
                                                                : log.statusCode >=
                                                                    400
                                                                  ? 'warning'
                                                                  : 'success'
                                                        }
                                                    >
                                                        {log.statusCode}
                                                    </Badge>
                                                ) : (
                                                    <span
                                                        style={{ opacity: 0.3 }}
                                                    >
                                                        -
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(log.createdAt)}
                                            </TableCell>
                                            <TableCell>
                                                <ViewButton
                                                    onClick={() =>
                                                        setSelectedLog(log)
                                                    }
                                                >
                                                    View
                                                </ViewButton>
                                            </TableCell>
                                        </ClearedRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {totalPages > 1 && (
                            <Pagination>
                                <PageButton
                                    disabled={page === 1}
                                    onClick={() => fetchLogs(page - 1)}
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
                                        onClick={() => fetchLogs(p)}
                                    >
                                        {p}
                                    </PageButton>
                                ))}
                                <PageButton
                                    disabled={page === totalPages}
                                    onClick={() => fetchLogs(page + 1)}
                                >
                                    Next
                                </PageButton>
                            </Pagination>
                        )}
                    </>
                )
            ) : /* Errors Tab */
            errors.length === 0 ? (
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
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </EmptyStateIcon>
                    <EmptyStateTitle>No errors found</EmptyStateTitle>
                    <EmptyStateText>
                        {resolvedFilter === 'false'
                            ? 'No unresolved errors'
                            : resolvedFilter === 'true'
                              ? 'No resolved errors'
                              : 'No errors recorded'}
                    </EmptyStateText>
                </EmptyState>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>Message</TableHeader>
                                    <TableHeader $width="100px">
                                        Count
                                    </TableHeader>
                                    <TableHeader $width="140px">
                                        First Seen
                                    </TableHeader>
                                    <TableHeader $width="140px">
                                        Last Seen
                                    </TableHeader>
                                    <TableHeader $width="100px">
                                        Status
                                    </TableHeader>
                                    <TableHeader $width="100px">
                                        Actions
                                    </TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {errors.map((err) => (
                                    <TableRow key={err.id}>
                                        <TableCell>
                                            <LogMessage>
                                                {err.message.length > 80
                                                    ? err.message.substring(
                                                          0,
                                                          80
                                                      ) + '...'
                                                    : err.message}
                                            </LogMessage>
                                            {err.source && (
                                                <div
                                                    style={{
                                                        fontSize: '0.7rem',
                                                        opacity: 0.6,
                                                        marginTop: '4px'
                                                    }}
                                                >
                                                    Source: {err.source}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                $variant={
                                                    err.count > 10
                                                        ? 'danger'
                                                        : err.count > 3
                                                          ? 'warning'
                                                          : 'secondary'
                                                }
                                            >
                                                {err.count}x
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(err.firstSeenAt)}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(err.lastSeenAt)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                $variant={
                                                    err.resolved
                                                        ? 'success'
                                                        : 'warning'
                                                }
                                            >
                                                {err.resolved
                                                    ? 'Resolved'
                                                    : 'Open'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <ViewButton
                                                onClick={() =>
                                                    setSelectedError(err)
                                                }
                                            >
                                                View
                                            </ViewButton>
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
                                onClick={() => fetchErrors(page - 1)}
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
                                    onClick={() => fetchErrors(p)}
                                >
                                    {p}
                                </PageButton>
                            ))}
                            <PageButton
                                disabled={page === totalPages}
                                onClick={() => fetchErrors(page + 1)}
                            >
                                Next
                            </PageButton>
                        </Pagination>
                    )}
                </>
            )}

            {/* Log Detail Modal */}
            {selectedLog && (
                <ModalBackdrop onClick={() => setSelectedLog(null)}>
                    <WideModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Log Details</ModalTitle>
                            <AdminCloseButton
                                onClick={() => setSelectedLog(null)}
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
                            </AdminCloseButton>
                        </ModalHeader>

                        <ModalBody>
                            <DetailRow>
                                <DetailLabel>Level:</DetailLabel>
                                <DetailValue>
                                    <Badge
                                        $variant={getLevelBadgeVariant(
                                            selectedLog.level
                                        )}
                                    >
                                        {selectedLog.level.toUpperCase()}
                                    </Badge>
                                </DetailValue>
                            </DetailRow>

                            <DetailRow>
                                <DetailLabel>Message:</DetailLabel>
                                <DetailValue>{selectedLog.message}</DetailValue>
                            </DetailRow>

                            {selectedLog.path && (
                                <DetailRow>
                                    <DetailLabel>Request:</DetailLabel>
                                    <DetailValue>
                                        {selectedLog.method} {selectedLog.path}
                                    </DetailValue>
                                </DetailRow>
                            )}

                            {selectedLog.statusCode && (
                                <DetailRow>
                                    <DetailLabel>Status:</DetailLabel>
                                    <DetailValue>
                                        {selectedLog.statusCode}
                                    </DetailValue>
                                </DetailRow>
                            )}

                            {selectedLog.duration && (
                                <DetailRow>
                                    <DetailLabel>Duration:</DetailLabel>
                                    <DetailValue>
                                        {selectedLog.duration}ms
                                    </DetailValue>
                                </DetailRow>
                            )}

                            {selectedLog.requestId && (
                                <DetailRow>
                                    <DetailLabel>Request ID:</DetailLabel>
                                    <DetailValue>
                                        {selectedLog.requestId}
                                    </DetailValue>
                                </DetailRow>
                            )}

                            {selectedLog.userId && (
                                <DetailRow>
                                    <DetailLabel>User ID:</DetailLabel>
                                    <DetailValue>
                                        {selectedLog.userId}
                                    </DetailValue>
                                </DetailRow>
                            )}

                            {selectedLog.ipAddress && (
                                <DetailRow>
                                    <DetailLabel>IP Address:</DetailLabel>
                                    <DetailValue>
                                        {selectedLog.ipAddress}
                                    </DetailValue>
                                </DetailRow>
                            )}

                            <DetailRow>
                                <DetailLabel>Timestamp:</DetailLabel>
                                <DetailValue>
                                    {formatDate(selectedLog.createdAt)}
                                </DetailValue>
                            </DetailRow>

                            {selectedLog.stack && (
                                <div style={{ marginTop: '1rem' }}>
                                    <DetailLabel>Stack Trace:</DetailLabel>
                                    <StackTrace>{selectedLog.stack}</StackTrace>
                                </div>
                            )}

                            {selectedLog.context &&
                                Object.keys(selectedLog.context).length > 0 && (
                                    <div style={{ marginTop: '1rem' }}>
                                        <DetailLabel>Context:</DetailLabel>
                                        <StackTrace>
                                            {JSON.stringify(
                                                selectedLog.context,
                                                null,
                                                2
                                            )}
                                        </StackTrace>
                                    </div>
                                )}
                        </ModalBody>
                    </WideModalContent>
                </ModalBackdrop>
            )}

            {/* Error Detail Modal */}
            {selectedError && (
                <ModalBackdrop onClick={() => setSelectedError(null)}>
                    <WideModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>Error Details</ModalTitle>
                            <AdminCloseButton
                                onClick={() => setSelectedError(null)}
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
                            </AdminCloseButton>
                        </ModalHeader>

                        <ModalBody>
                            <DetailRow>
                                <DetailLabel>Status:</DetailLabel>
                                <DetailValue>
                                    <Badge
                                        $variant={
                                            selectedError.resolved
                                                ? 'success'
                                                : 'warning'
                                        }
                                    >
                                        {selectedError.resolved
                                            ? 'Resolved'
                                            : 'Open'}
                                    </Badge>
                                </DetailValue>
                            </DetailRow>

                            <DetailRow>
                                <DetailLabel>Message:</DetailLabel>
                                <DetailValue>
                                    {selectedError.message}
                                </DetailValue>
                            </DetailRow>

                            {selectedError.source && (
                                <DetailRow>
                                    <DetailLabel>Source:</DetailLabel>
                                    <DetailValue>
                                        {selectedError.source}
                                    </DetailValue>
                                </DetailRow>
                            )}

                            <DetailRow>
                                <DetailLabel>Occurrences:</DetailLabel>
                                <DetailValue>{selectedError.count}</DetailValue>
                            </DetailRow>

                            <DetailRow>
                                <DetailLabel>First Seen:</DetailLabel>
                                <DetailValue>
                                    {formatDate(selectedError.firstSeenAt)}
                                </DetailValue>
                            </DetailRow>

                            <DetailRow>
                                <DetailLabel>Last Seen:</DetailLabel>
                                <DetailValue>
                                    {formatDate(selectedError.lastSeenAt)}
                                </DetailValue>
                            </DetailRow>

                            {selectedError.resolvedAt && (
                                <DetailRow>
                                    <DetailLabel>Resolved At:</DetailLabel>
                                    <DetailValue>
                                        {formatDate(selectedError.resolvedAt)}
                                    </DetailValue>
                                </DetailRow>
                            )}

                            {selectedError.stack && (
                                <div style={{ marginTop: '1rem' }}>
                                    <DetailLabel>Stack Trace:</DetailLabel>
                                    <StackTrace>
                                        {selectedError.stack}
                                    </StackTrace>
                                </div>
                            )}

                            {selectedError.notes && (
                                <div style={{ marginTop: '1rem' }}>
                                    <DetailLabel>Notes:</DetailLabel>
                                    <p style={{ marginTop: '0.5rem' }}>
                                        {selectedError.notes}
                                    </p>
                                </div>
                            )}

                            {!selectedError.resolved && (
                                <div style={{ marginTop: '1.5rem' }}>
                                    <FormGroup>
                                        <Label>
                                            Resolution Notes (optional):
                                        </Label>
                                        <NotesInput
                                            value={resolveNotes}
                                            onChange={(e) =>
                                                setResolveNotes(e.target.value)
                                            }
                                            placeholder="Add notes about how this was resolved..."
                                        />
                                    </FormGroup>
                                    <div
                                        style={{
                                            display: 'flex',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Button
                                            variant="primary"
                                            onClick={() =>
                                                handleResolveError(
                                                    selectedError.id
                                                )
                                            }
                                        >
                                            Mark as Resolved
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            onClick={() =>
                                                setSelectedError(null)
                                            }
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {selectedError.resolved && (
                                <div style={{ marginTop: '1.5rem' }}>
                                    <Button
                                        variant="warning"
                                        onClick={() =>
                                            handleUnresolveError(
                                                selectedError.id
                                            )
                                        }
                                    >
                                        Reopen Error
                                    </Button>
                                </div>
                            )}
                        </ModalBody>
                    </WideModalContent>
                </ModalBackdrop>
            )}
        </>
    );
}
