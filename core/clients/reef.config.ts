import type { ClientConfig } from '../config/schema';

/**
 * Example client 002 — an underwater build, for a different customer.
 *
 * This exists to keep the engine honest. A configuration layer that has only
 * ever described the app it was extracted from is not a pipeline, it is a
 * rename. Anything AnSo does that cannot be said here is a leak, and the leak
 * shows up as a hardcoded word in a component rather than as a value in a file.
 *
 * Not a shipping client. Delete or replace when a real second customer lands.
 */
export const reefConfig: ClientConfig = {
  clientId: 'reef',
  appName: 'Tidepool — Learn Beneath the Waves',
  domain: 'tidepool.d6five.com',
  themeId: 'underwater',
  artTier: 'prebuilt',

  terms: {
    currency: 'sea glass',
    currencyOne: 'piece of sea glass',
    currencyIcon: '🫧',
    lesson: 'shell',
    lessonPlural: 'shells',
    lessonGroup: 'reef',
    lessonGroupPlural: 'reefs',
    avatar: 'diver',
    homeBase: 'Your Tidepool',
    wardrobe: 'Dive Kit',
    shop: 'Trading Post',
    rewards: 'finds',
    guide: 'Marlow',
  },

  palette: {
    bgDeep: '#04141f',
    bgMid: '#0a2a3d',
    nebulaA: 'rgba(40, 170, 190, 0.16)',
    nebulaB: 'rgba(30, 90, 160, 0.14)',
    ink: '#eefaff',
    inkDim: '#a9cbd9',
    accent: '#5fe0d6',
    accentWarm: '#ffd08a',
    good: '#79e6b0',
    bad: '#ff9090',
  },

  subjects: [
    {
      id: 'reading',
      name: 'Reading',
      groupName: 'The Kelp Forest',
      color: { light: '#8fe6d8', deep: '#43bfae' },
      glyph: '📖',
      description: 'Read a story, then show Marlow what you understood.',
    },
    {
      id: 'vocabulary',
      name: 'Word Power',
      groupName: 'The Coral Garden',
      color: { light: '#ffb3c6', deep: '#f2789c' },
      glyph: '🐚',
      description: 'Collect new words and learn what they really mean.',
    },
    {
      id: 'math',
      name: 'Numbers',
      groupName: 'The Sandbar',
      color: { light: '#ffdd99', deep: '#f0bd52' },
      glyph: '🔢',
      description: 'Solve number puzzles that get a little braver each time.',
    },
    {
      id: 'thinking',
      name: 'Big Thinking',
      groupName: 'The Deep Trench',
      color: { light: '#b3c4f7', deep: '#7f95e8' },
      glyph: '🧩',
      description: 'Patterns, riddles, and problems worth slowing down for.',
    },
    {
      id: 'typing',
      name: 'Fast Fins',
      groupName: 'The Current',
      color: { light: '#9fe8f5', deep: '#54c8de' },
      glyph: '⌨️',
      description: 'Teach your fingers where every letter lives.',
    },
  ],

  learner: {
    grades: [2, 4],
    ageRange: '7-10',
    subjectFocus: ['reading', 'vocabulary', 'math', 'thinking', 'typing'],
    difficultyPacing: 'accelerated',
  },

  economy: {
    perCorrectAnswer: 8,
    firstCompletionBonus: 40,
    newPersonalBestBonus: 15,
    perfectScoreBonus: 30,
    // A slower drip than AnSo: this client wanted rewards to feel scarcer.
    rewardEveryNLessons: 2,
  },

  content: {
    source: 'd6five_default',
    curriculumRef: '',
  },

  reporting: {
    parentDashboardTier: 'detailed',
  },
};
