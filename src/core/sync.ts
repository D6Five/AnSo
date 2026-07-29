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
import { applyRemoteProfiles, getSave, subscribeToSave } from './store';

export type SyncStatus = 'off' | 'syncing' | 'synced' | 'offline' | 'error';

interface SyncState {
  status: SyncStatus;
  lastSyncedAt: number | null;
}

let state: SyncState = { status: 'off', lastSyncedAt: null };
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
}

/** True while we are writing server data into the store, to break the loop. */
let applying = false;
let inFlight = false;
let pendingWhileInFlight = false;
let timer: number | null = null;

/** Only profile data crosses the wire; volume and mic settings stay per-device. */
function payloadFrom(save: SaveData) {
  return {
    version: 1 as const,
    profiles: save.profiles,
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
