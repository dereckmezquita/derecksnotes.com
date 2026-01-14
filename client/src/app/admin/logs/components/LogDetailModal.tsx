'use client';

import React from 'react';
import {
    ModalBackdrop,
    ModalHeader,
    ModalTitle,
    ModalBody,
    CloseButton,
    Badge
} from '../../components/AdminStyles';
import {
    WideModalContent,
    DetailRow,
    DetailLabel,
    DetailValue,
    StackTrace
} from './LogStyles';
import type { LogEntry } from '@/types/api';

interface LogDetailModalProps {
    log: LogEntry;
    onClose: () => void;
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

export function LogDetailModal({ log, onClose }: LogDetailModalProps) {
    return (
        <ModalBackdrop onClick={onClose}>
            <WideModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Log Details</ModalTitle>
                    <CloseButton onClick={onClose}>
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
                    <DetailRow>
                        <DetailLabel>Level:</DetailLabel>
                        <DetailValue>
                            <Badge $variant={getLevelBadgeVariant(log.level)}>
                                {log.level.toUpperCase()}
                            </Badge>
                        </DetailValue>
                    </DetailRow>

                    <DetailRow>
                        <DetailLabel>Message:</DetailLabel>
                        <DetailValue>{log.message}</DetailValue>
                    </DetailRow>

                    {log.path && (
                        <DetailRow>
                            <DetailLabel>Request:</DetailLabel>
                            <DetailValue>
                                {log.method} {log.path}
                            </DetailValue>
                        </DetailRow>
                    )}

                    {log.statusCode && (
                        <DetailRow>
                            <DetailLabel>Status:</DetailLabel>
                            <DetailValue>{log.statusCode}</DetailValue>
                        </DetailRow>
                    )}

                    {log.duration && (
                        <DetailRow>
                            <DetailLabel>Duration:</DetailLabel>
                            <DetailValue>{log.duration}ms</DetailValue>
                        </DetailRow>
                    )}

                    {log.requestId && (
                        <DetailRow>
                            <DetailLabel>Request ID:</DetailLabel>
                            <DetailValue>{log.requestId}</DetailValue>
                        </DetailRow>
                    )}

                    {log.userId && (
                        <DetailRow>
                            <DetailLabel>User ID:</DetailLabel>
                            <DetailValue>{log.userId}</DetailValue>
                        </DetailRow>
                    )}

                    {log.ipAddress && (
                        <DetailRow>
                            <DetailLabel>IP Address:</DetailLabel>
                            <DetailValue>{log.ipAddress}</DetailValue>
                        </DetailRow>
                    )}

                    <DetailRow>
                        <DetailLabel>Timestamp:</DetailLabel>
                        <DetailValue>{formatDate(log.createdAt)}</DetailValue>
                    </DetailRow>

                    {log.stack && (
                        <div style={{ marginTop: '1rem' }}>
                            <DetailLabel>Stack Trace:</DetailLabel>
                            <StackTrace>{log.stack}</StackTrace>
                        </div>
                    )}

                    {log.context && Object.keys(log.context).length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            <DetailLabel>Context:</DetailLabel>
                            <StackTrace>
                                {JSON.stringify(log.context, null, 2)}
                            </StackTrace>
                        </div>
                    )}
                </ModalBody>
            </WideModalContent>
        </ModalBackdrop>
    );
}
