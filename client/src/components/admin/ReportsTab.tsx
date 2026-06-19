'use client';
import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/utils/api';
import {
  Card,
  CardTitle,
  EmptyState,
  Button,
  ButtonRow
} from '@/components/ui/PageStyles';
import {
  DataTable,
  DataTableWrapper,
  DataTableCheckbox,
  SelectAllCheckbox
} from '@/components/ui/DataTable';
import { BulkActionBar } from '@/components/ui/BulkActionBar';
import { useRangeSelect } from '@/components/ui/useRangeSelect';
import type {
  AdminReport,
  AdminReportStatus,
  PaginatedResponse
} from '@derecksnotes/shared';
import { AdminBadge } from './_shared/styles';
import { formatAdminDate } from './_shared/formatDate';

type StatusFilter = AdminReportStatus | 'all';

const STATUS_FILTERS: StatusFilter[] = ['open', 'resolved', 'dismissed', 'all'];

function statusColour(s: AdminReportStatus): string {
  switch (s) {
    case 'open':
      return '#c87137';
    case 'resolved':
      return '#0F9960';
    case 'dismissed':
      return '#999';
  }
}

export function ReportsTab() {
  const [items, setItems] = useState<AdminReport[]>([]);
  const [status, setStatus] = useState<StatusFilter>('open');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const sel = useRangeSelect(items);

  const load = useCallback(
    async (p: number, st: StatusFilter) => {
      const data = await api.get<PaginatedResponse<AdminReport>>(
        `/admin/reports?status=${st}&page=${p}&limit=20`
      );
      setItems((prev) => (p === 1 ? data.data : [...prev, ...data.data]));
      setHasMore(data.hasMore);
      setPage(p);
      sel.resetAnchor();
    },
    [sel]
  );

  useEffect(() => {
    load(1, status);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const bulk = async (next: 'resolved' | 'dismissed') => {
    if (sel.count === 0) return;
    if (!confirm(`Mark ${sel.count} report(s) as ${next}?`)) return;
    const ids = Array.from(sel.selected);
    try {
      await api.post('/admin/reports/bulk-status', { ids, status: next });
      toast.success(`${ids.length} report(s) ${next}`);
      sel.clear();
      load(1, status);
    } catch {
      // toast handled by api util
    }
  };

  return (
    <Card>
      <CardTitle>Reports</CardTitle>
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          marginBottom: '0.5rem',
          flexWrap: 'wrap'
        }}
      >
        {STATUS_FILTERS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            style={{
              padding: '2px 8px',
              fontSize: '0.7rem',
              border: `1px solid ${status === s ? 'hsla(22, 80%, 45%, 1)' : '#ccc'}`,
              borderRadius: '3px',
              background:
                status === s ? 'hsla(22, 80%, 45%, 0.1)' : 'transparent',
              color: status === s ? 'hsla(22, 80%, 45%, 1)' : '#666',
              cursor: 'pointer',
              textTransform: 'capitalize',
              fontFamily: 'Roboto, sans-serif'
            }}
          >
            {s}
          </button>
        ))}
      </div>
      <BulkActionBar count={sel.count} onClear={sel.clear}>
        <Button onClick={() => bulk('resolved')}>Resolve ({sel.count})</Button>
        <Button $variant="danger" onClick={() => bulk('dismissed')}>
          Dismiss ({sel.count})
        </Button>
      </BulkActionBar>
      {items.length === 0 ? (
        <EmptyState>No reports.</EmptyState>
      ) : (
        <DataTableWrapper>
          <DataTable>
            <thead>
              <tr>
                <th style={{ width: 28 }}>
                  <SelectAllCheckbox
                    checked={sel.isAllSelected}
                    indeterminate={sel.isIndeterminate}
                    onChange={sel.toggleAll}
                  />
                </th>
                <th>Reporter</th>
                <th>Target</th>
                <th>Reason</th>
                <th>Details</th>
                <th>Status</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {items.map((r, idx) => (
                <tr
                  key={r.id}
                  className={sel.isSelected(r.id) ? 'selected' : ''}
                >
                  <td>
                    <DataTableCheckbox
                      checked={sel.isSelected(r.id)}
                      onChange={() => {
                        /* handled in onClick */
                      }}
                      onClick={(e) => sel.onCheckboxClick(r.id, idx, e)}
                    />
                  </td>
                  <td>@{r.reporter?.username || 'unknown'}</td>
                  <td>
                    {r.targetType === 'comment' ? (
                      <span>
                        comment{' '}
                        <code style={{ fontSize: '0.7rem' }}>
                          {r.targetId.slice(0, 8)}
                        </code>
                      </span>
                    ) : (
                      <span>user {r.targetId}</span>
                    )}
                  </td>
                  <td>{r.reason}</td>
                  <td>
                    <div className="content-preview">
                      {r.details ? r.details.slice(0, 200) : '—'}
                    </div>
                  </td>
                  <td>
                    <AdminBadge $color={statusColour(r.status)}>
                      {r.status}
                    </AdminBadge>
                  </td>
                  <td>
                    <div className="meta">{formatAdminDate(r.createdAt)}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        </DataTableWrapper>
      )}
      {hasMore && (
        <ButtonRow>
          <Button $variant="secondary" onClick={() => load(page + 1, status)}>
            Load More
          </Button>
        </ButtonRow>
      )}
    </Card>
  );
}
