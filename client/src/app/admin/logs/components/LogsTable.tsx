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
    Badge,
    Checkbox
} from '../../components/AdminStyles';
import { ClearedRow, LogMessage, ViewButton } from './LogStyles';
import type { LogEntry } from '@/types/api';

interface LogsTableProps {
    logs: LogEntry[];
    selectedIds: Set<string>;
    onToggleSelection: (id: string) => void;
    onToggleSelectAll: () => void;
    onViewLog: (log: LogEntry) => void;
}

function getLevelBadgeVariant(
    level: string
): 'primary' | 'success' | 'warning' | 'danger' | 'secondary' {
    switch (level) {
        case 'fatal':
        case 'error':
            return 'danger';
        case 'warn':
            return 'warning';
        case 'info':
            return 'primary';
        case 'debug':
        default:
            return 'secondary';
    }
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
}

export function LogsTable({
    logs,
    selectedIds,
    onToggleSelection,
    onToggleSelectAll,
    onViewLog
}: LogsTableProps) {
    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeader $width="40px">
                            <Checkbox
                                checked={
                                    selectedIds.size === logs.length &&
                                    logs.length > 0
                                }
                                onChange={onToggleSelectAll}
                            />
                        </TableHeader>
                        <TableHeader $width="80px">Level</TableHeader>
                        <TableHeader>Message</TableHeader>
                        <TableHeader $width="120px">Path</TableHeader>
                        <TableHeader $width="80px">Status</TableHeader>
                        <TableHeader $width="150px">Date</TableHeader>
                        <TableHeader $width="80px">Actions</TableHeader>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {logs.map((log) => (
                        <ClearedRow key={log.id} $isCleared={!!log.clearedAt}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedIds.has(log.id)}
                                    onChange={() => onToggleSelection(log.id)}
                                />
                            </TableCell>
                            <TableCell>
                                <Badge
                                    $variant={getLevelBadgeVariant(log.level)}
                                >
                                    {log.level.toUpperCase()}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <LogMessage>
                                    {log.message.length > 100
                                        ? log.message.substring(0, 100) + '...'
                                        : log.message}
                                </LogMessage>
                            </TableCell>
                            <TableCell $truncate>
                                {log.path ? (
                                    <span title={`${log.method} ${log.path}`}>
                                        {log.method} {log.path}
                                    </span>
                                ) : (
                                    <span style={{ opacity: 0.3 }}>-</span>
                                )}
                            </TableCell>
                            <TableCell>
                                {log.statusCode ? (
                                    <Badge
                                        $variant={
                                            log.statusCode >= 500
                                                ? 'danger'
                                                : log.statusCode >= 400
                                                  ? 'warning'
                                                  : 'success'
                                        }
                                    >
                                        {log.statusCode}
                                    </Badge>
                                ) : (
                                    <span style={{ opacity: 0.3 }}>-</span>
                                )}
                            </TableCell>
                            <TableCell>{formatDate(log.createdAt)}</TableCell>
                            <TableCell>
                                <ViewButton onClick={() => onViewLog(log)}>
                                    View
                                </ViewButton>
                            </TableCell>
                        </ClearedRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
