/**
 * The five princesses.
 *
 * All Korean-American, each with a Korean given name and the English name she
 * also goes by — which is how a great many Korean-American children are
 * actually named. The hanja meaning is included because it is genuinely lovely
 * and because a child choosing a princess deserves to know what her name means.
 *
 * They are differentiated by hair, palette and personality rather than by
 * facial features. Drawing five girls of the same heritage as individuals means
 * varying the things that actually vary between people, not exaggerating the
 * things that do not.
 */

export type PrincessId = 'luna' | 'nova' | 'solara';

export type HairStyle = 'long' | 'braid' | 'bun' | 'halfUp' | 'wavy';

export interface Princess {
  id: PrincessId;
  /** Korean given name, romanised. */
  name: string;
  /** In hangul, shown alongside. */
  hangul: string;
  /** The English name she also goes by. */
  englishName: string;
  /** What the name means. */
  meaning: string;
  /** One line of character, spoken by AnSo when chosen. */
  personality: string;
  hair: HairStyle;
  /** Hair colour — varied within a natural range of dark browns and blacks. */
  hairColor: string;
  hairShine: string;
  /** A single bold dyed streak, the way an idol group differentiates members. */
  streak: string;
  /** Iris colour. Stylised rather than literal, which is the point of the look. */
  eyeColor: string;
  skin: string;
  skinShade: string;
  /** Her signature colour, used for her card and her starting dress. */
  accent: string;
  accentDeep: string;
}

/**
 * Three of them, like an idol group — which is also enough to keep each one
 * clearly distinct rather than five variations on a theme.
 */
export const PRINCESSES: Princess[] = [
  {
    id: 'luna',
    name: 'Luna',
    hangul: '루나',
    englishName: 'Seo-yeon 서연',
    meaning: 'the moon — steady, and brightest when the world is quiet',
    personality:
      'Luna is the calm one. She reads everything twice, once for the story and once for the parts she missed, and she notices what everybody else walked past.',
    hair: 'long',
    hairColor: '#151013',
    hairShine: '#3a2c33',
    streak: '#4fd6ef',
    eyeColor: '#2f8fb8',
    skin: '#f2cdb0',
    skinShade: '#dfb193',
    accent: '#8fe0f0',
    accentDeep: '#4fbfd9',
  },
  {
    id: 'nova',
    name: 'Nova',
    hangul: '노바',
    englishName: 'Ha-eun 하은',
    meaning: 'a new star — a sudden burst of light where there was none',
    personality:
      'Nova is warm and quick to arrive. She is the one who notices when somebody has gone quiet, and goes and sits with them without being asked.',
    hair: 'braid',
    hairColor: '#241318',
    hairShine: '#48282f',
    streak: '#ff77ac',
    eyeColor: '#a8436d',
    skin: '#efc4a4',
    skinShade: '#daa787',
    accent: '#f9b6ce',
    accentDeep: '#ee87af',
  },
  {
    id: 'solara',
    name: 'Solara',
    hangul: '솔라라',
    englishName: 'Ji-woo 지우',
    meaning: 'of the sun — bright, warm, and impossible to ignore',
    personality:
      'Solara is the bold one. She asks why about four hundred times a day, and she is right to.',
    hair: 'bun',
    hairColor: '#16101c',
    hairShine: '#372a44',
    streak: '#b98cff',
    eyeColor: '#6d4bb5',
    skin: '#e8b995',
    skinShade: '#d09f79',
    accent: '#c7b4f6',
    accentDeep: '#a68deb',
  },
];

export const PRINCESS_BY_ID: Record<PrincessId, Princess> = Object.fromEntries(
  PRINCESSES.map((p) => [p.id, p]),
) as Record<PrincessId, Princess>;

export function princessOrDefault(id: string | undefined): Princess {
  return PRINCESS_BY_ID[(id ?? '') as PrincessId] ?? PRINCESSES[0];
}
