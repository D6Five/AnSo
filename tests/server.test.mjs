import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { spawn } from 'node:child_process';
import { createHmac } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Boots the real server (real HMAC sessions, real merge, real throttling) on a
 * random port with a throwaway data directory, and exercises it over HTTP the
 * way a browser would. This is the layer that catches "the deploy is broken"
 * before Railway ever sees it.
 */

const PASSWORD = 'test-password-123';
const PORT = 18000 + Math.floor(Math.random() * 2000);
const BASE = `http://127.0.0.1:${PORT}`;

let child;
let dataDir;

async function waitForServer(tries = 50) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(BASE + '/', { redirect: 'manual' });
      if (res.status > 0) return;
    } catch {
      await new Promise((r) => setTimeout(r, 100));
    }
  }
  throw new Error('server never came up');
}

beforeAll(async () => {
  dataDir = await mkdtemp(join(tmpdir(), 'anso-test-'));
  child = spawn(process.execPath, ['server.mjs'], {
    cwd: fileURLToPath(new URL('..', import.meta.url)),
    env: {
      ...process.env,
      AUTH_PASSWORD: PASSWORD,
      DATA_DIR: dataDir,
      PORT: String(PORT),
      HOST: '127.0.0.1',
    },
    stdio: 'ignore',
  });
  await waitForServer();
}, 20000);

afterAll(async () => {
  child?.kill();
  // Give Windows a beat to release file handles before removing the dir.
  await new Promise((r) => setTimeout(r, 200));
  await rm(dataDir, { recursive: true, force: true }).catch(() => {});
});

async function login(password = PASSWORD) {
  const res = await fetch(BASE + '/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ password }).toString(),
    redirect: 'manual',
  });
  const setCookie = res.headers.get('set-cookie') ?? '';
  return { status: res.status, cookie: setCookie.split(';')[0] };
}

describe('password gate', () => {
  it('serves nothing without a session — not even the app shell', async () => {
    const res = await fetch(BASE + '/', { redirect: 'manual' });
    expect(res.status).toBe(401);
    const body = await res.text();
    expect(body).toContain('type="password"');
    expect(body).not.toContain('assets/'); // no app code leaks to the login page
  });

  it('rejects a wrong password', async () => {
    const { status, cookie } = await login('wrong-password-1');
    expect(status).toBe(401);
    expect(cookie).not.toContain('anso_session=');
  });

  it('issues a session cookie for the right password', async () => {
    const { status, cookie } = await login();
    expect(status).toBe(303);
    expect(cookie).toMatch(/^anso_session=\d+\./);
  });

  it('rejects a forged session token', async () => {
    const res = await fetch(BASE + '/api/sync', {
      method: 'POST',
      headers: { Cookie: `anso_session=${Date.now() + 9999999}.forged-signature` },
      body: JSON.stringify({ profiles: [] }),
    });
    expect(res.status).toBe(401);
  });
});

/** Sign a token exactly the way the server does, for expiry tests. */
function signedToken(expires, payloadPrefix = 'idle.') {
  const key = createHmac('sha256', 'anso.session.v1').update(PASSWORD).digest();
  const sig = createHmac('sha256', key).update(payloadPrefix + expires).digest('base64url');
  return `${expires}.${sig}`;
}

describe('idle timeout', () => {
  it('issues sessions that expire after the idle window, not after months', async () => {
    const { cookie } = await login();
    const raw = (await fetch(BASE + '/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ password: PASSWORD }).toString(),
      redirect: 'manual',
    })).headers.get('set-cookie');
    expect(raw).toContain('Max-Age=3600');

    // The token's own expiry is about an hour out, give or take slack.
    const expires = Number(cookie.split('=')[1].split('.')[0]);
    const hourFromNow = Date.now() + 3600_000;
    expect(Math.abs(expires - hourFromNow)).toBeLessThan(60_000);
  });

  it('slides the window: every authenticated request refreshes the cookie', async () => {
    const { cookie } = await login();

    const page = await fetch(BASE + '/', { headers: { Cookie: cookie } });
    expect(page.headers.get('set-cookie')).toContain('anso_session=');

    const sync = await fetch(BASE + '/api/sync', {
      method: 'POST',
      headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify({ version: 1, profiles: [], deletedProfileIds: [] }),
    });
    expect(sync.headers.get('set-cookie')).toContain('anso_session=');
  });

  it('answers the activity keepalive with a refreshed session', async () => {
    const { cookie } = await login();
    const res = await fetch(BASE + '/api/ping', { method: 'POST', headers: { Cookie: cookie } });
    expect(res.status).toBe(204);
    expect(res.headers.get('set-cookie')).toContain('anso_session=');
  });

  it('refuses the keepalive without a session', async () => {
    const res = await fetch(BASE + '/api/ping', { method: 'POST' });
    expect(res.status).toBe(401);
  });

  it('rejects a correctly-signed token whose idle window has passed', async () => {
    const stale = signedToken(Date.now() - 1000);
    const res = await fetch(BASE + '/', {
      headers: { Cookie: `anso_session=${stale}` },
      redirect: 'manual',
    });
    expect(res.status).toBe(401);
  });

  it('rejects cookies from the old long-lease format outright', async () => {
    // Old tokens signed the bare expiry with no version prefix. Even with
    // months of validity left they must fail, so the idle rule starts now.
    const oldFormat = signedToken(Date.now() + 90 * 86400000, '');
    const res = await fetch(BASE + '/', {
      headers: { Cookie: `anso_session=${oldFormat}` },
      redirect: 'manual',
    });
    expect(res.status).toBe(401);
  });

  it('genuinely locks after the idle window on a live server', async () => {
    // A second server whose whole idle window is 1.2 seconds.
    const port = PORT + 1;
    const dir = await mkdtemp(join(tmpdir(), 'anso-idle-'));
    const proc = spawn(process.execPath, ['server.mjs'], {
      cwd: fileURLToPath(new URL('..', import.meta.url)),
      env: {
        ...process.env,
        AUTH_PASSWORD: PASSWORD,
        DATA_DIR: dir,
        PORT: String(port),
        HOST: '127.0.0.1',
        IDLE_MINUTES: '0.02',
      },
      stdio: 'ignore',
    });
    try {
      const base = `http://127.0.0.1:${port}`;
      for (let i = 0; i < 50; i++) {
        try {
          await fetch(base + '/', { redirect: 'manual' });
          break;
        } catch {
          await new Promise((r) => setTimeout(r, 100));
        }
      }

      const loginRes = await fetch(base + '/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ password: PASSWORD }).toString(),
        redirect: 'manual',
      });
      const cookie = (loginRes.headers.get('set-cookie') ?? '').split(';')[0];

      // Fresh session works.
      const alive = await fetch(base + '/api/ping', { method: 'POST', headers: { Cookie: cookie } });
      expect(alive.status).toBe(204);

      // After sitting idle past the window, the same cookie is refused.
      await new Promise((r) => setTimeout(r, 1500));
      const stale = await fetch(base + '/api/ping', { method: 'POST', headers: { Cookie: cookie } });
      expect(stale.status).toBe(401);
    } finally {
      proc.kill();
      await new Promise((r) => setTimeout(r, 200));
      await rm(dir, { recursive: true, force: true }).catch(() => {});
    }
  }, 20000);
});

describe('/api/sync', () => {
  it('requires a session', async () => {
    const res = await fetch(BASE + '/api/sync', {
      method: 'POST',
      body: JSON.stringify({ profiles: [] }),
    });
    expect(res.status).toBe(401);
  });

  it('rejects malformed payloads', async () => {
    const { cookie } = await login();
    const res = await fetch(BASE + '/api/sync', {
      method: 'POST',
      headers: { Cookie: cookie },
      body: 'not json at all',
    });
    expect(res.status).toBe(400);
  });

  it('stores a profile and reports the server version', async () => {
    const { cookie } = await login();
    const res = await fetch(BASE + '/api/sync', {
      method: 'POST',
      headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: 1,
        profiles: [
          {
            id: 'dev_a', name: 'Testa', grade: 3, avatar: 0, stardust: 100,
            progress: { s1: { completions: 1, bestScore: 5, lastPlayed: 10 } },
            reviewQueue: [], createdAt: 1, updatedAt: 1,
          },
        ],
        deletedProfileIds: [],
      }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.profiles.length).toBe(1);
    expect(body.profiles[0].name).toBe('Testa');
    expect(typeof body.version).toBe('string');
  });

  it('merges a second device instead of overwriting the first', async () => {
    const { cookie } = await login();
    const res = await fetch(BASE + '/api/sync', {
      method: 'POST',
      headers: { Cookie: cookie, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        version: 1,
        profiles: [
          {
            id: 'dev_b', name: 'Testa', grade: 3, avatar: 0, stardust: 50,
            progress: { s2: { completions: 1, bestScore: 6, lastPlayed: 20 } },
            reviewQueue: [], createdAt: 2, updatedAt: 2,
          },
        ],
        deletedProfileIds: [],
      }),
    });
    const body = await res.json();
    // Same child (name+grade) from two device ids becomes one profile with
    // both devices' progress and the higher balance.
    expect(body.profiles.length).toBe(1);
    expect(body.profiles[0].stardust).toBe(100);
    expect(Object.keys(body.profiles[0].progress).sort()).toEqual(['s1', 's2']);
  });
});
