import type { Request, Response, NextFunction } from 'express';
import { config } from '@lib/env';

// I1: stateless CSRF defence-in-depth on top of SameSite=Lax + CORS-pin +
// HttpOnly cookies. Rejects state-changing requests whose origin does not
// match the deploy's baseUrl. Covers the corners SameSite misses (subdomain
// attacks, browser bugs, sec-fetch-site=none on mutating routes).
//
// Strategy, per the research spike (docs/spikes/2026-06-18-...md §4):
// 1. GET/HEAD/OPTIONS — always allowed (Express's own routing decides 404s).
// 2. Modern browsers: trust Sec-Fetch-Site=same-origin/same-site and reject
//    Sec-Fetch-Site=none/cross-site on mutating methods (Rails 8.2 default).
// 3. Legacy fallback: validate Origin (preferred) or Referer header against
//    the configured baseUrl allowlist.
// 4. Local APP_ENV runs without a fixed origin — allow everything (matches
//    the CORS local behaviour in src/index.ts).

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function getAllowedOrigins(): Set<string> {
  // baseUrl is the externally-facing origin for this deploy (set in
  // shared/src/env.ts ENV_CONFIG). On local APP_ENV we accept the dev-server
  // origins as well so `bun run dev` workflows aren't blocked.
  const allowed = new Set<string>();
  if (config.baseUrl) allowed.add(config.baseUrl);
  if (config.appEnv === 'local') {
    allowed.add('http://localhost:3000');
    allowed.add('http://localhost:3001');
    allowed.add('http://127.0.0.1:3000');
    allowed.add('http://127.0.0.1:3001');
  }
  return allowed;
}

const ALLOWED_ORIGINS = getAllowedOrigins();

export function csrfGuard() {
  return (req: Request, res: Response, next: NextFunction) => {
    if (SAFE_METHODS.has(req.method)) return next();

    // Sec-Fetch-Site lookup. Browsers populate this for fetch/XHR/form
    // submissions; absence means a non-browser caller (curl, server-to-
    // server) which we treat the same as cross-site under the strict gate.
    const fetchSite = req.headers['sec-fetch-site'];
    if (fetchSite === 'same-origin' || fetchSite === 'same-site') {
      return next();
    }

    // Fallback: Origin header (preferred) or Referer.
    const origin = (req.headers.origin as string | undefined) || '';
    const referer = (req.headers.referer as string | undefined) || '';
    const candidate = origin || referer;
    if (candidate) {
      try {
        const url = new URL(candidate);
        const candidateOrigin = `${url.protocol}//${url.host}`;
        if (ALLOWED_ORIGINS.has(candidateOrigin)) {
          return next();
        }
      } catch {
        // malformed Origin/Referer — fall through to the reject path
      }
    }

    res.status(403).json({ error: 'Cross-site request blocked' });
  };
}
