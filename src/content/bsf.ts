import type { Challenge, Grade, Star } from '../types';

/**
 * Bible Study Fellowship weekly curriculum.
 *
 * The weekly material is not built into the app — it is dropped into
 * `bsfWeeks.ts` as plain data and turned into stars here. That means adding a
 * new week is editing one array, with no React and no rebuilding of activities.
 *
 * Each week produces one star per grade, scaled by the `grades` field: write
 * the questions once and mark which ages they suit, or provide grade-specific
 * versions where the wording needs to differ.
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
  /** e.g. "Genesis 1:1-31" */
  reference: string;
  /** A short summary AnSo reads to set up the lesson. */
  summary: string;
  /** The passage or key portion, one string per paragraph or verse. */
  passage: string[];
  /** The verse to learn by heart, if the week has one. */
  memoryVerse?: { text: string; reference: string };
  questions: BsfQuestion[];
  /** Estimated minutes. Defaults to 15. */
  minutes?: number;
}

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

/** Build a memory-verse challenge when the week supplies one. */
function memoryChallenge(week: BsfWeek, starId: string): Challenge | null {
  if (!week.memoryVerse) return null;
  return {
    kind: 'typing',
    id: `${starId}_verse`,
    mode: 'sentence',
    target: week.memoryVerse.text,
    prompt: `Let us learn this week's verse by heart. Type it out — ${week.memoryVerse.reference}.`,
    hint: 'Take it slowly. Getting it right matters more than getting it fast.',
    teach: `${week.memoryVerse.reference}. Say it once more before you go.`,
  };
}

export function buildBsfStar(week: BsfWeek, grade: Grade): Star {
  const id = `bsf_w${String(week.week).padStart(2, '0')}_g${grade}`;

  const questions = week.questions
    .filter((q) => !q.grades || q.grades.includes(grade))
    .map((q, i) => toChallenge(q, id, i));

  const verse = memoryChallenge(week, id);
  const challenges = verse ? [...questions, verse] : questions;

  return {
    id,
    subject: 'bsf',
    grade,
    title: `Week ${week.week}: ${week.title}`,
    blurb: week.summary,
    minutes: week.minutes ?? 15,
    content: {
      kind: 'passage',
      passage: {
        title: `${week.title} — ${week.reference}`,
        paragraphs: week.passage,
      },
      challenges,
    },
  };
}

export function buildBsfStars(weeks: BsfWeek[], grade: Grade): Star[] {
  return [...weeks]
    .sort((a, b) => a.week - b.week)
    .map((week) => buildBsfStar(week, grade));
}
