import type { Challenge, Grade, Star } from '../types';

/**
 * Bible Study Fellowship weekly curriculum — the Romans series.
 *
 * The weekly material lives in `bsfWeeks.ts` as plain data and is turned into
 * stars here. Each week carries the four treasures from the BSF children's
 * material — Main Truth, God's Attribute, Doctrine, and Gospel Connection —
 * plus the scripture passage and the NIV memory verse.
 *
 * A week becomes one star per grade with this shape:
 *
 *   1. The passage, read aloud with follow-along word highlighting, with the
 *      four treasures displayed as a study card beneath it.
 *   2. Treasure checks — the main truth, the attribute, and the doctrine,
 *      each taught and then asked back.
 *   3. Comprehension questions about the passage, filtered per grade.
 *   4. The gospel connection, said back in the child's own words.
 *   5. Memory verse work, built automatically from the verse text:
 *      fill-in-the-blank (1 blank for grade 1, 3 for grade 3), phrase
 *      ordering (grade 3), an echo recitation, and typing (a short clause
 *      for grade 1, the fuller verse for grade 3).
 */

export interface BsfQuestion {
  /** The question AnSo asks. */
  ask: string;
  /** Answers to accept for a spoken/typed response. Leave out for `options`. */
  accept?: string[];
  /** Multiple choice instead of open response. */
  options?: string[];
  /** Index of the correct option. Required when `options` is given. */
  correct?: number;
  /** Shown as a model answer when the child asks for help. */
  sample?: string;
  hint?: string;
  /** Read aloud after a correct answer. */
  teach?: string;
  /** Which grades this question suits. Defaults to both. */
  grades?: Grade[];
}

export interface BsfWeek {
  /** Week number within the BSF year. Used for ordering and star ids. */
  week: number;
  title: string;
  /** e.g. "Romans 1:1-17" */
  reference: string;
  /** A short summary AnSo reads to set up the lesson. */
  summary: string;
  /** Key into the BsfArt illustration set. */
  art: string;
  /** The passage text, one string per paragraph (grouped verses). */
  passage: string[];
  /** The NIV verse to learn by heart. */
  memoryVerse: { text: string; reference: string };
  /** Main Truth — the sentence the whole lesson hangs on. */
  truth: string;
  /** God's Attribute for the week, with its child-sized meaning. */
  attribute: { name: string; meaning: string };
  /** The doctrine word for the week, with its child-sized meaning. */
  doctrine: { term: string; meaning: string };
  /** Gospel Connection — how the lesson points to Jesus. */
  gospel: string;
  questions: BsfQuestion[];
  /** Estimated minutes. Defaults to 18. */
  minutes?: number;
}

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

/** Typeable form of a verse: straight quotes, plain hyphens, no wrapping quotes. */
function typeable(text: string): string {
  return text
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/—/g, ' - ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Words of a verse, lowercased, punctuation stripped, in order. */
function verseWords(text: string): string[] {
  return typeable(text)
    .toLowerCase()
    .replace(/[^a-z'\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 0);
}

/**
 * The most memorisable words of a verse: longest first, ties by first
 * appearance, duplicates removed. Deterministic, so a star is identical on
 * every visit.
 */
function keyWords(text: string, minLen: number): string[] {
  const seen = new Set<string>();
  const ordered: { word: string; at: number }[] = [];
  verseWords(text).forEach((word, at) => {
    if (word.length >= minLen && !seen.has(word)) {
      seen.add(word);
      ordered.push({ word, at });
    }
  });
  return ordered.sort((a, b) => b.word.length - a.word.length || a.at - b.at).map((o) => o.word);
}

/** First clause of a verse for grade 1 typing — cut at punctuation past 25 chars. */
function firstClause(text: string): string {
  const t = typeable(text);
  const cut = t.slice(25).search(/[,;:.!?]|\s-\s/);
  if (cut >= 0) return t.slice(0, 25 + cut + 1).replace(/[\s-]+$/, '').trim();
  if (t.length <= 55) return t;
  const space = t.lastIndexOf(' ', 55);
  return t.slice(0, space > 25 ? space : 55).trim();
}

/** Split a verse into 3-5 phrases for the ordering challenge. */
function versePhrases(text: string): string[] {
  const t = typeable(text);
  let parts = t
    .split(/(?<=[,;:])\s+|\s-\s/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // A verse with no internal punctuation still needs pieces to arrange.
  if (parts.length < 3) {
    const words = t.split(/\s+/);
    const size = Math.ceil(words.length / Math.min(4, Math.max(3, Math.round(words.length / 4))));
    parts = [];
    for (let i = 0; i < words.length; i += size) parts.push(words.slice(i, i + size).join(' '));
  }

  // Too many pieces makes the puzzle fiddly rather than hard; merge the tail.
  while (parts.length > 5) {
    const last = parts.pop()!;
    parts[parts.length - 1] = `${parts[parts.length - 1]} ${last}`;
  }
  return parts;
}

/** Place the correct option at a deterministic, varying position. */
function withDecoys(correctText: string, decoys: string[], slot: number): { options: string[]; correct: number } {
  const options = decoys.slice(0, 3);
  const at = slot % (options.length + 1);
  options.splice(at, 0, correctText);
  return { options, correct: at };
}

/* ------------------------------------------------------------------ */
/* Challenge builders                                                  */
/* ------------------------------------------------------------------ */

function toChallenge(q: BsfQuestion, starId: string, index: number): Challenge {
  if (q.options && q.correct !== undefined) {
    return {
      kind: 'choice',
      id: `${starId}_q${index}`,
      prompt: q.ask,
      options: q.options,
      correct: q.correct,
      hint: q.hint,
      teach: q.teach,
    };
  }
  return {
    kind: 'speak',
    id: `${starId}_q${index}`,
    prompt: q.ask,
    // Reflection questions often have no single right answer. An empty accept
    // list would reject everything, so fall back to accepting any real attempt.
    accept: q.accept ?? ['i', 'because', 'he', 'she', 'god', 'jesus', 'it', 'they', 'yes', 'no'],
    sampleAnswer: q.sample ?? 'Tell me what you think.',
    hint: q.hint,
    teach: q.teach,
  };
}

/** The three treasure checks: main truth, God's attribute, doctrine. */
function treasureChallenges(week: BsfWeek, all: BsfWeek[], starId: string): Challenge[] {
  const others = (pick: (w: BsfWeek) => string): string[] =>
    [3, 7, 10].map((o) => pick(all[(week.week - 1 + o) % all.length]));

  const truth = withDecoys(week.truth, others((w) => w.truth), week.week);
  const attr = withDecoys(week.attribute.meaning, others((w) => w.attribute.meaning), week.week + 1);
  const doctrine = withDecoys(week.doctrine.meaning, others((w) => w.doctrine.meaning), week.week + 2);

  return [
    {
      kind: 'choice',
      id: `${starId}_truth`,
      prompt: 'What is our Main Truth this week?',
      display: '💎 Main Truth',
      ...truth,
      hint: 'It is on the study card, right under the passage.',
      teach: `Our Main Truth: ${week.truth}`,
    },
    {
      kind: 'choice',
      id: `${starId}_attr`,
      prompt: `This week we learned that God is ${week.attribute.name}. What does that mean?`,
      display: `✨ God is ${week.attribute.name}`,
      ...attr,
      hint: 'Think about what the study card said.',
      teach: `God is ${week.attribute.name} — ${week.attribute.meaning}`,
    },
    {
      kind: 'choice',
      id: `${starId}_doct`,
      prompt: `Our big Bible word this week is ${week.doctrine.term}. What does it mean?`,
      display: `📖 ${week.doctrine.term}`,
      ...doctrine,
      hint: 'Say the big word out loud, then think about the lesson.',
      teach: `${week.doctrine.term} means ${week.doctrine.meaning}`,
    },
  ];
}

/** The gospel connection, said back in the child's own words. */
function gospelChallenge(week: BsfWeek, starId: string): Challenge {
  const accept = keyWords(week.gospel, 4).slice(0, 8);
  return {
    kind: 'speak',
    id: `${starId}_gospel`,
    prompt: `Here is this week's Gospel Connection: ${week.gospel} Now tell it back to me in your own words.`,
    display: `✝️ ${week.gospel}`,
    accept: accept.length > 0 ? accept : ['jesus', 'god', 'faith'],
    sampleAnswer: week.gospel,
    hint: 'There is no wrong way to say it. What does this week say about Jesus?',
    teach: 'Yes. Every lesson in Romans points to Jesus, and you just said how.',
  };
}

/** Memory-verse work, generated from the verse text. */
function verseChallenges(week: BsfWeek, grade: Grade, starId: string): Challenge[] {
  const verse = week.memoryVerse;
  const clean = typeable(verse.text);
  const blanks = keyWords(verse.text, 5);
  const out: Challenge[] = [];

  const blankCount = grade === 1 ? 1 : Math.min(3, blanks.length);
  for (let b = 0; b < blankCount && b < blanks.length; b++) {
    const target = blanks[b];
    // Show the verse with this word hidden. Replace only the first occurrence,
    // case-insensitively, preserving the surrounding punctuation.
    const re = new RegExp(`\\b${target}\\b`, 'i');
    const display = clean.replace(re, '_____');
    const decoys = blanks.filter((w) => w !== target).slice(3, 6);
    while (decoys.length < 3) decoys.push(['heart', 'light', 'world'][decoys.length]);
    const { options, correct } = withDecoys(target, decoys, week.week + b);

    out.push({
      kind: 'choice',
      id: `${starId}_blank${b}`,
      prompt: 'Which word completes our memory verse?',
      display,
      options,
      correct,
      hint: 'Say the verse out loud from the start. Your mouth remembers.',
      teach: `${clean} — ${verse.reference}`,
    });
  }

  if (grade === 3) {
    out.push({
      kind: 'order',
      id: `${starId}_order`,
      prompt: 'Put the pieces of our memory verse in order.',
      items: versePhrases(verse.text),
      hint: 'Start with the piece that sounds like a beginning.',
      teach: `${clean} — ${verse.reference}`,
    });
  }

  const echo = keyWords(verse.text, 6).slice(0, 6);
  out.push({
    kind: 'speak',
    id: `${starId}_echo`,
    prompt: `Now say the memory verse out loud, as much as you remember. ${verse.reference}.`,
    display: `🎵 ${verse.reference}`,
    pronounce: clean,
    accept: echo.length > 0 ? echo : verseWords(verse.text).slice(0, 5),
    sampleAnswer: clean,
    hint: 'Press the speaker button to hear it once more, then try.',
    teach: 'Beautiful. A verse learned by heart stays with you for life.',
  });

  out.push({
    kind: 'typing',
    id: `${starId}_type`,
    mode: 'sentence',
    target: grade === 1 ? firstClause(verse.text) : clean,
    prompt:
      grade === 1
        ? `Type the first part of our verse — ${verse.reference}.`
        : `Type our memory verse — ${verse.reference}.`,
    hint: 'Slow and right beats fast and wrong.',
    teach: `${verse.reference}. Say it once more before you go.`,
  });

  return out;
}

/* ------------------------------------------------------------------ */
/* Star builder                                                        */
/* ------------------------------------------------------------------ */

export function buildBsfStar(week: BsfWeek, grade: Grade, all: BsfWeek[]): Star {
  const id = `bsf_w${String(week.week).padStart(2, '0')}_g${grade}`;

  const questions = week.questions
    .filter((q) => !q.grades || q.grades.includes(grade))
    .map((q, i) => toChallenge(q, id, i));

  const challenges: Challenge[] = [
    ...treasureChallenges(week, all, id),
    ...questions,
    gospelChallenge(week, id),
    ...verseChallenges(week, grade, id),
  ];

  return {
    id,
    subject: 'bsf',
    grade,
    title: `Lesson ${week.week}: ${week.title}`,
    blurb: week.summary,
    minutes: week.minutes ?? 18,
    content: {
      kind: 'passage',
      passage: {
        title: `${week.title} — ${week.reference}`,
        paragraphs: week.passage,
        readAlong: true,
        art: week.art,
        notes: [
          { label: 'Main Truth', text: week.truth, emphasis: true },
          { label: "God's Attribute", text: `${week.attribute.name} — ${week.attribute.meaning}` },
          { label: 'Doctrine', text: `${week.doctrine.term} — ${week.doctrine.meaning}` },
          { label: 'Gospel Connection', text: week.gospel },
          { label: 'Memory Verse', text: `“${week.memoryVerse.text}” — ${week.memoryVerse.reference} (NIV)`, emphasis: true },
        ],
      },
      challenges,
    },
  };
}

export function buildBsfStars(weeks: BsfWeek[], grade: Grade): Star[] {
  const sorted = [...weeks].sort((a, b) => a.week - b.week);
  return sorted.map((week) => buildBsfStar(week, grade, sorted));
}
