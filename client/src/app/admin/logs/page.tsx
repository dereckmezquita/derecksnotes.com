'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import {
    AdminHeader,
    AdminTitle,
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
    Button
} from '../components/AdminStyles';
import {
    LogDetailModal,
    ErrorDetailModal,
    LogsTable,
    ErrorsTable,
    LogFilters,
    ErrorFilters,
    TabContainer,
    Tab
} from './components';
import type { LogEntry, ErrorSummary, LogStats } from '@/types/api';

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

    // Log filters
    const [levelFilter, setLevelFilter] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [clearedFilter, setClearedFilter] = useState<string>('false');

    // Error filters
    const [resolvedFilter, setResolvedFilter] = useState<string>('false');

    // UI state
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
    const [selectedError, setSelectedError] = useState<ErrorSummary | null>(
        null
    );
    const [downloading, setDownloading] = useState(false);
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
            setSelectedIds(new Set());
            try {
                const params = new URLSearchParams({
                    offset: ((pageNum - 1) * 25).toString(),
                    limit: '25'
                });
                if (levelFilter) params.append('level', levelFilter);
                if (searchQuery) params.append('search', searchQuery);
                if (startDate) {
                    params.append(
                        'startDate',
                        new Date(startDate).toISOString()
                    );
                }
                if (endDate) {
                    params.append('endDate', new Date(endDate).toISOString());
                }
                if (clearedFilter !== '') {
                    params.append('cleared', clearedFilter);
                }

                const res = await api.get<{
                    logs: LogEntry[];
                    total: number;
                }>(`/admin/logs?${params.toString()}`);

                setLogs(res.data.logs);
                setPage(pageNum);
                setTotalPages(Math.ceil(res.data.total / 25) || 1);
            } catch (err: unknown) {
                console.error('Error fetching logs:', err);
                const apiErr = err as {
                    response?: { data?: { error?: string } };
                };
                setError(apiErr.response?.data?.error || 'Failed to load logs');
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
                }>(`/admin/logs/errors?${params.toString()}`);

                setErrors(res.data.summaries);
                setPage(pageNum);
                setTotalPages(Math.ceil(res.data.total / 25) || 1);
            } catch (err: unknown) {
                console.error('Error fetching errors:', err);
                const apiErr = err as {
                    response?: { data?: { error?: string } };
                };
                setError(
                    apiErr.response?.data?.error || 'Failed to load errors'
                );
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

    // Handlers
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchInput);
        setPage(1);
    };

    const handleClearFilters = () => {
        setLevelFilter('');
        setSearchQuery('');
        setSearchInput('');
        setStartDate('');
        setEndDate('');
        setClearedFilter('false');
    };

    const handleResolveError = async (errorId: string, notes: string) => {
        try {
            await api.post(`/admin/logs/errors/${errorId}/resolve`, { notes });
            setSelectedError(null);
            fetchErrors(page);
            fetchStats();
        } catch (err: unknown) {
            console.error('Error resolving error:', err);
            const apiErr = err as { response?: { data?: { error?: string } } };
            setError(apiErr.response?.data?.error || 'Failed to resolve error');
        }
    };

    const handleUnresolveError = async (errorId: string) => {
        try {
            await api.post(`/admin/logs/errors/${errorId}/unresolve`);
            setSelectedError(null);
            fetchErrors(page);
            fetchStats();
        } catch (err: unknown) {
            console.error('Error unresolving error:', err);
            const apiErr = err as { response?: { data?: { error?: string } } };
            setError(
                apiErr.response?.data?.error || 'Failed to unresolve error'
            );
        }
    };

    const handleDownloadLogs = async (downloadAll: boolean = false) => {
        setDownloading(true);
        try {
            const params = new URLSearchParams();
            if (!downloadAll) {
                params.append('offset', ((page - 1) * 25).toString());
                params.append('limit', '25');
            } else {
                params.append('offset', '0');
                params.append('limit', '1000');
            }
            if (levelFilter) params.append('level', levelFilter);
            if (searchQuery) params.append('search', searchQuery);
            if (startDate) {
                params.append('startDate', new Date(startDate).toISOString());
            }
            if (endDate) {
                params.append('endDate', new Date(endDate).toISOString());
            }
            if (clearedFilter !== '') {
                params.append('cleared', clearedFilter);
            }

            const res = await api.get<{ logs: LogEntry[]; total: number }>(
                `/admin/logs?${params.toString()}`
            );

            const dataToDownload = {
                exportedAt: new Date().toISOString(),
                filters: {
                    level: levelFilter || 'all',
                    search: searchQuery || null,
                    startDate: startDate || null,
                    endDate: endDate || null,
                    cleared: clearedFilter || 'all',
                    downloadAll
                },
                total: res.data.total,
                count: res.data.logs.length,
                logs: res.data.logs
            };

            downloadJson(dataToDownload, 'server-logs');
        } catch (err: unknown) {
            console.error('Error downloading logs:', err);
            const apiErr = err as { response?: { data?: { error?: string } } };
            setError(apiErr.response?.data?.error || 'Failed to download logs');
        } finally {
            setDownloading(false);
        }
    };

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
                filters: { resolved: resolvedFilter || 'all' },
                total: res.data.total,
                count: res.data.summaries.length,
                errors: res.data.summaries
            };

            downloadJson(dataToDownload, 'error-summaries');
        } catch (err: unknown) {
            console.error('Error downloading errors:', err);
            const apiErr = err as { response?: { data?: { error?: string } } };
            setError(
                apiErr.response?.data?.error || 'Failed to download errors'
            );
        } finally {
            setDownloading(false);
        }
    };

    const handleClearSelected = async () => {
        if (selectedIds.size === 0) return;
        setClearing(true);
        try {
            await api.post('/admin/logs/clear', {
                ids: Array.from(selectedIds)
            });
            setSelectedIds(new Set());
            fetchLogs(page);
        } catch (err: unknown) {
            console.error('Error clearing logs:', err);
            const apiErr = err as { response?: { data?: { error?: string } } };
            setError(apiErr.response?.data?.error || 'Failed to clear logs');
        } finally {
            setClearing(false);
        }
    };

    const handleUnclearSelected = async () => {
        if (selectedIds.size === 0) return;
        setClearing(true);
        try {
            await api.post('/admin/logs/unclear', {
                ids: Array.from(selectedIds)
            });
            setSelectedIds(new Set());
            fetchLogs(page);
        } catch (err: unknown) {
            console.error('Error restoring logs:', err);
            const apiErr = err as { response?: { data?: { error?: string } } };
            setError(apiErr.response?.data?.error || 'Failed to restore logs');
        } finally {
            setClearing(false);
        }
    };

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
            const payload: Record<string, string> = {};
            if (levelFilter) payload.level = levelFilter;
            if (searchQuery) payload.search = searchQuery;
            if (startDate)
                payload.startDate = new Date(startDate).toISOString();
            if (endDate) payload.endDate = new Date(endDate).toISOString();
            await api.post('/admin/logs/clear-all', payload);
            setSelectedIds(new Set());
            fetchLogs(page);
        } catch (err: unknown) {
            console.error('Error clearing all logs:', err);
            const apiErr = err as { response?: { data?: { error?: string } } };
            setError(apiErr.response?.data?.error || 'Failed to clear logs');
        } finally {
            setClearing(false);
        }
    };

    const toggleSelection = (id: string) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === logs.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(logs.map((l) => l.id)));
        }
    };

    // Helper to download JSON
    function downloadJson(data: object, filename: string) {
        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().split('T')[0];
        a.download = `${filename}-${timestamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Pagination helper
    const getPageNumbers = () => {
        return Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            if (totalPages <= 5) return i + 1;
            if (page <= 3) return i + 1;
            if (page >= totalPages - 2) return totalPages - 4 + i;
            return page - 2 + i;
        });
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

    const showClearFilters =
        !!levelFilter ||
        !!searchQuery ||
        !!startDate ||
        !!endDate ||
        clearedFilter !== 'false';

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
            {activeTab === 'logs' ? (
                <LogFilters
                    levelFilter={levelFilter}
                    setLevelFilter={(v) => {
                        setLevelFilter(v);
                        setPage(1);
                    }}
                    clearedFilter={clearedFilter}
                    setClearedFilter={(v) => {
                        setClearedFilter(v);
                        setPage(1);
                    }}
                    startDate={startDate}
                    setStartDate={(v) => {
                        setStartDate(v);
                        setPage(1);
                    }}
                    endDate={endDate}
                    setEndDate={(v) => {
                        setEndDate(v);
                        setPage(1);
                    }}
                    searchInput={searchInput}
                    setSearchInput={setSearchInput}
                    onSearch={handleSearch}
                    onClearFilters={handleClearFilters}
                    showClearFilters={showClearFilters}
                    selectedCount={selectedIds.size}
                    onClearSelected={handleClearSelected}
                    onUnclearSelected={handleUnclearSelected}
                    onClearAll={handleClearAll}
                    clearing={clearing}
                    hasLogs={logs.length > 0}
                    onDownloadPage={() => handleDownloadLogs(false)}
                    onDownloadAll={() => handleDownloadLogs(true)}
                    downloading={downloading}
                />
            ) : (
                <ErrorFilters
                    resolvedFilter={resolvedFilter}
                    setResolvedFilter={(v) => {
                        setResolvedFilter(v);
                        setPage(1);
                    }}
                    onDownload={handleDownloadErrors}
                    downloading={downloading}
                    hasErrors={errors.length > 0}
                />
            )}

            {/* Error Alert */}
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

            {/* Content */}
            {loading ? (
                <LoadingContainer>
                    <LoadingSpinner />
                    <LoadingText>Loading logs...</LoadingText>
                </LoadingContainer>
            ) : activeTab === 'logs' ? (
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
                        <LogsTable
                            logs={logs}
                            selectedIds={selectedIds}
                            onToggleSelection={toggleSelection}
                            onToggleSelectAll={toggleSelectAll}
                            onViewLog={setSelectedLog}
                        />

                        {totalPages > 1 && (
                            <Pagination>
                                <PageButton
                                    disabled={page === 1}
                                    onClick={() => fetchLogs(page - 1)}
                                >
                                    Previous
                                </PageButton>
                                {getPageNumbers().map((p) => (
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
            ) : errors.length === 0 ? (
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
                    <ErrorsTable
                        errors={errors}
                        onViewError={setSelectedError}
                    />

                    {totalPages > 1 && (
                        <Pagination>
                            <PageButton
                                disabled={page === 1}
                                onClick={() => fetchErrors(page - 1)}
                            >
                                Previous
                            </PageButton>
                            {getPageNumbers().map((p) => (
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

            {/* Modals */}
            {selectedLog && (
                <LogDetailModal
                    log={selectedLog}
                    onClose={() => setSelectedLog(null)}
                />
            )}

            {selectedError && (
                <ErrorDetailModal
                    error={selectedError}
                    onClose={() => setSelectedError(null)}
                    onResolve={handleResolveError}
                    onUnresolve={handleUnresolveError}
                />
            )}
        </>
    );
}
