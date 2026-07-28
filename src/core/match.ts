/**
 * Lenient answer matching for spoken and typed responses.
 *
 * A 6-year-old saying "seven" may be transcribed as "Seven.", "sevin", or
 * "the answer is seven" — and the recogniser hands us several alternatives at
 * once. Being strict here would make the app feel broken and unfair, so
 * matching normalises aggressively and accepts close-enough spellings.
 */

const NUMBER_WORDS: Record<string, string> = {
  zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5',
  six: '6', seven: '7', eight: '8', nine: '9', ten: '10',
  eleven: '11', twelve: '12', thirteen: '13', fourteen: '14', fifteen: '15',
  sixteen: '16', seventeen: '17', eighteen: '18', nineteen: '19', twenty: '20',
  thirty: '30', forty: '40', fifty: '50', sixty: '60', seventy: '70',
  eighty: '80', ninety: '90', hundred: '100',
};

/** Filler the child may wrap around the real answer. */
const LEADING_FILLER = [
  'the answer is', 'i think it is', 'i think its', 'i think', 'it is', 'its',
  'the answer', 'answer is', 'maybe', 'um', 'uh', 'well',
];

export function normalize(input: string): string {
  let text = input
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  for (const filler of LEADING_FILLER) {
    if (text.startsWith(filler + ' ')) {
      text = text.slice(filler.length + 1).trim();
      break;
    }
  }

  // Map number words to digits so "seven" and "7" compare equal.
  text = text
    .split(' ')
    .map((word) => NUMBER_WORDS[word] ?? word)
    .join(' ');

  // Drop articles last — they never carry meaning in these answers.
  return text.replace(/\b(a|an|the)\b/g, '').replace(/\s+/g, ' ').trim();
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length];
}

/** 0..1 similarity, 1 being identical. */
export function similarity(a: string, b: string): number {
  const longest = Math.max(a.length, b.length);
  if (longest === 0) return 1;
  return 1 - levenshtein(a, b) / longest;
}

/**
 * Short words need near-exact spelling ("cat" vs "cap" are different answers),
 * but longer words can tolerate more slop from transcription.
 */
function thresholdFor(target: string): number {
  if (target.length <= 3) return 1;
  if (target.length <= 5) return 0.8;
  if (target.length <= 8) return 0.75;
  return 0.7;
}

export interface MatchResult {
  ok: boolean;
  /** Which accepted answer matched, if any. */
  matched?: string;
  /** Best similarity seen — useful for "so close!" feedback. */
  score: number;
}

/**
 * Check a response against a list of acceptable answers.
 *
 * `response` may contain several recogniser alternatives separated by " | ";
 * any one of them matching counts as correct.
 */
export function matchAnswer(response: string, accept: string[]): MatchResult {
  const candidates = response
    .split('|')
    .map((part) => normalize(part))
    .filter(Boolean);

  if (candidates.length === 0) return { ok: false, score: 0 };

  let bestScore = 0;
  let bestTarget: string | undefined;

  for (const rawTarget of accept) {
    const target = normalize(rawTarget);
    if (!target) continue;

    for (const candidate of candidates) {
      if (candidate === target) return { ok: true, matched: rawTarget, score: 1 };

      // "the cat sat on the mat" contains "cat" — accept the child who answers
      // in a full sentence, as long as the key phrase is present.
      const contained =
        target.length >= 3 &&
        (candidate.includes(target) || target.includes(candidate));

      const score = Math.max(similarity(candidate, target), contained ? 0.9 : 0);
      if (score > bestScore) {
        bestScore = score;
        bestTarget = rawTarget;
      }
      if (score >= thresholdFor(target)) {
        return { ok: true, matched: rawTarget, score };
      }
    }
  }

  return { ok: false, matched: bestTarget, score: bestScore };
}

/** True when the answer was close but not accepted — worth an encouraging nudge. */
export function isNearMiss(result: MatchResult): boolean {
  return !result.ok && result.score >= 0.55;
}
