'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/utils/api';
import {
  Card,
  CardTitle,
  EmptyState,
  Button,
  ButtonRow,
  InfoRow,
  InfoLabel,
  InfoValue
} from '@/components/ui/PageStyles';
import type { AuditLogEntry, PaginatedResponse } from '@derecksnotes/shared';
import { AdminBadge } from './_shared/styles';
import { formatAdminDate } from './_shared/formatDate';

export function AuditTab() {
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const load = async (p: number) => {
    const data = await api.get<PaginatedResponse<AuditLogEntry>>(
      `/admin/audit?page=${p}&limit=30`
    );
    setEntries(p === 1 ? data.data : [...entries, ...data.data]);
    setHasMore(data.hasMore);
    setPage(p);
  };

  useEffect(() => {
    load(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardTitle>Audit Log</CardTitle>
      {entries.length === 0 ? (
        <EmptyState>No audit entries.</EmptyState>
      ) : (
        entries.map((e) => (
          <InfoRow key={e.id}>
            <div>
              <InfoValue>{e.admin?.username || 'System'}</InfoValue>
              <AdminBadge $color="#106BA3">{e.action}</AdminBadge>
              <AdminBadge $color="#999">{e.targetType}</AdminBadge>
              <br />
              <InfoLabel>
                {e.targetId && `Target: ${e.targetId.substring(0, 8)}... `}
                {e.ipAddress && `IP: ${e.ipAddress} `}
              </InfoLabel>
            </div>
            <InfoLabel>{formatAdminDate(e.createdAt)}</InfoLabel>
          </InfoRow>
        ))
      )}
      {hasMore && (
        <ButtonRow>
          <Button $variant="secondary" onClick={() => load(page + 1)}>
            Load More
          </Button>
        </ButtonRow>
      )}
    </Card>
  );
}
