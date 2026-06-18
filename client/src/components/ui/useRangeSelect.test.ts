import { describe, expect, test } from 'bun:test';
import { renderHook, act } from '@testing-library/react';
import { useRangeSelect } from './useRangeSelect';

// Minimal mock of React.MouseEvent — only the fields the hook reads.
function clickEvent(shiftKey: boolean) {
  return { shiftKey } as unknown as React.MouseEvent<HTMLInputElement>;
}

const ITEMS = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }, { id: 'e' }];

describe('useRangeSelect', () => {
  test('single click toggles the row', () => {
    const { result } = renderHook(() => useRangeSelect(ITEMS));
    act(() => result.current.onCheckboxClick('b', 1, clickEvent(false)));
    expect(result.current.isSelected('b')).toBe(true);
    expect(result.current.count).toBe(1);

    act(() => result.current.onCheckboxClick('b', 1, clickEvent(false)));
    expect(result.current.isSelected('b')).toBe(false);
    expect(result.current.count).toBe(0);
  });

  test('shift-click selects the range to target state', () => {
    const { result } = renderHook(() => useRangeSelect(ITEMS));
    // anchor on b (idx 1)
    act(() => result.current.onCheckboxClick('b', 1, clickEvent(false)));
    // shift-click on e (idx 4) — b..e should now be selected
    act(() => result.current.onCheckboxClick('e', 4, clickEvent(true)));
    expect(Array.from(result.current.selected).sort()).toEqual([
      'b',
      'c',
      'd',
      'e'
    ]);
  });

  test('shift-click deselects when target was already selected', () => {
    const { result } = renderHook(() => useRangeSelect(ITEMS));
    act(() => result.current.selectAll());
    expect(result.current.count).toBe(5);
    // anchor on b
    act(() => result.current.onCheckboxClick('b', 1, clickEvent(false)));
    // b is now deselected; shift-click on d — b..d all match the new target
    // (deselect), so c+d also drop. a stays selected, e stays selected.
    act(() => result.current.onCheckboxClick('d', 3, clickEvent(true)));
    expect(Array.from(result.current.selected).sort()).toEqual(['a', 'e']);
  });

  test('clear removes all selection and the anchor', () => {
    const { result } = renderHook(() => useRangeSelect(ITEMS));
    act(() => result.current.selectAll());
    expect(result.current.count).toBe(5);
    act(() => result.current.clear());
    expect(result.current.count).toBe(0);

    // After clear, the next click acts as a new anchor (no implicit range).
    act(() => result.current.onCheckboxClick('c', 2, clickEvent(false)));
    act(() => result.current.onCheckboxClick('e', 4, clickEvent(true)));
    expect(Array.from(result.current.selected).sort()).toEqual(['c', 'd', 'e']);
  });

  test('isIndeterminate is true only for partial selection', () => {
    const { result } = renderHook(() => useRangeSelect(ITEMS));
    expect(result.current.isIndeterminate).toBe(false);
    expect(result.current.isAllSelected).toBe(false);

    act(() => result.current.toggle('a'));
    expect(result.current.isIndeterminate).toBe(true);
    expect(result.current.isAllSelected).toBe(false);

    act(() => result.current.selectAll());
    expect(result.current.isIndeterminate).toBe(false);
    expect(result.current.isAllSelected).toBe(true);
  });

  test('toggleAll flips between empty and full', () => {
    const { result } = renderHook(() => useRangeSelect(ITEMS));
    act(() => result.current.toggleAll());
    expect(result.current.count).toBe(5);
    act(() => result.current.toggleAll());
    expect(result.current.count).toBe(0);
  });

  test('shift-click without a prior anchor falls back to single toggle', () => {
    const { result } = renderHook(() => useRangeSelect(ITEMS));
    act(() => result.current.onCheckboxClick('c', 2, clickEvent(true)));
    expect(Array.from(result.current.selected)).toEqual(['c']);
  });
});
