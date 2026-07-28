/**
 * Measures how much curriculum actually exists.
 *
 * Rather than trusting a number written in a README, this bundles the real
 * content modules with esbuild (already present as a Vite dependency), imports
 * them, and counts what is there. Run with: npm run content:report
 */

import { build } from 'esbuild';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const GRADES = [1, 3];

const SUBJECT_NAMES = {
  reading: 'Reading comprehension',
  vocabulary: 'Vocabulary',
  math: 'Math',
  thinking: 'Critical thinking',
  typing: 'Typing',
  bsf: 'Bible Study Fellowship',
};

async function loadContent() {
  const dir = await mkdtemp(join(tmpdir(), 'anso-report-'));
  const outfile = join(dir, 'content.mjs');

  await build({
    entryPoints: ['src/content/index.ts'],
    outfile,
    bundle: true,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  });

  const mod = await import(pathToFileURL(outfile).href);
  await rm(dir, { recursive: true, force: true });
  return mod;
}

/** Count the challenges in a star, resolving generators to their real output. */
function challengeCount(star, challengesFor) {
  const challenges = challengesFor(star, 0);
  return challenges.length;
}

function bar(value, max, width = 22) {
  const filled = max === 0 ? 0 : Math.round((value / max) * width);
  return '█'.repeat(filled) + '░'.repeat(width - filled);
}

const { starsForGrade, challengesFor, SUBJECTS } = await loadContent();

console.log('\n  AnSo — curriculum content report');
console.log('  ' + '─'.repeat(62));

const totals = { stars: 0, challenges: 0, minutes: 0 };

for (const grade of GRADES) {
  const stars = starsForGrade(grade);
  const gradeMinutes = stars.reduce((sum, s) => sum + s.minutes, 0);
  const gradeChallenges = stars.reduce((sum, s) => sum + challengeCount(s, challengesFor), 0);

  totals.stars += stars.length;
  totals.challenges += gradeChallenges;
  totals.minutes += gradeMinutes;

  console.log(`\n  GRADE ${grade}`);
  console.log(
    `  ${stars.length} stars · ${gradeChallenges} challenges · ${(gradeMinutes / 60).toFixed(1)} hours\n`,
  );

  const maxMinutes = Math.max(
    ...SUBJECTS.map((subject) =>
      stars.filter((s) => s.subject === subject.id).reduce((sum, s) => sum + s.minutes, 0),
    ),
  );

  for (const subject of SUBJECTS) {
    const subjectStars = stars.filter((s) => s.subject === subject.id);
    const minutes = subjectStars.reduce((sum, s) => sum + s.minutes, 0);
    const challenges = subjectStars.reduce((sum, s) => sum + challengeCount(s, challengesFor), 0);
    const generated = subjectStars.some((s) => s.content.kind === 'generated');

    const label = (SUBJECT_NAMES[subject.id] ?? subject.id).padEnd(24);
    const hours = `${(minutes / 60).toFixed(1)}h`.padStart(6);
    const starCount = `${subjectStars.length} stars`.padStart(9);
    const challengeCountText = `${challenges} challenges`.padStart(16);

    console.log(
      `  ${label}${bar(minutes, maxMinutes)} ${hours} ${starCount} ${challengeCountText}` +
        (generated ? '  ∞ replayable' : ''),
    );
  }
}

console.log('\n  ' + '─'.repeat(62));
console.log(
  `  TOTAL  ${totals.stars} stars · ${totals.challenges} challenges · ` +
    `${(totals.minutes / 60).toFixed(1)} hours of first-pass curriculum`,
);
console.log(
  '  Stars marked ∞ generate fresh problems on every replay, so practice\n' +
    '  time in maths and typing is not capped by the figures above.\n',
);
