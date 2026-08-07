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
    blurb: 'All twelve tables at pace. And the journey continues past the crown.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_21', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 480,
    title: 'Twos and Twelves',
    blurb: 'The 12s are just the 2s plus the 10s. See the connection.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-2', 'mult-table-12'] } },
  },
  {
    id: 'g3_math_22', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 480,
    title: 'Threes and Elevens',
    blurb: 'One tricky table, one friendly one. Balance the effort.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-3', 'mult-table-11'] } },
  },
  {
    id: 'g3_math_23', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 480,
    title: 'Fours and Eights',
    blurb: 'The 8s are double the 4s. Doubling is a superpower.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-4', 'mult-table-8'] } },
  },
  {
    id: 'g3_math_24', subject: 'math', grade: 3, minutes: 12, timeLimitSeconds: 480,
    title: 'Threes and Sixes',
    blurb: 'The 6s are double the 3s. Another doubling shortcut.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-3', 'mult-table-6'] } },
  },
  {
    id: 'g3_math_25', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 450,
    title: 'Sevens Solo',
    blurb: 'Thirty questions, nothing but sevens. After today they are yours.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-7'] } },
  },
  {
    id: 'g3_math_26', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 450,
    title: 'Eights Solo',
    blurb: 'All eights, all the way through. Own this table.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-8'] } },
  },
  {
    id: 'g3_math_27', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 450,
    title: 'Sixes Solo',
    blurb: 'The 6s get a full star of their own. Steady focus.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-6'] } },
  },
  {
    id: 'g3_math_28', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 450,
    title: 'Twelves Solo',
    blurb: 'The biggest table, conquered one fact at a time.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-12'] } },
  },
  {
    id: 'g3_math_29', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 420,
    title: 'The Square Collection',
    blurb: 'All the squares from 1×1 to 12×12, plus mixed practice.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-squares'] } },
  },
  {
    id: 'g3_math_30', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 480,
    title: 'The Middle Mix',
    blurb: 'Tables 5 through 9 — the heart of the grid, fully shuffled.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-5', 'mult-table-6', 'mult-table-7', 'mult-table-8', 'mult-table-9'] } },
  },
  {
    id: 'g3_math_31', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 400,
    title: 'Trouble Spots Tour',
    blurb: '6s, 7s, 8s — the three tables that need the most visits.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-table-6', 'mult-table-7', 'mult-table-8'] } },
  },
  {
    id: 'g3_math_32', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 400,
    title: 'Full Grid, Steady Pace',
    blurb: 'Every fact possible. Keep your rhythm even.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_33', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 380,
    title: 'Full Grid, Quicker',
    blurb: 'Twenty fewer seconds than last time. You will not miss them.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_34', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 360,
    title: 'Six Minutes Flat',
    blurb: 'Thirty facts in six minutes. Twelve seconds each. Plenty.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_35', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 340,
    title: 'Shaving Seconds',
    blurb: 'The clock tightens again. Your recall is faster than you think.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_36', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 320,
    title: 'Squares at Speed',
    blurb: 'The squares again, now at a sprint. 7×7? Instantly.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-squares', 'mult-facts'] } },
  },
  {
    id: 'g3_math_37', subject: 'math', grade: 3, minutes: 13, timeLimitSeconds: 320,
    title: 'The Five-Minute Grid',
    blurb: 'All twelve tables with barely a breath between facts.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_38', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 300,
    title: 'Champion Pace',
    blurb: 'Ten seconds a fact. This is what mastery feels like.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_39', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 280,
    title: 'Beyond the Crown',
    blurb: 'Faster than the crown star. There is always a next level.',
    content: { kind: 'generated', count: 30, generator: { type: 'math', skills: ['mult-facts'] } },
  },
  {
    id: 'g3_math_40', subject: 'math', grade: 3, minutes: 14, timeLimitSeconds: 260,
    title: 'The Grand Master',
    blurb: 'The true final star. All 144 facts live in you now. Prove it.',
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
    blurb: 'Words and sentences, no warm-up. And the road goes on from here.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [...GRADE3_SENTENCES].reverse() } },
  },
  {
    id: 'g3_type_13', subject: 'typing', grade: 3, minutes: 12,
    title: 'The Number Row',
    blurb: 'Numbers live above the letters. Reach without looking.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: '1234567890', rounds: 10 } },
  },
  {
    id: 'g3_type_14', subject: 'typing', grade: 3, minutes: 12,
    title: 'Letters Meet Numbers',
    blurb: 'Mixed drills with digits — like typing real homework.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'keys', keys: 'asdfjkl4759', rounds: 10 } },
  },
  {
    id: 'g3_type_15', subject: 'typing', grade: 3, minutes: 12,
    title: 'Science Sentences',
    blurb: 'Type facts worth knowing.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'Honey found in ancient tombs is still safe to eat.',
      'An octopus can squeeze through a hole the size of a coin.',
      'The heart beats one hundred thousand times every day.',
      'Trees share food through fungus threads underground.',
    ] } },
  },
  {
    id: 'g3_type_16', subject: 'typing', grade: 3, minutes: 12,
    title: 'Question Practice',
    blurb: 'The question mark needs Shift. End every question properly.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'Why does the moon seem to follow the car?',
      'How deep is the deepest part of the ocean?',
      'What makes the leaves change color in fall?',
      'Where do birds go in the winter?',
    ] } },
  },
  {
    id: 'g3_type_17', subject: 'typing', grade: 3, minutes: 13,
    title: 'Quotation Marks',
    blurb: 'Typing what people say, with the marks that show it.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      '"Keep the lights," her father said.',
      '"I refused to accept that," said Mae.',
      '"It fell twice," Ruby said, "and then it did not."',
      '"Good," said the teacher. "Now do it again."',
    ] } },
  },
  {
    id: 'g3_type_18', subject: 'typing', grade: 3, minutes: 13,
    title: 'Animal Facts',
    blurb: 'True sentences about remarkable creatures.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'Army ants build bridges out of their own bodies.',
      'A hummingbird can fly backwards and upside down.',
      'Elephants can hear storms from a hundred miles away.',
      'An octopus has three hearts and blue blood.',
    ] } },
  },
  {
    id: 'g3_type_19', subject: 'typing', grade: 3, minutes: 13,
    title: 'Weather Report',
    blurb: 'Sentences with numbers mixed in — a common real-world combo.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'The storm lasted 4 weeks and the lamps never went out.',
      'Winds reached 40 miles per hour that morning.',
      'The temperature dropped 15 degrees in one hour.',
      'Boston got 12 inches of snow in a single day.',
    ] } },
  },
  {
    id: 'g3_type_20', subject: 'typing', grade: 3, minutes: 13,
    title: 'The Long Haul',
    blurb: 'Longer sentences that test your focus to the last letter.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'The women planted trees along the roads, on the farms, and around every school.',
      'From orbit the Earth has no borders, no lines, and no marks dividing anyone from anyone.',
      'The bad notes are not in the way of the good ones; they are the road to the good ones.',
    ] } },
  },
  {
    id: 'g3_type_21', subject: 'typing', grade: 3, minutes: 13,
    title: 'Apostrophe Alley',
    blurb: 'Contractions and belongings — the apostrophe key earns its place.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'It\'s the little things citizens do that matter most.',
      'Priya\'s notebook was full of wrong ideas that worked.',
      'Don\'t assume she\'s upset; go and ask her.',
      'The squirrel couldn\'t reach Priya\'s fourth feeder.',
    ] } },
  },
  {
    id: 'g3_type_22', subject: 'typing', grade: 3, minutes: 13,
    title: 'Speed Words One',
    blurb: 'Short common words at maximum pace. Let your fingers lead.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: ['the', 'and', 'that', 'have', 'with', 'this', 'from', 'they', 'been', 'were', 'said', 'each', 'which', 'their', 'will'], rounds: 12 } },
  },
  {
    id: 'g3_type_23', subject: 'typing', grade: 3, minutes: 13,
    title: 'Speed Words Two',
    blurb: 'Longer words at pace. Rhythm over rush.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: ['because', 'through', 'thought', 'together', 'important', 'different', 'remember', 'sentence', 'question', 'discover'], rounds: 12 } },
  },
  {
    id: 'g3_type_24', subject: 'typing', grade: 3, minutes: 13,
    title: 'The Story Sprint',
    blurb: 'A tiny story, typed sentence by sentence.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'The keeper climbed the tower as the storm began.',
      'She trimmed the wicks and filled the lamps with oil.',
      'All night the light swept across the crashing waves.',
      'Every ship that passed the rocks came home safe.',
    ] } },
  },
  {
    id: 'g3_type_25', subject: 'typing', grade: 3, minutes: 13,
    title: 'Capital Cities',
    blurb: 'Proper nouns need capital letters. Shift is your friend.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'Katherine Johnson worked at NASA in Virginia.',
      'Wangari Maathai planted trees across Kenya.',
      'The Mariana Trench lies in the Pacific Ocean.',
      'Abbie kept the lighthouse off the coast of Maine.',
    ] } },
  },
  {
    id: 'g3_type_26', subject: 'typing', grade: 3, minutes: 14,
    title: 'The Paragraph Push',
    blurb: 'Multiple connected sentences. Real writing stamina.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'William found a book about windmills in the library.',
      'He collected junk parts for months while neighbors laughed.',
      'When he connected the machine, a bulb began to glow.',
      'It was the first electric light his family ever had.',
    ] } },
  },
  {
    id: 'g3_type_27', subject: 'typing', grade: 3, minutes: 14,
    title: 'Tricky Spellings',
    blurb: 'Words that fool fingers — double letters and silent partners.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: ['necessary', 'beautiful', 'suddenly', 'happened', 'tomorrow', 'beginning', 'different', 'interesting', 'favorite', 'probably'], rounds: 12 } },
  },
  {
    id: 'g3_type_28', subject: 'typing', grade: 3, minutes: 14,
    title: 'Mixed Everything',
    blurb: 'Words, numbers, capitals, punctuation — all in one drill.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'Inky escaped through a 50-meter drainpipe to the sea.',
      'The tank held 2 million gallons of molasses.',
      'By age 9, your heart has beaten 300 million times.',
      'Earth\'s deepest trench is 11 kilometers down.',
    ] } },
  },
  {
    id: 'g3_type_29', subject: 'typing', grade: 3, minutes: 14,
    title: 'The Quiet Champion',
    blurb: 'Sentences worth keeping. Type them like you mean them.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'Somehow I managed, though at times greatly exhausted.',
      'A failure you understand is worth more than a lucky success.',
      'Forty people saw the mountain, but one person saw the bag.',
      'The light did not tell them it was tired.',
    ] } },
  },
  {
    id: 'g3_type_30', subject: 'typing', grade: 3, minutes: 14,
    title: 'Marathon One',
    blurb: 'Every word from the word bank, one long run.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'words', words: GRADE3_WORDS, rounds: 16 } },
  },
  {
    id: 'g3_type_31', subject: 'typing', grade: 3, minutes: 14,
    title: 'Marathon Two',
    blurb: 'Every sentence you have ever typed here, back to back.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: GRADE3_SENTENCES } },
  },
  {
    id: 'g3_type_32', subject: 'typing', grade: 3, minutes: 14,
    title: 'The Golden Fingers',
    blurb: 'The true final typing star. Everything, at your best speed. Type proud.',
    content: { kind: 'generated', count: 0, generator: { type: 'typing', mode: 'sentence', sentences: [
      'My fingers know every key without looking now.',
      'I type with rhythm, accuracy, and speed.',
      'From four keys to full paragraphs in thirty-two stars.',
      'This is only the beginning of everything I will write.',
    ] } },
  },
];
