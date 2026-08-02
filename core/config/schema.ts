/**
 * The client configuration contract.
 *
 * This is the boundary between the engine and a client build. Everything in
 * here is a decision a client gets to make; everything absent from here is a
 * decision the engine has already made on their behalf, deliberately.
 *
 * It extends the v0.1 draft schema with the fields AnSo actually needed once
 * the theme was pulled out of the code. Those additions are marked, because the
 * gap between "what we thought was configurable" and "what had to be" is the
 * useful output of building the first app.
 */

/* ------------------------------------------------------------------ */
/* Vocabulary                                                          */
/* ------------------------------------------------------------------ */

/**
 * Every noun the child sees that changes per theme.
 *
 * Learned from AnSo: a single `currency_name` is not enough. Copy needs the
 * singular, the plural and the earn verb, or the app ends up saying "1 stardust"
 * and "you found 3 stardusts" — which no amount of theming can rescue.
 */
export interface Terminology {
  /** "stardust", "sea glass", "fossils" */
  currency: string;
  currencyOne: string;
  currencyIcon: string;
  /** What a completed lesson is called. "star", "shell", "bone" */
  lesson: string;
  lessonPlural: string;
  /** A group of lessons. "constellation", "reef", "dig site" */
  lessonGroup: string;
  lessonGroupPlural: string;
  /** The character the child plays as. "princess", "explorer", "diver" */
  avatar: string;
  /** The persistent return point. "Her Royal Chamber", "Your Reef" */
  homeBase: string;
  /** The collection screen. "Wardrobe", "Kit", "Shell Collection" */
  wardrobe: string;
  /** The shop. "Stardust Shop", "Trading Post" */
  shop: string;
  /** Collective noun for unlocked items. "treasures", "finds", "gear" */
  rewards: string;
  /** The guide character's name. */
  guide: string;
}

/* ------------------------------------------------------------------ */
/* Look                                                                */
/* ------------------------------------------------------------------ */

export interface Palette {
  /** Deep background, furthest back. */
  bgDeep: string;
  /** Nearer background, used for the top of the gradient. */
  bgMid: string;
  /** Two faint tints over the background so it is not flat black. */
  nebulaA: string;
  nebulaB: string;
  /** Text on dark. */
  ink: string;
  inkDim: string;
  /** Card surfaces are light in every theme; only the accents change. */
  accent: string;
  accentWarm: string;
  good: string;
  bad: string;
}

/**
 * A card face is a light-to-deep pair rather than one colour.
 *
 * Learned from AnSo: flat saturated blocks looked harsh against a dark
 * background, and every subject needed a gradient. Shipping a single hex per
 * subject would force that mistake on every future client.
 */
export interface ColorPair {
  light: string;
  deep: string;
}

/* ------------------------------------------------------------------ */
/* Learning                                                            */
/* ------------------------------------------------------------------ */

/** A subject strand, rendered as one lesson group. */
export interface SubjectConfig {
  id: string;
  /** What the child sees: "Reading", "Numbers". */
  name: string;
  /** The themed group name: "The Storyteller", "Kelp Forest". */
  groupName: string;
  color: ColorPair;
  glyph: string;
  description: string;
}

export type DifficultyPacing = 'standard' | 'accelerated' | 'remedial';
export type ContentSource = 'd6five_default' | 'client_provided';
export type ReportingTier = 'basic' | 'detailed';
export type ArtTier = 'prebuilt' | 'custom';

export interface LearnerConfig {
  /** Inclusive grade levels this build serves. AnSo shipped 1 and 3. */
  grades: number[];
  ageRange: string;
  subjectFocus: string[];
  difficultyPacing: DifficultyPacing;
}

/* ------------------------------------------------------------------ */
/* Reward economy                                                      */
/* ------------------------------------------------------------------ */

/**
 * How currency is earned. Fixed shape, client-tunable numbers.
 *
 * Learned from AnSo: currency has to be *lifetime earned* rather than a
 * decrementing balance, because a decrementing balance cannot survive a
 * last-write-wins sync — spending was silently refunded. Spendable balance is
 * always derived. This is engine behaviour, not a client choice, but the rates
 * are theirs.
 */
export interface EconomyConfig {
  perCorrectAnswer: number;
  firstCompletionBonus: number;
  newPersonalBestBonus: number;
  perfectScoreBonus: number;
  /** Reward granted every N distinct lessons completed. 1 = every lesson. */
  rewardEveryNLessons: number;
}

/* ------------------------------------------------------------------ */
/* Governance                                                          */
/* ------------------------------------------------------------------ */

/**
 * Not exposed in the questionnaire and not client-editable.
 *
 * Present in the type so a build can assert them and a reviewer can see them,
 * but the values are fixed by `GOVERNANCE` below. A client cannot turn these
 * off, which is the entire point of them being here rather than in the
 * customisable layer.
 */
export interface Governance {
  readonly collectsChildPii: false;
  readonly childFacingExternalLinks: false;
  readonly childFacingChatOrSocial: false;
  readonly parentVisibilityOfAllActivity: true;
  readonly requiresParentAuth: true;
  /** Days of inactivity after which a profile is purged. */
  readonly dataRetentionDays: number;
}

export const GOVERNANCE: Governance = {
  collectsChildPii: false,
  childFacingExternalLinks: false,
  childFacingChatOrSocial: false,
  parentVisibilityOfAllActivity: true,
  requiresParentAuth: true,
  dataRetentionDays: 730,
};

/* ------------------------------------------------------------------ */
/* The whole thing                                                     */
/* ------------------------------------------------------------------ */

export interface ClientConfig {
  clientId: string;
  appName: string;
  domain: string;
  themeId: string;
  artTier: ArtTier;
  terms: Terminology;
  palette: Palette;
  subjects: SubjectConfig[];
  learner: LearnerConfig;
  economy: EconomyConfig;
  content: {
    source: ContentSource;
    curriculumRef: string;
  };
  reporting: {
    parentDashboardTier: ReportingTier;
  };
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

export interface ConfigProblem {
  path: string;
  message: string;
}

/**
 * Check a config before a build runs.
 *
 * This exists because the failure mode it prevents is expensive: a client app
 * that builds cleanly, deploys, and only then turns out to have no subjects or
 * an unreadable palette. Cheap to run in CI, and the errors name the field.
 */
export function validateConfig(config: ClientConfig): ConfigProblem[] {
  const problems: ConfigProblem[] = [];
  const require = (value: unknown, path: string, message: string) => {
    if (value === undefined || value === null || value === '') {
      problems.push({ path, message });
    }
  };

  require(config.clientId, 'clientId', 'Every build needs a client id.');
  require(config.appName, 'appName', 'The app needs a name to show the child.');
  require(config.domain, 'domain', 'A domain is needed to issue a certificate.');

  for (const key of Object.keys(config.terms) as (keyof Terminology)[]) {
    require(config.terms[key], `terms.${key}`, 'Every themed noun must be supplied.');
  }

  if (config.subjects.length === 0) {
    problems.push({ path: 'subjects', message: 'A build with no subjects has nothing to teach.' });
  }

  const seen = new Set<string>();
  for (const subject of config.subjects) {
    if (seen.has(subject.id)) {
      problems.push({ path: `subjects.${subject.id}`, message: 'Duplicate subject id.' });
    }
    seen.add(subject.id);
  }

  if (config.learner.grades.length === 0) {
    problems.push({ path: 'learner.grades', message: 'At least one grade must be served.' });
  }

  if (config.economy.rewardEveryNLessons < 1) {
    problems.push({
      path: 'economy.rewardEveryNLessons',
      message: 'Must be 1 or more, or every lesson would grant infinite rewards.',
    });
  }

  // A theme whose subject colours are all near-identical reads as one colour on
  // the map, which is the failure AnSo hit before the palette became a family.
  const hues = new Set(config.subjects.map((s) => s.color.light.toLowerCase()));
  if (config.subjects.length > 1 && hues.size < config.subjects.length) {
    problems.push({
      path: 'subjects[].color',
      message: 'Two subjects share a colour; they will be indistinguishable on the map.',
    });
  }

  return problems;
}

/** Throws with every problem at once, rather than one per build attempt. */
export function assertValidConfig(config: ClientConfig): void {
  const problems = validateConfig(config);
  if (problems.length === 0) return;
  throw new Error(
    `Invalid client config for "${config.clientId}":\n` +
      problems.map((p) => `  ${p.path}: ${p.message}`).join('\n'),
  );
}
