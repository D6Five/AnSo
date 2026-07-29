import type { Star } from '../../types';
import { GRADE1_SENTENCES, GRADE1_WORDS } from '../generators/typing';

/**
 * Grade 1 maths and typing.
 *
 * Maths runs 30 questions per star against a clock, because fluency — not just
 * correctness — is the point at this stage. The time allowed is generous
 * (roughly 20 seconds a question) so it pushes without panicking, and running
 * out ends the star with the work already done rather than discarding it.
 * Multiple choice is off from early on: choosing between four numbers is a
 * different and easier skill than actually computing the answer.
 *
 * Typing starts far gentler than it used to. A six-year-old hunting for keys
 * needs single letters and two-letter clusters long before whole sentences.
 */

/** 30 questions at roughly 20 seconds each. */
const MATH_TIME = 600;

export const grade1Math: Star[] = [
  {
    id: 'g1_math_01', subject: 'math', grade: 1, minutes: 11, timeLimitSeconds: MATH_TIME,
    title: 'Counting Up to Ten',
    blurb: 'Thirty questions, and a clock. Do not rush — steady is faster than frantic.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-within-10', 'sub-within-10'] } },
  },
  {
    id: 'g1_math_02', subject: 'math', grade: 1, minutes: 11, timeLimitSeconds: MATH_TIME,
    title: 'Taking Away',
    blurb: 'Counting backwards is its own kind of brave.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['sub-within-10', 'sub-within-20'] } },
  },
  {
    id: 'g1_math_03', subject: 'math', grade: 1, minutes: 12, timeLimitSeconds: MATH_TIME,
    title: 'Past Ten',
    blurb: 'The numbers get bigger. You are ready for them.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-within-20', 'sub-within-20'] } },
  },
  {
    id: 'g1_math_04', subject: 'math', grade: 1, minutes: 12, timeLimitSeconds: MATH_TIME,
    title: 'The Missing Number',
    blurb: 'Something is hiding in each of these. Your job is to find it.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['missing-addend', 'add-within-20'] } },
  },
  {
    id: 'g1_math_05', subject: 'math', grade: 1, minutes: 12, timeLimitSeconds: MATH_TIME,
    title: 'Skip, Skip, Skip',
    blurb: 'Counting by twos, fives and tens. Patterns hiding inside numbers.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['skip-count', 'compare'] } },
  },
  {
    id: 'g1_math_06', subject: 'math', grade: 1, minutes: 12, timeLimitSeconds: MATH_TIME,
    title: 'Tens and Ones',
    blurb: 'Every two-digit number is made of tens and leftovers.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['place-value', 'compare'] } },
  },
  {
    id: 'g1_math_07', subject: 'math', grade: 1, minutes: 13, timeLimitSeconds: MATH_TIME,
    title: 'Bigger Sums',
    blurb: 'Two-digit numbers. Add the tens first, then the ones.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-two-digit'] } },
  },
  {
    id: 'g1_math_08', subject: 'math', grade: 1, minutes: 13, timeLimitSeconds: MATH_TIME,
    title: 'Bigger Take-Aways',
    blurb: 'Same idea, going down instead of up.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['sub-two-digit'] } },
  },
  {
    id: 'g1_math_09', subject: 'math', grade: 1, minutes: 13, timeLimitSeconds: MATH_TIME,
    title: 'Story Numbers',
    blurb: 'The maths comes wrapped in a story. Listen for what is being asked.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['word-problem'] } },
  },
  {
    id: 'g1_math_10', subject: 'math', grade: 1, minutes: 13, timeLimitSeconds: MATH_TIME,
    title: 'Coins and Cents',
    blurb: 'Money is just counting with a job to do.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['money'] } },
  },
  {
    id: 'g1_math_11', subject: 'math', grade: 1, minutes: 13, timeLimitSeconds: MATH_TIME,
    title: 'Both Directions',
    blurb: 'Adding and taking away, all mixed up. Read the sign every time.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-two-digit', 'sub-two-digit', 'missing-addend'] } },
  },
  {
    id: 'g1_math_12', subject: 'math', grade: 1, minutes: 14, timeLimitSeconds: MATH_TIME,
    title: 'Number Detective',
    blurb: 'Missing numbers, comparisons and place value together.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['missing-addend', 'compare', 'place-value', 'skip-count'] } },
  },
  {
    id: 'g1_math_13', subject: 'math', grade: 1, minutes: 14, timeLimitSeconds: MATH_TIME,
    title: 'Groups of Things',
    blurb: 'Adding the same number over and over. This is the beginning of times tables.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['skip-count', 'word-problem', 'add-two-digit'] } },
  },
  {
    id: 'g1_math_14', subject: 'math', grade: 1, minutes: 14, timeLimitSeconds: MATH_TIME,
    title: 'Harder Stories',
    blurb: 'These take two steps. Do the first before you look for the second.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['word-problem', 'money'] } },
  },
  {
    id: 'g1_math_15', subject: 'math', grade: 1, minutes: 14, timeLimitSeconds: MATH_TIME,
    title: 'Speed and Steadiness',
    blurb: 'Quick ones. Accuracy first — the clock is not the boss of you.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-within-20', 'sub-within-20', 'missing-addend'] } },
  },
  {
    id: 'g1_math_16', subject: 'math', grade: 1, minutes: 15, timeLimitSeconds: MATH_TIME,
    title: 'The Long Climb',
    blurb: 'Everything you know, thirty questions, one clock.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-two-digit', 'sub-two-digit', 'skip-count', 'money', 'word-problem'] } },
  },
  {
    id: 'g1_math_17', subject: 'math', grade: 1, minutes: 15, timeLimitSeconds: MATH_TIME,
    title: 'Into the Hundreds',
    blurb: 'Three-digit numbers. Hundreds, then tens, then ones.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-three-digit'] } },
  },
  {
    id: 'g1_math_18', subject: 'math', grade: 1, minutes: 15, timeLimitSeconds: MATH_TIME,
    title: 'Big Take-Aways',
    blurb: 'Subtracting past a hundred. This one is genuinely hard.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['sub-three-digit'] } },
  },
  {
    id: 'g1_math_19', subject: 'math', grade: 1, minutes: 15, timeLimitSeconds: MATH_TIME,
    title: 'Everything So Far',
    blurb: 'No hints about which kind is which. Read each one properly.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-three-digit', 'sub-three-digit', 'missing-addend', 'place-value', 'money'] } },
  },
  {
    id: 'g1_math_20', subject: 'math', grade: 1, minutes: 16, timeLimitSeconds: MATH_TIME,
    title: 'The Counting Crown',
    blurb: 'The last star of this constellation. Everything, all at once.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['add-three-digit', 'sub-three-digit', 'missing-addend', 'compare', 'place-value', 'skip-count', 'money', 'word-problem'] } },
  },
];

export const grade1Typing: Star[] = [
  {
    id: 'g1_type_01', subject: 'typing', grade: 1, minutes: 8,
    title: 'Just Four Keys',
    blurb: 'Rest your left fingers on A S D F. That is all we need today.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'asdf', rounds: 6 } },
  },
  {
    id: 'g1_type_02', subject: 'typing', grade: 1, minutes: 8,
    title: 'Four More Keys',
    blurb: 'Now the right hand. J K L, and nothing else.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'jkl', rounds: 6 } },
  },
  {
    id: 'g1_type_03', subject: 'typing', grade: 1, minutes: 8,
    title: 'Both Hands',
    blurb: 'Left and right together. Slow is perfectly fine.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'asdfjkl', rounds: 8 } },
  },
  {
    id: 'g1_type_04', subject: 'typing', grade: 1, minutes: 9,
    title: 'Two Little Words',
    blurb: 'Real words now. Only the shortest ones.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: ['a', 'as', 'ask', 'all', 'fall', 'lad', 'salad', 'flask'], rounds: 8 } },
  },
  {
    id: 'g1_type_05', subject: 'typing', grade: 1, minutes: 9,
    title: 'Adding E and I',
    blurb: 'Two new letters. Your fingers reach up just a little.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'asdfjklei', rounds: 8 } },
  },
  {
    id: 'g1_type_06', subject: 'typing', grade: 1, minutes: 9,
    title: 'Words You Know',
    blurb: 'Words you can already read. Now your fingers learn them.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: ['the', 'and', 'see', 'like', 'is', 'it', 'in', 'at', 'me', 'we'], rounds: 8 } },
  },
  {
    id: 'g1_type_07', subject: 'typing', grade: 1, minutes: 9,
    title: 'More Letters',
    blurb: 'A few more keys join in.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'asdfjkleirumn', rounds: 8 } },
  },
  {
    id: 'g1_type_08', subject: 'typing', grade: 1, minutes: 10,
    title: 'Little Words',
    blurb: 'Short words, typed one letter at a time.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: GRADE1_WORDS.slice(0, 16), rounds: 8 } },
  },
  {
    id: 'g1_type_09', subject: 'typing', grade: 1, minutes: 10,
    title: 'Colour Words',
    blurb: 'Red, blue, green. Words you use every day.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: ['red', 'blue', 'green', 'one', 'two', 'three', 'sun', 'moon', 'star', 'cat', 'dog'], rounds: 8 } },
  },
  {
    id: 'g1_type_10', subject: 'typing', grade: 1, minutes: 10,
    title: 'The Whole Alphabet',
    blurb: 'Every letter now. Take your time and look for each one.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'abcdefghijklmnopqrstuvwxyz', rounds: 8 } },
  },
  {
    id: 'g1_type_11', subject: 'typing', grade: 1, minutes: 11,
    title: 'All the Words',
    blurb: 'Everything from every word star so far.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: GRADE1_WORDS, rounds: 10 } },
  },
  {
    id: 'g1_type_12', subject: 'typing', grade: 1, minutes: 11,
    title: 'Your First Sentence',
    blurb: 'A capital letter needs Shift. Hold it with the other hand.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: GRADE1_SENTENCES.slice(0, 4) } },
  },
  {
    id: 'g1_type_13', subject: 'typing', grade: 1, minutes: 12,
    title: 'More Sentences',
    blurb: 'Remember the full stop at the end.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: GRADE1_SENTENCES.slice(4, 8) } },
  },
  {
    id: 'g1_type_14', subject: 'typing', grade: 1, minutes: 12,
    title: 'The Swift Hand',
    blurb: 'Every sentence you have learned. The last star here.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: GRADE1_SENTENCES } },
  },
];
