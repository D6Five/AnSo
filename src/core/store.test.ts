// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from 'vitest';

/**
 * The store is module-singleton state backed by localStorage, so each test
 * gets a genuinely fresh module: reset the registry, clear storage, and
 * re-import. Importing after mutations (without clearing) also lets tests
 * prove that state survives a reload — which is the store's whole job.
 */

type Store = typeof import('./store');

async function freshStore(): Promise<Store> {
  vi.resetModules();
  return import('./store');
}

beforeEach(() => {
  localStorage.clear();
});

describe('first run and seed explorers', () => {
  it('ships with Mia and Zen on a brand-new device', async () => {
    const store = await freshStore();
    const save = store.getSave();
    const names = save.profiles.map((p) => p.name).sort();
    expect(names).toEqual(['Mia', 'Zen']);
    expect(save.profiles.find((p) => p.name === 'Mia')?.stardust).toBe(3500);
    expect(save.profiles.find((p) => p.name === 'Zen')?.stardust).toBe(2000);
  });

  it('does not resurrect a deleted seed explorer on reload', async () => {
    let store = await freshStore();
    const zen = store.getSave().profiles.find((p) => p.name === 'Zen')!;
    store.deleteProfile(zen.id);

    // Reload: same localStorage, fresh module.
    vi.resetModules();
    store = await import('./store');
    expect(store.getSave().profiles.find((p) => p.name === 'Zen')).toBeUndefined();
    expect(store.getSave().deletedProfileIds).toContain(zen.id);
  });
});

describe('completeStar stardust math', () => {
  async function playerStore(): Promise<Store> {
    const store = await freshStore();
    store.createProfile('Testa', 3, 0); // creating selects her automatically
    return store;
  }

  it('pays score×10 plus the first-time bonus', async () => {
    const store = await playerStore();
    const awarded = store.completeStar('g3_read_01', 5, 6);
    expect(awarded).toBe(5 * 10 + 50);
  });

  it('adds the perfect-score bonus on top', async () => {
    const store = await playerStore();
    expect(store.completeStar('g3_read_01', 6, 6)).toBe(60 + 50 + 25);
  });

  it('pays the best-score bonus on an improved replay, but not the first-time bonus', async () => {
    const store = await playerStore();
    store.completeStar('g3_read_01', 4, 6);
    expect(store.completeStar('g3_read_01', 6, 6)).toBe(60 + 20 + 25);
  });

  it('still pays base stardust on a worse replay', async () => {
    const store = await playerStore();
    store.completeStar('g3_read_01', 6, 6);
    expect(store.completeStar('g3_read_01', 3, 6)).toBe(30);
  });

  it('doubles everything when the exploration bonus applies', async () => {
    const store = await playerStore();
    expect(store.completeStar('g3_read_01', 6, 6, true)).toBe((60 + 50 + 25) * store.EXPLORATION_BONUS);
  });

  it('tracks completions and best score across plays', async () => {
    const store = await playerStore();
    store.completeStar('g3_read_01', 4, 6);
    store.completeStar('g3_read_01', 6, 6);
    store.completeStar('g3_read_01', 2, 6);
    const profile = store.getSave().profiles.find((p) => p.name === 'Testa')!;
    expect(profile.progress['g3_read_01'].completions).toBe(3);
    expect(profile.progress['g3_read_01'].bestScore).toBe(6);
  });

  it('persists progress across a reload', async () => {
    let store = await playerStore();
    store.completeStar('g3_read_01', 6, 6);

    vi.resetModules();
    store = await import('./store');
    const profile = store.getSave().profiles.find((p) => p.name === 'Testa')!;
    expect(profile.progress['g3_read_01'].completions).toBe(1);
  });
});

describe('the shop and spendable stardust', () => {
  it('spendable balance is earned minus purchases, never negative', async () => {
    const store = await freshStore();
    const mia = store.getSave().profiles.find((p) => p.name === 'Mia')!;
    store.selectProfile(mia.id);

    expect(store.spendableStardust(mia)).toBe(3500);
    expect(store.buyItem(mia.id, 's_flats')).toBe(true); // 350
    const after = store.getSave().profiles.find((p) => p.id === mia.id)!;
    expect(store.spendableStardust(after)).toBe(3150);
    // Lifetime earned total is untouched — spending is derived, not subtracted.
    expect(after.stardust).toBe(3500);
  });

  it('refuses a duplicate purchase and an unaffordable one', async () => {
    const store = await freshStore();
    const zen = store.getSave().profiles.find((p) => p.name === 'Zen')!;
    store.selectProfile(zen.id);

    expect(store.buyItem(zen.id, 's_flats')).toBe(true);
    expect(store.buyItem(zen.id, 's_flats')).toBe(false);

    // Zen has 2000 − 350 = 1650 spendable; drain it and confirm refusal.
    expect(store.buyItem(zen.id, 's_gold_heels')).toBe(true); // 700 → 950
    expect(store.buyItem(zen.id, 's_star_purse')).toBe(true); // 650 → 300
    expect(store.buyItem(zen.id, 's_boots')).toBe(false); // 450 > 300
  });

  it('resets a seed explorer to her starting balance when she is left', async () => {
    const store = await freshStore();
    const mia = store.getSave().profiles.find((p) => p.name === 'Mia')!;
    store.selectProfile(mia.id);
    store.buyItem(mia.id, 's_flats');

    store.selectProfile(null); // leaving triggers the reset

    const reset = store.getSave().profiles.find((p) => p.id === mia.id)!;
    expect(reset.stardust).toBe(3500);
    expect(reset.purchased).toEqual([]);
  });
});

describe('deploy-version seed reset', () => {
  it('records the first version without resetting, then fully resets seeds on a redeploy', async () => {
    const store = await freshStore();
    const mia = store.getSave().profiles.find((p) => p.name === 'Mia')!;
    store.selectProfile(mia.id);
    store.completeStar('g3_read_01', 6, 6);

    store.applyDeployVersion('v-first');
    let current = store.getSave().profiles.find((p) => p.name === 'Mia')!;
    expect(current.progress['g3_read_01']).toBeDefined();

    store.applyDeployVersion('v-second');
    current = store.getSave().profiles.find((p) => p.name === 'Mia')!;
    expect(current.progress).toEqual({});
    expect(current.stardust).toBe(3500);
  });
});

describe('exploration nudge', () => {
  it('stays quiet until a real pattern exists, then flags neglected subjects', async () => {
    const store = await freshStore();
    store.createProfile('Testa', 3, 0);

    // Five reading stars: enough plays, and reading is now 5 ahead of everything.
    for (const id of ['g3_read_01', 'g3_read_02', 'g3_read_03', 'g3_read_04', 'g3_read_05']) {
      store.completeStar(id, 6, 6);
    }
    const profile = store.getSave().profiles.find((p) => p.name === 'Testa')!;
    const neglected = store.neglectedSubjects(profile);
    expect(neglected.has('math')).toBe(true);
    expect(neglected.has('reading')).toBe(false);
  });

  it('never flags anything for a brand-new explorer', async () => {
    const store = await freshStore();
    const profile = store.createProfile('Newbie', 1, 0);
    expect(store.neglectedSubjects(profile).size).toBe(0);
  });

  it('only pays the bonus for the first completion of a neglected star', async () => {
    const store = await freshStore();
    store.createProfile('Testa', 3, 0);
    for (const id of ['g3_read_01', 'g3_read_02', 'g3_read_03', 'g3_read_04', 'g3_read_05']) {
      store.completeStar(id, 6, 6);
    }
    const profile = store.getSave().profiles.find((p) => p.name === 'Testa')!;
    const mathStar = { id: 'g3_math_01', subject: 'math', grade: 3 } as never;
    const readStar = { id: 'g3_read_01', subject: 'reading', grade: 3 } as never;
    expect(store.bonusAppliesTo(profile, mathStar)).toBe(true);
    expect(store.bonusAppliesTo(profile, readStar)).toBe(false); // already played
  });
});
