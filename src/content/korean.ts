import type { Challenge, Grade, Star } from '../types';

/**
 * Basic Korean vocabulary.
 *
 * Ten concrete nouns a child can see a picture of — no abstractions, because
 * the picture has to carry the meaning without English propping it up. Each
 * word is taught three ways before it is tested: the picture with the hangul,
 * the sound of it, and the romanisation to sound it out. The star finishes with
 * a matching round over all ten.
 *
 * Romanisation follows Revised Romanization, with a plainer "say it like this"
 * spelling alongside — RR is correct but tells a six-year-old nothing about how
 * 꽃 actually sounds.
 */

export interface KoreanWord {
  hangul: string;
  /** Revised Romanization. */
  roman: string;
  /** How to say it, spelled the way an English-speaking child would read it. */
  sound: string;
  english: string;
  /** Key into the picture set in KoreanPicture.tsx. */
  picture: string;
}

export const KOREAN_WORDS: KoreanWord[] = [
  { hangul: '물', roman: 'mul', sound: 'MOOL', english: 'water', picture: 'water' },
  { hangul: '사과', roman: 'sagwa', sound: 'SA-gwa', english: 'apple', picture: 'apple' },
  { hangul: '고양이', roman: 'goyangi', sound: 'go-YANG-ee', english: 'cat', picture: 'cat' },
  { hangul: '개', roman: 'gae', sound: 'GEH', english: 'dog', picture: 'dog' },
  { hangul: '집', roman: 'jip', sound: 'JEEP', english: 'house', picture: 'house' },
  { hangul: '별', roman: 'byeol', sound: 'BYUL', english: 'star', picture: 'star' },
  { hangul: '달', roman: 'dal', sound: 'DAL', english: 'moon', picture: 'moon' },
  { hangul: '꽃', roman: 'kkot', sound: 'KOT', english: 'flower', picture: 'flower' },
  { hangul: '책', roman: 'chaek', sound: 'CHEK', english: 'book', picture: 'book' },
  { hangul: '손', roman: 'son', sound: 'SON', english: 'hand', picture: 'hand' },
];

export const KOREAN_BY_HANGUL: Record<string, KoreanWord> = Object.fromEntries(
  KOREAN_WORDS.map((w) => [w.hangul, w]),
);

/** Three plausible wrong words — always other real words from the set. */
function decoys(word: KoreanWord, all: KoreanWord[], offset: number): KoreanWord[] {
  const others = all.filter((w) => w.hangul !== word.hangul);
  return [0, 1, 2].map((i) => others[(offset + i) % others.length]);
}

/**
 * Build the challenges for a set of words: meet each word with its picture,
 * then read the hangul without the picture, then match everything at the end.
 */
function challengesFor(words: KoreanWord[], starId: string, all: KoreanWord[]): Challenge[] {
  const out: Challenge[] = [];

  // Pass one: picture on screen, choose the Korean word. This is the first
  // meeting, so the picture does the teaching and the choice just confirms it.
  words.forEach((word, i) => {
    const wrong = decoys(word, all, i);
    const options = [word.hangul, ...wrong.map((w) => w.hangul)];
    out.push({
      kind: 'choice',
      id: `${starId}_meet_${i}`,
      prompt: `This is ${word.english}. Which one says "${word.english}" in Korean?`,
      picture: word.picture,
      pronounce: word.hangul,
      pronounceLang: 'ko-KR',
      pronounceMeaning: `${word.hangul}. ${word.sound}. It means ${word.english}.`,
      display: `${word.hangul}  ·  ${word.sound}`,
      options,
      correct: 0,
      teach: `${word.hangul} — say it like ${word.sound} — means ${word.english}.`,
    });
  });

  // Pass two: hangul only, no picture. Reading it rather than recognising the
  // drawing next to it.
  words.forEach((word, i) => {
    const wrong = decoys(word, all, i + 3);
    const options = [word.english, ...wrong.map((w) => w.english)];
    out.push({
      kind: 'choice',
      id: `${starId}_read_${i}`,
      prompt: `What does ${word.hangul} mean?`,
      display: `${word.hangul}  ·  ${word.sound}`,
      pronounce: word.hangul,
      pronounceLang: 'ko-KR',
      options,
      correct: 0,
      hint: `Sound it out: ${word.sound}.`,
      teach: `${word.hangul} is ${word.english}.`,
    });
  });

  // Pass three: the matching round the whole star builds toward, in groups of
  // five so a wrong pair is recoverable rather than a wall of ten.
  for (let start = 0; start < words.length; start += 5) {
    const group = words.slice(start, start + 5);
    if (group.length < 2) continue;
    out.push({
      kind: 'match',
      id: `${starId}_match_${start}`,
      prompt: 'Match each Korean word to what it means.',
      pairs: group.map((w) => ({ left: `${w.hangul} (${w.sound})`, right: w.english })),
      teach: 'Every one matched. You can read those now.',
    });
  }

  return out;
}

const HALF = 5;

export function koreanStars(grade: Grade): Star[] {
  const first = KOREAN_WORDS.slice(0, HALF);
  const second = KOREAN_WORDS.slice(HALF);
  const g = `g${grade}`;

  return [
    {
      id: `${g}_kor_01`,
      subject: 'korean',
      grade,
      title: 'First Five Words',
      blurb:
        'Your first Korean words. Look at the picture, listen to the sound, then find the word.',
      minutes: 12,
      content: { kind: 'fixed', challenges: challengesFor(first, `${g}_kor_01`, KOREAN_WORDS) },
    },
    {
      id: `${g}_kor_02`,
      subject: 'korean',
      grade,
      title: 'Five More Words',
      blurb: 'Five new words. Same as before — picture, sound, then the word itself.',
      minutes: 12,
      content: { kind: 'fixed', challenges: challengesFor(second, `${g}_kor_02`, KOREAN_WORDS) },
    },
    {
      id: `${g}_kor_03`,
      subject: 'korean',
      grade,
      title: 'All Ten Together',
      blurb: 'Everything you have learned. Match every Korean word to its picture.',
      minutes: 13,
      content: {
        kind: 'fixed',
        challenges: [
          // Picture to hangul across the whole set, then the full matching round.
          ...KOREAN_WORDS.map((word, i) => {
            const wrong = decoys(word, KOREAN_WORDS, i + 5);
            return {
              kind: 'choice' as const,
              id: `${g}_kor_03_pic_${i}`,
              prompt: 'Which Korean word matches this picture?',
              picture: word.picture,
              options: [word.hangul, ...wrong.map((w) => w.hangul)],
              correct: 0,
              teach: `${word.hangul} — ${word.sound} — ${word.english}.`,
            };
          }),
          ...challengesFor(KOREAN_WORDS, `${g}_kor_03`, KOREAN_WORDS).filter((c) =>
            c.id.includes('_match_'),
          ),
        ],
      },
    },
  ];
}
