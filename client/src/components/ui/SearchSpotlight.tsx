'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import styled, { keyframes } from 'styled-components';
import { Search } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import type { SearchResult } from '@derecksnotes/shared';

// ============================================================================
// Animations
// ============================================================================

const fadeIn = keyframes`
    from { opacity: 0; }
    to { opacity: 1; }
`;

const scaleIn = keyframes`
    from { opacity: 0; transform: translateX(-50%) scale(0.97) translateY(-10px); }
    to { opacity: 1; transform: translateX(-50%) scale(1) translateY(0); }
`;

// ============================================================================
// Styled Components
// ============================================================================

const Overlay = styled.div`
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
    z-index: 200;
    animation: ${fadeIn} 0.15s ease;
`;

const Container = styled.div`
    position: fixed;
    top: 18%;
    left: 50%;
    transform: translateX(-50%);
    width: 640px;
    max-width: 95vw;
    z-index: 201;
    background: white;
    border-radius: 12px;
    box-shadow:
        0 25px 60px rgba(0, 0, 0, 0.25),
        0 0 0 1px rgba(0, 0, 0, 0.05);
    overflow: hidden;
    animation: ${scaleIn} 0.2s ease;

    @media (max-width: 650px) {
        top: 10%;
        width: 95vw;
        border-radius: 10px;
    }
`;

const InputWrapper = styled.div`
    display: flex;
    align-items: center;
    padding: 14px 18px;
    gap: 12px;
    border-bottom: 1px solid #f0f0f0;
`;

const SearchIcon = styled.div`
    color: #999;
    flex-shrink: 0;
    display: flex;
    align-items: center;
`;

const Input = styled.input`
    flex: 1;
    border: none;
    outline: none;
    font-size: 17px;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1d1d1f;
    background: transparent;

    &::placeholder {
        color: #bbb;
    }
`;

const EscHint = styled.kbd`
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 11px;
    color: #aaa;
    background: #f5f5f5;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
    padding: 2px 6px;
    flex-shrink: 0;
`;

const ResultsContainer = styled.div`
    max-height: 55vh;
    overflow-y: auto;
    overscroll-behavior: contain;

    &::-webkit-scrollbar {
        width: 6px;
    }
    &::-webkit-scrollbar-thumb {
        background: #ddd;
        border-radius: 3px;
    }
`;

const SectionHeader = styled.div`
    padding: 8px 18px 4px;
    font-size: 11px;
    font-weight: 600;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background: #fafafa;
    position: sticky;
    top: 0;
`;

const ResultItem = styled.div<{ $active: boolean }>`
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 18px;
    cursor: pointer;
    background: ${(p) => (p.$active ? '#f0f0f5' : 'transparent')};
    border-left: 3px solid
        ${(p) => (p.$active ? 'hsla(22, 80%, 50%, 1)' : 'transparent')};
    transition: background 0.1s ease;

    &:hover {
        background: #f5f5f7;
    }
`;

const ResultTitle = styled.div`
    font-size: 14px;
    font-weight: 500;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1d1d1f;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const ResultMeta = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #999;
`;

const SectionBadge = styled.span<{ $color: string }>`
    background: ${(p) => p.$color};
    color: white;
    padding: 1px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.03em;
`;

const ResultSnippet = styled.div`
    font-size: 12px;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #666;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;

    mark {
        background: hsla(45, 100%, 70%, 0.5);
        color: inherit;
        padding: 0 1px;
        border-radius: 2px;
    }
`;

const EmptyState = styled.div`
    padding: 30px 18px;
    text-align: center;
    font-size: 13px;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #999;
`;

const LoadingDots = styled.div`
    padding: 20px 18px;
    text-align: center;
    font-size: 13px;
    color: #bbb;

    &::after {
        content: '...';
        animation: ${fadeIn} 0.5s ease infinite alternate;
    }
`;

const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 18px;
    border-top: 1px solid #f0f0f0;
    font-size: 11px;
    font-family:
        -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #bbb;
`;

const KeyHint = styled.span`
    display: flex;
    align-items: center;
    gap: 4px;

    kbd {
        font-family: inherit;
        background: #f5f5f5;
        border: 1px solid #e0e0e0;
        border-radius: 3px;
        padding: 1px 4px;
        font-size: 10px;
    }
`;

// ============================================================================
// Helpers
// ============================================================================

const SECTION_COLORS: Record<string, string> = {
    blog: 'hsla(210, 60%, 50%, 1)',
    courses: 'hsla(145, 50%, 40%, 1)',
    references: 'hsla(280, 45%, 50%, 1)',
    comments: 'hsla(22, 70%, 50%, 1)'
};

function groupBySection(results: SearchResult[]): Map<string, SearchResult[]> {
    const groups = new Map<string, SearchResult[]>();
    for (const r of results) {
        const section = r.section;
        if (!groups.has(section)) groups.set(section, []);
        groups.get(section)!.push(r);
    }
    return groups;
}

function formatDate(iso: string): string {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// ============================================================================
// Component
// ============================================================================

interface SearchSpotlightProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SearchSpotlight({ isOpen, onClose }: SearchSpotlightProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);
    const { query, search, results, loading, clearResults } = useSearch();
    const [activeIndex, setActiveIndex] = useState(-1);

    // Focus input when opening
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            setActiveIndex(-1);
        } else {
            clearResults();
        }
    }, [isOpen, clearResults]);

    // Reset active index when results change
    useEffect(() => {
        setActiveIndex(results.length > 0 ? 0 : -1);
    }, [results]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e: KeyboardEvent) {
            if (e.key === 'Escape') {
                e.preventDefault();
                onClose();
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex((prev) =>
                    Math.min(prev + 1, results.length - 1)
                );
                return;
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex((prev) => Math.max(prev - 1, 0));
                return;
            }

            if (e.key === 'Enter' && activeIndex >= 0 && results[activeIndex]) {
                e.preventDefault();
                navigateTo(results[activeIndex]);
                return;
            }
        }

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, activeIndex, onClose]);

    // Scroll active item into view
    useEffect(() => {
        if (activeIndex < 0) return;
        const container = resultsRef.current;
        if (!container) return;
        const items = container.querySelectorAll('[data-result-index]');
        const item = items[activeIndex] as HTMLElement;
        if (item) item.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    function navigateTo(result: SearchResult) {
        onClose();
        router.push(result.path);
    }

    if (!isOpen) return null;

    const grouped = groupBySection(results);
    let flatIndex = 0;

    return (
        <>
            <Overlay onClick={onClose} />
            <Container onClick={(e) => e.stopPropagation()}>
                <InputWrapper>
                    <SearchIcon>
                        <Search size={20} />
                    </SearchIcon>
                    <Input
                        ref={inputRef}
                        type="text"
                        placeholder="Search posts, courses, comments..."
                        value={query}
                        onChange={(e) => search(e.target.value)}
                        spellCheck={false}
                        autoComplete="off"
                    />
                    <EscHint>ESC</EscHint>
                </InputWrapper>

                {(query.length >= 2 || results.length > 0) && (
                    <ResultsContainer ref={resultsRef}>
                        {loading && results.length === 0 && (
                            <LoadingDots>Searching</LoadingDots>
                        )}

                        {!loading &&
                            query.length >= 2 &&
                            results.length === 0 && (
                                <EmptyState>
                                    No results for &ldquo;{query}&rdquo;
                                </EmptyState>
                            )}

                        {Array.from(grouped.entries()).map(
                            ([section, sectionResults]) => (
                                <div key={section}>
                                    <SectionHeader>
                                        {section} ({sectionResults.length})
                                    </SectionHeader>
                                    {sectionResults.map((result) => {
                                        const idx = flatIndex++;
                                        return (
                                            <ResultItem
                                                key={`${result.type}-${result.slug}`}
                                                $active={idx === activeIndex}
                                                data-result-index={idx}
                                                onClick={() =>
                                                    navigateTo(result)
                                                }
                                                onMouseEnter={() =>
                                                    setActiveIndex(idx)
                                                }
                                            >
                                                <ResultTitle>
                                                    {result.title}
                                                </ResultTitle>
                                                <ResultMeta>
                                                    <SectionBadge
                                                        $color={
                                                            SECTION_COLORS[
                                                                section
                                                            ] || '#999'
                                                        }
                                                    >
                                                        {result.type ===
                                                        'comment'
                                                            ? 'comment'
                                                            : section}
                                                    </SectionBadge>
                                                    {result.date && (
                                                        <span>
                                                            {formatDate(
                                                                result.date
                                                            )}
                                                        </span>
                                                    )}
                                                    {result.author && (
                                                        <span>
                                                            by {result.author}
                                                        </span>
                                                    )}
                                                    {result.tags
                                                        .slice(0, 3)
                                                        .map((tag) => (
                                                            <span
                                                                key={tag}
                                                                style={{
                                                                    color: '#aaa'
                                                                }}
                                                            >
                                                                #{tag}
                                                            </span>
                                                        ))}
                                                </ResultMeta>
                                                <ResultSnippet
                                                    dangerouslySetInnerHTML={{
                                                        __html: result.snippet
                                                    }}
                                                />
                                            </ResultItem>
                                        );
                                    })}
                                </div>
                            )
                        )}
                    </ResultsContainer>
                )}

                <Footer>
                    <span>
                        {results.length > 0
                            ? `${results.length} results`
                            : 'Type to search'}
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <KeyHint>
                            <kbd>&uarr;</kbd>
                            <kbd>&darr;</kbd> navigate
                        </KeyHint>
                        <KeyHint>
                            <kbd>&crarr;</kbd> open
                        </KeyHint>
                        <KeyHint>
                            <kbd>esc</kbd> close
                        </KeyHint>
                    </div>
                </Footer>
            </Container>
        </>
    );
}
