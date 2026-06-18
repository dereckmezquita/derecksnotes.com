'use client';
import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

/**
 * Generic data-table primitives. The site's prior pattern was inline
 * `<table>` markup with bespoke styling per page; this file is the canonical
 * styled-table for the codebase. Pair with useRangeSelect for shift-click
 * multi-select.
 *
 * The components here are styled HTML — they intentionally do NOT take
 * data props. Hosts compose them: <DataTable><thead><DataTableHeaderRow>...
 * Use the same conventions site-wide so visual rhythm stays consistent.
 */

export const DataTableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
`;

export const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 0.8rem;
  font-family: ${(p) => p.theme.text.font.roboto};

  th,
  td {
    padding: 6px 8px;
    text-align: left;
    border-bottom: 1px solid ${(p) => p.theme.container.border.colour.primary()};
    vertical-align: top;
  }

  th {
    font-weight: ${(p) => p.theme.text.weight.bold};
    color: ${(p) => p.theme.text.colour.light_grey()};
    text-transform: uppercase;
    font-size: 0.65rem;
    letter-spacing: 0.05em;
    border-bottom: 2px solid ${(p) => p.theme.text.colour.header()};
    white-space: nowrap;
  }

  tbody tr.selected {
    background: ${(p) => p.theme.text.colour.header()}10;
  }

  td .content-preview {
    max-width: 340px;
    color: ${(p) => p.theme.text.colour.primary()};
    line-height: 1.35;
  }

  td .meta {
    color: ${(p) => p.theme.text.colour.light_grey()};
    font-size: 0.7rem;
  }
`;

export const DataTableCheckbox = styled.input.attrs({ type: 'checkbox' })`
  cursor: pointer;
  /* Bigger hit area so shift-clicking a fiddly checkbox isn't a sniper shot. */
  width: 16px;
  height: 16px;
`;

/**
 * Header checkbox that drives an indeterminate state when only some rows
 * are selected — the standard "partial selection" affordance for tables.
 * `indeterminate` is not a real HTML attribute on the input element; it
 * has to be assigned on the DOM node, so this component wraps the ref
 * logic in a hook so consumers don't have to.
 */
export interface SelectAllCheckboxProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
> {
  checked: boolean;
  indeterminate: boolean;
}

export function SelectAllCheckbox({
  checked,
  indeterminate,
  ...rest
}: SelectAllCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);
  return <DataTableCheckbox ref={ref} checked={checked} {...rest} />;
}
