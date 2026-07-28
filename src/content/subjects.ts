import type { Subject, SubjectId } from '../types';

/**
 * The six constellations of the learning universe. Order here is the order
 * they appear on the galaxy map.
 */
export const SUBJECTS: Subject[] = [
  {
    id: 'reading',
    name: 'Reading',
    constellation: 'The Storyteller',
    color: '#8be9fd',
    glyph: '📖',
    description: 'Read a story, then show AnSo what you understood.',
  },
  {
    id: 'vocabulary',
    name: 'Word Power',
    constellation: 'The Wordsmith',
    color: '#ff9ecd',
    glyph: '💫',
    description: 'Collect new words and learn what they really mean.',
  },
  {
    id: 'math',
    name: 'Numbers',
    constellation: 'The Counting Crown',
    color: '#ffd479',
    glyph: '🔢',
    description: 'Solve number puzzles that get a little braver each time.',
  },
  {
    id: 'thinking',
    name: 'Big Thinking',
    constellation: 'The Puzzle Weaver',
    color: '#c9a7ff',
    glyph: '🧩',
    description: 'Patterns, riddles, and problems worth slowing down for.',
  },
  {
    id: 'typing',
    name: 'Star Typing',
    constellation: 'The Swift Hand',
    color: '#7ee7b4',
    glyph: '⌨️',
    description: 'Teach your fingers where every letter lives.',
  },
  {
    id: 'bsf',
    name: 'Bible Study',
    constellation: 'The Lamp',
    color: '#ffb86c',
    glyph: '🕯️',
    description: 'This week\'s lesson, questions, and verse to remember.',
  },
];

export const SUBJECT_BY_ID: Record<SubjectId, Subject> = Object.fromEntries(
  SUBJECTS.map((s) => [s.id, s]),
) as Record<SubjectId, Subject>;
