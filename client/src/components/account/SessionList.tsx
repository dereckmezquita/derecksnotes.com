'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import {
  EmptyState,
  Button,
  InfoRow,
  InfoLabel,
  InfoValue
} from '@/components/ui/PageStyles';
import type { SessionInfo } from '@derecksnotes/shared';
import { formatAccountDate } from './_shared/formatDate';

export function SessionList() {
  const [sessions, setSessions] = useState<SessionInfo[]>([]);

  useEffect(() => {
    api
      .get<SessionInfo[]>('/auth/sessions')
      .then(setSessions)
      .catch(() => {
        toast.error('Failed to load sessions');
      });
  }, []);

  const revoke = async (id: string) => {
    try {
      await api.delete(`/auth/sessions/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
      toast.success('Session revoked');
    } catch {
      toast.error('Failed to revoke session');
    }
  };

  if (sessions.length === 0) {
    return <EmptyState>No active sessions.</EmptyState>;
  }

  return (
    <>
      {sessions.map((s) => (
        <InfoRow key={s.id}>
          <div>
            <InfoValue>
              {s.isCurrent
                ? 'Current session'
                : s.userAgent?.substring(0, 40) || 'Unknown device'}
            </InfoValue>
            <br />
            <InfoLabel>
              {s.ipAddress} — expires {formatAccountDate(s.expiresAt)}
            </InfoLabel>
          </div>
          {!s.isCurrent && (
            <Button $variant="secondary" onClick={() => revoke(s.id)}>
              Revoke
            </Button>
          )}
        </InfoRow>
      ))}
    </>
  );
}
