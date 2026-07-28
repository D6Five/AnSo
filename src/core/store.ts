/**
 * Profile and progress persistence.
 *
 * Everything lives in localStorage on the family's own machine — no accounts,
 * no server, no child data leaving the device. The store is a tiny external
 * store read through `useSyncExternalStore`.
 */

import { useSyncExternalStore } from 'react';
import type { Grade, Profile, SaveData, StarProgress } from '../types';

const STORAGE_KEY = 'anso.save.v1';

const DEFAULT_SAVE: SaveData = {
  version: 1,
  profiles: [],
  activeProfileId: null,
  settings: { volume: 0.7, voiceEnabled: true, micEnabled: true },
};

export const AVATARS = [
  { name: 'Comet', color: '#ff9ecd', accent: '#fff0f7' },
  { name: 'Nova', color: '#8be9fd', accent: '#e8fbff' },
  { name: 'Luna', color: '#c9a7ff', accent: '#f3ecff' },
  { name: 'Sol', color: '#ffd479', accent: '#fff8e6' },
  { name: 'Iris', color: '#7ee7b4', accent: '#e9fff5' },
  { name: 'Vega', color: '#ffa8a8', accent: '#fff0f0' },
] as const;

let state: SaveData = load();
const listeners = new Set<() => void>();

function load(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SAVE };
    const parsed = JSON.parse(raw) as SaveData;
    if (parsed.version !== 1) return { ...DEFAULT_SAVE };
    return {
      ...DEFAULT_SAVE,
      ...parsed,
      settings: { ...DEFAULT_SAVE.settings, ...parsed.settings },
    };
  } catch {
    // A corrupt save must never brick the app for a child.
    return { ...DEFAULT_SAVE };
  }
}

function persist(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked — the session still works, it just won't survive reload */
  }
}

function commit(next: SaveData): void {
  state = next;
  persist();
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function snapshot(): SaveData {
  return state;
}

export function useSave(): SaveData {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

export function useActiveProfile(): Profile | null {
  const save = useSave();
  return save.profiles.find((p) => p.id === save.activeProfileId) ?? null;
}

/* ------------------------------------------------------------------ */
/* Actions                                                             */
/* ------------------------------------------------------------------ */

export function createProfile(name: string, grade: Grade, avatar: number): Profile {
  const profile: Profile = {
    id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
    name: name.trim() || 'Explorer',
    grade,
    avatar: avatar % AVATARS.length,
    stardust: 0,
    progress: {},
    reviewQueue: [],
    createdAt: Date.now(),
  };
  commit({
    ...state,
    profiles: [...state.profiles, profile],
    activeProfileId: profile.id,
  });
  return profile;
}

export function selectProfile(id: string | null): void {
  commit({ ...state, activeProfileId: id });
}

export function deleteProfile(id: string): void {
  const profiles = state.profiles.filter((p) => p.id !== id);
  commit({
    ...state,
    profiles,
    activeProfileId: state.activeProfileId === id ? null : state.activeProfileId,
  });
}

function updateActive(mutate: (p: Profile) => Profile): void {
  const { activeProfileId } = state;
  if (!activeProfileId) return;
  commit({
    ...state,
    profiles: state.profiles.map((p) => (p.id === activeProfileId ? mutate(p) : p)),
  });
}

/**
 * Record the result of a finished star. Stardust is awarded on every play so
 * that replaying a star still feels worthwhile, but the bonus for a new
 * personal best is bigger.
 */
export function completeStar(starId: string, score: number, total: number): number {
  let awarded = 0;
  updateActive((p) => {
    const prior: StarProgress = p.progress[starId] ?? {
      completions: 0,
      bestScore: 0,
      lastPlayed: 0,
    };
    const isFirst = prior.completions === 0;
    const isBest = score > prior.bestScore;

    awarded = score * 10 + (isFirst ? 50 : 0) + (isBest && !isFirst ? 20 : 0);
    if (score === total) awarded += 25;

    return {
      ...p,
      stardust: p.stardust + awarded,
      progress: {
        ...p.progress,
        [starId]: {
          completions: prior.completions + 1,
          bestScore: Math.max(prior.bestScore, score),
          lastPlayed: Date.now(),
        },
      },
    };
  });
  return awarded;
}

/** Queue a word the child missed so it can resurface in a later star. */
export function addReviewWord(word: string): void {
  updateActive((p) => {
    if (p.reviewQueue.includes(word)) return p;
    // Keep the queue small so review sessions stay short.
    return { ...p, reviewQueue: [...p.reviewQueue, word].slice(-40) };
  });
}

export function clearReviewWord(word: string): void {
  updateActive((p) => ({ ...p, reviewQueue: p.reviewQueue.filter((w) => w !== word) }));
}

export function updateSettings(patch: Partial<SaveData['settings']>): void {
  commit({ ...state, settings: { ...state.settings, ...patch } });
}

/** Wipe everything. Used by the grown-up settings panel. */
export function resetAll(): void {
  commit({ ...DEFAULT_SAVE });
}
