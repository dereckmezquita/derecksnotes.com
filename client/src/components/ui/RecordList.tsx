'use client';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { toast } from 'sonner';
import {
  Card,
  CardTitle,
  EmptyState,
  Button
} from '@/components/ui/PageStyles';
import { DataTableCheckbox } from '@/components/ui/DataTable';
import { BulkActionBar } from '@/components/ui/BulkActionBar';
import { useRangeSelect } from '@/components/ui/useRangeSelect';

/**
 * Single record-list component shared by /account Comments, Read History,
 * Bookmarks, Following, and Notifications. One source of truth for:
 *  - row layout (checkbox + body + per-row action)
 *  - shift-click range selection
 *  - bulk-action toolbar
 *  - header (title + right-aligned global actions)
 *  - pagination
 *
 * Hosts supply rendering + data; selection is owned here so shift-click
 * works identically everywhere.
 */

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Hint = styled.p`
  font-size: 0.75rem;
  color: #888;
  margin: 0 0 0.25rem;
`;

const RowOuter = styled.div<{ $unread?: boolean }>`
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
  background: ${(p) =>
    p.$unread ? `${p.theme.text.colour.header()}10` : 'transparent'};

  &:last-of-type {
    border-bottom: none;
  }
`;

const RowBody = styled.div`
  flex: 1;
  min-width: 0;
`;

const RowActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
`;

/**
 * Click-target wrapper around the checkbox so the user can tap anywhere in a
 * comfortable area instead of having to hit a 16x16 input. Stops propagation
 * to the parent row so a click here doesn't also bubble to a link inside the
 * body.
 */
const CheckboxHit = styled.label`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  margin: -6px;
  cursor: pointer;
  user-select: none;
`;

export interface RecordListAction<T> {
  label: string;
  variant?: 'secondary' | 'danger';
  /**
   * Called with the items currently selected. Throw or reject to surface a
   * toast error; resolve to clear selection and refresh.
   */
  onAction: (items: T[]) => Promise<void> | void;
  confirm?: (count: number) => string;
}

export interface RecordListProps<T extends { id: string }> {
  title: string;
  items: T[];
  loading?: boolean;
  emptyMessage?: string;
  hint?: string;
  /**
   * Right-aligned global actions in the card header — e.g. "Mark all read",
   * "Clear history". Independent of selection state.
   */
  headerActions?: React.ReactNode;
  renderRow: (item: T) => React.ReactNode;
  rowAction?: (item: T) => React.ReactNode;
  /**
   * Row-level opt-out of selection — e.g. a deleted comment shouldn't be
   * selectable for bulk-delete because it's already gone. Default: all
   * selectable.
   */
  isSelectable?: (item: T) => boolean;
  /**
   * Row-level unread highlight (for the Notifications tab). Default: false.
   */
  isUnread?: (item: T) => boolean;
  bulkActions?: RecordListAction<T>[];
  hasMore?: boolean;
  onLoadMore?: () => void;
  /**
   * Called after a successful bulk action so the host can re-fetch.
   */
  onChanged?: () => void;
}

export function RecordList<T extends { id: string }>({
  title,
  items,
  loading,
  emptyMessage = 'Nothing here yet.',
  hint,
  headerActions,
  renderRow,
  rowAction,
  isSelectable,
  isUnread,
  bulkActions,
  hasMore,
  onLoadMore,
  onChanged
}: RecordListProps<T>) {
  // Selection is bound to the SELECTABLE subset only — that's the list whose
  // indices drive shift-click ranges. Items that opt out of selection still
  // render, they just don't participate in checkbox math.
  const selectable = useMemo(
    () => (isSelectable ? items.filter(isSelectable) : items),
    [items, isSelectable]
  );
  const sel = useRangeSelect(selectable);
  const [busy, setBusy] = useState(false);

  const selectedItems = useMemo(
    () => selectable.filter((i) => sel.selected.has(i.id)),
    [selectable, sel.selected]
  );

  async function runBulk(action: RecordListAction<T>) {
    if (selectedItems.length === 0) return;
    if (action.confirm) {
      const msg = action.confirm(selectedItems.length);
      if (!confirm(msg)) return;
    }
    setBusy(true);
    try {
      await action.onAction(selectedItems);
      sel.clear();
      onChanged?.();
    } catch (err: any) {
      toast.error(err?.message || `Failed: ${action.label}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card>
      <Header>
        <CardTitle style={{ margin: 0 }}>{title}</CardTitle>
        {headerActions && <HeaderActions>{headerActions}</HeaderActions>}
      </Header>

      {loading && items.length === 0 ? (
        <EmptyState>Loading…</EmptyState>
      ) : items.length === 0 ? (
        <EmptyState>{emptyMessage}</EmptyState>
      ) : (
        <>
          {hint && selectable.length > 0 && <Hint>{hint}</Hint>}
          {bulkActions && bulkActions.length > 0 && (
            <BulkActionBar count={sel.count} onClear={sel.clear}>
              {bulkActions.map((a) => (
                <Button
                  key={a.label}
                  $variant={a.variant || 'secondary'}
                  disabled={busy || sel.count === 0}
                  onClick={() => runBulk(a)}
                >
                  {a.label} ({sel.count})
                </Button>
              ))}
            </BulkActionBar>
          )}
          {items.map((item) => {
            const selectableHere = !isSelectable || isSelectable(item);
            const idx = selectableHere
              ? selectable.findIndex((s) => s.id === item.id)
              : -1;
            return (
              <RowOuter
                key={item.id}
                $unread={isUnread ? isUnread(item) : false}
              >
                {bulkActions && bulkActions.length > 0 && (
                  <CheckboxHit
                    onClick={(e) => {
                      // Only the checkbox itself handles selection — the
                      // hit-area label catches mistargeted clicks but lets
                      // the inner input fire normally.
                      e.stopPropagation();
                    }}
                  >
                    <DataTableCheckbox
                      checked={selectableHere ? sel.isSelected(item.id) : false}
                      disabled={!selectableHere}
                      onChange={() => {
                        /* controlled — handled in onClick to capture shiftKey */
                      }}
                      onClick={
                        selectableHere
                          ? (e) => sel.onCheckboxClick(item.id, idx, e)
                          : undefined
                      }
                    />
                  </CheckboxHit>
                )}
                <RowBody>{renderRow(item)}</RowBody>
                {rowAction && <RowActions>{rowAction(item)}</RowActions>}
              </RowOuter>
            );
          })}
          {hasMore && onLoadMore && (
            <Button
              $variant="secondary"
              onClick={onLoadMore}
              style={{ marginTop: '0.75rem' }}
            >
              Load more
            </Button>
          )}
        </>
      )}
    </Card>
  );
}
