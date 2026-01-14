'use client';

import React, { useState } from 'react';
import {
    ModalBackdrop,
    ModalHeader,
    ModalTitle,
    ModalBody,
    CloseButton,
    Badge,
    Button,
    FormGroup,
    Label
} from '../../components/AdminStyles';
import {
    WideModalContent,
    DetailRow,
    DetailLabel,
    DetailValue,
    StackTrace,
    NotesInput
} from './LogStyles';
import type { ErrorSummary } from '@/types/api';

interface ErrorDetailModalProps {
    error: ErrorSummary;
    onClose: () => void;
    onResolve: (errorId: string, notes: string) => Promise<void>;
    onUnresolve: (errorId: string) => Promise<void>;
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString();
}

export function ErrorDetailModal({
    error,
    onClose,
    onResolve,
    onUnresolve
}: ErrorDetailModalProps) {
    const [resolveNotes, setResolveNotes] = useState('');

    const handleResolve = async () => {
        await onResolve(error.id, resolveNotes);
        setResolveNotes('');
    };

    return (
        <ModalBackdrop onClick={onClose}>
            <WideModalContent onClick={(e) => e.stopPropagation()}>
                <ModalHeader>
                    <ModalTitle>Error Details</ModalTitle>
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
                        <DetailLabel>Status:</DetailLabel>
                        <DetailValue>
                            <Badge
                                $variant={
                                    error.resolved ? 'success' : 'warning'
                                }
                            >
                                {error.resolved ? 'Resolved' : 'Open'}
                            </Badge>
                        </DetailValue>
                    </DetailRow>

                    <DetailRow>
                        <DetailLabel>Message:</DetailLabel>
                        <DetailValue>{error.message}</DetailValue>
                    </DetailRow>

                    {error.source && (
                        <DetailRow>
                            <DetailLabel>Source:</DetailLabel>
                            <DetailValue>{error.source}</DetailValue>
                        </DetailRow>
                    )}

                    <DetailRow>
                        <DetailLabel>Occurrences:</DetailLabel>
                        <DetailValue>{error.count}</DetailValue>
                    </DetailRow>

                    <DetailRow>
                        <DetailLabel>First Seen:</DetailLabel>
                        <DetailValue>
                            {formatDate(error.firstSeenAt)}
                        </DetailValue>
                    </DetailRow>

                    <DetailRow>
                        <DetailLabel>Last Seen:</DetailLabel>
                        <DetailValue>
                            {formatDate(error.lastSeenAt)}
                        </DetailValue>
                    </DetailRow>

                    {error.resolvedAt && (
                        <DetailRow>
                            <DetailLabel>Resolved At:</DetailLabel>
                            <DetailValue>
                                {formatDate(error.resolvedAt)}
                            </DetailValue>
                        </DetailRow>
                    )}

                    {error.stack && (
                        <div style={{ marginTop: '1rem' }}>
                            <DetailLabel>Stack Trace:</DetailLabel>
                            <StackTrace>{error.stack}</StackTrace>
                        </div>
                    )}

                    {error.notes && (
                        <div style={{ marginTop: '1rem' }}>
                            <DetailLabel>Notes:</DetailLabel>
                            <p style={{ marginTop: '0.5rem' }}>{error.notes}</p>
                        </div>
                    )}

                    {!error.resolved && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <FormGroup>
                                <Label>Resolution Notes (optional):</Label>
                                <NotesInput
                                    value={resolveNotes}
                                    onChange={(e) =>
                                        setResolveNotes(e.target.value)
                                    }
                                    placeholder="Add notes about how this was resolved..."
                                />
                            </FormGroup>
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '0.5rem'
                                }}
                            >
                                <Button
                                    variant="primary"
                                    onClick={handleResolve}
                                >
                                    Mark as Resolved
                                </Button>
                                <Button variant="secondary" onClick={onClose}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}

                    {error.resolved && (
                        <div style={{ marginTop: '1.5rem' }}>
                            <Button
                                variant="warning"
                                onClick={() => onUnresolve(error.id)}
                            >
                                Reopen Error
                            </Button>
                        </div>
                    )}
                </ModalBody>
            </WideModalContent>
        </ModalBackdrop>
    );
}
