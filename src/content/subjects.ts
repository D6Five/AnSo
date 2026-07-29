import type { Subject, SubjectId } from '../types';

/**
 * The six constellations of the learning universe. Order here is the order
 * they appear on the galaxy map.
 *
 * The palette is deliberately a family rather than six independent choices:
 * every hue sits at a similar lightness and chroma, so the cards read as one
 * set glowing against the dark sky instead of six colours competing. Fully
 * saturated hues looked harsh at this size and on black.
 */
export const SUBJECTS: Subject[] = [
  {
    id: 'reading',
    name: 'Reading',
    constellation: 'The Storyteller',
    color: '#8fe0f0',
    colorDeep: '#4fbfd9',
    glyph: '📖',
    description: 'Read a story, then show AnSo what you understood.',
  },
  {
    id: 'vocabulary',
    name: 'Word Power',
    constellation: 'The Wordsmith',
    color: '#f9b6ce',
    colorDeep: '#ee87af',
    glyph: '💫',
    description: 'Collect new words and learn what they really mean.',
  },
  {
    id: 'math',
    name: 'Numbers',
    constellation: 'The Counting Crown',
    color: '#fbd98f',
    colorDeep: '#f3bc5c',
    glyph: '🔢',
    description: 'Solve number puzzles that get a little braver each time.',
  },
  {
    id: 'thinking',
    name: 'Big Thinking',
    constellation: 'The Puzzle Weaver',
    color: '#c7b4f6',
    colorDeep: '#a68deb',
    glyph: '🧩',
    description: 'Patterns, riddles, and problems worth slowing down for.',
  },
  {
    id: 'typing',
    name: 'Star Typing',
    constellation: 'The Swift Hand',
    color: '#9ee6c4',
    colorDeep: '#63d6a2',
    glyph: '⌨️',
    description: 'Teach your fingers where every letter lives.',
  },
  {
    id: 'bsf',
    name: 'Bible Study',
    constellation: 'The Lamp',
    color: '#f9c4a1',
    colorDeep: '#efa271',
    glyph: '🕯️',
    description: 'This week\'s lesson, questions, and verse to remember.',
  },
];

export const SUBJECT_BY_ID: Record<SubjectId, Subject> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s]),
) as Record<SubjectId, Subject>;
