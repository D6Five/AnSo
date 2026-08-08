// @vitest-environment jsdom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

/**
 * The idle guard decides when a left-open tab goes back to the password page,
 * and when an actively-used one keeps its session alive. Time is faked so an
 * hour of idling costs nothing to test.
 */

type Idle = typeof import('./idle');

async function freshIdle(): Promise<Idle> {
  vi.resetModules();
  return import('./idle');
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('fetch', vi.fn(() => Promise.resolve(new Response(null, { status: 204 }))));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

const HOUR = 60 * 60 * 1000;

describe('idle guard', () => {
  it('logs an untouched tab out after the idle limit', async () => {
    const { initIdleGuard } = await freshIdle();
    const onIdle = vi.fn();
    initIdleGuard({ onIdle });

    vi.advanceTimersByTime(HOUR - 60_000);
    expect(onIdle).not.toHaveBeenCalled();

    vi.advanceTimersByTime(2 * 60_000);
    expect(onIdle).toHaveBeenCalled();
  });

  it('never logs out while the child keeps playing', async () => {
    const { initIdleGuard } = await freshIdle();
    const onIdle = vi.fn();
    initIdleGuard({ onIdle });

    // Ninety minutes of tapping every ten minutes: longer than the idle
    // limit in total, but never idle for more than ten minutes at a stretch.
    for (let i = 0; i < 9; i++) {
      vi.advanceTimersByTime(10 * 60_000);
      window.dispatchEvent(new Event('pointerdown'));
    }
    expect(onIdle).not.toHaveBeenCalled();

    // Then she walks away, and the hour runs out.
    vi.advanceTimersByTime(HOUR + 60_000);
    expect(onIdle).toHaveBeenCalled();
  });

  it('keeps the server session fresh during activity, at most once per interval', async () => {
    const { initIdleGuard } = await freshIdle();
    initIdleGuard({ onIdle: vi.fn() });

    // Page load pings once so the cookie starts sliding immediately.
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(fetch).mock.calls[0][0]).toBe('/api/ping');

    // A burst of taps within the keepalive window adds no extra pings.
    window.dispatchEvent(new Event('pointerdown'));
    window.dispatchEvent(new Event('keydown'));
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(1);

    // Activity after the window has passed pings again.
    vi.advanceTimersByTime(6 * 60_000);
    window.dispatchEvent(new Event('keydown'));
    expect(vi.mocked(fetch)).toHaveBeenCalledTimes(2);
  });

  it('treats keyboard input as activity, not only taps', async () => {
    const { initIdleGuard } = await freshIdle();
    const onIdle = vi.fn();
    initIdleGuard({ onIdle });

    vi.advanceTimersByTime(50 * 60_000);
    window.dispatchEvent(new Event('keydown')); // typing a verse, say
    vi.advanceTimersByTime(50 * 60_000);
    expect(onIdle).not.toHaveBeenCalled();
  });
});
