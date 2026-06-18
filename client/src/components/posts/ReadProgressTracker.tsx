'use client';
import { useEffect, useRef } from 'react';
import { api } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

/**
 * Reports reading progress for the current post. Hooks into window scroll,
 * throttled at 4s. Only POSTs when the reported value is STRICTLY greater
 * than the last one we sent — the server also clamps to the max so a
 * misbehaving client can't regress, but skipping the call early saves
 * bandwidth.
 */
export function ReadProgressTracker({
  slug,
  title
}: {
  slug: string;
  title: string;
}) {
  const { isAuthenticated } = useAuth();
  const lastSent = useRef(0);
  const inFlight = useRef(false);

  useEffect(() => {
    if (!isAuthenticated()) return;
    let timer: number | null = null;

    function compute(): number {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      if (total <= 0) return 100;
      const pct = Math.max(
        0,
        Math.min(100, Math.round((window.scrollY / total) * 100))
      );
      return pct;
    }

    async function send(pct: number) {
      if (inFlight.current) return;
      inFlight.current = true;
      try {
        await api.post(
          '/posts/read-progress',
          { slug, title, percent: pct },
          {
            silent: true
          }
        );
        lastSent.current = pct;
      } catch {
        // silent
      } finally {
        inFlight.current = false;
      }
    }

    function onScroll() {
      if (timer !== null) return;
      timer = window.setTimeout(() => {
        timer = null;
        const pct = compute();
        if (pct > lastSent.current + 4) {
          send(pct);
        }
      }, 4000);
    }

    // Fire once on mount so the initial state is captured.
    const initial = compute();
    if (initial > 0) send(initial);

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (timer !== null) window.clearTimeout(timer);
    };
  }, [isAuthenticated, slug, title]);

  return null;
}
