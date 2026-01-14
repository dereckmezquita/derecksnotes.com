'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
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
    ButtonGroup,
    ActionBar,
    ActionBarLeft,
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
    FormGroup,
    Label,
    Input
} from '../components/AdminStyles';
import SelectDropDown from '@components/atomic/SelectDropDown';
import { Modal } from '@components/ui/modal/Modal';

import type { AdminReport, AdminReportsResponse } from '@/types/api';

type Report = AdminReport;
type ReportsResponse = AdminReportsResponse;

export default function AdminReportsPage() {
    const { isAdmin, hasPermission } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>('pending');
    const [processing, setProcessing] = useState<string | null>(null);

    // Modal states
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewAction, setReviewAction] = useState<'reviewed' | 'dismissed'>(
        'reviewed'
    );
    const [reviewNotes, setReviewNotes] = useState('');

    const canViewReports = isAdmin() || hasPermission('report.view');

    const fetchReports = useCallback(
        async (pageNum: number = 1, status: string = 'pending') => {
            setLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams({
                    page: pageNum.toString(),
                    limit: '20'
                });
                if (status && status !== 'all') {
                    params.append('status', status);
                }
                const res = await api.get<ReportsResponse>(
                    `/admin/reports?${params.toString()}`
                );
                setReports(res.data.reports);
                setPage(res.data.page);
                // Server doesn't return total, so calculate hasMore based on returned count
                const hasMore = res.data.reports.length === res.data.limit;
                setTotalPages(hasMore ? res.data.page + 1 : res.data.page);
            } catch (err: any) {
                console.error('Error fetching reports:', err);
                setError(err.response?.data?.error || 'Failed to load reports');
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        if (canViewReports) {
            fetchReports(1, statusFilter);
        }
    }, [fetchReports, canViewReports, statusFilter]);

    const handleReview = async () => {
        if (!selectedReport) return;
        setProcessing(selectedReport.id);
        try {
            await api.post(`/admin/reports/${selectedReport.id}/review`, {
                action: reviewAction,
                deleteComment: false
            });
            toast.success(
                `Report ${reviewAction === 'reviewed' ? 'reviewed' : 'dismissed'}`
            );
            setReports((prev) =>
                prev.map((r) =>
                    r.id === selectedReport.id
                        ? { ...r, status: reviewAction }
                        : r
                )
            );
            setShowReviewModal(false);
            setSelectedReport(null);
            setReviewNotes('');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to review report');
        } finally {
            setProcessing(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusBadgeVariant = (
        status: string
    ): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' => {
        switch (status) {
            case 'pending':
                return 'warning';
            case 'reviewed':
                return 'success';
            case 'dismissed':
                return 'secondary';
            default:
                return 'secondary';
        }
    };

    const truncateText = (text: string, maxLength: number = 80) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    if (!canViewReports) {
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
                <p>You do not have permission to view reports.</p>
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
                    onClick={() => fetchReports(1, statusFilter)}
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
                <AdminTitle>Reports</AdminTitle>
            </AdminHeader>

            <ActionBar>
                <ActionBarLeft>
                    <SelectDropDown
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { label: 'Pending', value: 'pending' },
                            { label: 'Resolved', value: 'reviewed' },
                            { label: 'Dismissed', value: 'dismissed' },
                            { label: 'All', value: 'all' }
                        ]}
                        styleContainer={{ width: '150px', margin: 0 }}
                    />
                </ActionBarLeft>
            </ActionBar>

            {loading ? (
                <LoadingContainer>
                    <LoadingSpinner />
                    <LoadingText>Loading reports...</LoadingText>
                </LoadingContainer>
            ) : reports.length === 0 ? (
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
                    <EmptyStateTitle>
                        {statusFilter === 'pending'
                            ? 'All clear'
                            : 'No reports found'}
                    </EmptyStateTitle>
                    <EmptyStateText>
                        {statusFilter === 'pending'
                            ? 'No reports pending review'
                            : 'No reports match this filter'}
                    </EmptyStateText>
                </EmptyState>
            ) : (
                <>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader $width="100px">
                                        Reporter
                                    </TableHeader>
                                    <TableHeader>Comment</TableHeader>
                                    <TableHeader $width="150px">
                                        Reason
                                    </TableHeader>
                                    <TableHeader $width="90px" $align="center">
                                        Status
                                    </TableHeader>
                                    <TableHeader $width="150px">
                                        Date
                                    </TableHeader>
                                    <TableHeader $width="150px" $align="center">
                                        Actions
                                    </TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>
                                            {report.reporter?.username || (
                                                <Badge $variant="secondary">
                                                    Anon
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell
                                            $truncate
                                            title={report.comment?.content}
                                        >
                                            {report.comment ? (
                                                <div>
                                                    <span>
                                                        {truncateText(
                                                            report.comment
                                                                .content,
                                                            40
                                                        )}
                                                    </span>
                                                    <div
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            opacity: 0.6
                                                        }}
                                                    >
                                                        by{' '}
                                                        {report.comment.user
                                                            ?.username ||
                                                            'deleted'}
                                                        {report.isHighPriority && (
                                                            <Badge
                                                                $variant="danger"
                                                                style={{
                                                                    marginLeft:
                                                                        '0.5rem'
                                                                }}
                                                            >
                                                                {
                                                                    report.reportCount
                                                                }
                                                                x
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <Badge $variant="secondary">
                                                    Deleted
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell
                                            $truncate
                                            title={
                                                report.details || report.reason
                                            }
                                        >
                                            <strong>{report.reason}</strong>
                                        </TableCell>
                                        <TableCell $align="center">
                                            <Badge
                                                $variant={getStatusBadgeVariant(
                                                    report.status
                                                )}
                                            >
                                                {report.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(report.createdAt)}
                                        </TableCell>
                                        <TableCell $align="center">
                                            {report.status === 'pending' ? (
                                                <ButtonGroup>
                                                    <Button
                                                        variant="success"
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedReport(
                                                                report
                                                            );
                                                            setReviewAction(
                                                                'reviewed'
                                                            );
                                                            setShowReviewModal(
                                                                true
                                                            );
                                                        }}
                                                        disabled={
                                                            processing ===
                                                            report.id
                                                        }
                                                    >
                                                        Resolve
                                                    </Button>
                                                    <Button
                                                        variant="secondary"
                                                        size="small"
                                                        onClick={() => {
                                                            setSelectedReport(
                                                                report
                                                            );
                                                            setReviewAction(
                                                                'dismissed'
                                                            );
                                                            setShowReviewModal(
                                                                true
                                                            );
                                                        }}
                                                        disabled={
                                                            processing ===
                                                            report.id
                                                        }
                                                    >
                                                        Dismiss
                                                    </Button>
                                                </ButtonGroup>
                                            ) : (
                                                <span
                                                    style={{
                                                        opacity: 0.5,
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    {report.reviewedAt
                                                        ? new Date(
                                                              report.reviewedAt
                                                          ).toLocaleDateString()
                                                        : '-'}
                                                </span>
                                            )}
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
                                onClick={() =>
                                    fetchReports(page - 1, statusFilter)
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
                                        fetchReports(p, statusFilter)
                                    }
                                >
                                    {p}
                                </PageButton>
                            ))}
                            <PageButton
                                disabled={page === totalPages}
                                onClick={() =>
                                    fetchReports(page + 1, statusFilter)
                                }
                            >
                                Next
                            </PageButton>
                        </Pagination>
                    )}
                </>
            )}

            {/* Review Modal */}
            <Modal
                isOpen={showReviewModal && selectedReport !== null}
                onClose={() => setShowReviewModal(false)}
                title={`${reviewAction === 'reviewed' ? 'Resolve' : 'Dismiss'} Report`}
            >
                {selectedReport && (
                    <>
                        <div style={{ marginBottom: '1rem' }}>
                            <strong>Report Details:</strong>
                            <div
                                style={{
                                    marginTop: '0.5rem',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.05)',
                                    borderRadius: '4px'
                                }}
                            >
                                <div>
                                    <Badge $variant="primary">comment</Badge>{' '}
                                    reported for:{' '}
                                    <strong>{selectedReport.reason}</strong>
                                </div>
                                {selectedReport.comment && (
                                    <div
                                        style={{
                                            marginTop: '0.5rem',
                                            fontStyle: 'italic'
                                        }}
                                    >
                                        &ldquo;
                                        {truncateText(
                                            selectedReport.comment.content,
                                            100
                                        )}
                                        &rdquo;
                                    </div>
                                )}
                                {selectedReport.details && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        Details: {selectedReport.details}
                                    </div>
                                )}
                            </div>
                        </div>
                        <FormGroup>
                            <Label>Notes (optional)</Label>
                            <Input
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Add any notes about this decision..."
                            />
                        </FormGroup>
                        <div
                            style={{
                                display: 'flex',
                                gap: '0.5rem',
                                justifyContent: 'flex-end',
                                marginTop: '1rem'
                            }}
                        >
                            <Button
                                variant="secondary"
                                onClick={() => setShowReviewModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={
                                    reviewAction === 'reviewed'
                                        ? 'success'
                                        : 'secondary'
                                }
                                onClick={handleReview}
                                disabled={processing === selectedReport.id}
                            >
                                {processing === selectedReport.id
                                    ? 'Processing...'
                                    : reviewAction === 'reviewed'
                                      ? 'Mark as Resolved'
                                      : 'Dismiss Report'}
                            </Button>
                        </div>
                    </>
                )}
            </Modal>
        </>
    );
}
