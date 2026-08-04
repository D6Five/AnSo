/**
 * Core content model for AnSo.
 *
 * The whole app is data-driven: a handful of generic "challenge" shapes are
 * rendered by generic engines, so adding curriculum means adding data, never
 * writing new screens. Math and typing use seeded generators instead of fixed
 * lists, which is what makes unlimited drill practice possible.
 */

export type Grade = 1 | 3;

export type SubjectId =
  | 'reading'
  | 'vocabulary'
  | 'korean'
  | 'math'
  | 'thinking'
  | 'typing'
  | 'bsf';

export interface Subject {
  id: SubjectId;
  name: string;
  /** Constellation name shown on the galaxy map. */
  constellation: string;
  /**
   * Card face colours, light to deep. A pair rather than one value because a
   * flat block of saturated colour looks harsh against the dark sky, while a
   * gentle gradient reads as a lit surface.
   */
  color: string;
  colorDeep: string;
  glyph: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/* Challenges                                                          */
/* ------------------------------------------------------------------ */

interface ChallengeBase {
  id: string;
  /** Spoken aloud by AnSo when the challenge opens. */
  prompt: string;
  /** Optional shorter text shown on screen if the prompt is long. */
  display?: string;
  hint?: string;
  /** Read aloud after a correct answer — the "why", not just "well done". */
  teach?: string;
  /**
   * A word to pronounce on demand, shown with a speaker button. Vocabulary is
   * half sound: a child who has only ever seen a word in print cannot use it in
   * conversation, and cannot recognise it when someone else says it.
   */
  pronounce?: string;
  /** BCP-47 tag for the pronounced word, e.g. 'ko-KR'. Defaults to English. */
  pronounceLang?: string;
  /** Definition read aloud on request, alongside the word itself. */
  pronounceMeaning?: string;
  /** Key into the picture set. Carries the meaning where words cannot yet. */
  picture?: string;
}

/** Pick one of several options. The workhorse shape. */
export interface ChoiceChallenge extends ChallengeBase {
  kind: 'choice';
  options: string[];
  correct: number;
}

/** Open response: spoken (transcribed) or typed. Fuzzy-matched. */
export interface SpeakChallenge extends ChallengeBase {
  kind: 'speak';
  /** Any of these count as correct; matching is lenient. */
  accept: string[];
  /** Shown when the child asks to see choices instead of speaking. */
  sampleAnswer: string;
  /** Render as a big flash card (word on the front) instead of the plain layout. */
  flashcard?: boolean;
}

/** Arrange items into the right order. */
export interface OrderChallenge extends ChallengeBase {
  kind: 'order';
  /** Presented shuffled; this array is the correct order. */
  items: string[];
}

/** Match left items to right items. */
export interface MatchChallenge extends ChallengeBase {
  kind: 'match';
  pairs: { left: string; right: string }[];
}

/** A single arithmetic problem. Usually produced by a generator. */
export interface MathChallenge extends ChallengeBase {
  kind: 'math';
  /** Rendered large and centered, e.g. "14 + 7". */
  expression: string;
  answer: number;
  /** Optional multiple-choice scaffold for younger learners. */
  options?: number[];
}

/** Type the target text. Measures accuracy and words per minute. */
export interface TypingChallenge extends ChallengeBase {
  kind: 'typing';
  target: string;
  /** 'keys' shows a home-row guide, 'words'/'sentence' do not. */
  mode: 'keys' | 'words' | 'sentence';
}

export type Challenge =
  | ChoiceChallenge
  | SpeakChallenge
  | OrderChallenge
  | MatchChallenge
  | MathChallenge
  | TypingChallenge;

export type ChallengeKind = Challenge['kind'];

/* ------------------------------------------------------------------ */
/* Reading passages                                                    */
/* ------------------------------------------------------------------ */

/**
 * Reading stars pair a passage with its questions. The passage is read aloud
 * by AnSo on request, and stays on screen while questions are answered —
 * comprehension practice, not memory practice.
 */
export interface Passage {
  title: string;
  /** One string per paragraph. */
  paragraphs: string[];
  /** Words worth pre-teaching before reading. */
  preview?: { word: string; meaning: string }[];
}

/* ------------------------------------------------------------------ */
/* Generators                                                          */
/* ------------------------------------------------------------------ */

export type MathSkill =
  | 'add-within-10'
  | 'add-within-20'
  | 'sub-within-10'
  | 'sub-within-20'
  | 'add-two-digit'
  | 'sub-two-digit'
  | 'add-three-digit'
  | 'sub-three-digit'
  | 'skip-count'
  | 'missing-addend'
  | 'compare'
  | 'place-value'
  | 'mult-facts'
  | 'mult-table-2'
  | 'mult-table-3'
  | 'mult-table-4'
  | 'mult-table-5'
  | 'mult-table-6'
  | 'mult-table-7'
  | 'mult-table-8'
  | 'mult-table-9'
  | 'mult-table-10'
  | 'mult-table-11'
  | 'mult-table-12'
  | 'mult-squares'
  | 'div-facts'
  | 'mult-two-digit'
  | 'fractions-compare'
  | 'fractions-equivalent'
  | 'rounding'
  | 'area-perimeter'
  | 'elapsed-time'
  | 'money'
  | 'word-problem'
  | 'word-problem-hard';

export interface MathGenerator {
  type: 'math';
  skills: MathSkill[];
  /** Offer multiple choice instead of free entry (kinder for 1st grade). */
  multipleChoice?: boolean;
}

export type TypingDrill =
  | { type: 'typing'; mode: 'keys'; keys: string; rounds: number }
  | { type: 'typing'; mode: 'words'; words: string[]; rounds: number }
  | { type: 'typing'; mode: 'sentence'; sentences: string[] };

export type GeneratorSpec = MathGenerator | TypingDrill;

/* ------------------------------------------------------------------ */
/* Stars and constellations                                            */
/* ------------------------------------------------------------------ */

export type StarContent =
  | { kind: 'fixed'; challenges: Challenge[] }
  | { kind: 'passage'; passage: Passage; challenges: Challenge[] }
  | { kind: 'generated'; generator: GeneratorSpec; count: number };

export interface Star {
  id: string;
  subject: SubjectId;
  grade: Grade;
  title: string;
  /** AnSo says this when the star opens. Sets the scene. */
  blurb: string;
  /** Estimated minutes. The content report sums these for the hours total. */
  minutes: number;
  /**
   * Seconds allowed for the whole star. Used by maths, where fluency is part of
   * the skill. Running out ends the star with whatever was answered — it never
   * discards the work already done.
   */
  timeLimitSeconds?: number;
  content: StarContent;
}

/* ------------------------------------------------------------------ */
/* Profiles and progress                                               */
/* ------------------------------------------------------------------ */

export interface StarProgress {
  /** Times this star has been completed. Replay is encouraged. */
  completions: number;
  bestScore: number;
  lastPlayed: number;
}

export interface Profile {
  id: string;
  name: string;
  grade: Grade;
  /** Index into the AVATARS palette. */
  avatar: number;
  stardust: number;
  /** Keyed by star id. */
  progress: Record<string, StarProgress>;
  /** Words the child has struggled with, surfaced again later. */
  reviewQueue: string[];
  createdAt: number;
  /**
   * When this copy of the profile last changed. Stamped on every mutation and
   * used by the sync merge to decide which device's version of a single-value
   * field wins. Without it, changing an outfit altered no progress, so both
   * copies looked equally fresh and the change was silently reverted.
   */
  updatedAt?: number;
  /**
   * Which of the five princesses this explorer plays as. The collection of
   * dresses, accessories and room items is derived from how many distinct stars
   * she has finished, so there is no separate inventory to drift out of step
   * with her progress.
   */
  princess?: string;
  equippedDress?: string;
  equippedAccessories?: string[];
  /** Ids bought from the stardust shop. Unlike earned treasures these must be
   *  stored, since spending is a decision rather than a consequence of progress. */
  purchased?: string[];
  /**
   * Whether this child may answer out loud. Per-child rather than per-device:
   * recognition works well for an older reader and poorly for a younger one, so
   * the right answer genuinely differs between two sisters on the same laptop.
   * Undefined means enabled.
   */
  micEnabled?: boolean;
}

export interface SaveData {
  version: 1;
  profiles: Profile[];
  activeProfileId: string | null;
  /**
   * Device-level settings, shared across profiles. Volume and music describe
   * the room the app is being used in, not the child using it — unlike the
   * microphone, which now lives on the profile.
   */
  settings: {
    volume: number;
    voiceEnabled: boolean;
    /** Retained as the default for profiles created before mic went per-child. */
    micEnabled: boolean;
    musicEnabled: boolean;
    musicVolume: number;
    /**
     * Chosen speech-synthesis voice by name. Device-level, because which voices
     * exist varies by machine and browser. Null means pick the best available.
     */
    voiceName?: string | null;
  };
  /**
   * Ids of profiles deleted on this device. Without these, sync would merge a
   * deleted profile straight back from whichever device had not seen the
   * deletion yet. Tombstones make removal stick across all devices.
   */
  deletedProfileIds?: string[];
  /** Last time this device's copy changed. Used to settle settings conflicts. */
  updatedAt?: number;
  /**
   * Server version last seen by this device, used to notice a redeploy so the
   * seed test explorers can be put back to their starting state.
   */
  deployVersion?: string | null;
}
