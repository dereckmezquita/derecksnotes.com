'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import {
    AdminHeader,
    AdminTitle,
    AdminSubtitle,
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
    Alert,
    Pagination,
    PageButton,
    AccessDenied
} from '../components/AdminStyles';
import SelectDropDown from '@components/atomic/SelectDropDown';
import SearchBar from '@components/atomic/SearchBar';

interface AuditLogEntry {
    id: string;
    adminId: string;
    action: string;
    targetType: string;
    targetId: string | null;
    details: Record<string, any> | null;
    ipAddress: string | null;
    createdAt: string;
    admin: {
        id: string;
        username: string;
    } | null;
}

interface AuditLogResponse {
    logs: AuditLogEntry[];
    page: number;
    limit: number;
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
                setEntries(res.data.logs);
                setPage(res.data.page);
                // Server doesn't return total, so calculate hasMore based on returned count
                const hasMore = res.data.logs.length === res.data.limit;
                setTotalPages(hasMore ? res.data.page + 1 : res.data.page);
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

    const parseDetails = (
        details: Record<string, any> | null
    ): Record<string, any> => {
        if (!details) return {};
        return details;
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

            <ActionBar>
                <ActionBarLeft>
                    <SelectDropDown
                        value={actionFilter}
                        onChange={(value) => {
                            setActionFilter(value);
                            setPage(1);
                        }}
                        options={ACTION_TYPES.map((type) => ({
                            label: type.label,
                            value: type.value
                        }))}
                        styleContainer={{ width: '180px', margin: 0 }}
                    />
                    <form onSubmit={handleSearch}>
                        <SearchBar
                            placeholder="Filter by admin..."
                            value={searchInput}
                            onChange={setSearchInput}
                            styleContainer={{ width: '200px', margin: 0 }}
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
                            Clear
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
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader $width="120px">
                                        Admin
                                    </TableHeader>
                                    <TableHeader $width="150px">
                                        Action
                                    </TableHeader>
                                    <TableHeader $width="140px">
                                        Target
                                    </TableHeader>
                                    <TableHeader>Details</TableHeader>
                                    <TableHeader $width="160px">
                                        Date
                                    </TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {entries.map((entry) => {
                                    const details = parseDetails(entry.details);
                                    return (
                                        <TableRow key={entry.id}>
                                            <TableCell>
                                                <strong>
                                                    {entry.admin?.username ||
                                                        'Unknown'}
                                                </strong>
                                                {entry.ipAddress && (
                                                    <div
                                                        style={{
                                                            fontSize: '0.7rem',
                                                            opacity: 0.5
                                                        }}
                                                    >
                                                        {entry.ipAddress}
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    $variant={getActionBadgeVariant(
                                                        entry.action
                                                    )}
                                                >
                                                    {formatAction(entry.action)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge $variant="secondary">
                                                    {entry.targetType}
                                                </Badge>
                                                {entry.targetId && (
                                                    <span
                                                        style={{
                                                            marginLeft:
                                                                '0.25rem',
                                                            opacity: 0.6,
                                                            fontSize: '0.75rem'
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
                                                $truncate
                                                title={JSON.stringify(details)}
                                            >
                                                {Object.keys(details).length >
                                                0 ? (
                                                    <span
                                                        style={{
                                                            fontSize: '0.8rem',
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
                                                {formatDate(entry.createdAt)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

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
                                    $active={p === page}
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
        </>
    );
}
