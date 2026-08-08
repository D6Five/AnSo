import { describe, it, expect } from 'vitest';
import { mergeSaves } from '../save-store.mjs';

/**
 * The merge is what makes two devices safe to use in the same week. Every rule
 * here was designed against a specific data-loss bug, so every rule gets a
 * test that would fail if it regressed.
 */

function profile(overrides = {}) {
  return {
    id: 'p1',
    name: 'Mia',
    grade: 3,
    avatar: 0,
    stardust: 0,
    progress: {},
    reviewQueue: [],
    createdAt: 100,
    updatedAt: 100,
    purchased: [],
    ...overrides,
  };
}

const save = (profiles, deletedProfileIds = []) => ({ version: 1, profiles, deletedProfileIds });

describe('mergeSaves', () => {
  it('takes the max of stardust so neither device loses earnings', () => {
    const merged = mergeSaves(
      save([profile({ stardust: 500 })]),
      save([profile({ stardust: 800 })]),
    );
    expect(merged.profiles[0].stardust).toBe(800);
  });

  it('unions purchases so nothing bought is ever refunded by a sync', () => {
    const merged = mergeSaves(
      save([profile({ purchased: ['s_flats'] })]),
      save([profile({ purchased: ['s_boots'] })]),
    );
    expect(merged.profiles[0].purchased).toEqual(['s_boots', 's_flats']);
  });

  it('merges star progress field by field, taking the best of each', () => {
    const merged = mergeSaves(
      save([profile({ progress: { star_a: { completions: 3, bestScore: 4, lastPlayed: 10 } } })]),
      save([profile({ progress: { star_a: { completions: 1, bestScore: 6, lastPlayed: 20 } } })]),
    );
    expect(merged.profiles[0].progress.star_a).toEqual({
      completions: 3,
      bestScore: 6,
      lastPlayed: 20,
    });
  });

  it('keeps stars that only one device has played', () => {
    const merged = mergeSaves(
      save([profile({ progress: { star_a: { completions: 1, bestScore: 5, lastPlayed: 1 } } })]),
      save([profile({ progress: { star_b: { completions: 1, bestScore: 6, lastPlayed: 2 } } })]),
    );
    expect(Object.keys(merged.profiles[0].progress).sort()).toEqual(['star_a', 'star_b']);
  });

  it('lets a tombstone win over a device that still has the profile', () => {
    const merged = mergeSaves(
      save([profile()], ['p1']),
      save([profile({ stardust: 9999 })]),
    );
    expect(merged.profiles).toEqual([]);
    expect(merged.deletedProfileIds).toContain('p1');
  });

  it('stitches the same child created independently on two devices', () => {
    const merged = mergeSaves(
      save([profile({ id: 'laptop_1', createdAt: 100, stardust: 300 })]),
      save([profile({ id: 'tablet_9', createdAt: 200, stardust: 500 })]),
    );
    expect(merged.profiles.length).toBe(1);
    // The older id becomes canonical so the choice is stable.
    expect(merged.profiles[0].id).toBe('laptop_1');
    expect(merged.profiles[0].stardust).toBe(500);
  });

  it('does not stitch different children who share a name but not a grade', () => {
    const merged = mergeSaves(
      save([profile({ id: 'a', name: 'Alex', grade: 1 })]),
      save([profile({ id: 'b', name: 'Alex', grade: 3 })]),
    );
    expect(merged.profiles.length).toBe(2);
  });

  it('lets the most recently edited copy win single-value fields like the outfit', () => {
    const merged = mergeSaves(
      save([profile({ equippedDress: 'old_dress', updatedAt: 100 })]),
      save([profile({ equippedDress: 'new_dress', updatedAt: 200 })]),
    );
    expect(merged.profiles[0].equippedDress).toBe('new_dress');
  });

  it('is symmetric: the merged profiles are identical whichever side syncs first', () => {
    const a = save([
      profile({ stardust: 300, purchased: ['s_flats'], progress: { s1: { completions: 2, bestScore: 5, lastPlayed: 9 } } }),
    ]);
    const b = save([
      profile({ stardust: 700, purchased: ['s_boots'], progress: { s1: { completions: 1, bestScore: 6, lastPlayed: 4 }, s2: { completions: 1, bestScore: 3, lastPlayed: 2 } } }),
    ]);
    const ab = mergeSaves(a, b);
    const ba = mergeSaves(b, a);
    expect(ab.profiles).toEqual(ba.profiles);
    expect(ab.deletedProfileIds).toEqual(ba.deletedProfileIds);
  });

  it('survives malformed junk in a profile list', () => {
    const merged = mergeSaves(
      save([null, undefined, { noId: true }, profile()]),
      save([]),
    );
    expect(merged.profiles.length).toBe(1);
  });
});
