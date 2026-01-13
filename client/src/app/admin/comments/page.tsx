'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
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
    ButtonGroup,
    IconButton,
    ActionBar,
    ActionBarLeft,
    ActionBarRight,
    Checkbox,
    LoadingContainer,
    LoadingSpinner,
    LoadingText,
    EmptyState,
    Alert,
    Pagination,
    PageButton,
    AccessDenied
} from '../components/AdminStyles';

interface PendingComment {
    id: string;
    content: string;
    postSlug: string;
    createdAt: string;
    user: {
        id: string;
        username: string;
        displayName: string | null;
    } | null;
}

interface PendingCommentsResponse {
    comments: PendingComment[];
    page: number;
    limit: number;
}

export default function AdminCommentsPage() {
    const { isAdmin, hasPermission } = useAuth();
    const [comments, setComments] = useState<PendingComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [processing, setProcessing] = useState(false);

    const canModerate = isAdmin() || hasPermission('comment.approve');

    const fetchComments = useCallback(async (pageNum: number = 1) => {
        setLoading(true);
        setError(null);
        try {
            const res = await api.get<PendingCommentsResponse>(
                `/admin/comments/pending?page=${pageNum}&limit=20`
            );
            setComments(res.data.comments);
            setPage(res.data.page);
            // Server doesn't return total, so calculate hasMore based on returned count
            const hasMore = res.data.comments.length === res.data.limit;
            setTotalPages(hasMore ? res.data.page + 1 : res.data.page);
        } catch (err: any) {
            console.error('Error fetching pending comments:', err);
            setError(
                err.response?.data?.error || 'Failed to load pending comments'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (canModerate) {
            fetchComments();
        }
    }, [fetchComments, canModerate]);

    const handleApprove = async (id: string) => {
        setProcessing(true);
        try {
            await api.post(`/admin/comments/${id}/approve`);
            toast.success('Comment approved');
            setComments((prev) => prev.filter((c) => c.id !== id));
            setSelectedIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to approve');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async (id: string) => {
        setProcessing(true);
        try {
            await api.post(`/admin/comments/${id}/reject`);
            toast.success('Comment rejected');
            setComments((prev) => prev.filter((c) => c.id !== id));
            setSelectedIds((prev) => {
                const next = new Set(prev);
                next.delete(id);
                return next;
            });
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to reject');
        } finally {
            setProcessing(false);
        }
    };

    const handleBulkApprove = async () => {
        if (selectedIds.size === 0) return;
        setProcessing(true);
        try {
            await api.post('/admin/comments/bulk-approve', {
                ids: Array.from(selectedIds)
            });
            toast.success(`${selectedIds.size} comments approved`);
            setComments((prev) => prev.filter((c) => !selectedIds.has(c.id)));
            setSelectedIds(new Set());
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to bulk approve');
        } finally {
            setProcessing(false);
        }
    };

    const handleBulkReject = async () => {
        if (selectedIds.size === 0) return;
        setProcessing(true);
        try {
            await api.post('/admin/comments/bulk-reject', {
                ids: Array.from(selectedIds)
            });
            toast.success(`${selectedIds.size} comments rejected`);
            setComments((prev) => prev.filter((c) => !selectedIds.has(c.id)));
            setSelectedIds(new Set());
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to bulk reject');
        } finally {
            setProcessing(false);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selectedIds.size === comments.length) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(comments.map((c) => c.id)));
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const truncateContent = (content: string, maxLength: number = 100) => {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    };

    if (!canModerate) {
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
                <p>You do not have permission to moderate comments.</p>
            </AccessDenied>
        );
    }

    if (loading) {
        return (
            <LoadingContainer>
                <LoadingSpinner />
                <LoadingText>Loading pending comments...</LoadingText>
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
                    onClick={() => fetchComments()}
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
                <AdminTitle>Pending Comments</AdminTitle>
                <AdminSubtitle>
                    Review and moderate user-submitted comments
                </AdminSubtitle>
            </AdminHeader>

            {comments.length === 0 ? (
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
                    <h3>No pending comments</h3>
                    <p>All comments have been reviewed.</p>
                </EmptyState>
            ) : (
                <>
                    {selectedIds.size > 0 && (
                        <ActionBar>
                            <ActionBarLeft>
                                <span style={{ fontWeight: 500 }}>
                                    {selectedIds.size} item
                                    {selectedIds.size !== 1 ? 's' : ''} selected
                                </span>
                            </ActionBarLeft>
                            <ActionBarRight>
                                <ButtonGroup>
                                    <Button
                                        variant="success"
                                        size="small"
                                        onClick={handleBulkApprove}
                                        disabled={processing}
                                    >
                                        Approve Selected
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="small"
                                        onClick={handleBulkReject}
                                        disabled={processing}
                                    >
                                        Reject Selected
                                    </Button>
                                </ButtonGroup>
                            </ActionBarRight>
                        </ActionBar>
                    )}

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableHeader $width="40px" $align="center">
                                        <Checkbox
                                            checked={
                                                selectedIds.size ===
                                                    comments.length &&
                                                comments.length > 0
                                            }
                                            onChange={toggleSelectAll}
                                        />
                                    </TableHeader>
                                    <TableHeader $width="120px">
                                        Author
                                    </TableHeader>
                                    <TableHeader>Content</TableHeader>
                                    <TableHeader $width="180px">
                                        Post
                                    </TableHeader>
                                    <TableHeader $width="160px">
                                        Date
                                    </TableHeader>
                                    <TableHeader $width="100px" $align="center">
                                        Actions
                                    </TableHeader>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {comments.map((comment) => (
                                    <TableRow key={comment.id}>
                                        <TableCell $align="center">
                                            <Checkbox
                                                checked={selectedIds.has(
                                                    comment.id
                                                )}
                                                onChange={() =>
                                                    toggleSelect(comment.id)
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {comment.user ? (
                                                <strong>
                                                    {comment.user.displayName ||
                                                        comment.user.username}
                                                </strong>
                                            ) : (
                                                <Badge $variant="secondary">
                                                    Deleted
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell
                                            $truncate
                                            title={comment.content}
                                        >
                                            {truncateContent(
                                                comment.content,
                                                80
                                            )}
                                        </TableCell>
                                        <TableCell $truncate>
                                            <a
                                                href={`/${comment.postSlug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                style={{ color: 'inherit' }}
                                            >
                                                {comment.postSlug}
                                            </a>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(comment.createdAt)}
                                        </TableCell>
                                        <TableCell $align="center">
                                            <ButtonGroup>
                                                <IconButton
                                                    $variant="success"
                                                    title="Approve"
                                                    onClick={() =>
                                                        handleApprove(
                                                            comment.id
                                                        )
                                                    }
                                                    disabled={processing}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4.5 12.75l6 6 9-13.5"
                                                        />
                                                    </svg>
                                                </IconButton>
                                                <IconButton
                                                    $variant="danger"
                                                    title="Reject"
                                                    onClick={() =>
                                                        handleReject(comment.id)
                                                    }
                                                    disabled={processing}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </IconButton>
                                            </ButtonGroup>
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
                                onClick={() => fetchComments(page - 1)}
                            >
                                Previous
                            </PageButton>
                            {Array.from(
                                { length: totalPages },
                                (_, i) => i + 1
                            ).map((p) => (
                                <PageButton
                                    key={p}
                                    $active={p === page}
                                    onClick={() => fetchComments(p)}
                                >
                                    {p}
                                </PageButton>
                            ))}
                            <PageButton
                                disabled={page === totalPages}
                                onClick={() => fetchComments(page + 1)}
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
