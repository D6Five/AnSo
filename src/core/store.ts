/**
 * Profile and progress persistence.
 *
 * localStorage is the source of truth for this device and always works, server
 * or not. When the app is hosted, `sync.ts` mirrors profiles to the server so
 * progress follows each child between devices and survives a cleared cache.
 * Volume, microphone and which child is selected stay local — those describe
 * the device, not the child.
 */

import { useSyncExternalStore } from 'react';
import type { Grade, Profile, SaveData, StarProgress } from '../types';
import {
  REWARD_BY_ID,
  SHOP_BY_ID,
  accessorySlot,
  rewardsEarned,
  type Reward,
} from '../content/rewards';

const STORAGE_KEY = 'anso.save.v1';

const DEFAULT_SAVE: SaveData = {
  version: 1,
  profiles: [],
  activeProfileId: null,
  settings: {
    volume: 0.7,
    voiceEnabled: true,
    micEnabled: true,
    musicEnabled: true,
    musicVolume: 0.35,
    voiceName: null,
  },
  deletedProfileIds: [],
};

/** Drawn from the same family as the constellation palette so a profile card
 *  sits alongside the map without clashing with it. */
export const AVATARS = [
  { name: 'Comet', color: '#f9b6ce', deep: '#ee87af' },
  { name: 'Nova', color: '#8fe0f0', deep: '#4fbfd9' },
  { name: 'Luna', color: '#c7b4f6', deep: '#a68deb' },
  { name: 'Sol', color: '#fbd98f', deep: '#f3bc5c' },
  { name: 'Iris', color: '#9ee6c4', deep: '#63d6a2' },
  { name: 'Vega', color: '#f9c4a1', deep: '#efa271' },
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
      deletedProfileIds: parsed.deletedProfileIds ?? [],
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

/** Current save, for non-React callers such as the sync layer. */
export function getSave(): SaveData {
  return state;
}

/** Subscribe to any save change. Returns an unsubscribe function. */
export function subscribeToSave(fn: () => void): () => void {
  return subscribe(fn);
}

/**
 * Replace the local profile list with the server's merged version.
 *
 * Settings and the selected child are deliberately preserved: they belong to
 * this device. The selected child is re-matched by name and grade because the
 * merge may have settled on a different canonical id for the same girl, and
 * dropping her back to the profile picker mid-session would be baffling.
 */
export function applyRemoteProfiles(profiles: Profile[], deletedProfileIds: string[]): void {
  const previous = state.profiles.find((p) => p.id === state.activeProfileId);

  let activeProfileId: string | null = null;
  if (previous) {
    const sameId = profiles.find((p) => p.id === previous.id);
    const sameChild = profiles.find(
      (p) =>
        p.name.trim().toLowerCase() === previous.name.trim().toLowerCase() &&
        p.grade === previous.grade,
    );
    activeProfileId = (sameId ?? sameChild)?.id ?? null;
  }

  commit({ ...state, profiles, deletedProfileIds, activeProfileId });
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
    micEnabled: true,
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
    // Record a tombstone, or the next device to sync would merge this profile
    // straight back in — it has no way to tell a deletion from a device that
    // simply has not seen the profile yet.
    deletedProfileIds: [...new Set([...(state.deletedProfileIds ?? []), id])],
    activeProfileId: state.activeProfileId === id ? null : state.activeProfileId,
  });
}

/**
 * Apply a change to one profile and stamp it.
 *
 * Every mutation must go through here. A profile edited without bumping
 * `updatedAt` looks stale to the sync merge and gets overwritten by whatever
 * the server already had.
 */
function updateProfile(profileId: string, mutate: (p: Profile) => Profile): void {
  commit({
    ...state,
    profiles: state.profiles.map((p) =>
      p.id === profileId ? { ...mutate(p), updatedAt: Date.now() } : p,
    ),
  });
}

function updateActive(mutate: (p: Profile) => Profile): void {
  const { activeProfileId } = state;
  if (!activeProfileId) return;
  updateProfile(activeProfileId, mutate);
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

/* ------------------------------------------------------------------ */
/* Princess and treasures                                              */
/* ------------------------------------------------------------------ */

/** Distinct stars finished. This alone determines the size of her collection. */
export function starsCompleted(profile: Profile | null): number {
  if (!profile) return 0;
  return Object.values(profile.progress).filter((p) => p.completions > 0).length;
}

/** Everything this princess owns: earned through stars, plus anything bought. */
export function earnedRewards(profile: Profile | null): Reward[] {
  const earned = rewardsEarned(starsCompleted(profile));
  const bought = (profile?.purchased ?? [])
    .map((id) => REWARD_BY_ID[id])
    .filter((r): r is Reward => !!r);
  return [...earned, ...bought];
}

/**
 * Spend stardust on a shop item. Returns false when it is already owned or
 * unaffordable, so the caller never has to re-check the balance itself.
 */
export function buyItem(profileId: string, itemId: string): boolean {
  const item = SHOP_BY_ID[itemId];
  const profile = state.profiles.find((p) => p.id === profileId);
  if (!item || !profile) return false;
  if ((profile.purchased ?? []).includes(itemId)) return false;
  if (profile.stardust < item.price) return false;

  updateProfile(profileId, (p) => ({
    ...p,
    stardust: p.stardust - item.price,
    purchased: [...(p.purchased ?? []), itemId],
  }));
  return true;
}

export function setPrincess(profileId: string, princess: string): void {
  updateProfile(profileId, (p) => ({ ...p, princess }));
}

export function equipDress(profileId: string, dressId: string): void {
  updateProfile(profileId, (p) => ({ ...p, equippedDress: dressId }));
}

/**
 * Accessories toggle rather than replace, so a princess can wear a crown and a
 * necklace at once — but only one per slot, or a crown would sit inside a
 * flower crown.
 */
export function toggleAccessory(profileId: string, accessoryId: string, slotKey: string): void {
  updateProfile(profileId, (p) => {
    const worn = p.equippedAccessories ?? [];
    if (worn.includes(accessoryId)) {
      return { ...p, equippedAccessories: worn.filter((a) => a !== accessoryId) };
    }
    const withoutSameSlot = worn.filter((id) => {
      const other = REWARD_BY_ID[id];
      return !(other && other.kind === 'accessory' && accessorySlot(other.type) === slotKey);
    });
    return { ...p, equippedAccessories: [...withoutSameSlot, accessoryId] };
  });
}

/** Turn spoken answers on or off for one child. */
export function setProfileMic(profileId: string, enabled: boolean): void {
  commit({
    ...state,
    profiles: state.profiles.map((p) => (p.id === profileId ? { ...p, micEnabled: enabled } : p)),
  });
}

/**
 * Whether this child may answer out loud. Profiles created before the setting
 * moved onto the profile have no value, so they inherit the old device-level
 * one rather than silently changing behaviour.
 */
export function micEnabledFor(profile: Profile | null): boolean {
  if (!profile) return false;
  return profile.micEnabled ?? state.settings.micEnabled;
}

/**
 * Wipe everything. Used by the grown-up settings panel.
 *
 * Every existing profile is tombstoned, otherwise the next sync would pull them
 * all back from the server and "erase everything" would quietly mean nothing.
 */
export function resetAll(): void {
  commit({
    ...DEFAULT_SAVE,
    deletedProfileIds: [
      ...new Set([...(state.deletedProfileIds ?? []), ...state.profiles.map((p) => p.id)]),
    ],
  });
}
