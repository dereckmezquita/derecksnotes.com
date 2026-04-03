'use client';
import { useState, useRef, useCallback } from 'react';
import type { SearchResponse, SearchResult } from '@derecksnotes/shared';

const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 2;
const cache = new Map<string, SearchResponse>();

export function useSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const abortRef = useRef<AbortController>(null);

  const search = useCallback((q: string) => {
    setQuery(q);

    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (q.trim().length < MIN_QUERY_LENGTH) {
      setResults([]);
      setLoading(false);
      return;
    }

    // Check cache
    const cached = cache.get(q.trim());
    if (cached) {
      setResults(cached.results);
      setLoading(false);
      return;
    }

    setLoading(true);

    timerRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const res = await fetch(
          `/api/v1/search?q=${encodeURIComponent(q.trim())}&limit=20`,
          { signal: controller.signal }
        );

        if (!res.ok) {
          setResults([]);
          return;
        }

        const data: SearchResponse = await res.json();
        cache.set(q.trim(), data);
        setResults(data.results);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setResults([]);
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
  }, []);

  const clearResults = useCallback(() => {
    setQuery('');
    setResults([]);
    setLoading(false);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (abortRef.current) abortRef.current.abort();
  }, []);

  return { query, search, results, loading, clearResults };
}
