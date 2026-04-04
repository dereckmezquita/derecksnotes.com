/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
'use client';
import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

// ── styled ───────────────────────────────────────────────────────────
const Wrapper = styled.div`
  position: fixed;
  top: 200px;
  right: 12px;
  z-index: 65;
  display: flex;
  align-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  padding: 0 12px;
  width: 220px;
  transition:
    width 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    backdrop-filter 0.2s ease;

  &:focus-within {
    width: 280px;
    background: rgba(255, 255, 255, 0.85);
    border-color: rgba(200, 113, 55, 0.4);
    backdrop-filter: blur(8px);
  }
`;

const Icon = styled(FaSearch)`
  color: #999;
  flex-shrink: 0;
  font-size: 13px;
`;

const Input = styled.input`
  background: none;
  border: none;
  outline: none;
  color: #333;
  font-size: 13px;
  padding: 10px 8px;
  width: 100%;

  &::placeholder {
    color: #999;
  }
`;

// ── component ────────────────────────────────────────────────────────
interface ExploreSearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function ExploreSearchBar({
  value,
  onChange
}: ExploreSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // focus on '/' key
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <Wrapper>
      <Icon />
      <Input
        ref={inputRef}
        type="text"
        placeholder="Search nodes... ( / )"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </Wrapper>
  );
}
