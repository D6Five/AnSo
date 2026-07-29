/**
 * Static file server for the production build.
 *
 * Written against Node's built-in http/fs so deploying adds no dependencies —
 * the app itself has none beyond React, and there is no reason for hosting it
 * to change that. Railway sets PORT; everything else has a sensible default.
 */

import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { extname, join, normalize, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('./dist', import.meta.url)));
const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || '0.0.0.0';

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
  '.map': 'application/json; charset=utf-8',
};

/**
 * Resolve a URL path to a file inside ROOT, or null if it escapes.
 * Path traversal is the one real risk in a static server, so this is the only
 * place a request is allowed to become a filesystem path.
 */
function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
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
      const indexInfo = await stat(index);
      if (indexInfo.isFile()) return index;
    }
  } catch {
    /* falls through to the SPA fallback below */
  }
  return null;
}

function cacheHeaderFor(file) {
  // Vite fingerprints filenames in assets/, so those are safe to cache hard.
  // index.html must never be cached or a deploy would not reach the browser.
  if (file.includes(`${sep}assets${sep}`)) return 'public, max-age=31536000, immutable';
  return 'no-cache';
}

const server = createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { Allow: 'GET, HEAD' });
    res.end('Method not allowed');
    return;
  }

  const requested = await findFile(req.url || '/');
  // Any unknown path serves the app shell, so refreshing a deep link works.
  const file = requested ?? join(ROOT, 'index.html');

  try {
    await stat(file);
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Build output missing. Run "npm run build" before starting.');
    return;
  }

  // The fallback is the app shell, not an error page, so it is a 200 either way.
  res.writeHead(200, {
    'Content-Type': MIME[extname(file).toLowerCase()] ?? 'application/octet-stream',
    'Cache-Control': cacheHeaderFor(file),
    'X-Content-Type-Options': 'nosniff',
  });

  if (req.method === 'HEAD') {
    res.end();
    return;
  }

  createReadStream(file)
    .on('error', () => {
      res.end();
    })
    .pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`AnSo is serving ${ROOT} on http://${HOST}:${PORT}`);
});
