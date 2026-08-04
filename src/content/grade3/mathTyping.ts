import type { Star } from '../../types';
import { GRADE3_SENTENCES, GRADE3_WORDS } from '../generators/typing';

/**
 * Grade 3 math.
 *
 * The whole ladder is the times tables, 1 through 12 — the goal is not
 * understanding what multiplication means (that takes ten minutes to grasp),
 * it is instant recall of all 144 facts. Every star is 30 questions of pure
 * multiplication, free numeric entry, so getting fast means getting fast at
 * typing the answer too. The ladder introduces each table on its own, then
 * reviews in growing combinations, then drills speed once the facts are in
 * place — cramming everything together from day one would just teach
 * counting on fingers under time pressure.
 */

export const grade3Math: Star[] = [
  {
    id: 'g3_math_01', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 600,
    title: 'The 2 and 3 Times Tables',
    blurb: 'Thirty questions, just these two tables. Take your time — speed comes later.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-2', 'mult-table-3'] } },
  },
  {
    id: 'g3_math_02', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 600,
    title: 'The 4 and 5 Times Tables',
    blurb: 'The 5s have a pattern: they always end in 0 or 5. Watch for it.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-4', 'mult-table-5'] } },
  },
  {
    id: 'g3_math_03', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'The 6 and 7 Times Tables',
    blurb: 'These two trip people up more than any others. Slow and correct first.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-6', 'mult-table-7'] } },
  },
  {
    id: 'g3_math_04', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'The 8 and 9 Times Tables',
    blurb: 'For the 9s: the digits of the answer always add up to 9. Try it.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-8', 'mult-table-9'] } },
  },
  {
    id: 'g3_math_05', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'The 10, 11, and 12 Times Tables',
    blurb: 'The last three, and often the easiest once you see the pattern.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-10', 'mult-table-11', 'mult-table-12'] } },
  },
  {
    id: 'g3_math_06', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'Review: 2 Through 5',
    blurb: 'The first four tables together. If one feels shaky, that is the one to notice.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-2', 'mult-table-3', 'mult-table-4', 'mult-table-5'] } },
  },
  {
    id: 'g3_math_07', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'Review: 6 Through 9',
    blurb: 'The trickiest four, back again. They get easier every time you meet them.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-6', 'mult-table-7', 'mult-table-8', 'mult-table-9'] } },
  },
  {
    id: 'g3_math_08', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 600,
    title: 'Review: 10, 11, and 12',
    blurb: 'The last three tables, mixed together.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-10', 'mult-table-11', 'mult-table-12'] } },
  },
  {
    id: 'g3_math_09', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 480,
    title: 'The Tricky Sevens and Eights',
    blurb: 'Extra practice on the two tables everybody needs the most reps on.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-7', 'mult-table-8'] } },
  },
  {
    id: 'g3_math_10', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 480,
    title: 'The Nine Pattern',
    blurb: 'All nines. Watch the tens digit go up while the ones digit goes down.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-9'] } },
  },
  {
    id: 'g3_math_11', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 600,
    title: 'Halfway There',
    blurb: 'Every table, fully mixed, for the first time. This is the real test.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_12', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 360,
    title: 'Speed Round: Small Numbers',
    blurb: 'Tables 2 through 6, against the clock now. Answer quickly — you know these.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-2', 'mult-table-3', 'mult-table-4', 'mult-table-5', 'mult-table-6'] } },
  },
  {
    id: 'g3_math_13', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 360,
    title: 'Speed Round: Big Numbers',
    blurb: 'Tables 7 through 12, against the clock.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-7', 'mult-table-8', 'mult-table-9', 'mult-table-10', 'mult-table-11', 'mult-table-12'] } },
  },
  {
    id: 'g3_math_14', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 480,
    title: 'Squares',
    blurb: 'A number times itself. These come up everywhere — worth knowing on sight.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-squares', 'mult-facts'] } },
  },
  {
    id: 'g3_math_15', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 600,
    title: 'All Twelve Tables',
    blurb: 'Every fact, fully shuffled, no pattern to lean on.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_16', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 360,
    title: 'All Twelve Tables, Faster',
    blurb: 'The same facts, less time to think. Recall, not calculate.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_17', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 480,
    title: 'Squares and Everything Else',
    blurb: 'Squares mixed back in with the full set.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-squares', 'mult-facts', 'mult-facts'] } },
  },
  {
    id: 'g3_math_18', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 420,
    title: 'Fast and Accurate',
    blurb: 'Facts you should know without stopping to work them out.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_19', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 360,
    title: 'One More Sprint',
    blurb: 'Same as the last star, a little less time. See if it feels easier.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_20', subject: 'math', grade: 3, minutes: 16, timeLimitSeconds: 300,
    title: 'The Times Table Crown',
    blurb: 'The final star. All twelve tables, fastest pace yet. Show me what you know.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
];

export const grade3Typing: Star[] = [
  {
    id: 'g3_type_01', subject: 'typing', grade: 3, minutes: 11,
    title: 'Home Row Refresher',
    blurb: 'Fingers on A S D F and J K L. Even if you know this, start here.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'asdfghjkl;', rounds: 8 } },
  },
  {
    id: 'g3_type_02', subject: 'typing', grade: 3, minutes: 11,
    title: 'Top Row',
    blurb: 'Reaching up and coming straight back home.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'qwertyuiop', rounds: 10 } },
  },
  {
    id: 'g3_type_03', subject: 'typing', grade: 3, minutes: 11,
    title: 'Bottom Row',
    blurb: 'The hardest row to reach. Keep your wrists still.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'zxcvbnm', rounds: 10 } },
  },
  {
    id: 'g3_type_04', subject: 'typing', grade: 3, minutes: 12,
    title: 'All Three Rows',
    blurb: 'Every letter, mixed. This is where it starts to feel automatic.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'abcdefghijklmnopqrstuvwxyz', rounds: 12 } },
  },
  {
    id: 'g3_type_05', subject: 'typing', grade: 3, minutes: 12,
    title: 'Space Words',
    blurb: 'Words from our journey, typed at speed.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: GRADE3_WORDS.slice(0, 18), rounds: 12 } },
  },
  {
    id: 'g3_type_06', subject: 'typing', grade: 3, minutes: 12,
    title: 'Thinking Words',
    blurb: 'Longer words. Watch for the tricky middles.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: GRADE3_WORDS.slice(12, 32), rounds: 12 } },
  },
  {
    id: 'g3_type_07', subject: 'typing', grade: 3, minutes: 12,
    title: 'Story Words',
    blurb: 'Words you will use whenever you write about a book.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: GRADE3_WORDS.slice(26), rounds: 12 } },
  },
  {
    id: 'g3_type_08', subject: 'typing', grade: 3, minutes: 13,
    title: 'The Whole Word Bank',
    blurb: 'Everything, shuffled. Accuracy still matters more than speed.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: GRADE3_WORDS, rounds: 14 } },
  },
  {
    id: 'g3_type_09', subject: 'typing', grade: 3, minutes: 13,
    title: 'Full Sentences',
    blurb: 'Capitals and full stops now. Shift with the opposite hand.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: GRADE3_SENTENCES.slice(0, 6) } },
  },
  {
    id: 'g3_type_10', subject: 'typing', grade: 3, minutes: 13,
    title: 'Longer Sentences',
    blurb: 'Commas and hyphens appear. Slow down for the punctuation.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: GRADE3_SENTENCES.slice(6) } },
  },
  {
    id: 'g3_type_11', subject: 'typing', grade: 3, minutes: 14,
    title: 'Endurance',
    blurb: 'Every sentence in one go. See if your accuracy holds to the end.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: GRADE3_SENTENCES } },
  },
  {
    id: 'g3_type_12', subject: 'typing', grade: 3, minutes: 14,
    title: 'The Swift Hand',
    blurb: 'The final typing star. Words and sentences, no warm-up. Show me.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [...GRADE3_SENTENCES].reverse() } },
  },
];
