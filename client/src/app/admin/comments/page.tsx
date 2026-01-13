'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
    createColumnHelper,
    SortingState,
    ColumnFiltersState,
    RowSelectionState
} from '@tanstack/react-table';
import { useAuth } from '@context/AuthContext';
import { api } from '@utils/api/api';
import { toast } from 'sonner';
import styled from 'styled-components';
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
    AccessDenied,
    SearchInput,
    Select
} from '../components/AdminStyles';

// ============================================================================
// TYPES
// ============================================================================

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

// ============================================================================
// ADDITIONAL STYLED COMPONENTS FOR TABLE
// ============================================================================

const TableToolbar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${(props) => props.theme.container.spacing.medium};
    flex-wrap: wrap;
    gap: ${(props) => props.theme.container.spacing.small};
`;

const FilterGroup = styled.div`
    display: flex;
    align-items: center;
    gap: ${(props) => props.theme.container.spacing.small};
`;

const SortableHeader = styled.div<{ $canSort?: boolean }>`
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: ${(props) => (props.$canSort ? 'pointer' : 'default')};
    user-select: none;

    &:hover {
        color: ${(props) =>
            props.$canSort ? props.theme.theme_colours[5]() : 'inherit'};
    }
`;

const SortIcon = styled.span<{ $direction?: 'asc' | 'desc' | false }>`
    display: inline-flex;
    opacity: ${(props) => (props.$direction ? 1 : 0.3)};
    transition: opacity 0.15s ease;
`;

const ContentPreview = styled.div`
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

const PostLink = styled.a`
    color: ${(props) => props.theme.theme_colours[5]()};
    text-decoration: none;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;

    &:hover {
        text-decoration: underline;
    }
`;

const TableInfo = styled.div`
    font-size: ${(props) => props.theme.text.size.small};
    color: ${(props) => props.theme.text.colour.light_grey()};
`;

const PageSizeSelect = styled(Select)`
    padding: 4px 8px;
    font-size: ${(props) => props.theme.text.size.small};
`;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
};

// ============================================================================
// COLUMN HELPER
// ============================================================================

const columnHelper = createColumnHelper<PendingComment>();

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AdminCommentsPage() {
    const { isAdmin, hasPermission } = useAuth();
    const [comments, setComments] = useState<PendingComment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    // TanStack Table state
    const [sorting, setSorting] = useState<SortingState>([
        { id: 'createdAt', desc: true }
    ]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 20
    });

    const canModerate = isAdmin() || hasPermission('comment.approve');

    // ========================================================================
    // DATA FETCHING
    // ========================================================================

    const fetchComments = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Fetch more comments to allow client-side filtering
            const res = await api.get<PendingCommentsResponse>(
                `/admin/comments/pending?page=1&limit=100`
            );
            setComments(res.data.comments);
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

    // ========================================================================
    // ACTIONS
    // ========================================================================

    const handleApprove = async (id: string) => {
        setProcessing(true);
        try {
            await api.post(`/admin/comments/${id}/approve`);
            toast.success('Comment approved');
            setComments((prev) => prev.filter((c) => c.id !== id));
            setRowSelection((prev) => {
                const next = { ...prev };
                delete next[id];
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
            setRowSelection((prev) => {
                const next = { ...prev };
                delete next[id];
                return next;
            });
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to reject');
        } finally {
            setProcessing(false);
        }
    };

    const handleBulkApprove = async () => {
        const selectedIds = Object.keys(rowSelection);
        if (selectedIds.length === 0) return;

        setProcessing(true);
        try {
            await api.post('/admin/comments/bulk-approve', {
                ids: selectedIds
            });
            toast.success(`${selectedIds.length} comments approved`);
            setComments((prev) =>
                prev.filter((c) => !selectedIds.includes(c.id))
            );
            setRowSelection({});
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to bulk approve');
        } finally {
            setProcessing(false);
        }
    };

    const handleBulkReject = async () => {
        const selectedIds = Object.keys(rowSelection);
        if (selectedIds.length === 0) return;

        setProcessing(true);
        try {
            await api.post('/admin/comments/bulk-reject', { ids: selectedIds });
            toast.success(`${selectedIds.length} comments rejected`);
            setComments((prev) =>
                prev.filter((c) => !selectedIds.includes(c.id))
            );
            setRowSelection({});
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to bulk reject');
        } finally {
            setProcessing(false);
        }
    };

    // ========================================================================
    // TABLE COLUMNS
    // ========================================================================

    const columns = useMemo(
        () => [
            columnHelper.display({
                id: 'select',
                header: ({ table }) => (
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onChange={table.getToggleAllPageRowsSelectedHandler()}
                    />
                ),
                cell: ({ row }) => (
                    <Checkbox
                        checked={row.getIsSelected()}
                        onChange={row.getToggleSelectedHandler()}
                    />
                ),
                size: 40
            }),
            columnHelper.accessor(
                (row) =>
                    row.user?.displayName || row.user?.username || 'Deleted',
                {
                    id: 'author',
                    header: 'Author',
                    cell: ({ row }) => {
                        const user = row.original.user;
                        if (!user) {
                            return <Badge $variant="secondary">Deleted</Badge>;
                        }
                        return (
                            <strong>{user.displayName || user.username}</strong>
                        );
                    },
                    size: 120
                }
            ),
            columnHelper.accessor('content', {
                header: 'Content',
                cell: ({ getValue }) => (
                    <ContentPreview title={getValue()}>
                        {getValue()}
                    </ContentPreview>
                ),
                size: 300
            }),
            columnHelper.accessor('postSlug', {
                header: 'Post',
                cell: ({ getValue }) => (
                    <PostLink
                        href={`/${getValue()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={getValue()}
                    >
                        {getValue()}
                    </PostLink>
                ),
                size: 150
            }),
            columnHelper.accessor('createdAt', {
                header: 'Date',
                cell: ({ getValue }) => formatRelativeTime(getValue()),
                sortingFn: 'datetime',
                size: 100
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <ButtonGroup>
                        <IconButton
                            $variant="success"
                            title="Approve"
                            onClick={() => handleApprove(row.original.id)}
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
                            onClick={() => handleReject(row.original.id)}
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
                ),
                size: 100
            })
        ],
        [processing]
    );

    // ========================================================================
    // TABLE INSTANCE
    // ========================================================================

    const table = useReactTable({
        data: comments,
        columns,
        state: {
            sorting,
            columnFilters,
            globalFilter,
            rowSelection,
            pagination
        },
        enableRowSelection: true,
        getRowId: (row) => row.id,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel()
    });

    const selectedCount = Object.keys(rowSelection).length;

    // ========================================================================
    // RENDER
    // ========================================================================

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
                    {/* Toolbar with search and filters */}
                    <TableToolbar>
                        <FilterGroup>
                            <SearchInput
                                placeholder="Search comments..."
                                value={globalFilter ?? ''}
                                onChange={(e) =>
                                    setGlobalFilter(e.target.value)
                                }
                            />
                        </FilterGroup>
                        <FilterGroup>
                            <TableInfo>
                                {table.getFilteredRowModel().rows.length} of{' '}
                                {comments.length} comments
                            </TableInfo>
                            <PageSizeSelect
                                value={pagination.pageSize}
                                onChange={(e) =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageSize: Number(e.target.value),
                                        pageIndex: 0
                                    }))
                                }
                            >
                                <option value={10}>10 per page</option>
                                <option value={20}>20 per page</option>
                                <option value={50}>50 per page</option>
                                <option value={100}>100 per page</option>
                            </PageSizeSelect>
                        </FilterGroup>
                    </TableToolbar>

                    {/* Bulk action bar */}
                    {selectedCount > 0 && (
                        <ActionBar>
                            <ActionBarLeft>
                                <span style={{ fontWeight: 500 }}>
                                    {selectedCount} item
                                    {selectedCount !== 1 ? 's' : ''} selected
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

                    {/* Table */}
                    <TableContainer>
                        <Table>
                            <TableHead>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <TableHeader
                                                key={header.id}
                                                $width={
                                                    header.getSize() !== 150
                                                        ? `${header.getSize()}px`
                                                        : undefined
                                                }
                                                $align={
                                                    header.id === 'select' ||
                                                    header.id === 'actions'
                                                        ? 'center'
                                                        : 'left'
                                                }
                                            >
                                                {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                                    <SortableHeader
                                                        $canSort={true}
                                                        onClick={header.column.getToggleSortingHandler()}
                                                    >
                                                        {flexRender(
                                                            header.column
                                                                .columnDef
                                                                .header,
                                                            header.getContext()
                                                        )}
                                                        <SortIcon
                                                            $direction={header.column.getIsSorted()}
                                                        >
                                                            {header.column.getIsSorted() ===
                                                            'asc' ? (
                                                                <svg
                                                                    width="12"
                                                                    height="12"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                >
                                                                    <path d="M18 15l-6-6-6 6" />
                                                                </svg>
                                                            ) : header.column.getIsSorted() ===
                                                              'desc' ? (
                                                                <svg
                                                                    width="12"
                                                                    height="12"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                >
                                                                    <path d="M6 9l6 6 6-6" />
                                                                </svg>
                                                            ) : (
                                                                <svg
                                                                    width="12"
                                                                    height="12"
                                                                    viewBox="0 0 24 24"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                >
                                                                    <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />
                                                                </svg>
                                                            )}
                                                        </SortIcon>
                                                    </SortableHeader>
                                                ) : (
                                                    flexRender(
                                                        header.column.columnDef
                                                            .header,
                                                        header.getContext()
                                                    )
                                                )}
                                            </TableHeader>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHead>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                $align={
                                                    cell.column.id ===
                                                        'select' ||
                                                    cell.column.id === 'actions'
                                                        ? 'center'
                                                        : 'left'
                                                }
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Pagination */}
                    {table.getPageCount() > 1 && (
                        <Pagination>
                            <PageButton
                                disabled={!table.getCanPreviousPage()}
                                onClick={() => table.previousPage()}
                            >
                                Previous
                            </PageButton>
                            {Array.from(
                                { length: table.getPageCount() },
                                (_, i) => i
                            ).map((pageIndex) => (
                                <PageButton
                                    key={pageIndex}
                                    $active={pageIndex === pagination.pageIndex}
                                    onClick={() =>
                                        table.setPageIndex(pageIndex)
                                    }
                                >
                                    {pageIndex + 1}
                                </PageButton>
                            ))}
                            <PageButton
                                disabled={!table.getCanNextPage()}
                                onClick={() => table.nextPage()}
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
