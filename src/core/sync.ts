/**
 * Keeps this device's progress in step with the server.
 *
 * The exchange is deliberately one-way-shaped: this device sends what it has,
 * the server merges it with every other device's copy, and this device adopts
 * the answer. All the conflict resolution lives on the server so there is only
 * one implementation of it.
 *
 * Sync is strictly an enhancement. With no server — running `npm run dev`, or
 * simply offline — every call fails quietly and the app carries on against
 * localStorage exactly as before. Nothing here is allowed to block a child.
 */

import { useSyncExternalStore } from 'react';
import type { Profile, SaveData } from '../types';
import { applyRemoteProfiles, getSave, isSeedProfile, subscribeToSave } from './store';

export type SyncStatus = 'off' | 'syncing' | 'synced' | 'offline' | 'error';

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
  /**
   * True once the first sync attempt has finished, whatever the outcome.
   *
   * The UI needs to distinguish "we do not know yet whether this device has
   * profiles" from "we asked and there are none". Without this the profile
   * picker waits on a condition that never becomes false when there is no
   * server, and a new explorer can never be created at all.
   */
  settled: boolean;
  /**
   * True when the server is running a different version of the app.
   * A gentle reload prompt can be shown after the current activity finishes.
   */
  updateAvailable: boolean;
}

let state: SyncState = { status: 'off', lastSyncedAt: null, settled: false, updateAvailable: false };
let serverVersion: string | null = null;
const listeners = new Set<() => void>();

function setState(next: Partial<SyncState>): void {
  state = { ...state, ...next };
  listeners.forEach((fn) => fn());
}

export function useSyncStatus(): SyncState {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    () => state,
    () => state,
  );
}

/* ------------------------------------------------------------------ */
/* Transport                                                           */
/* ------------------------------------------------------------------ */

interface SyncResponse {
  profiles: Profile[];
  deletedProfileIds?: string[];
  version?: string;
}

/** True while we are writing server data into the store, to break the loop. */
let applying = false;
let inFlight = false;
let pendingWhileInFlight = false;
let timer: number | null = null;

/**
 * Only profile data crosses the wire; volume and mic settings stay per-device.
 *
 * The built-in test explorers are excluded entirely. They exist on every device
 * already, and syncing them would fight their reset behaviour — stardust merges
 * by max and purchases merge as a union, so the server would hand back the
 * spent balance and the bought items the moment they were reset. Keeping them
 * local also means test data never reaches the real save.
 */
function payloadFrom(save: SaveData) {
  return {
    version: 1 as const,
    profiles: save.profiles.filter((p) => !isSeedProfile(p.id)),
    deletedProfileIds: save.deletedProfileIds ?? [],
  };
}

async function push(): Promise<void> {
  if (inFlight) {
    pendingWhileInFlight = true;
    return;
  }
  inFlight = true;
  setState({ status: 'syncing' });

  try {
    const response = await fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify(payloadFrom(getSave())),
    });

    if (response.status === 404) {
      // No sync endpoint at all — running `npm run dev`, or opening the built
      // files directly. That is a normal way to use the app, not a failure, so
      // it reports as local-only rather than as something being broken.
      setState({ status: 'off' });
      return;
    }

    if (response.status === 401) {
      // The session expired. A reload lands on the login page, which is the
      // honest thing to do rather than silently dropping progress.
      setState({ status: 'error' });
      return;
    }

    if (!response.ok) {
      setState({ status: 'error' });
      return;
    }

    const merged = (await response.json()) as SyncResponse;
    if (!Array.isArray(merged.profiles)) {
      setState({ status: 'error' });
      return;
    }

    // Detect when the server is running a new version of the app.
    const newVersion = merged.version;
    if (newVersion && serverVersion !== newVersion) {
      serverVersion = newVersion;
      setState({ updateAvailable: true });
    }

    applying = true;
    try {
      applyRemoteProfiles(merged.profiles, merged.deletedProfileIds ?? []);
    } finally {
      applying = false;
    }

    setState({ status: 'synced', lastSyncedAt: Date.now() });
  } catch {
    // Network failure, or no server at all in dev. Local storage still holds
    // everything, so this is not an error the child should ever see.
    setState({ status: 'offline' });
  } finally {
    inFlight = false;
    // Every path through this function is a completed attempt, including the
    // failures — so the UI is never left waiting on an answer that will not come.
    setState({ settled: true });
    if (pendingWhileInFlight) {
      pendingWhileInFlight = false;
      schedule(300);
    }
  }
}

function schedule(delayMs = 1500): void {
  if (timer !== null) window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    timer = null;
    void push();
  }, delayMs);
}

/* ------------------------------------------------------------------ */
/* Lifecycle                                                           */
/* ------------------------------------------------------------------ */

let started = false;

/**
 * Start syncing. Safe to call once at app startup; later calls do nothing.
 */
export function initSync(): void {
  if (started) return;
  started = true;

  // Pull straight away so a device picks up progress made elsewhere before the
  // child starts playing.
  void push();

  // Belt and braces: if the request somehow never settles — a proxy holding the
  // connection open, say — the app must still become usable.
  window.setTimeout(() => setState({ settled: true }), 4000);

  subscribeToSave(() => {
    // Ignore the store change we just caused ourselves.
    if (applying) return;
    schedule();
  });

  // A star finished just as the tab closes would otherwise be lost. This is
  // best-effort by nature; the next load syncs it anyway.
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && !inFlight) {
      void push();
    }
  });

  window.addEventListener('online', () => schedule(200));
}

/** Force an immediate sync. Used by the settings panel. */
export function syncNow(): void {
  schedule(0);
}

/** Clear the update available flag and reload the page. */
export function applyUpdate(): void {
  setState({ updateAvailable: false });
  window.location.reload();
}
