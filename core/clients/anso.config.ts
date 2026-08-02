import type { ClientConfig } from '../config/schema';

/**
 * Client 001 — AnSo.
 *
 * The first build, and therefore the reference: every value here was hardcoded
 * somewhere in the app before the engine existed. If a future client cannot
 * express something AnSo does, the schema is wrong rather than the client.
 */
export const ansoConfig: ClientConfig = {
  clientId: 'anso',
  appName: 'AnSo — A Universe of Learning',
  domain: 'anso.d6five.com',
  themeId: 'galaxy',
  artTier: 'prebuilt',

  terms: {
    currency: 'stardust',
    currencyOne: 'stardust',
    currencyIcon: '✨',
    lesson: 'star',
    lessonPlural: 'stars',
    lessonGroup: 'constellation',
    lessonGroupPlural: 'constellations',
    avatar: 'princess',
    homeBase: 'Her Royal Chamber',
    wardrobe: 'Wardrobe',
    shop: 'Stardust Shop',
    rewards: 'treasures',
    guide: 'AnSo',
  },

  palette: {
    bgDeep: '#07061a',
    bgMid: '#0f0d2b',
    nebulaA: 'rgba(120, 90, 220, 0.16)',
    nebulaB: 'rgba(40, 150, 190, 0.13)',
    ink: '#f3f0ff',
    inkDim: '#b8b2dd',
    accent: '#8be9fd',
    accentWarm: '#ffd479',
    good: '#7ee7b4',
    bad: '#ff8fa3',
  },

  subjects: [
    {
      id: 'reading',
      name: 'Reading',
      groupName: 'The Storyteller',
      color: { light: '#8fe0f0', deep: '#4fbfd9' },
      glyph: '📖',
      description: 'Read a story, then show AnSo what you understood.',
    },
    {
      id: 'vocabulary',
      name: 'Word Power',
      groupName: 'The Wordsmith',
      color: { light: '#f9b6ce', deep: '#ee87af' },
      glyph: '💫',
      description: 'Collect new words and learn what they really mean.',
    },
    {
      id: 'korean',
      name: 'Korean Words',
      groupName: 'The Lantern Road',
      color: { light: '#f9a8a8', deep: '#e97070' },
      glyph: '한',
      description: 'Learn to read and say your first words in Korean.',
    },
    {
      id: 'math',
      name: 'Numbers',
      groupName: 'The Counting Crown',
      color: { light: '#fbd98f', deep: '#f3bc5c' },
      glyph: '🔢',
      description: 'Solve number puzzles that get a little braver each time.',
    },
    {
      id: 'thinking',
      name: 'Big Thinking',
      groupName: 'The Puzzle Weaver',
      color: { light: '#c7b4f6', deep: '#a68deb' },
      glyph: '🧩',
      description: 'Patterns, riddles, and problems worth slowing down for.',
    },
    {
      id: 'typing',
      name: 'Star Typing',
      groupName: 'The Swift Hand',
      color: { light: '#9ee6c4', deep: '#63d6a2' },
      glyph: '⌨️',
      description: 'Teach your fingers where every letter lives.',
    },
    {
      id: 'bsf',
      name: 'Bible Study',
      groupName: 'The Lamp',
      color: { light: '#f9c4a1', deep: '#efa271' },
      glyph: '🕯️',
      description: "This week's lesson, questions, and verse to remember.",
    },
  ],

  learner: {
    grades: [1, 3],
    ageRange: '6-9',
    subjectFocus: ['reading', 'vocabulary', 'korean', 'math', 'thinking', 'typing', 'bsf'],
    difficultyPacing: 'standard',
  },

  economy: {
    perCorrectAnswer: 10,
    firstCompletionBonus: 50,
    newPersonalBestBonus: 20,
    perfectScoreBonus: 25,
    rewardEveryNLessons: 1,
  },

  content: {
    source: 'client_provided',
    curriculumRef: 'src/content',
  },

  reporting: {
    parentDashboardTier: 'basic',
  },
};
