import type { Star } from '../../types';
import { GRADE1_SENTENCES, GRADE1_WORDS } from '../generators/typing';

/**
 * Grade 1 math and typing.
 *
 * Both are generator-driven, so a star is a short spec rather than a list of
 * problems. Multiple choice stays on for the first-grade math stars — free
 * numeric entry is a separate skill from arithmetic, and mixing the two just
 * measures typing.
 */

export const grade1Math: Star[] = [
  {
    id: 'g1_math_01', subject: 'math', grade: 1, minutes: 11,
    title: 'Counting Up to Ten',
    blurb: 'We start where every mathematician starts. Small numbers, said out loud.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['add-within-10'], multipleChoice: true } },
  },
  {
    id: 'g1_math_02', subject: 'math', grade: 1, minutes: 11,
    title: 'Taking Away',
    blurb: 'Now we go the other direction. Counting backwards is its own kind of brave.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['sub-within-10'], multipleChoice: true } },
  },
  {
    id: 'g1_math_03', subject: 'math', grade: 1, minutes: 11,
    title: 'Both Directions',
    blurb: 'Adding and taking away, mixed together. Read each one carefully.',
    content: { kind: 'generated', count: 14, generator: { type: 'math', skills: ['add-within-10', 'sub-within-10'], multipleChoice: true } },
  },
  {
    id: 'g1_math_04', subject: 'math', grade: 1, minutes: 12,
    title: 'Past Ten',
    blurb: 'The numbers get bigger. You are ready for them.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['add-within-20'], multipleChoice: true } },
  },
  {
    id: 'g1_math_05', subject: 'math', grade: 1, minutes: 12,
    title: 'Taking Away from Twenty',
    blurb: 'Bigger numbers, same idea.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['sub-within-20'], multipleChoice: true } },
  },
  {
    id: 'g1_math_06', subject: 'math', grade: 1, minutes: 11,
    title: 'The Missing Number',
    blurb: 'Something is hiding in each of these. Your job is to find it.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['missing-addend'], multipleChoice: true } },
  },
  {
    id: 'g1_math_07', subject: 'math', grade: 1, minutes: 11,
    title: 'Skip, Skip, Skip',
    blurb: 'Counting by twos, fives, and tens. Patterns hiding inside numbers.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['skip-count'], multipleChoice: true } },
  },
  {
    id: 'g1_math_08', subject: 'math', grade: 1, minutes: 11,
    title: 'Which Is Bigger',
    blurb: 'Comparing numbers without counting every single one.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['compare'], multipleChoice: true } },
  },
  {
    id: 'g1_math_09', subject: 'math', grade: 1, minutes: 12,
    title: 'Tens and Ones',
    blurb: 'Every two-digit number is made of tens and leftovers.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['place-value'], multipleChoice: true } },
  },
  {
    id: 'g1_math_10', subject: 'math', grade: 1, minutes: 13,
    title: 'Story Numbers',
    blurb: 'Now the maths comes wrapped in a story. Listen for what is being asked.',
    content: { kind: 'generated', count: 10, generator: { type: 'math', skills: ['word-problem'], multipleChoice: true } },
  },
  {
    id: 'g1_math_11', subject: 'math', grade: 1, minutes: 12,
    title: 'Coins and Cents',
    blurb: 'Money is just counting with a job to do.',
    content: { kind: 'generated', count: 10, generator: { type: 'math', skills: ['money'], multipleChoice: true } },
  },
  {
    id: 'g1_math_12', subject: 'math', grade: 1, minutes: 13,
    title: 'Everything So Far',
    blurb: 'A mix of everything you have learned. No hints about which is which.',
    content: { kind: 'generated', count: 15, generator: { type: 'math', skills: ['add-within-20', 'sub-within-20', 'missing-addend', 'compare', 'skip-count'], multipleChoice: true } },
  },
  {
    id: 'g1_math_13', subject: 'math', grade: 1, minutes: 12,
    title: 'No More Choices',
    blurb: 'This time you type the answer yourself. I believe you can.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['add-within-20', 'sub-within-20'] } },
  },
  {
    id: 'g1_math_14', subject: 'math', grade: 1, minutes: 13,
    title: 'Bigger Sums',
    blurb: 'Two-digit numbers. Add the tens first, then the ones.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['add-two-digit'], multipleChoice: true } },
  },
  {
    id: 'g1_math_15', subject: 'math', grade: 1, minutes: 13,
    title: 'Bigger Take-Aways',
    blurb: 'Same idea, going down instead of up.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['sub-two-digit'], multipleChoice: true } },
  },
  {
    id: 'g1_math_16', subject: 'math', grade: 1, minutes: 13,
    title: 'Story Problems Again',
    blurb: 'Harder stories this time. Read them twice if you need to.',
    content: { kind: 'generated', count: 12, generator: { type: 'math', skills: ['word-problem'] } },
  },
  {
    id: 'g1_math_17', subject: 'math', grade: 1, minutes: 13,
    title: 'Number Detective',
    blurb: 'Missing numbers and comparisons all mixed up.',
    content: { kind: 'generated', count: 14, generator: { type: 'math', skills: ['missing-addend', 'compare', 'place-value'] } },
  },
  {
    id: 'g1_math_18', subject: 'math', grade: 1, minutes: 14,
    title: 'The Long Climb',
    blurb: 'Fifteen problems, everything mixed. This is your biggest one yet.',
    content: { kind: 'generated', count: 15, generator: { type: 'math', skills: ['add-two-digit', 'sub-two-digit', 'skip-count', 'money', 'word-problem'] } },
  },
  {
    id: 'g1_math_19', subject: 'math', grade: 1, minutes: 13,
    title: 'Speed and Steadiness',
    blurb: 'Quick ones. Do not rush — steady wins here.',
    content: { kind: 'generated', count: 16, generator: { type: 'math', skills: ['add-within-20', 'sub-within-20', 'missing-addend'] } },
  },
  {
    id: 'g1_math_20', subject: 'math', grade: 1, minutes: 15,
    title: 'The Counting Crown',
    blurb: 'The last star in this constellation. Everything you know, all at once.',
    content: { kind: 'generated', count: 18, generator: { type: 'math', skills: ['add-two-digit', 'sub-two-digit', 'missing-addend', 'compare', 'place-value', 'skip-count', 'money', 'word-problem'] } },
  },
];

export const grade1Typing: Star[] = [
  {
    id: 'g1_type_01', subject: 'typing', grade: 1, minutes: 10,
    title: 'Finding Home',
    blurb: 'Put your left fingers on A S D F and your right on J K L. That is home.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'asdfjkl', rounds: 8 } },
  },
  {
    id: 'g1_type_02', subject: 'typing', grade: 1, minutes: 10,
    title: 'Left Hand Alone',
    blurb: 'Just the left side today. Slow and correct beats fast and wrong.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'asdfg', rounds: 8 } },
  },
  {
    id: 'g1_type_03', subject: 'typing', grade: 1, minutes: 10,
    title: 'Right Hand Alone',
    blurb: 'Now the other side.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'hjkl;', rounds: 8 } },
  },
  {
    id: 'g1_type_04', subject: 'typing', grade: 1, minutes: 10,
    title: 'Both Hands Together',
    blurb: 'The whole home row. Try not to look down.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'asdfghjkl;', rounds: 10 } },
  },
  {
    id: 'g1_type_05', subject: 'typing', grade: 1, minutes: 10,
    title: 'Reaching Up',
    blurb: 'Now we reach up to the row above home, and come straight back.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'asdfjklqwerty', rounds: 10 } },
  },
  {
    id: 'g1_type_06', subject: 'typing', grade: 1, minutes: 10,
    title: 'Reaching Down',
    blurb: 'And down to the bottom row. Fingers always come home after.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'asdfjklzxcvbnm', rounds: 10 } },
  },
  {
    id: 'g1_type_07', subject: 'typing', grade: 1, minutes: 11,
    title: 'The Whole Keyboard',
    blurb: 'Every letter now. This one is a real stretch.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'abcdefghijklmnopqrstuvwxyz', rounds: 10 } },
  },
  {
    id: 'g1_type_08', subject: 'typing', grade: 1, minutes: 11,
    title: 'First Real Words',
    blurb: 'Words you already know how to read. Now your fingers learn them too.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: GRADE1_WORDS.slice(0, 20), rounds: 10 } },
  },
  {
    id: 'g1_type_09', subject: 'typing', grade: 1, minutes: 11,
    title: 'More Words',
    blurb: 'A bigger pile of words to practise with.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: GRADE1_WORDS.slice(15, 40), rounds: 10 } },
  },
  {
    id: 'g1_type_10', subject: 'typing', grade: 1, minutes: 11,
    title: 'Colour and Number Words',
    blurb: 'Words you use every single day.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: GRADE1_WORDS.slice(28, 50), rounds: 10 } },
  },
  {
    id: 'g1_type_11', subject: 'typing', grade: 1, minutes: 12,
    title: 'All the Words',
    blurb: 'Everything from every word star, mixed together.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: GRADE1_WORDS, rounds: 12 } },
  },
  {
    id: 'g1_type_12', subject: 'typing', grade: 1, minutes: 12,
    title: 'Your First Sentences',
    blurb: 'Capital letters need Shift. Use the finger on the opposite hand.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: GRADE1_SENTENCES.slice(0, 5) } },
  },
  {
    id: 'g1_type_13', subject: 'typing', grade: 1, minutes: 12,
    title: 'More Sentences',
    blurb: 'Longer ones. Remember the full stop at the end.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: GRADE1_SENTENCES.slice(5) } },
  },
  {
    id: 'g1_type_14', subject: 'typing', grade: 1, minutes: 13,
    title: 'The Swift Hand',
    blurb: 'Every sentence you have learned. The last star of this constellation.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: GRADE1_SENTENCES } },
  },
];
