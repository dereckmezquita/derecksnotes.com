/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
'use client';
import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

// ── styled ───────────────────────────────────────────────────────────
const Wrapper = styled.div`
  position: fixed;
  top: 160px;
  right: 16px;
  z-index: 50;
  display: flex;
  align-items: center;
  background: rgba(10, 10, 20, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0 12px;
  backdrop-filter: blur(12px);
  width: 220px;
  transition: width 0.2s ease;

  &:focus-within {
    width: 280px;
    border-color: rgba(68, 136, 255, 0.4);
  }
`;

const Icon = styled(FaSearch)`
  color: #666;
  flex-shrink: 0;
  font-size: 13px;
`;

const Input = styled.input`
  background: none;
  border: none;
  outline: none;
  color: #ddd;
  font-size: 13px;
  padding: 10px 8px;
  width: 100%;

  &::placeholder {
    color: #555;
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
