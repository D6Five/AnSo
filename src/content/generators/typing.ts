/**
 * Typing drill generation.
 *
 * Progression follows the standard touch-typing ladder: home row first, then
 * outward to the top and bottom rows, then real words, then sentences with
 * capitals and punctuation. Key drills are generated so each round is fresh;
 * word and sentence drills draw on curated lists that match each grade's
 * reading level, so typing practice doubles as reading practice.
 */

import type { TypingChallenge, TypingDrill } from '../../types';
import type { Rng } from '../../core/rng';

/** Build pronounceable-ish clusters rather than pure random mash. */
function keyCluster(keys: string, rng: Rng, length: number): string {
  let out = '';
  for (let i = 0; i < length; i++) out += keys[rng.int(0, keys.length - 1)];
  return out;
}

function keyLine(keys: string, rng: Rng): string {
  const groups = rng.int(4, 6);
  const parts: string[] = [];
  for (let i = 0; i < groups; i++) parts.push(keyCluster(keys, rng, rng.int(2, 4)));
  return parts.join(' ');
}

export function generateTyping(
  drill: TypingDrill,
  rng: Rng,
  idPrefix: string,
): TypingChallenge[] {
  const out: TypingChallenge[] = [];

  if (drill.mode === 'keys') {
    for (let i = 0; i < drill.rounds; i++) {
      out.push({
        kind: 'typing',
        id: `${idPrefix}_t${i}`,
        mode: 'keys',
        target: keyLine(drill.keys, rng),
        prompt: 'Type what you see. Keep your fingers resting on the home row.',
        hint: 'Left hand on A S D F, right hand on J K L and semicolon.',
      });
    }
    return out;
  }

  if (drill.mode === 'words') {
    for (let i = 0; i < drill.rounds; i++) {
      const line = rng
        .shuffle(drill.words)
        .slice(0, rng.int(4, 6))
        .join(' ');
      out.push({
        kind: 'typing',
        id: `${idPrefix}_t${i}`,
        mode: 'words',
        target: line,
        prompt: 'Type these words. Accuracy first, speed will follow.',
        hint: 'Try not to look down at your hands.',
      });
    }
    return out;
  }

  drill.sentences.forEach((sentence, i) => {
    out.push({
      kind: 'typing',
      id: `${idPrefix}_t${i}`,
      mode: 'sentence',
      target: sentence,
      prompt: 'Type the whole sentence, including the capital letter and the punctuation.',
      hint: 'Hold Shift with the opposite hand to make a capital letter.',
    });
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* Word banks                                                          */
/* ------------------------------------------------------------------ */

/** High-frequency words a 1st grader can already read. */
export const GRADE1_WORDS = [
  'the', 'and', 'see', 'look', 'like', 'can', 'run', 'jump', 'play', 'this',
  'that', 'with', 'have', 'she', 'her', 'they', 'was', 'said', 'come', 'here',
  'big', 'little', 'good', 'help', 'make', 'went', 'find', 'want', 'away', 'blue',
  'red', 'green', 'yellow', 'one', 'two', 'three', 'four', 'five', 'me', 'you',
  'cat', 'dog', 'sun', 'moon', 'star', 'tree', 'book', 'fish', 'bird', 'home',
];

/** Longer, multisyllabic words suited to a 3rd grader. */
export const GRADE3_WORDS = [
  'planet', 'gravity', 'orbit', 'comet', 'galaxy', 'distance', 'measure', 'pattern',
  'compare', 'explain', 'because', 'question', 'discover', 'imagine', 'careful',
  'believe', 'together', 'important', 'different', 'remember', 'suddenly', 'through',
  'thought', 'enough', 'friend', 'family', 'kindness', 'courage', 'wonder', 'journey',
  'telescope', 'astronaut', 'mountain', 'ocean', 'forest', 'weather', 'science',
  'history', 'sentence', 'paragraph', 'chapter', 'character', 'problem', 'solution',
];

export const GRADE1_SENTENCES = [
  'The sun is a star.',
  'I can see the moon.',
  'We like to play here.',
  'She has a red book.',
  'The little cat ran fast.',
  'Look at the big blue sky.',
  'My dog can jump high.',
  'They went to find a star.',
  'God made the day and the night.',
  'I am glad you came home.',
];

export const GRADE3_SENTENCES = [
  'Every planet in our solar system orbits the sun.',
  'A telescope helps us see things that are very far away.',
  'The astronaut floated slowly toward the window.',
  'Because the sky was clear, we counted forty-one stars.',
  'Curiosity is the beginning of every discovery.',
  'She explained her answer carefully, step by step.',
  'The comet returns once every seventy-six years.',
  'Kindness costs nothing, but it changes everything.',
  'Light from the nearest star takes four years to reach us.',
  'When you do not know, the bravest thing is to ask.',
  'Gravity holds the moon in its steady path around Earth.',
  'They worked together until the problem finally made sense.',
];
