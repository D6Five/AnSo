/**
 * Idle watch: after an hour with no real activity, the app returns to the
 * password page.
 *
 * The server enforces this on its own — the session cookie expires an hour
 * after the last request — but the app runs happily against localStorage with
 * no network at all, so an abandoned open tab would otherwise keep working
 * without a session. This watcher supplies the visible half of the rule: it
 * tracks genuine input, keeps the server session fresh while the child is
 * playing (a long lesson may make no sync requests at all), and reloads an
 * idle tab — which, with the cookie expired, lands on the login page.
 *
 * Reloading loses nothing: progress lives in localStorage and syncs after the
 * next login.
 */

/** How long a tab may sit untouched. Matches the server's IDLE_MINUTES default. */
const IDLE_MS = 60 * 60 * 1000;
/** While active, nudge the server this often so the cookie window slides. */
const KEEPALIVE_MS = 5 * 60 * 1000;
/** How often to look at the clock. Also catches waking from a long sleep. */
const CHECK_MS = 30 * 1000;

const ACTIVITY_EVENTS = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const;

let started = false;
let lastActivity = 0;
let lastPing = 0;

function keepAlive(): void {
  // Fire-and-forget: in dev there is no server and this 404s quietly.
  void fetch('/api/ping', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
}

export interface IdleGuardOptions {
  idleMs?: number;
  keepaliveMs?: number;
  checkMs?: number;
  /** What to do when the idle limit is reached. Defaults to a full reload. */
  onIdle?: () => void;
}

/** Start watching. Safe to call once at app startup; later calls do nothing. */
export function initIdleGuard(opts: IdleGuardOptions = {}): void {
  if (started) return;
  started = true;

  const idleMs = opts.idleMs ?? IDLE_MS;
  const keepaliveMs = opts.keepaliveMs ?? KEEPALIVE_MS;
  const checkMs = opts.checkMs ?? CHECK_MS;
  const onIdle = opts.onIdle ?? (() => window.location.reload());

  const bump = () => {
    lastActivity = Date.now();
    if (Date.now() - lastPing >= keepaliveMs) {
      lastPing = Date.now();
      keepAlive();
    }
  };

  for (const event of ACTIVITY_EVENTS) {
    window.addEventListener(event, bump, { passive: true });
  }

  // Loading the page counts as activity and slides the server session too.
  bump();

  window.setInterval(() => {
    if (Date.now() - lastActivity >= idleMs) onIdle();
  }, checkMs);
}
