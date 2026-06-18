'use client';
import React from 'react';
import { Button, ButtonRow } from './PageStyles';

/**
 * Toolbar that surfaces above a selectable list/table when one or more
 * rows are selected. Composes with useRangeSelect — pass the count and
 * onClear from the hook, render whatever action buttons the host needs
 * as children.
 *
 * Returns null when count === 0 so hosts can keep this in the render
 * tree unconditionally without managing visibility themselves.
 *
 * Usage:
 *   const sel = useRangeSelect(rows);
 *   <BulkActionBar count={sel.count} onClear={sel.clear}>
 *     <Button onClick={() => approveMany(Array.from(sel.selected))}>
 *       Approve ({sel.count})
 *     </Button>
 *     <Button $variant="danger" onClick={() => rejectMany(Array.from(sel.selected))}>
 *       Reject ({sel.count})
 *     </Button>
 *   </BulkActionBar>
 */
export interface BulkActionBarProps {
  count: number;
  onClear: () => void;
  children: React.ReactNode;
  clearLabel?: string;
}

export function BulkActionBar({
  count,
  onClear,
  children,
  clearLabel = 'Clear'
}: BulkActionBarProps) {
  if (count === 0) return null;
  return (
    <ButtonRow>
      {children}
      <Button $variant="secondary" onClick={onClear}>
        {clearLabel}
      </Button>
    </ButtonRow>
  );
}
