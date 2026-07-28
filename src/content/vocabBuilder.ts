import type { Challenge, Grade, Star, SubjectId } from '../types';

/**
 * Vocabulary stars are built from word data rather than hand-written challenge
 * lists. Each word yields three passes — meaning, usage in context, and
 * producing the word from its definition — which is roughly what it takes for a
 * word to stick. Writing that out by hand for 200 words would be unreadable.
 */

export interface WordEntry {
  word: string;
  meaning: string;
  /** A sentence using the word, with the word itself replaced by "____". */
  cloze: string;
  /** Three wrong meanings. Should be plausible, not silly. */
  decoys: [string, string, string];
  /** Optional note AnSo reads after a correct answer. */
  note?: string;
}

export interface VocabStarSpec {
  id: string;
  grade: Grade;
  title: string;
  blurb: string;
  minutes: number;
  words: WordEntry[];
}

function meaningChallenge(entry: WordEntry, idx: number, starId: string): Challenge {
  // Rotate the correct position so the answer is not always in the same slot.
  const correct = idx % 4;
  const options = [...entry.decoys];
  options.splice(correct, 0, entry.meaning);
  return {
    kind: 'choice',
    id: `${starId}_w${idx}_mean`,
    prompt: `What does the word "${entry.word}" mean?`,
    display: entry.word,
    options,
    correct,
    teach: entry.note ?? `"${entry.word}" means ${entry.meaning}.`,
  };
}

function clozeChallenge(entry: WordEntry, idx: number, starId: string, pool: WordEntry[]): Challenge {
  const others = pool.filter((w) => w.word !== entry.word).slice(0, 3);
  const correct = (idx + 2) % Math.min(4, others.length + 1);
  const options = others.map((w) => w.word);
  options.splice(correct, 0, entry.word);
  return {
    kind: 'choice',
    id: `${starId}_w${idx}_cloze`,
    prompt: `Which word fits? ${entry.cloze}`,
    display: entry.cloze,
    options,
    correct,
    teach: entry.cloze.replace('____', entry.word),
  };
}

function produceChallenge(entry: WordEntry, idx: number, starId: string): Challenge {
  return {
    kind: 'speak',
    id: `${starId}_w${idx}_say`,
    prompt: `I am thinking of a word that means: ${entry.meaning}. What is the word?`,
    accept: [entry.word],
    sampleAnswer: entry.word,
    hint: `It starts with the letter ${entry.word[0].toUpperCase()}.`,
    teach: `Yes — ${entry.word}.`,
  };
}

/** Build a full vocabulary star from a word list. */
export function buildVocabStar(spec: VocabStarSpec): Star {
  const challenges: Challenge[] = [];

  spec.words.forEach((entry, i) => {
    challenges.push(meaningChallenge(entry, i, spec.id));
  });
  spec.words.forEach((entry, i) => {
    challenges.push(clozeChallenge(entry, i, spec.id, spec.words));
  });
  // The produce-the-word pass is hardest, so it comes last and only covers
  // half the set — enough to stretch without turning into a slog.
  spec.words.slice(0, Math.ceil(spec.words.length / 2)).forEach((entry, i) => {
    challenges.push(produceChallenge(entry, i, spec.id));
  });

  return {
    id: spec.id,
    subject: 'vocabulary' as SubjectId,
    grade: spec.grade,
    title: spec.title,
    blurb: spec.blurb,
    minutes: spec.minutes,
    content: { kind: 'fixed', challenges },
  };
}
