/**
 * Server-side save storage and merge.
 *
 * Two devices can both make progress while neither has seen the other's. A
 * last-write-wins store would silently throw one of them away, so every field
 * is merged on its own terms instead — and the merge lives here, on the server,
 * so there is exactly one implementation rather than one per device.
 *
 * Only profiles and their progress are synced. Volume, microphone toggles and
 * which child is currently selected stay local to each device, because those
 * are properties of the device rather than of the child.
 */

import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const DATA_DIR = process.env.DATA_DIR || './data';
const SAVE_FILE = join(DATA_DIR, 'save.json');

/* ------------------------------------------------------------------ */
/* Merge                                                               */
/* ------------------------------------------------------------------ */

/**
 * The same child created separately on two devices gets two different locally
 * generated ids, and would otherwise show up as two explorers. Falling back to
 * name and grade stitches those together on first sync; afterwards the ids
 * match and this never fires again.
 */
function identityKey(profile) {
  return `${String(profile.name ?? '').trim().toLowerCase()}|${profile.grade}`;
}

/** How recently this profile was actually used, for settling name/avatar edits. */
function lastActivity(profile) {
  let latest = Number(profile.createdAt) || 0;
  for (const record of Object.values(profile.progress ?? {})) {
    const played = Number(record?.lastPlayed) || 0;
    if (played > latest) latest = played;
  }
  return latest;
}

function mergeStarProgress(a, b) {
  if (!a) return b;
  if (!b) return a;
  return {
    // Max rather than sum: both sides likely include the same earlier plays,
    // and inflating a child's totals is worse than under-counting a replay.
    completions: Math.max(Number(a.completions) || 0, Number(b.completions) || 0),
    bestScore: Math.max(Number(a.bestScore) || 0, Number(b.bestScore) || 0),
    lastPlayed: Math.max(Number(a.lastPlayed) || 0, Number(b.lastPlayed) || 0),
  };
}

/**
 * Rebuild an object with its keys in sorted order.
 *
 * Without this the merged output depends on which device happened to sync
 * first — same data, different byte order. Canonical ordering means two devices
 * converge to an identical file, which is what makes "are these in sync?" a
 * question with an answer.
 */
function canonical(record) {
  return Object.fromEntries(Object.entries(record).sort(([x], [y]) => (x < y ? -1 : x > y ? 1 : 0)));
}

function mergeProfile(a, b) {
  // Descriptive fields follow whichever copy was used most recently.
  const [fresher, staler] = lastActivity(a) >= lastActivity(b) ? [a, b] : [b, a];

  const combined = { ...(a.progress ?? {}) };
  for (const [starId, record] of Object.entries(b.progress ?? {})) {
    combined[starId] = mergeStarProgress(combined[starId], record);
  }
  const progress = canonical(combined);

  // Sorted for the same determinism reason. These are words to revisit, so the
  // set matters and the order does not.
  const reviewQueue = [...new Set([...(a.reviewQueue ?? []), ...(b.reviewQueue ?? [])])]
    .sort()
    .slice(-40);

  return {
    // Keep the older id so the canonical choice is stable no matter which
    // device happens to sync first.
    id: (Number(a.createdAt) || 0) <= (Number(b.createdAt) || 0) ? a.id : b.id,
    name: fresher.name ?? staler.name,
    grade: fresher.grade ?? staler.grade,
    avatar: fresher.avatar ?? staler.avatar ?? 0,
    stardust: Math.max(Number(a.stardust) || 0, Number(b.stardust) || 0),
    createdAt: Math.min(
      Number(a.createdAt) || Date.now(),
      Number(b.createdAt) || Date.now(),
    ),
    progress,
    reviewQueue,
  };
}

/**
 * Merge two profile lists. Tombstoned ids are dropped from the result, which is
 * what makes a deletion on one device stick everywhere instead of being
 * resurrected by the next device to sync.
 */
export function mergeSaves(stored, incoming) {
  const tombstones = new Set([
    ...(stored.deletedProfileIds ?? []),
    ...(incoming.deletedProfileIds ?? []),
  ]);

  const all = [...(stored.profiles ?? []), ...(incoming.profiles ?? [])].filter(
    (p) => p && typeof p.id === 'string' && !tombstones.has(p.id),
  );

  const byId = new Map();
  for (const profile of all) {
    const existing = byId.get(profile.id);
    byId.set(profile.id, existing ? mergeProfile(existing, profile) : profile);
  }

  // Second pass stitches together the same child created independently on two
  // devices, which have different ids but the same name and grade.
  const byIdentity = new Map();
  for (const profile of byId.values()) {
    const key = identityKey(profile);
    const existing = byIdentity.get(key);
    byIdentity.set(key, existing ? mergeProfile(existing, profile) : profile);
  }

  const profiles = [...byIdentity.values()].sort((a, b) => {
    const byAge = (Number(a.createdAt) || 0) - (Number(b.createdAt) || 0);
    // Tie-break on id, so two profiles created in the same millisecond do not
    // swap places depending on which device synced first.
    return byAge !== 0 ? byAge : a.id < b.id ? -1 : a.id > b.id ? 1 : 0;
  });

  return {
    version: 1,
    profiles,
    // Tombstones are kept forever. They are just ids, so the cost is trivial
    // next to the cost of a deleted profile coming back.
    deletedProfileIds: [...tombstones].sort(),
    updatedAt: Date.now(),
  };
}

/* ------------------------------------------------------------------ */
/* Persistence                                                         */
/* ------------------------------------------------------------------ */

const EMPTY = { version: 1, profiles: [], deletedProfileIds: [], updatedAt: 0 };

export async function readSave() {
  try {
    const raw = await readFile(SAVE_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...EMPTY };
    return {
      ...EMPTY,
      ...parsed,
      profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
      deletedProfileIds: Array.isArray(parsed.deletedProfileIds) ? parsed.deletedProfileIds : [],
    };
  } catch (err) {
    if (err?.code !== 'ENOENT') {
      console.error('Could not read save file, starting empty:', err.message);
    }
    return { ...EMPTY };
  }
}

async function writeSave(data) {
  await mkdir(dirname(SAVE_FILE), { recursive: true });
  // Write then rename: a crash mid-write leaves the previous save intact
  // rather than a truncated file that would read as "no progress".
  const tmp = `${SAVE_FILE}.${process.pid}.tmp`;
  await writeFile(tmp, JSON.stringify(data), 'utf8');
  await rename(tmp, SAVE_FILE);
}

/**
 * Serialises all writes. Two devices syncing at the same instant would
 * otherwise read-modify-write over each other and lose one side's progress.
 */
let queue = Promise.resolve();

export function syncSave(incoming) {
  const run = queue.then(async () => {
    const stored = await readSave();
    const merged = mergeSaves(stored, incoming);
    await writeSave(merged);
    return merged;
  });
  // Keep the chain alive even if this link rejects.
  queue = run.catch(() => {});
  return run;
}

export function saveFilePath() {
  return SAVE_FILE;
}
