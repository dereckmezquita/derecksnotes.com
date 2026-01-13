'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import {
    AdminHeader,
    AdminTitle,
    AdminSubtitle,
    Card,
    Table,
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    Badge,
    Button,
    Select,
    SearchInput,
    ActionBar,
    ActionBarLeft,
    ActionBarRight,
    LoadingContainer,
    LoadingSpinner,
    LoadingText,
    EmptyState,
    Alert,
    Pagination,
    PageButton,
    AccessDenied
} from '../components/AdminStyles';

interface AuditLogEntry {
    id: string;
    adminId: string;
    adminUsername: string;
    action: string;
    targetType: string;
    targetId: string | null;
    details: string | null;
    ipAddress: string | null;
    createdAt: string;
}

interface AuditLogResponse {
    entries: AuditLogEntry[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
}

const ACTION_TYPES = [
    { value: '', label: 'All Actions' },
    { value: 'comment.approve', label: 'Comment Approve' },
    { value: 'comment.reject', label: 'Comment Reject' },
    { value: 'comment.bulk_approve', label: 'Bulk Approve' },
    { value: 'comment.bulk_reject', label: 'Bulk Reject' },
    { value: 'user.ban', label: 'User Ban' },
    { value: 'user.unban', label: 'User Unban' },
    { value: 'user.groups_update', label: 'Groups Update' },
    { value: 'user.delete', label: 'User Delete' },
    { value: 'report.resolve', label: 'Report Resolve' },
    { value: 'report.dismiss', label: 'Report Dismiss' }
];

export default function AdminAuditPage() {
    const { isAdmin, hasPermission } = useAuth();
    const [entries, setEntries] = useState<AuditLogEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [actionFilter, setActionFilter] = useState<string>('');
    const [searchAdmin, setSearchAdmin] = useState('');
    const [searchInput, setSearchInput] = useState('');

    const canViewAudit = isAdmin() || hasPermission('admin.audit.view');

    const fetchAuditLog = useCallback(
        async (
            pageNum: number = 1,
            action: string = '',
            admin: string = ''
        ) => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({
                    page: pageNum.toString(),
                    limit: '25'
                });
                if (action) {
                    params.append('action', action);
                }
                if (admin) {
                    params.append('admin', admin);
                }
                const res = await api.get<AuditLogResponse>(
                    `/admin/audit?${params.toString()}`
                );
                setEntries(res.data.entries);
                setPage(res.data.pagination.page);
                setTotalPages(
                    Math.ceil(
                        res.data.pagination.total / res.data.pagination.limit
                    )
                );
            } catch (err: any) {
                console.error('Error fetching audit log:', err);
                setError(
                    err.response?.data?.error || 'Failed to load audit log'
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        if (canViewAudit) {
            fetchAuditLog(1, actionFilter, searchAdmin);
        }
    }, [fetchAuditLog, canViewAudit, actionFilter, searchAdmin]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchAdmin(searchInput);
        setPage(1);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getActionBadgeVariant = (
        action: string
    ): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
        if (action.includes('approve') || action.includes('resolve'))
            return 'success';
        if (action.includes('reject') || action.includes('dismiss'))
            return 'warning';
        if (action.includes('ban') || action.includes('delete'))
            return 'danger';
        if (action.includes('unban')) return 'primary';
        return 'secondary';
    };

    const formatAction = (action: string): string => {
        return action
            .split('.')
            .map((part) =>
                part
                    .split('_')
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ')
            )
            .join(' - ');
    };

    const parseDetails = (details: string | null): Record<string, any> => {
        if (!details) return {};
        try {
            return JSON.parse(details);
        } catch {
            return { raw: details };
        }
    };

    if (!canViewAudit) {
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
                <p>You do not have permission to view the audit log.</p>
            </AccessDenied>
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
                    onClick={() => fetchAuditLog(1, actionFilter, searchAdmin)}
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
                <AdminTitle>Audit Log</AdminTitle>
                <AdminSubtitle>
                    Track administrative actions and changes
                </AdminSubtitle>
            </AdminHeader>

            <Card>
                <ActionBar>
                    <ActionBarLeft>
                        <Select
                            value={actionFilter}
                            onChange={(e) => {
                                setActionFilter(e.target.value);
                                setPage(1);
                            }}
                        >
                            {ACTION_TYPES.map((type) => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </Select>
                        <form onSubmit={handleSearch}>
                            <SearchInput
                                placeholder="Filter by admin..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                        </form>
                    </ActionBarLeft>
                    <ActionBarRight>
                        {(actionFilter || searchAdmin) && (
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={() => {
                                    setActionFilter('');
                                    setSearchAdmin('');
                                    setSearchInput('');
                                }}
                            >
                                Clear Filters
                            </Button>
                        )}
                    </ActionBarRight>
                </ActionBar>

                {loading ? (
                    <LoadingContainer>
                        <LoadingSpinner />
                        <LoadingText>Loading audit log...</LoadingText>
                    </LoadingContainer>
                ) : entries.length === 0 ? (
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
                        <h3>No audit entries</h3>
                        <p>
                            {actionFilter || searchAdmin
                                ? 'No entries match the current filters.'
                                : 'No administrative actions have been logged yet.'}
                        </p>
                    </EmptyState>
                ) : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>Admin</TableHeader>
                                    <TableHeader>Action</TableHeader>
                                    <TableHeader>Target</TableHeader>
                                    <TableHeader>Details</TableHeader>
                                    <TableHeader>Date</TableHeader>
                                </TableRow>
                            </TableHead>
                            <tbody>
                                {entries.map((entry) => {
                                    const details = parseDetails(entry.details);
                                    return (
                                        <TableRow key={entry.id}>
                                            <TableCell>
                                                <strong>
                                                    {entry.adminUsername}
                                                </strong>
                                                {entry.ipAddress && (
                                                    <div
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            opacity: 0.5
                                                        }}
                                                    >
                                                        {entry.ipAddress}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getActionBadgeVariant(
                                                        entry.action
                                                    )}
                                                >
                                                    {formatAction(entry.action)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary">
                                                    {entry.targetType}
                                                </Badge>
                                                {entry.targetId && (
                                                    <span
                                                        style={{
                                                            marginLeft:
                                                                '0.5rem',
                                                            opacity: 0.7,
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {entry.targetId.substring(
                                                            0,
                                                            8
                                                        )}
                                                        ...
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell
                                                style={{ maxWidth: '250px' }}
                                            >
                                                {Object.keys(details).length >
                                                0 ? (
                                                    <div
                                                        style={{
                                                            fontSize:
                                                                '0.875rem',
                                                            opacity: 0.7
                                                        }}
                                                    >
                                                        {details.raw
                                                            ? details.raw
                                                            : Object.entries(
                                                                  details
                                                              )
                                                                  .slice(0, 2)
                                                                  .map(
                                                                      ([
                                                                          k,
                                                                          v
                                                                      ]) =>
                                                                          `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`
                                                                  )
                                                                  .join(', ')}
                                                    </div>
                                                ) : (
                                                    <span
                                                        style={{ opacity: 0.3 }}
                                                    >
                                                        —
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(entry.createdAt)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </tbody>
                        </Table>

                        {totalPages > 1 && (
                            <Pagination>
                                <PageButton
                                    disabled={page === 1}
                                    onClick={() =>
                                        fetchAuditLog(
                                            page - 1,
                                            actionFilter,
                                            searchAdmin
                                        )
                                    }
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
                                        active={p === page}
                                        onClick={() =>
                                            fetchAuditLog(
                                                p,
                                                actionFilter,
                                                searchAdmin
                                            )
                                        }
                                    >
                                        {p}
                                    </PageButton>
                                ))}
                                <PageButton
                                    disabled={page === totalPages}
                                    onClick={() =>
                                        fetchAuditLog(
                                            page + 1,
                                            actionFilter,
                                            searchAdmin
                                        )
                                    }
                                >
                                    Next
                                </PageButton>
                            </Pagination>
                        )}
                    </>
                )}
            </Card>
        </>
    );
}
