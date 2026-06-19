'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Multi-select hook with email/file-manager-style shift-click range
 * selection. Designed to be table-agnostic — pass the visible items
 * (in their on-screen order), get back the selection state and a
 * checkbox onClick handler that already understands shift-click.
 *
 * Why a hook and not a wrapped <SelectableList>:
 * - Hosts retain control over markup (table, list, grid).
 * - Selection state is exposed for hosts that want to drive bulk
 *   actions from outside the list (toolbars, keyboard shortcuts).
 *
 * Usage:
 *   const sel = useRangeSelect(rows);
 *   <input
 *     type="checkbox"
 *     checked={sel.isSelected(row.id)}
 *     onChange={() => {}}            // suppress React warning
 *     onClick={(e) => sel.onCheckboxClick(row.id, idx, e)}
 *   />
 *   sel.selected      // Set<string>
 *   sel.clear()
 *   sel.selectAll()
 *   sel.isIndeterminate
 *   sel.isAllSelected
 *   sel.resetAnchor() // call after re-fetching the underlying data
 */
export function useRangeSelect<T extends { id: string }>(items: T[]) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const anchorRef = useRef<number | null>(null);

  // The anchor is an *index* into the items array, so any time the items
  // reorder underneath (refetch, re-sort, filter, etc.) it points at the
  // wrong row. Watch the id-sequence and reset the anchor whenever it
  // changes. Also drop selected ids that no longer exist so stale rows
  // don't sit in the bulk-action set after a delete.
  const idSignature = useMemo(() => items.map((i) => i.id).join('|'), [items]);
  useEffect(() => {
    anchorRef.current = null;
    setSelected((prev) => {
      const present = new Set(items.map((i) => i.id));
      let changed = false;
      const next = new Set<string>();
      for (const id of prev) {
        if (present.has(id)) next.add(id);
        else changed = true;
      }
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idSignature]);

  const isSelected = useCallback((id: string) => selected.has(id), [selected]);

  const clear = useCallback(() => {
    setSelected(new Set());
    anchorRef.current = null;
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(items.map((i) => i.id)));
  }, [items]);

  const toggleAll = useCallback(() => {
    setSelected((prev) => {
      if (prev.size === items.length && items.length > 0) {
        anchorRef.current = null;
        return new Set();
      }
      return new Set(items.map((i) => i.id));
    });
  }, [items]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const resetAnchor = useCallback(() => {
    anchorRef.current = null;
  }, []);

  /**
   * onClick fires BEFORE the native checkbox toggles its checked state, so
   * `selected.has(id)` here reflects the pre-click state. We invert it
   * ourselves and (for shift-click) propagate that target state across
   * the range — standard shift-click semantics.
   *
   * IMPORTANT: pair this with `onChange={() => {}}` on the checkbox so
   * React doesn't warn about the controlled input. We need controlled to
   * keep `checked` in sync with `selected`.
   */
  const onCheckboxClick = useCallback(
    (id: string, idx: number, e: React.MouseEvent<HTMLInputElement>) => {
      const isCurrentlySelected = selected.has(id);
      const targetState = !isCurrentlySelected;
      const next = new Set(selected);
      const anchor = anchorRef.current;

      if (e.shiftKey && anchor !== null && anchor !== idx) {
        const [lo, hi] = [Math.min(anchor, idx), Math.max(anchor, idx)];
        for (let i = lo; i <= hi; i++) {
          const rowId = items[i]?.id;
          if (!rowId) continue;
          if (targetState) next.add(rowId);
          else next.delete(rowId);
        }
      } else {
        if (targetState) next.add(id);
        else next.delete(id);
      }
      setSelected(next);
      anchorRef.current = idx;
    },
    [items, selected]
  );

  const isAllSelected = useMemo(
    () => items.length > 0 && selected.size === items.length,
    [items.length, selected.size]
  );
  const isIndeterminate = useMemo(
    () => selected.size > 0 && selected.size < items.length,
    [items.length, selected.size]
  );

  return {
    selected,
    setSelected,
    isSelected,
    toggle,
    clear,
    selectAll,
    toggleAll,
    resetAnchor,
    onCheckboxClick,
    isAllSelected,
    isIndeterminate,
    count: selected.size
  };
}
