/**
 * Merge tests for the progress sync.
 *
 * This is the one part of the app where a bug silently destroys something a
 * child spent weeks on, so the merge gets tested directly rather than by
 * clicking around. Run with: npm run test:sync
 */

import { mergeSaves } from '../save-store.mjs';

let passed = 0;
let failed = 0;

function check(label, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  ok    ${label}`);
  } else {
    failed++;
    console.log(`  FAIL  ${label}${detail ? `\n        ${detail}` : ''}`);
  }
}

function profile(overrides = {}) {
  return {
    id: 'p_a',
    name: 'Ana',
    grade: 1,
    avatar: 0,
    stardust: 0,
    createdAt: 1000,
    progress: {},
    reviewQueue: [],
    ...overrides,
  };
}

const star = (completions, bestScore, lastPlayed) => ({ completions, bestScore, lastPlayed });

console.log('\n  Sync merge tests\n  ' + '─'.repeat(58));

/* ------------------------------------------------------------------ */
console.log('\n  Progress made on two devices independently');
{
  const laptop = {
    profiles: [profile({ stardust: 300, progress: { g1_read_01: star(1, 5, 5000) } })],
  };
  const tablet = {
    profiles: [profile({ stardust: 250, progress: { g1_math_01: star(2, 12, 6000) } })],
  };

  const merged = mergeSaves(laptop, tablet);
  const p = merged.profiles[0];

  check('one profile, not two', merged.profiles.length === 1);
  check('laptop star kept', p.progress.g1_read_01?.completions === 1);
  check('tablet star kept', p.progress.g1_math_01?.completions === 2);
  check('stardust takes the higher, not the sum', p.stardust === 300, `got ${p.stardust}`);
}

/* ------------------------------------------------------------------ */
console.log('\n  Same star played on both devices');
{
  const laptop = { profiles: [profile({ progress: { g1_read_01: star(3, 4, 9000) } })] };
  const tablet = { profiles: [profile({ progress: { g1_read_01: star(1, 6, 2000) } })] };

  const p = mergeSaves(laptop, tablet).profiles[0].progress.g1_read_01;

  check('completions take the higher count', p.completions === 3, `got ${p.completions}`);
  check('best score is genuinely the best', p.bestScore === 6, `got ${p.bestScore}`);
  check('lastPlayed is the most recent', p.lastPlayed === 9000);
}

/* ------------------------------------------------------------------ */
console.log('\n  Same child created separately on each device');
{
  const laptop = {
    profiles: [
      profile({ id: 'p_laptop', createdAt: 1000, progress: { g1_read_01: star(1, 5, 5000) } }),
    ],
  };
  const tablet = {
    profiles: [
      profile({ id: 'p_tablet', createdAt: 2000, progress: { g1_math_01: star(1, 8, 6000) } }),
    ],
  };

  const merged = mergeSaves(laptop, tablet);

  check('stitched into a single explorer', merged.profiles.length === 1,
    `got ${merged.profiles.length}`);
  check('canonical id is the older one', merged.profiles[0].id === 'p_laptop');
  check('both sides of progress survive',
    merged.profiles[0].progress.g1_read_01 && merged.profiles[0].progress.g1_math_01);
}

/* ------------------------------------------------------------------ */
console.log('\n  Two different children are not confused');
{
  const laptop = { profiles: [profile({ id: 'p_1', name: 'Ana', grade: 1 })] };
  const tablet = { profiles: [profile({ id: 'p_2', name: 'Sofia', grade: 3 })] };

  const merged = mergeSaves(laptop, tablet);
  check('both kept separate', merged.profiles.length === 2, `got ${merged.profiles.length}`);
}

/* ------------------------------------------------------------------ */
console.log('\n  Same name, different grade stays separate');
{
  const a = { profiles: [profile({ id: 'p_1', name: 'Ana', grade: 1 })] };
  const b = { profiles: [profile({ id: 'p_2', name: 'Ana', grade: 3 })] };

  check('grade distinguishes them', mergeSaves(a, b).profiles.length === 2);
}

/* ------------------------------------------------------------------ */
console.log('\n  Deletion sticks');
{
  const stored = { profiles: [profile({ id: 'p_gone' }), profile({ id: 'p_keep', name: 'Sofia' })] };
  const deletingDevice = { profiles: [profile({ id: 'p_keep', name: 'Sofia' })],
    deletedProfileIds: ['p_gone'] };

  const merged = mergeSaves(stored, deletingDevice);

  check('deleted profile is gone', !merged.profiles.some((p) => p.id === 'p_gone'));
  check('other profile untouched', merged.profiles.some((p) => p.id === 'p_keep'));
  check('tombstone is retained', merged.deletedProfileIds.includes('p_gone'));

  // The device that never saw the deletion syncs afterwards and still has it.
  const staleDevice = { profiles: [profile({ id: 'p_gone' })] };
  const after = mergeSaves(merged, staleDevice);
  check('stale device cannot resurrect it', !after.profiles.some((p) => p.id === 'p_gone'));
}

/* ------------------------------------------------------------------ */
console.log('\n  Name edit follows the more recently used copy');
{
  const older = {
    profiles: [profile({ name: 'Anna', progress: { s: star(1, 1, 1000) } })],
  };
  const newer = {
    profiles: [profile({ name: 'Ana', progress: { s: star(1, 1, 9000) } })],
  };

  check('newer name wins', mergeSaves(older, newer).profiles[0].name === 'Ana');
  check('order does not matter', mergeSaves(newer, older).profiles[0].name === 'Ana');
}

/* ------------------------------------------------------------------ */
console.log('\n  Merge is order independent and repeatable');
{
  const a = { profiles: [profile({ stardust: 100, progress: { x: star(2, 5, 3000) } })] };
  const b = { profiles: [profile({ stardust: 200, progress: { y: star(1, 9, 8000) } })] };

  const ab = mergeSaves(a, b);
  const ba = mergeSaves(b, a);

  const strip = (s) => JSON.stringify({ ...s, updatedAt: 0 });
  check('same result either way', strip(ab) === strip(ba));

  // Syncing twice with no changes must not drift.
  const twice = mergeSaves(ab, { profiles: ab.profiles });
  check('re-syncing is stable', strip(twice) === strip(ab));
}

/* ------------------------------------------------------------------ */
console.log('\n  Empty and malformed input is survivable');
{
  check('empty both sides', mergeSaves({ profiles: [] }, { profiles: [] }).profiles.length === 0);
  check('missing fields entirely', mergeSaves({}, {}).profiles.length === 0);
  check('first sync from a fresh device',
    mergeSaves({ profiles: [] }, { profiles: [profile()] }).profiles.length === 1);
  check('junk entries are dropped',
    mergeSaves({ profiles: [null, undefined, {}] }, { profiles: [profile()] }).profiles.length === 1);
}

/* ------------------------------------------------------------------ */
console.log('\n  Microphone preference follows the child');
{
  const older = { profiles: [profile({ micEnabled: true, progress: { s: star(1, 1, 1000) } })] };
  const newer = { profiles: [profile({ micEnabled: false, progress: { s: star(1, 1, 9000) } })] };

  check('turning it off on one device wins', mergeSaves(older, newer).profiles[0].micEnabled === false);
  check('order does not matter', mergeSaves(newer, older).profiles[0].micEnabled === false);
  // Deliberately left unset rather than defaulted, so a profile predating this
  // setting still honours the old device-level toggle on the client instead of
  // having the microphone switched back on for it.
  check('profiles predating the setting keep no opinion',
    mergeSaves({ profiles: [profile()] }, { profiles: [] }).profiles[0].micEnabled === undefined);
  check('an explicit off is never lost to a profile with no opinion',
    mergeSaves({ profiles: [profile({ micEnabled: false })] }, { profiles: [profile()] })
      .profiles[0].micEnabled === false);
}

/* ------------------------------------------------------------------ */
console.log('\n  Review queue');
{
  const a = { profiles: [profile({ reviewQueue: ['orbit', 'vast'] })] };
  const b = { profiles: [profile({ reviewQueue: ['vast', 'gentle'] })] };

  const queue = mergeSaves(a, b).profiles[0].reviewQueue;
  check('union without duplicates', queue.length === 3 && new Set(queue).size === 3,
    `got ${JSON.stringify(queue)}`);
}

console.log('\n  ' + '─'.repeat(58));
console.log(`  ${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
