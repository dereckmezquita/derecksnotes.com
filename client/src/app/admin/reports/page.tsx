'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
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
    ButtonGroup,
    Select,
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
    AccessDenied,
    ModalBackdrop,
    ModalContent,
    ModalHeader,
    ModalTitle,
    ModalBody,
    ModalFooter,
    CloseButton,
    FormGroup,
    Label,
    Input
} from '../components/AdminStyles';

interface Report {
    id: string;
    reporterUsername: string | null;
    targetType: 'comment' | 'user';
    targetId: string;
    reason: string;
    details: string | null;
    status: 'pending' | 'resolved' | 'dismissed';
    reviewedBy: string | null;
    reviewedAt: string | null;
    createdAt: string;
}

interface ReportsResponse {
    reports: Report[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
}

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
    const [reviewAction, setReviewAction] = useState<'resolved' | 'dismissed'>(
        'resolved'
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
                setPage(res.data.pagination.page);
                setTotalPages(
                    Math.ceil(
                        res.data.pagination.total / res.data.pagination.limit
                    )
                );
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
                status: reviewAction,
                notes: reviewNotes || undefined
            });
            toast.success(
                `Report ${reviewAction === 'resolved' ? 'resolved' : 'dismissed'}`
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
            case 'resolved':
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
                <AdminSubtitle>
                    Review user-submitted reports and take action
                </AdminSubtitle>
            </AdminHeader>

            <Card>
                <ActionBar>
                    <ActionBarLeft>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                            <option value="dismissed">Dismissed</option>
                            <option value="all">All</option>
                        </Select>
                    </ActionBarLeft>
                </ActionBar>

                {loading ? (
                    <LoadingContainer>
                        <LoadingSpinner />
                        <LoadingText>Loading reports...</LoadingText>
                    </LoadingContainer>
                ) : reports.length === 0 ? (
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
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3>No reports found</h3>
                        <p>
                            {statusFilter === 'pending'
                                ? 'All reports have been reviewed.'
                                : 'No reports match the selected filter.'}
                        </p>
                    </EmptyState>
                ) : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader>Reporter</TableHeader>
                                    <TableHeader>Type</TableHeader>
                                    <TableHeader>Reason</TableHeader>
                                    <TableHeader>Status</TableHeader>
                                    <TableHeader>Date</TableHeader>
                                    <TableHeader>Actions</TableHeader>
                                </TableRow>
                            </TableHead>
                            <tbody>
                                {reports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>
                                            {report.reporterUsername || (
                                                <Badge variant="secondary">
                                                    Anonymous
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    report.targetType ===
                                                    'comment'
                                                        ? 'primary'
                                                        : 'warning'
                                                }
                                            >
                                                {report.targetType}
                                            </Badge>
                                        </TableCell>
                                        <TableCell
                                            title={
                                                report.details || report.reason
                                            }
                                        >
                                            <div>
                                                <strong>{report.reason}</strong>
                                                {report.details && (
                                                    <div
                                                        style={{
                                                            fontSize:
                                                                '0.875rem',
                                                            opacity: 0.7,
                                                            marginTop: '0.25rem'
                                                        }}
                                                    >
                                                        {truncateText(
                                                            report.details
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getStatusBadgeVariant(
                                                    report.status
                                                )}
                                            >
                                                {report.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(report.createdAt)}
                                        </TableCell>
                                        <TableCell>
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
                                                                'resolved'
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
                                                <span style={{ opacity: 0.5 }}>
                                                    Reviewed
                                                    {report.reviewedAt &&
                                                        ` on ${new Date(report.reviewedAt).toLocaleDateString()}`}
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </Table>

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
                                        active={p === page}
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
            </Card>

            {/* Review Modal */}
            {showReviewModal && selectedReport && (
                <ModalBackdrop onClick={() => setShowReviewModal(false)}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <ModalHeader>
                            <ModalTitle>
                                {reviewAction === 'resolved'
                                    ? 'Resolve'
                                    : 'Dismiss'}{' '}
                                Report
                            </ModalTitle>
                            <CloseButton
                                onClick={() => setShowReviewModal(false)}
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
                            </CloseButton>
                        </ModalHeader>
                        <ModalBody>
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
                                        <Badge
                                            variant={
                                                selectedReport.targetType ===
                                                'comment'
                                                    ? 'primary'
                                                    : 'warning'
                                            }
                                        >
                                            {selectedReport.targetType}
                                        </Badge>{' '}
                                        reported for:{' '}
                                        <strong>{selectedReport.reason}</strong>
                                    </div>
                                    {selectedReport.details && (
                                        <div style={{ marginTop: '0.5rem' }}>
                                            {selectedReport.details}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <FormGroup>
                                <Label>Notes (optional)</Label>
                                <Input
                                    value={reviewNotes}
                                    onChange={(e) =>
                                        setReviewNotes(e.target.value)
                                    }
                                    placeholder="Add any notes about this decision..."
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="secondary"
                                onClick={() => setShowReviewModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant={
                                    reviewAction === 'resolved'
                                        ? 'success'
                                        : 'secondary'
                                }
                                onClick={handleReview}
                                disabled={processing === selectedReport.id}
                            >
                                {processing === selectedReport.id
                                    ? 'Processing...'
                                    : reviewAction === 'resolved'
                                      ? 'Mark as Resolved'
                                      : 'Dismiss Report'}
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </>
    );
}
