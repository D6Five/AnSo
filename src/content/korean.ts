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

/** Twenty more words, unlocked in the expansion stars. Same rules: concrete, drawable. */
export const KOREAN_WORDS_2: KoreanWord[] = [
  { hangul: '나무', roman: 'namu', sound: 'NA-moo', english: 'tree', picture: 'tree' },
  { hangul: '해', roman: 'hae', sound: 'HEH', english: 'sun', picture: 'sun' },
  { hangul: '새', roman: 'sae', sound: 'SEH', english: 'bird', picture: 'bird' },
  { hangul: '물고기', roman: 'mulgogi', sound: 'mool-GO-ghee', english: 'fish', picture: 'fish' },
  { hangul: '우유', roman: 'uyu', sound: 'OO-yoo', english: 'milk', picture: 'milk' },
  { hangul: '밥', roman: 'bap', sound: 'BAHP', english: 'rice', picture: 'rice' },
  { hangul: '눈', roman: 'nun', sound: 'NOON', english: 'eye', picture: 'eye' },
  { hangul: '코', roman: 'ko', sound: 'KOH', english: 'nose', picture: 'nose' },
  { hangul: '입', roman: 'ip', sound: 'EEP', english: 'mouth', picture: 'mouth' },
  { hangul: '발', roman: 'bal', sound: 'BAHL', english: 'foot', picture: 'foot' },
  { hangul: '엄마', roman: 'eomma', sound: 'UM-ma', english: 'mom', picture: 'mom' },
  { hangul: '아빠', roman: 'appa', sound: 'AH-pa', english: 'dad', picture: 'dad' },
  { hangul: '아기', roman: 'agi', sound: 'AH-ghee', english: 'baby', picture: 'baby' },
  { hangul: '하나', roman: 'hana', sound: 'HA-na', english: 'one', picture: 'one' },
  { hangul: '둘', roman: 'dul', sound: 'DOOL', english: 'two', picture: 'two' },
  { hangul: '셋', roman: 'set', sound: 'SET', english: 'three', picture: 'three' },
  { hangul: '빨강', roman: 'ppalgang', sound: 'PAL-gang', english: 'red', picture: 'red' },
  { hangul: '파랑', roman: 'parang', sound: 'PA-rang', english: 'blue', picture: 'blue' },
  { hangul: '노랑', roman: 'norang', sound: 'NO-rang', english: 'yellow', picture: 'yellow' },
  { hangul: '공', roman: 'gong', sound: 'GONG', english: 'ball', picture: 'ball' },
];

/** Every Korean word the app teaches, both sets together. */
export const ALL_KOREAN_WORDS: KoreanWord[] = [...KOREAN_WORDS, ...KOREAN_WORDS_2];

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

/** A full review star: picture-to-hangul across the set, then matching rounds. */
function reviewStar(
  id: string,
  grade: Grade,
  title: string,
  blurb: string,
  words: KoreanWord[],
  pool: KoreanWord[],
): Star {
  return {
    id,
    subject: 'korean',
    grade,
    title,
    blurb,
    minutes: 13,
    content: {
      kind: 'fixed',
      challenges: [
        ...words.map((word, i) => {
          const wrong = decoys(word, pool, i + 5);
          return {
            kind: 'choice' as const,
            id: `${id}_pic_${i}`,
            prompt: 'Which Korean word matches this picture?',
            picture: word.picture,
            options: [word.hangul, ...wrong.map((w) => w.hangul)],
            correct: 0,
            teach: `${word.hangul} — ${word.sound} — ${word.english}.`,
          };
        }),
        ...challengesFor(words, id, pool).filter((c) => c.id.includes('_match_')),
      ],
    },
  };
}

/** A learning star for a batch of new words. */
function learnStar(
  id: string,
  grade: Grade,
  title: string,
  blurb: string,
  words: KoreanWord[],
  pool: KoreanWord[],
): Star {
  return {
    id,
    subject: 'korean',
    grade,
    title,
    blurb,
    minutes: 12,
    content: { kind: 'fixed', challenges: challengesFor(words, id, pool) },
  };
}

export function koreanStars(grade: Grade): Star[] {
  const first = KOREAN_WORDS.slice(0, HALF);
  const second = KOREAN_WORDS.slice(HALF);
  const g = `g${grade}`;
  const w2 = KOREAN_WORDS_2;
  const all = ALL_KOREAN_WORDS;

  // Themed subsets for the practice stars in the back half. Every word appears
  // in at least one theme, so nothing taught is ever left behind.
  const themes: { title: string; blurb: string; words: KoreanWord[] }[] = [
    {
      title: 'Living Things',
      blurb: 'Cat, dog, bird, fish, flower — everything alive, all together.',
      words: all.filter((w) => ['cat', 'dog', 'bird', 'fish', 'flower'].includes(w.english)),
    },
    {
      title: 'Food and Drink',
      blurb: 'The eating words: water, apple, milk, and rice.',
      words: all.filter((w) => ['water', 'apple', 'milk', 'rice'].includes(w.english)),
    },
    {
      title: 'Up in the Sky',
      blurb: 'Sun, moon, star, tree — the things you see when you look up.',
      words: all.filter((w) => ['sun', 'moon', 'star', 'tree'].includes(w.english)),
    },
    {
      title: 'My Face and Body',
      blurb: 'Eye, nose, mouth, hand, foot. Point to each one as you learn it.',
      words: all.filter((w) => ['eye', 'nose', 'mouth', 'hand', 'foot'].includes(w.english)),
    },
    {
      title: 'My Family',
      blurb: 'Mom, dad, baby, house — the people and place you love.',
      words: all.filter((w) => ['mom', 'dad', 'baby', 'house'].includes(w.english)),
    },
    {
      title: 'Counting Words',
      blurb: 'One, two, three — now you can count in Korean.',
      words: all.filter((w) => ['one', 'two', 'three', 'ball'].includes(w.english)),
    },
    {
      title: 'Color Words',
      blurb: 'Red, blue, yellow — the colors around you have Korean names.',
      words: all.filter((w) => ['red', 'blue', 'yellow', 'flower', 'ball'].includes(w.english)),
    },
  ];

  // Rotating mixed-practice subsets so later stars keep every earlier word alive.
  const mixed = (n: number, size = 6): KoreanWord[] => {
    const out: KoreanWord[] = [];
    for (let i = 0; i < size; i++) out.push(all[(n * 7 + i * 5) % all.length]);
    return out;
  };

  return [
    learnStar(`${g}_kor_01`, grade, 'First Five Words',
      'Your first Korean words. Look at the picture, listen to the sound, then find the word.',
      first, KOREAN_WORDS),
    learnStar(`${g}_kor_02`, grade, 'Five More Words',
      'Five new words. Same as before — picture, sound, then the word itself.',
      second, KOREAN_WORDS),
    reviewStar(`${g}_kor_03`, grade, 'All Ten Together',
      'Everything you have learned. Match every Korean word to its picture.',
      KOREAN_WORDS, KOREAN_WORDS),
    learnStar(`${g}_kor_04`, grade, 'Nature Words',
      'Tree, sun, bird, fish, milk — five new words from the world around you.',
      w2.slice(0, 5), all),
    learnStar(`${g}_kor_05`, grade, 'Body and Food Words',
      'Rice, eye, nose, mouth, foot. Words you use every single day.',
      w2.slice(5, 10), all),
    reviewStar(`${g}_kor_06`, grade, 'Ten New Words Review',
      'The ten words you just learned, all mixed together.',
      w2.slice(0, 10), all),
    learnStar(`${g}_kor_07`, grade, 'Family Words',
      'Mom, dad, baby — and how to count: one, two.',
      w2.slice(10, 15), all),
    learnStar(`${g}_kor_08`, grade, 'Colors and Counting',
      'Three, red, blue, yellow, ball. Bright words for bright things.',
      w2.slice(15, 20), all),
    reviewStar(`${g}_kor_09`, grade, 'Newest Words Review',
      'Family, colors, and counting — everything from the last two stars.',
      w2.slice(10, 20), all),
    reviewStar(`${g}_kor_10`, grade, 'The Thirty Word Challenge',
      'Every Korean word you know. This is the big one.',
      all, all),
    ...themes.map((t, i) =>
      learnStar(`${g}_kor_${String(11 + i).padStart(2, '0')}`, grade, t.title, t.blurb, t.words, all),
    ),
    ...Array.from({ length: 5 }, (_, i) =>
      reviewStar(
        `${g}_kor_${18 + i}`,
        grade,
        `Mixed Practice ${i + 1}`,
        'A surprise mix of words you have learned. Keep them all fresh.',
        mixed(i + 1),
        all,
      ),
    ),
    reviewStar(`${g}_kor_23`, grade, 'Korean Champion',
      'The final star. All thirty words, one last time. You are amazing.',
      all, all),
  ];
}
