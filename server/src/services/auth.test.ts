import { describe, expect, test } from 'bun:test';

// hashSessionToken reads SESSION_TOKEN_PEPPER at module load, so isolate it:
// reset the var and re-import via a dynamic import in each path that cares.
function freshImport(): Promise<typeof import('./auth')> {
  return import(`./auth?cachebust=${Math.random()}`).then((m) => m as any);
}

describe('hashSessionToken', () => {
  test('is deterministic for the same input (no-pepper path)', async () => {
    delete process.env.SESSION_TOKEN_PEPPER;
    const { hashSessionToken } = await freshImport();
    expect(hashSessionToken('abc')).toBe(hashSessionToken('abc'));
  });

  test('different inputs produce different hashes', async () => {
    delete process.env.SESSION_TOKEN_PEPPER;
    const { hashSessionToken } = await freshImport();
    expect(hashSessionToken('abc')).not.toBe(hashSessionToken('abd'));
  });

  test('output is 64 hex chars (SHA-256)', async () => {
    delete process.env.SESSION_TOKEN_PEPPER;
    const { hashSessionToken } = await freshImport();
    const h = hashSessionToken('any-token');
    expect(h).toMatch(/^[0-9a-f]{64}$/);
  });

  test('output does not contain the input (irreversible)', async () => {
    delete process.env.SESSION_TOKEN_PEPPER;
    const { hashSessionToken } = await freshImport();
    const secret = 'super-secret-session-token-9f1c8a';
    const h = hashSessionToken(secret);
    expect(h.includes(secret)).toBe(false);
  });

  test('changing pepper changes the hash for the same input', async () => {
    delete process.env.SESSION_TOKEN_PEPPER;
    const plain = (await freshImport()).hashSessionToken('same-token');

    process.env.SESSION_TOKEN_PEPPER = 'pepper-A';
    const peppered = (await freshImport()).hashSessionToken('same-token');

    expect(peppered).not.toBe(plain);

    process.env.SESSION_TOKEN_PEPPER = 'pepper-B';
    const repeppered = (await freshImport()).hashSessionToken('same-token');

    expect(repeppered).not.toBe(peppered);

    // Cleanup so other tests don't inherit a pepper.
    delete process.env.SESSION_TOKEN_PEPPER;
  });
});
