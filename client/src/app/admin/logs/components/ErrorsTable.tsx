'use client';

import React from 'react';
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableHeader,
    TableCell,
    Badge
} from '../../components/AdminStyles';
import { LogMessage, ViewButton } from './LogStyles';
import type { ErrorSummary } from '@/types/api';

interface ErrorsTableProps {
    errors: ErrorSummary[];
    onViewError: (error: ErrorSummary) => void;
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
}

export function ErrorsTable({ errors, onViewError }: ErrorsTableProps) {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader>Message</TableHeader>
                        <TableHeader $width="100px">Count</TableHeader>
                        <TableHeader $width="140px">First Seen</TableHeader>
                        <TableHeader $width="140px">Last Seen</TableHeader>
                        <TableHeader $width="100px">Status</TableHeader>
                        <TableHeader $width="100px">Actions</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {errors.map((err) => (
                        <TableRow key={err.id}>
                            <TableCell>
                                <LogMessage>
                                    {err.message.length > 80
                                        ? err.message.substring(0, 80) + '...'
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
                            <TableCell>{formatDate(err.firstSeenAt)}</TableCell>
                            <TableCell>{formatDate(err.lastSeenAt)}</TableCell>
                            <TableCell>
                                <Badge
                                    $variant={
                                        err.resolved ? 'success' : 'warning'
                                    }
                                >
                                    {err.resolved ? 'Resolved' : 'Open'}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <ViewButton onClick={() => onViewError(err)}>
                                    View
                                </ViewButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
