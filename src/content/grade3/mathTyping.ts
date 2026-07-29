import type { Star } from '../../types';
import { GRADE3_SENTENCES, GRADE3_WORDS } from '../generators/typing';

/**
 * Grade 3 math and typing.
 *
 * Third grade math is where multiplication, division, and fractions arrive, so
 * the ladder spends most of its length there. Free numeric entry throughout —
 * by this age the typing is not the obstacle.
 */

export const grade3Math: Star[] = [
  {
    id: 'g3_math_01', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 600,
    title: 'Warming Up',
    blurb: 'Two-digit adding and taking away, to see where we are starting from.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-two-digit', 'sub-two-digit'] } },
  },
  {
    id: 'g3_math_02', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'Into the Hundreds',
    blurb: 'Three-digit numbers. Line up the hundreds, tens, and ones in your head.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-three-digit'] } },
  },
  {
    id: 'g3_math_03', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'Borrowing and Regrouping',
    blurb: 'Subtraction with big numbers. This is the one people find tricky — take your time.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['sub-three-digit'] } },
  },
  {
    id: 'g3_math_04', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 600,
    title: 'Groups of Things',
    blurb: 'Multiplication is just adding the same number over and over, faster.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_05', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 600,
    title: 'Sharing Equally',
    blurb: 'Division. The opposite question to multiplication.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['div-facts'] } },
  },
  {
    id: 'g3_math_06', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'Times and Share Together',
    blurb: 'Both directions, mixed. Read the sign before you start.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts', 'div-facts'] } },
  },
  {
    id: 'g3_math_07', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'Bigger Multiplication',
    blurb: 'Two-digit times one-digit. Break the big number apart first.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-two-digit'] } },
  },
  {
    id: 'g3_math_08', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'Pieces of a Whole',
    blurb: 'Fractions. Which piece is bigger, and why.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['fractions-compare'] } },
  },
  {
    id: 'g3_math_09', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'The Same Amount, Different Names',
    blurb: 'One half and two quarters are the same thing wearing different clothes.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['fractions-equivalent'] } },
  },
  {
    id: 'g3_math_10', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 600,
    title: 'Close Enough',
    blurb: 'Rounding. Knowing roughly is often more useful than knowing exactly.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['rounding'] } },
  },
  {
    id: 'g3_math_11', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'Around and Inside',
    blurb: 'Area and perimeter. One is the walk around, one is the space within.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['area-perimeter'] } },
  },
  {
    id: 'g3_math_12', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'Watching the Clock',
    blurb: 'Elapsed time. How long from now until then.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['elapsed-time'] } },
  },
  {
    id: 'g3_math_13', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 600,
    title: 'Making Change',
    blurb: 'Money problems. Counting up is usually easier than subtracting.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['money'] } },
  },
  {
    id: 'g3_math_14', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 600,
    title: 'Problems in Words',
    blurb: 'The maths is hidden inside a story. Find it first, then solve it.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['word-problem'] } },
  },
  {
    id: 'g3_math_15', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 600,
    title: 'Harder Stories',
    blurb: 'These take two steps. Do the first one before you look for the second.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['word-problem', 'mult-facts', 'div-facts'] } },
  },
  {
    id: 'g3_math_16', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 600,
    title: 'Fractions and Rounding',
    blurb: 'Two of the trickiest ideas, side by side.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['fractions-compare', 'fractions-equivalent', 'rounding'] } },
  },
  {
    id: 'g3_math_17', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 600,
    title: 'Measure and Time',
    blurb: 'Shapes, clocks, and coins together.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['area-perimeter', 'elapsed-time', 'money'] } },
  },
  {
    id: 'g3_math_18', subject: 'math', grade: 3, minutes: 15, timeLimitSeconds: 600,
    title: 'The Whole Ladder',
    blurb: 'Everything from this constellation, all mixed together.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-three-digit', 'sub-three-digit', 'mult-facts', 'div-facts', 'fractions-compare', 'rounding', 'word-problem'] } },
  },
  {
    id: 'g3_math_19', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 600,
    title: 'Fast and Accurate',
    blurb: 'Facts you should know without stopping to work them out.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts', 'div-facts'] } },
  },
  {
    id: 'g3_math_20', subject: 'math', grade: 3, minutes: 16, timeLimitSeconds: 600,
    title: 'The Counting Crown',
    blurb: 'The final star. Twenty problems, every skill you have. Go carefully.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-three-digit', 'sub-three-digit', 'mult-two-digit', 'div-facts', 'fractions-equivalent', 'rounding', 'area-perimeter', 'elapsed-time', 'money', 'word-problem'] } },
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
