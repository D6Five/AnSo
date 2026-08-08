/**
 * Static file server with a password gate.
 *
 * Written against Node's built-ins so deploying adds no dependencies. The gate
 * exists because this is a family app on a public URL: without a valid session
 * cookie nothing is served at all — not the HTML, not the JavaScript, not a
 * single asset. There is no unauthenticated surface beyond the login page.
 *
 * Configuration (Railway → Variables):
 *   AUTH_PASSWORD   required. The shared password. The server refuses to start
 *                   without it, so the app cannot accidentally become public.
 *   IDLE_MINUTES    optional, default 60. How long a signed-in device may sit
 *                   idle before the password is required again. The window
 *                   slides: every authenticated request (and the client's
 *                   activity keepalive) pushes it forward.
 */

import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { readSave, saveFilePath, syncSave } from './save-store.mjs';

const ROOT = resolve(fileURLToPath(new URL('./dist', import.meta.url)));
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';
const PASSWORD = process.env.AUTH_PASSWORD ?? '';
const IDLE_MINUTES = Number(process.env.IDLE_MINUTES) || 60;
const IDLE_MS = IDLE_MINUTES * 60000;
const COOKIE = 'anso_session';
const SERVER_VERSION = Date.now().toString(36);

// Fail closed. A missing password must never mean "serve it to everyone".
if (!PASSWORD) {
  console.error(
    '\nRefusing to start: AUTH_PASSWORD is not set.\n' +
      'Set it in Railway under Variables, or locally with:\n' +
      '  $env:AUTH_PASSWORD="your-password"; npm start\n',
  );
  process.exit(1);
}

if (PASSWORD.length < 8) {
  console.error('\nRefusing to start: AUTH_PASSWORD must be at least 8 characters.\n');
  process.exit(1);
}

/**
 * Cookies are signed with a key derived from the password, so there is only one
 * variable to manage. Derivation is deterministic on purpose: a redeploy or a
 * restart must not sign every device out. Changing the password does invalidate
 * all existing sessions, which is exactly what changing it should mean.
 */
const SIGNING_KEY = createHmac('sha256', 'anso.session.v1').update(PASSWORD).digest();

/* ------------------------------------------------------------------ */
/* Sessions                                                            */
/* ------------------------------------------------------------------ */

function sign(value) {
  return createHmac('sha256', SIGNING_KEY).update(value).digest('base64url');
}

/**
 * Sessions are an idle window, not a long lease: the token carries its own
 * expiry one idle-window ahead, and every authenticated request re-issues it,
 * so the window slides while the app is in use and closes when it is not.
 *
 * The 'idle.' prefix in the signed payload versions the scheme — cookies from
 * the old 180-day format fail the signature check, so the idle rule applies
 * to every device immediately rather than after months of grandfathering.
 */
function issueSession() {
  const expires = Date.now() + IDLE_MS;
  return `${expires}.${sign('idle.' + expires)}`;
}

function sessionCookieHeader() {
  return [
    `${COOKIE}=${issueSession()}`,
    'Path=/',
    'HttpOnly',
    'Secure',
    'SameSite=Strict',
    `Max-Age=${Math.ceil(IDLE_MS / 1000)}`,
  ].join('; ');
}

function isValidSession(token) {
  if (!token) return false;
  const dot = token.lastIndexOf('.');
  if (dot < 1) return false;

  const expires = token.slice(0, dot);
  const provided = token.slice(dot + 1);
  if (!/^\d+$/.test(expires)) return false;
  if (Number(expires) < Date.now()) return false;

  const expected = sign('idle.' + expires);
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Constant-time password check, so timing cannot reveal the password. */
function isCorrectPassword(attempt) {
  const a = createHmac('sha256', SIGNING_KEY).update(String(attempt)).digest();
  const b = createHmac('sha256', SIGNING_KEY).update(PASSWORD).digest();
  return timingSafeEqual(a, b);
}

function readCookie(header, name) {
  if (!header) return null;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq === -1) continue;
    if (part.slice(0, eq).trim() === name) return decodeURIComponent(part.slice(eq + 1).trim());
  }
  return null;
}

/* ------------------------------------------------------------------ */
/* Brute-force throttling                                              */
/* ------------------------------------------------------------------ */

const attempts = new Map();
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 15 * 60 * 1000;

function clientIp(req) {
  // Railway terminates TLS upstream, so the real address is in the header.
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim();
  return req.socket.remoteAddress ?? 'unknown';
}

function isThrottled(ip) {
  const record = attempts.get(ip);
  if (!record) return false;
  if (Date.now() > record.resetAt) {
    attempts.delete(ip);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(ip) {
  const record = attempts.get(ip);
  if (!record || Date.now() > record.resetAt) {
    attempts.set(ip, { count: 1, resetAt: Date.now() + WINDOW_MS });
    return;
  }
  record.count += 1;
}

// Keep the throttle map from growing without bound on a long-lived process.
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of attempts) if (now > record.resetAt) attempts.delete(ip);
}, WINDOW_MS).unref();

/* ------------------------------------------------------------------ */
/* Login page                                                          */
/* ------------------------------------------------------------------ */

function loginPage(message = '') {
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AnSo</title>
<style>
  :root{color-scheme:dark}
  *{box-sizing:border-box}
  body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
    font-family:'Segoe UI',system-ui,sans-serif;color:#f3f0ff;
    background:radial-gradient(ellipse at 50% 0%,#0f0d2b 0%,#07061a 62%)}
  .card{width:min(400px,100%);background:rgba(24,21,60,.82);border:1px solid rgba(255,255,255,.12);
    border-radius:18px;padding:40px 34px;text-align:center;box-shadow:0 18px 50px rgba(0,0,0,.45)}
  .star{font-size:3rem;line-height:1;margin-bottom:8px}
  h1{margin:0 0 6px;font-size:1.5rem}
  p{margin:0 0 26px;color:#b8b2dd;font-size:.95rem}
  input{width:100%;font:inherit;font-size:1.05rem;color:#f3f0ff;background:rgba(0,0,0,.32);
    border:2px solid rgba(255,255,255,.12);border-radius:14px;padding:14px 18px;margin-bottom:14px}
  input:focus{outline:none;border-color:#8be9fd}
  button{width:100%;font:inherit;font-weight:700;font-size:1.05rem;color:#0b0a1f;cursor:pointer;
    background:linear-gradient(135deg,#8be9fd,#a78bfa);border:0;border-radius:999px;padding:15px}
  button:hover{filter:brightness(1.08)}
  .msg{margin:0 0 16px;color:#ff8fa3;font-size:.92rem}
</style></head>
<body>
  <form class="card" method="POST" action="/login">
    <div class="star">⭐</div>
    <h1>AnSo</h1>
    <p>A universe of learning</p>
    ${message ? `<p class="msg">${message}</p>` : ''}
    <input type="password" name="password" placeholder="Password" autocomplete="current-password"
           autofocus required aria-label="Password">
    <button type="submit">Enter</button>
  </form>
</body></html>`;
}

function sendHtml(res, status, html, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    ...headers,
  });
  res.end(html);
}

/* ------------------------------------------------------------------ */
/* Static files                                                        */
/* ------------------------------------------------------------------ */

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

/**
 * Resolve a URL path to a file inside ROOT, or null if it escapes.
 * Path traversal is the one real risk in a static server, so this is the only
 * place a request is allowed to become a filesystem path.
 */
function safePath(urlPath) {
  let decoded;
  try {
    decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  } catch {
    return null;
  }
  const candidate = resolve(join(ROOT, normalize(decoded)));
  if (candidate !== ROOT && !candidate.startsWith(ROOT + sep)) return null;
  return candidate;
}

async function findFile(pathname) {
  const target = safePath(pathname);
  if (!target) return null;
  try {
    const info = await stat(target);
    if (info.isFile()) return target;
    if (info.isDirectory()) {
      const index = join(target, 'index.html');
      if ((await stat(index)).isFile()) return index;
    }
  } catch {
    /* falls through to the app-shell fallback */
  }
  return null;
}

function cacheHeaderFor(file) {
  // Vite fingerprints filenames in assets/, so those are safe to cache hard.
  // index.html must never be cached or a deploy would not reach the browser.
  return file.includes(`${sep}assets${sep}`)
    ? 'private, max-age=31536000, immutable'
    : 'no-store';
}

/* ------------------------------------------------------------------ */
/* Request handling                                                    */
/* ------------------------------------------------------------------ */

function readBody(req, limit = 4096) {
  return new Promise((resolveBody) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > limit) {
        data = data.slice(0, limit);
        req.destroy();
      }
    });
    req.on('end', () => resolveBody(data));
    req.on('error', () => resolveBody(''));
  });
}

async function handleLogin(req, res) {
  const ip = clientIp(req);

  if (isThrottled(ip)) {
    sendHtml(res, 429, loginPage('Too many attempts. Wait 15 minutes and try again.'));
    return;
  }

  const body = await readBody(req);
  const submitted = new URLSearchParams(body).get('password') ?? '';

  if (!isCorrectPassword(submitted)) {
    recordFailure(ip);
    sendHtml(res, 401, loginPage('That password is not right.'));
    return;
  }

  attempts.delete(ip);

  // Secure is safe to always set: Railway serves HTTPS, and a cookie that
  // refuses to travel over plain HTTP is exactly the behaviour we want.
  res.writeHead(303, {
    Location: '/',
    'Set-Cookie': sessionCookieHeader(),
    'Cache-Control': 'no-store',
  });
  res.end();
}

function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...headers,
  });
  res.end(JSON.stringify(body));
}

/**
 * Merge a device's save into the shared one and hand back the result.
 *
 * A single endpoint rather than a GET and a PUT: the device sends what it has,
 * the server merges it with what everyone else has, and the device adopts the
 * answer. That keeps the merge in one place and makes the exchange atomic.
 */
async function handleSync(req, res) {
  const raw = await readBody(req, 512 * 1024);
  if (!raw) {
    sendJson(res, 400, { error: 'Empty request body' });
    return;
  }

  let incoming;
  try {
    incoming = JSON.parse(raw);
  } catch {
    sendJson(res, 400, { error: 'Malformed JSON' });
    return;
  }

  if (!incoming || typeof incoming !== 'object' || !Array.isArray(incoming.profiles)) {
    sendJson(res, 400, { error: 'Expected { profiles: [] }' });
    return;
  }

  try {
    const merged = await syncSave(incoming);
    // Syncing is activity, so it slides the idle window.
    sendJson(res, 200, { ...merged, version: SERVER_VERSION }, { 'Set-Cookie': sessionCookieHeader() });
  } catch (err) {
    // A failed sync must never break the app — the device keeps its local copy.
    console.error('Sync failed:', err.message);
    sendJson(res, 500, { error: 'Could not save' });
  }
}

const server = createServer(async (req, res) => {
  const url = req.url || '/';
  const path = url.split('?')[0];

  if (req.method === 'POST' && path === '/login') {
    await handleLogin(req, res);
    return;
  }

  const isSyncRequest = req.method === 'POST' && path === '/api/sync';
  const isPingRequest = req.method === 'POST' && path === '/api/ping';

  if (!isSyncRequest && !isPingRequest && req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD, POST' });
    res.end('Method not allowed');
    return;
  }

  // Nothing below this line is reachable without a valid session, the sync
  // endpoint very much included.
  if (!isValidSession(readCookie(req.headers.cookie, COOKIE))) {
    if (isSyncRequest || isPingRequest) {
      sendJson(res, 401, { error: 'Not signed in' });
      return;
    }
    sendHtml(res, 401, loginPage());
    return;
  }

  if (isSyncRequest) {
    await handleSync(req, res);
    return;
  }

  // The activity keepalive: the client calls this while a child is genuinely
  // using the app, so a long lesson with no sync traffic still keeps the
  // session alive — and an idle hour genuinely does not.
  if (isPingRequest) {
    res.writeHead(204, { 'Set-Cookie': sessionCookieHeader(), 'Cache-Control': 'no-store' });
    res.end();
    return;
  }

  const requested = await findFile(url);
  // Any unknown path serves the app shell, so refreshing a deep link works.
  const file = requested ?? join(ROOT, 'index.html');

  try {
    await stat(file);
  } catch {
    res.writeHead(500, {
      'Content-Type': 'text/plain; charset=utf-8',
      // Still an authenticated request, so it slides the idle window like
      // any other — and the session tests stay honest without a build.
      'Set-Cookie': sessionCookieHeader(),
    });
    res.end('Build output missing. Run "npm run build" before starting.');
    return;
  }

  res.writeHead(200, {
    'Content-Type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': cacheHeaderFor(file),
    // Every authenticated request slides the idle window forward.
    'Set-Cookie': sessionCookieHeader(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  createReadStream(file)
    .on('error', () => res.end())
    .pipe(res);
});

server.listen(PORT, HOST, async () => {
  console.log(`AnSo serving ${ROOT} on http://${HOST}:${PORT} (password gate active)`);

  const stored = await readSave();
  console.log(`Progress store: ${saveFilePath()} (${stored.profiles.length} profile(s))`);

  // Without a mounted volume the save file lives in the container filesystem
  // and is destroyed on every redeploy. That failure is silent and only shows
  // up as lost progress weeks later, so it is worth shouting about.
  if (!process.env.DATA_DIR) {
    console.warn(
      '\n  WARNING: DATA_DIR is not set, so progress is being written inside the\n' +
        '  container and WILL BE LOST on the next redeploy. In Railway, add a\n' +
        '  Volume mounted at /data and set DATA_DIR=/data.\n',
    );
  }
});
