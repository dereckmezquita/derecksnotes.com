# Security fix research spike — PR #50

## TL;DR
- **Session token storage (I3):** Align. Hash at rest with SHA-256 (not bcrypt/Argon2 — tokens already have 256 bits of entropy). Optional HMAC pepper only if you commit to boot-time validation. Single-deployment migration: wipe sessions, force re-login.
- **Account enumeration (I2):** Refine. Split by surface — accept username-conflict 409 (usernames are public on `/users`), hide email-conflict via the Mozilla send-on-conflict pattern, always-202 on `/forgot-password`, precomputed dummy-bcrypt round on `/login` matching production cost exactly.
- **Rate limits (I11):** Align with refinements. Dual-key (IP + identifier) per NIST §3.2.2. Add a persistent per-account fail counter — middleware alone does not satisfy NIST. SSE uses a connection-counting Map, not `express-rate-limit`. Boot-time assertion on `trust proxy`.
- **CSRF (I1):** Refine. Skip synchroniser tokens (no HTML forms). Use stateless `Sec-Fetch-Site` + Origin/Referer allowlist middleware, `__Host-` cookie prefix, audit GETs for side effects. Reject `Sec-Fetch-Site: none` on mutating routes (Rails 8.2 default).
- **Password policy (I22):** Refine. NIST 800-63B-4 final (Aug 2025) specifies **NFC**, not NFKC — the audit wording is correct. Min 15 / max 128 chars. Migrate to Argon2id via `Bun.password` (no 72-byte cap, no shucking). HIBP k-anonymity check on register/change only.
- **SSE (B4):** Align with refinements. Explicit `import { randomUUID } from 'node:crypto'`, run through `authenticate()`, in-process Map for connection caps (3/user, 10/IP), heartbeat comment every ~25s, no tokens in URLs (long-lived) — short-lived ≤120s handshake tokens are the documented carve-out if cross-origin ever needed.
- **Backups (I8/I9/I10):** Align. Litestream v0.5.x → Backblaze B2 fronted by Cloudflare (free egress), `backup-db.yml` invokes `scripts/backup-db.sh` (de-dup), `PRAGMA integrity_check` + `PRAGMA foreign_key_check` on every snapshot, monthly CI restore drill, age envelope encryption, GFS retention.
- **Transactions (I13/I14/I36):** Refine. Wrapping in `db.transaction()` alone does **not** fix the race — Drizzle defaults to `deferred`. Pass `{ behavior: 'immediate' }` explicitly, set `busy_timeout=5000` at connection open, prefer single-statement UPSERT/`DELETE … NOT IN` patterns. Add `SQLITE_BUSY` retry wrapper.

---

## 1. Session token storage at rest (audit I3)

### Current best practice
Opaque server-side session tokens generated from `crypto.randomBytes(32)` carry 256 bits of entropy — they cannot be brute-forced. Industry consensus (Lucia v3, Symfony #27910 remember-me fix, GitHub PATs) stores only a fast cryptographic digest (SHA-256) of the token in the database. bcrypt/Argon2 are explicitly inappropriate here: their ~100 ms KDF cost would run on every authenticated request for zero added security against a 2^256 search space. OWASP's Session Management Cheat Sheet documents salted-hash storage for *log* contexts and a 64-bit entropy floor; the "hash at rest" pattern itself is precedented by Lucia and Symfony rather than mandated by OWASP directly.

### Recommended implementation
Stick with the single-token design (do not adopt Lucia's `<id>.<secret>` split — overkill for a solo-maintainer Express 5 + Drizzle + better-sqlite3 app). Keep the 32-byte token, hash with SHA-256, store hex (64 chars, identical column width to current). Lookup is `SELECT * FROM sessions WHERE tokenHash = ?` — timing-safe for free because the SHA-256 of attacker input randomises the lookup key. Index it: `CREATE UNIQUE INDEX sessions_token_hash_idx ON sessions(token_hash)`.

```ts
// auth/session.ts
import { randomBytes, createHash, createHmac } from 'node:crypto';

const PEPPER = process.env.SESSION_TOKEN_PEPPER; // optional; validate at boot
if (process.env.NODE_ENV === 'production' && !PEPPER) {
  throw new Error('SESSION_TOKEN_PEPPER required in production');
}

export function createSessionToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString('hex');
  const hash = PEPPER
    ? createHmac('sha256', PEPPER).update(token).digest('hex')
    : createHash('sha256').update(token).digest('hex');
  return { token, hash };
}

export function hashSessionToken(token: string): string {
  return PEPPER
    ? createHmac('sha256', PEPPER).update(token).digest('hex')
    : createHash('sha256').update(token).digest('hex');
}
```

Migration: drop `sessions.token`, add `sessions.tokenHash`, wipe table, ship. Users re-login once — zero risk, no dual-column transition. Centralise in `createSession()` and grep for any other `db.insert(sessions)` callsites before merging. Redact `cookie` headers in `morgan`/`pino-http`.

### Citations
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
- https://lucia-auth.com/sessions/basic
- https://github.com/symfony/symfony/issues/27910
- https://nodejs.org/api/crypto.html#cryptorandombytessize-callback

### Codebase-specific notes
- Bun's `node:crypto` shim supports `randomBytes` and `createHmac` identically — no async `crypto.subtle` needed; keep synchronous code in middleware.
- Use a single shared `better-sqlite3` connection (the canonical pattern); set `journal_mode=WAL` once at boot.
- Pepper rotation = global logout. Acceptable operational cost. Do not attempt multi-pepper support.
- Only add the HMAC pepper if you commit to boot-time env validation; at 256-bit entropy it buys near-zero real security and adds operational surface.

---

## 2. Account enumeration defences (audit I2)

### Current best practice
OWASP Top 10 2025 A07 and the Authentication Cheat Sheet require identical messages, status codes, and timing across registration, login, and forgot-password. The Forgot Password Cheat Sheet specifies "uniform time" and "consistent message." On login, the canonical fix for the timing oracle is a precomputed dummy bcrypt hash run when the user record is missing (Django #20760, propelauth). On registration, the modern dominant pattern (Mozilla, Stripe, Auth0 community) is always-202 with a generic body plus a context-appropriate out-of-band email. Note: neither cheat sheet formally exempts apps with public username pages — but the *informational* value of hiding usernames is zero when `/users` already enumerates them.

### Recommended implementation
**Asymmetric by surface, with the threat-model documented in code:**

1. `POST /register` — username conflict returns a specific 409 (usernames are public on `/users`; document this decision). Email conflict returns 202 with the same generic body as the success path, and the welcome-or-conflict email is dispatched via the same queue. **No header asymmetry** (no `Set-Cookie` differences, no `Content-Length` delta).
2. `POST /login` — precompute `DUMMY_BCRYPT_HASH` at module load using the same library and cost env var as production. Always run `bcrypt.compare` AFTER the SELECT regardless of result. Wrap in try/catch returning identical 401. Both failure branches: byte-identical response.
3. `POST /forgot-password` — always 202 with fixed body. Enqueue lookup + send in a background job so HTTP timing is decoupled from DB state. Per-IP and per-target-email rate limits to prevent harassment via mass-trigger.

```ts
// auth/login.ts
import bcrypt from 'bcrypt';
const COST = Number(process.env.BCRYPT_COST ?? 12);
const DUMMY_HASH = await bcrypt.hash('dummy-password', COST); // at module load

export async function login(req, res) {
  try {
    const { username, password } = req.body;
    const user = await db.query.users.findFirst({
      where: eq(users.username, username.toLowerCase().trim()),
    });
    const hash = user?.passwordHash ?? DUMMY_HASH;
    const ok = await bcrypt.compare(password, hash);
    if (!ok || !user) return res.status(401).json({ error: 'invalid_credentials' });
    // success path
  } catch {
    return res.status(401).json({ error: 'invalid_credentials' });
  }
}
```

Add an autocannon integration test asserting p95 timing delta `< 5 ms` between known-bad-password and unknown-user. If it fails, the dummy hash is misconfigured (wrong library, wrong cost).

### Citations
- https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Forgot_Password_Cheat_Sheet.html
- https://owasp.org/Top10/2025/A07_2025-Authentication_Failures/
- https://code.djangoproject.com/ticket/20760
- https://stytch.com/blog/prevent-enumeration-attacks/

### Codebase-specific notes
- Bun ships bcrypt via napi `node-bcrypt`. Do not mix with `bcryptjs` — different timing profile creates a fresh oracle.
- Express 5: an unhandled async rejection bubbles to a 500, which itself is an enumeration signal. Wrap auth branches in try/catch returning a uniform 401.
- Drizzle + SQLite-WAL: a SELECT-miss is microseconds; bcrypt is ~300 ms. The dummy compare MUST run unconditionally after SELECT.
- If `BCRYPT_COST` is bumped, the module-load dummy is recomputed at next deploy — no stale-cost oracle.

---

## 3. Rate-limit budgets (audit I11)

### Current best practice
NIST SP 800-63B-4 §3.2.2 (final, July 2025) requires disabling an authenticator after **100 consecutive failed attempts** on a single account, with progressive throttling permitted to avoid lockout. Rate-limit middleware alone does *not* satisfy this — you also need a persistent per-account fail counter. OWASP API Top 10 2023 (API4), the Authentication Cheat Sheet, Cloudflare's WAF reference rules, and Auth0's production defaults converge on dual-keyed limits: IP + target identifier. IP-only is bypassable by botnets; identifier-only enables targeted DoS. Response is HTTP 429 + `Retry-After` (RFC 9110 §10.2.3) + draft-7 `RateLimit-*` headers.

### Recommended implementation
| Endpoint | IP key | Identifier key | Notes |
|---|---|---|---|
| `POST /login` | 10 fails / 10 min | 10 fails / hour (lowercased username) | `skipSuccessfulRequests: true` |
| `POST /register` | 5 / hour | — | |
| `POST /forgot-password` | 5 / hour | 3 / hour (email) | Highest risk: triggers email send |
| `POST /change-password` | 10 / hour | 5 / hour (userId) | bcrypt pins event loop |
| `POST /comments` | — | 5 / 10 s burst + 60 / hour sustained | Authenticated |
| `GET /api/v1/graph/live` | 10 handshakes / min | Map-based 3/user + 10/IP concurrent caps | See §6 |
| Admin endpoints | 30 / min | 30 / min (adminId) | Alert on 429s |

```ts
import rateLimit from 'express-rate-limit';
app.set('trust proxy', 1); // assert correctness at boot — see pitfalls

const loginLimiter = rateLimit({
  windowMs: 10 * 60_000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => req.ip,
});

const loginUserLimiter = rateLimit({
  windowMs: 60 * 60_000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => (req.body?.username ?? '').toLowerCase().trim() || req.ip,
});

app.post('/login', loginLimiter, loginUserLimiter, loginHandler);
```

**Add a persistent per-account fail counter** in SQLite (separate from the rate limiter — the limiter handles windowed brute force, the counter handles distributed low-and-slow per NIST §3.2.2). Reset on successful login. At 100 consecutive fails, require password reset.

### Citations
- https://pages.nist.gov/800-63-4/sp800-63b.html
- https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/
- https://developers.cloudflare.com/waf/rate-limiting-rules/best-practices/
- https://datatracker.ietf.org/doc/html/rfc9110#section-10.2.3
- https://datatracker.ietf.org/doc/html/draft-ietf-httpapi-ratelimit-headers
- https://express-rate-limit.mintlify.app/overview

### Codebase-specific notes
- **The #1 silent failure is forgetting `app.set('trust proxy', ...)`** — without it, `req.ip` is the proxy address and all users share one bucket. Add a boot-time assertion that hits an internal echo route from a known external IP.
- `express-rate-limit`'s `MemoryStore` is fine for single-process Bun (~40 MB / 1M IPs/hour). Document: "Move to `rate-limit-redis` before horizontal scaling — otherwise effective limits become N× per process."
- Do not persist counters in the main SQLite DB synchronously — every limited request becomes a write tx and starves WAL checkpoints. Use a Map with periodic GC, or a separate SQLite file with `PRAGMA synchronous=NORMAL`.
- bcrypt cost 12 is ~300 ms of synchronous CPU. Five concurrent `/login` or `/change-password` requests can pin the Bun event loop. Pair the rate limiter with a per-user in-flight semaphore.
- Pin `standardHeaders: 'draft-7'` explicitly (not `true`) so future package upgrades don't silently flip header shape.

---

## 4. CSRF defence-in-depth (audit I1)

### Current best practice
SameSite=Lax is defence-in-depth, not a primary CSRF defence (OWASP, MDN, PortSwigger). The 2025–2026 shift: OWASP and MDN now list `Sec-Fetch-Site` as a complete primary defence for modern-browser-only audiences, *with a mandatory Origin/Referer fallback for legacy clients*. Rails 8.2 (`:header_only` default, PR #56350) and Datasette (Go 1.25-inspired, Aug 2025) have adopted this model and dropped form tokens. Synchroniser tokens remain valid but are pure ceremony when there are no HTML forms.

### Recommended implementation
Stateless gate as Express 5 middleware mounted at the top of the mutating router. Reject `Sec-Fetch-Site: none` on state-changing routes (matching Rails 8.2's `:header_only` default — `none` covers GET address-bar navigations, not POST/PUT/PATCH/DELETE).

```ts
const ALLOWED_ORIGINS = new Set([process.env.BASE_URL, /* dev variants */]);
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

export function csrfGate(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();
  const sfs = req.get('Sec-Fetch-Site');
  if (sfs) {
    if (sfs === 'same-origin' || sfs === 'same-site') return next();
    return res.status(403).json({ error: 'csrf_blocked' });
  }
  // Legacy fallback: Origin then Referer
  const origin = req.get('Origin') ?? (req.get('Referer') ? new URL(req.get('Referer')!).origin : null);
  if (origin && ALLOWED_ORIGINS.has(origin)) return next();
  return res.status(403).json({ error: 'csrf_blocked' });
}
```

Additional hardening:
- Rename auth cookie to `__Host-session` (`Secure`, `Path=/`, no `Domain`, `SameSite=Lax`). Blocks sibling-subdomain cookie injection per RFC 6265bis.
- **Restrict mutating endpoints to `application/json` only** — forces a CORS preflight on cross-origin attempts. Reject `text/plain` and `x-www-form-urlencoded` bodies on POST/PUT/PATCH/DELETE.
- Audit every GET handler for state-changing side effects (logout-via-GET, action links). SameSite=Lax sends cookies on top-level GET — this is the highest-payoff fix and is often skipped.
- Exempt `/webhooks/*` and `/api/health` from the gate; webhooks use HMAC signature verification instead.
- Verify the reverse proxy (Caddy/Nginx) forwards `Sec-Fetch-Site`, `Origin`, `Referer` untouched — add an integration test.

### Citations
- https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html
- https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CSRF_prevention
- https://portswigger.net/web-security/csrf/bypassing-samesite-restrictions
- https://simonwillison.net/2026/Apr/14/replace-token-based-csrf/

### Codebase-specific notes
- No synchroniser tokens — pure JSON API consumed by Next.js fetch with `credentials: true`.
- Do not promote auth cookie to `SameSite=Strict` without verifying magic-link/OAuth callback flows; MDN recommends Lax for auth cookies.
- Confirm no `method-override` middleware in the stack — if added later, ensure the CSRF gate runs first.
- Allowlist is exact-match on scheme+host+port, never suffix-match on eTLD+1.

---

## 5. Password length, normalisation, bcrypt 72-byte (audit I22)

### Current best practice
**NIST SP 800-63B-4 final (Aug 2025) specifies NFC**, not NFKC. NFKC/NFKD appeared in the Second Public Draft and was changed back to NFC in the final publication — the audit's "NFC" wording is correct, contrary to some online summaries. Other final-spec requirements: minimum 15 characters when password is the sole authenticator, support at least 64, screen against a breach corpus (SHALL, raised from SHOULD in Rev 4), no composition rules, no rotation. OWASP Password Storage Cheat Sheet: bcrypt minimum cost 10; verify under 1 second; pre-hash to escape the 72-byte cap using `HMAC-SHA-384` with a pepper (not raw SHA-512 — vulnerable to password shucking and null-byte truncation). Argon2id (RFC 9106) is OWASP's preferred KDF.

### Recommended implementation
**Migrate to Argon2id via `Bun.password`** — native libsodium, async off-thread, no 72-byte cap, no shucking, no null-byte bug. Keep bcrypt `verify` for legacy hashes, lazy-rehash on next successful login.

```ts
// auth/password.ts
const MIN_LEN = 15;
const MAX_LEN = 128;

export function normalizePassword(raw: string): string {
  return raw.normalize('NFC'); // NIST 800-63B-4 final, Memorized Secret Verifiers
}

export async function hashPassword(raw: string): Promise<string> {
  if (raw.length < MIN_LEN || raw.length > MAX_LEN) throw new Error('invalid_length');
  const normalized = normalizePassword(raw);
  if (normalized.length > MAX_LEN) throw new Error('invalid_length_post_normalize');
  return Bun.password.hash(normalized, {
    algorithm: 'argon2id',
    memoryCost: 19456, // OWASP minimum: 19 MiB
    timeCost: 2,
  });
}

export async function verifyPassword(raw: string, hash: string): Promise<boolean> {
  return Bun.password.verify(normalizePassword(raw), hash); // auto-detects $2b$ vs $argon2id$
}
```

Add HIBP k-anonymity check on **register and change-password only** (not login — registration-time check, not session check):

```ts
import { createHash } from 'node:crypto';

export async function isPwned(raw: string): Promise<boolean> {
  const sha1 = createHash('sha1').update(normalizePassword(raw)).digest('hex').toUpperCase();
  const prefix = sha1.slice(0, 5);
  const suffix = sha1.slice(5);
  const r = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { 'Add-Padding': 'true' },
  });
  if (!r.ok) return false; // fail-open + alert metric
  const body = await r.text();
  return body.split('\n').some((line) => line.startsWith(suffix));
}
```

### Citations
- https://pages.nist.gov/800-63-4/sp800-63b.html
- https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63B-4.pdf
- https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
- https://datatracker.ietf.org/doc/html/rfc9106
- https://bun.com/docs/runtime/hashing
- https://haveibeenpwned.com/Passwords
- https://www.troyhunt.com/understanding-have-i-been-pwneds-use-of-sha-1-and-k-anonymity/

### Codebase-specific notes
- Use `Bun.password` (libsodium-backed), not npm `argon2` or `bcryptjs` — those conflict with Bun's runtime thread pool.
- NFC must run on both register AND login — unit-test with `U+FB01` (ﬁ ligature) and a Korean syllable.
- HIBP: cache 24 h, fail-open on network error with an alerting metric. Add the `Add-Padding: true` header to defeat traffic-analysis side-channels.
- Validate raw length → NFC normalise → re-check post-normalisation length → hash. Normalisation can change byte length.
- If staying on bcrypt instead of migrating: cost 10 minimum (OWASP) is acceptable; cost 12 is a project-specific tuning choice that requires benchmarking on the production VPS, not an OWASP requirement.

---

## 6. SSE security (audit B4)

### Current best practice
Authenticate SSE via the same cookie middleware as other routes — `EventSource` attaches cookies automatically for same-origin. Validate `Origin` as CSRF defence (SSE is a GET). Heartbeat with an SSE comment line (`:hb\n\n`) every 15–30 s (~25 s is the median) to defeat idle-proxy timeouts. Cap concurrent connections per user and per IP via an in-process `Map`, not `express-rate-limit` (which counts requests, not open streams). Rate-limit the *handshake*, not message rate. Tokens in URLs are an OWASP-flagged information-exposure pattern — short-lived (≤120 s) signed handshake JWTs are the documented carve-out when cross-origin cookies are impossible.

### Recommended implementation
```ts
import { randomUUID } from 'node:crypto';

const connections = new Map<number, Set<{ id: string; res: Response }>>();
const PER_USER_CAP = 3; // well under browser HTTP/1.1 6-per-origin
const PER_IP_CAP = 10;

app.get('/api/v1/graph/live', authenticate(), csrfGate, handshakeLimiter, (req, res) => {
  const userId = req.user!.id;
  const userSet = connections.get(userId) ?? new Set();
  if (userSet.size >= PER_USER_CAP) {
    res.set('Retry-After', '30');
    return res.status(429).json({ error: 'too_many_sse_connections' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const id = randomUUID();
  const entry = { id, res };
  userSet.add(entry);
  connections.set(userId, userSet);

  const hb = setInterval(() => res.write(':hb\n\n'), 25_000);

  let closed = false;
  const onClose = () => {
    if (closed) return;
    closed = true;
    clearInterval(hb);
    userSet.delete(entry);
    if (userSet.size === 0) connections.delete(userId);
    if (!res.writableEnded) { try { res.end(); } catch {} }
  };
  req.on('close', onClose);
  res.on('close', onClose);
});
```

### Citations
- https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
- https://owasp.org/www-community/vulnerabilities/Information_exposure_through_query_strings_in_url
- https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- https://bun.com/reference/node/crypto/randomUUID
- https://bun.com/docs/runtime/nodejs-compat

### Codebase-specific notes
- Use `import { randomUUID } from 'node:crypto'` (lint-safe, no `no-undef`, Bun-compatible) over `globalThis.crypto.randomUUID()`.
- Per-user cap = 3: leaves browser HTTP/1.1 budget for other XHR/asset connections on the same origin.
- Close handler must be idempotent (the `closed` flag) — `req.on('close')` and `res.on('close')` can both fire; Bun throws on post-close `res.end()` without the guard.
- Do NOT debounce SSE writes with per-message Drizzle queries — coalesce with one shared poller fanning out across the connection Map.
- Verify the reverse proxy (Cloudflare buffers SSE on free tier; nginx needs `X-Accel-Buffering: no`).
- Add a CI/lint gate failing on `req.query.token` in any auth-bearing route — prevents the "temporary fix" rule violation.
- Add `SIGTERM` handler that walks the Map and `res.end()`s each entry for clean PM2/Bun reloads.

---

## 7. SQLite backup durability (audit I8, I9, I10)

### Current best practice
2026 canonical stack: **Litestream v0.5.x** streams WAL frames in LTX format with hierarchical compaction (30 s / 5 min / 1 h levels), giving sub-second-lag PITR from a dozen files. Offsite target: **Backblaze B2** (~$0.006/GB) fronted by Cloudflare for free egress via Bandwidth Alliance; Cloudflare R2 if you want unconditional zero egress single-vendor. Verify with `PRAGMA integrity_check` AND `PRAGMA foreign_key_check` (the former does not cover FK constraints). Run a monthly end-to-end restore drill in CI — verifying the artifact exists is not the same as verifying you can recover. GFS retention: 7 daily / 4 weekly / 12 monthly / 3-7 yearly. Encrypt snapshot tarballs with **age** (X25519 + ChaCha20-Poly1305) plus bucket SSE.

### Recommended implementation
1. **Litestream as primary continuous replication** to B2. Lifecycle: "keep only the last version" (Litestream files are immutable; bucket versioning silently doubles cost).
2. **Daily snapshot via `scripts/backup-db.sh`** (encrypted with age, GFS-retained). `backup-db.yml` invokes the script (`uses: ./scripts/backup-db.sh`) instead of re-implementing — fixes I10.
3. **Verification gates in `backup-db.sh`** before upload:
   ```bash
   sqlite3 /tmp/restore-test.db 'PRAGMA integrity_check;' | grep -qx ok || exit 1
   sqlite3 /tmp/restore-test.db 'PRAGMA foreign_key_check;' | wc -l | grep -qx 0 || exit 1
   gunzip -t snapshot.db.gz || exit 1
   ```
4. **Monthly CI restore drill**: download latest Litestream replica into a scratch container, run integrity_check + a row-count sanity query, alert on failure. This closes I9.
5. **Named Docker volume** in prod (not host bind-mount) — Linux ext4 bind-mounts work fine in prod, but use a named volume regardless for consistency.
6. **Never `cp` the bare `.db`** without `-wal` and `-shm`. Always go through SQLite Backup API, `VACUUM INTO`, or Litestream. Document in script header.
7. Keep age identity file off the prod host (1Password, GitHub Actions secret, hardware key). Only the public recipient lives on the host. Consider age v1.2+ `-pq` hybrid mode for yearly grandfather snapshots given long retention.

### Citations
- https://litestream.io/
- https://fly.io/blog/litestream-v050-is-here/
- https://litestream.io/guides/backblaze/
- https://sqlite.org/backup.html
- https://sqlite.org/pragma.html
- https://age-encryption.org/
- https://www.backblaze.com/blog/better-backup-practices-what-is-the-grandfather-father-son-approach/

### Codebase-specific notes
- App-boot PRAGMA block: `PRAGMA journal_mode=WAL; PRAGMA synchronous=NORMAL; PRAGMA busy_timeout=5000; PRAGMA foreign_keys=ON;` — Litestream cannot stream incrementally without WAL.
- `backup-db.sh` and Litestream must not both checkpoint simultaneously — use `VACUUM INTO` in the snapshot script to avoid touching WAL semantics.
- Drizzle long-running transactions delay WAL checkpoints, affecting Litestream compaction. Keep transactions short.
- B2 S3 API has a 5 MB minimum part size — Litestream defaults handle this; only matters if customising.
- Cloudflare R2 has no egress but charges Class A/B operations — chatty WAL frame uploads can make ops cost exceed storage cost. Tune `monitor-interval`.

---

## 8. Drizzle transactions / race conditions (audit I13, I14, I36)

### Current best practice
SQLite is single-writer; in WAL mode at most one write transaction holds the write lock. **Drizzle's default transaction behaviour is `deferred`** (matching better-sqlite3 default) — a deferred tx takes only a read lock at BEGIN and upgrades on first write, producing the exact lost-update race and mid-tx `SQLITE_BUSY` errors the audit aims to fix. **Wrapping in `db.transaction()` alone does not fix the race.** `BEGIN IMMEDIATE` claims the RESERVED write lock at BEGIN, eliminating the read-then-upgrade window. SQLite does not expose `isolation_level` knobs — `behavior: 'deferred' | 'immediate' | 'exclusive'` is the only lever. For toggle/counter patterns, a single `INSERT … ON CONFLICT … DO UPDATE` is race-free inside the engine (requires a real UNIQUE constraint).

### Recommended implementation
**Connection-open PRAGMAs (once, in `db.ts`):**
```ts
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA synchronous = NORMAL;
  PRAGMA busy_timeout = 5000;
  PRAGMA foreign_keys = ON;
  PRAGMA cache_size = -20000;
`);
```

**I13 (MAX_SESSIONS cap)** — collapse to two statements in one immediate tx:
```ts
await withRetry(() => db.transaction(async (tx) => {
  await tx.insert(sessions).values({ userId, tokenHash, expiresAt });
  await tx.run(sql`
    DELETE FROM sessions
    WHERE user_id = ${userId}
      AND id NOT IN (
        SELECT id FROM sessions WHERE user_id = ${userId}
        ORDER BY created_at DESC LIMIT ${MAX_SESSIONS}
      )
  `);
}, { behavior: 'immediate' }));
```

**I14 (reaction toggle)** — requires `UNIQUE(userId, commentId)` as a real CONSTRAINT (not just a Drizzle `uniqueIndex` — see Drizzle #4152). Add/change-type via UPSERT; toggle-off via immediate tx:
```ts
// Add or change reaction type
await db.insert(reactions)
  .values({ userId, commentId, type })
  .onConflictDoUpdate({
    target: [reactions.userId, reactions.commentId],
    set: { type: sql`excluded.type` },
  });

// Remove reaction (true toggle off)
await db.transaction(async (tx) => {
  await tx.delete(reactions).where(
    and(eq(reactions.userId, userId), eq(reactions.commentId, commentId))
  );
}, { behavior: 'immediate' });
```

**I36 (admin bulk delete)** — one immediate tx, `IN (...)` not per-row loop. With `ON DELETE CASCADE` and `PRAGMA foreign_keys=ON`, a single parent DELETE is atomic across tables.

**Retry wrapper:**
```ts
async function withRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 0; i < attempts; i++) {
    try { return await fn(); }
    catch (e: any) {
      const busy = e.code === 'SQLITE_BUSY' || e.code === 'SQLITE_BUSY_SNAPSHOT';
      if (!busy || i === attempts - 1) throw e;
      await new Promise((r) => setTimeout(r, 50 * (i + 1) + Math.random() * 50));
    }
  }
  throw new Error('unreachable');
}
```

### Citations
- https://orm.drizzle.team/docs/transactions
- https://orm.drizzle.team/docs/guides/upsert
- https://sqlite.org/lang_transaction.html
- https://sqlite.org/lang_conflict.html
- https://sqlite.org/c3ref/busy_timeout.html
- https://github.com/drizzle-team/drizzle-orm/issues/4152
- https://github.com/drizzle-team/drizzle-orm/issues/2275

### Codebase-specific notes
- Confirm whether this project uses `drizzle-orm/bun-sqlite` or `drizzle-orm/better-sqlite3` (check `package.json`). Drizzle issue #2275 documents that async tx callbacks are not properly awaited on `bun-sqlite` — prefer synchronous `tx.run()` calls on that driver.
- Never `await` non-DB I/O (fetch, queue publish) inside a transaction callback — you hold the global write lock for the duration and starve every other writer.
- `busy_timeout` only helps for *initial* lock acquisition. Errors surfacing mid-transaction (the deferred-upgrade race) bypass it — another reason for IMMEDIATE.
- Drizzle's `db.transaction` only rolls back if the callback throws. If you catch internally and don't rethrow, the tx commits partial state. Keep callbacks small and rethrow.
- Add integration tests: 50 concurrent logins for one userId asserting `sessions.length === MAX_SESSIONS`; N concurrent reaction toggles asserting no duplicate rows. Without these, the fix is unverified.

---

## Implementation order

The order matters because some fixes unblock others:

1. **Connection-open PRAGMAs** (§8) — `journal_mode=WAL`, `busy_timeout=5000`, `foreign_keys=ON`. Cheap, no-risk, pre-requisite for everything else: transactions, Litestream, rate-limit-counter persistence, session storage all depend on these defaults being correct.

2. **CSRF gate + `__Host-` cookie rename + `application/json`-only bodies** (§4) — pure middleware additions, zero schema impact. Doing this *before* the session refactor avoids needing two cookie-rename migrations. Audit GET handlers for side effects here too.

3. **`trust proxy` boot-time assertion + rate-limit middleware skeleton** (§3) — also pure middleware. Doing this *before* the auth refactor means the new login flow lands behind a working limiter from day one. Persistent per-account fail counter can land in a follow-up PR.

4. **Session token hashing at rest** (§1) — schema migration: drop `sessions.token`, add `sessions.tokenHash`, wipe table. Forces one user re-login. Lands cleanly after step 2 because the new `__Host-session` cookie is already in place.

5. **Password normalisation + length bounds + bcrypt-dummy-hash on login** (§2 login half + §5 length/normalisation) — these touch the same code paths. NFC normalisation, schema bounds, and the precomputed dummy bcrypt hash all ship together. Argon2id migration is a follow-up (verifier auto-detects hash type).

6. **Register email-conflict + forgot-password always-202** (§2 register/forgot halves) — depends on having an email-send queue. If the queue is synchronous today, ship the always-202 response first and back-fill async dispatch as a follow-up.

7. **Transaction `{ behavior: 'immediate' }` fixes + UPSERTs + retry wrapper** (§8) — I13, I14, I36. Verify or add the `UNIQUE(userId, commentId)` CONSTRAINT *before* converting the reaction toggle to UPSERT. Add concurrent-request integration tests in the same PR.

8. **SSE hardening** (§6) — `node:crypto` import, `authenticate()`, connection-cap Map, heartbeat, idempotent close handler. Depends on §3 (handshake rate limiter) and §4 (CSRF gate) being mounted.

9. **HIBP k-anonymity on register/change-password** (§5) — additive, depends on §5's normalisation helper. Cache 24 h, fail-open with alert metric.

10. **Argon2id migration via `Bun.password`** (§5) — lazy-rehash on next successful verify. Long tail; deploys safely after §4 cookie rename.

11. **Litestream + B2 + `backup-db.yml` calling `backup-db.sh` + monthly restore drill** (§7) — fully independent of all app changes. Can ship in parallel at any point but is best done *after* the WAL PRAGMAs in step 1 are confirmed in production.

12. **Persistent per-account fail counter for NIST §3.2.2 compliance** (§3) — follow-up to step 3. Separate SQLite file with `synchronous=NORMAL` to avoid contention on the main DB.