import type { Grade, Star, SubjectId } from '../types';
import { createRng } from '../core/rng';
import type { Challenge } from '../types';

import { grade1Reading } from './grade1/reading';
import { grade1Vocabulary } from './grade1/vocabulary';
import { grade1Thinking } from './grade1/thinking';
import { grade1Math, grade1Typing } from './grade1/mathTyping';

import { grade3Reading } from './grade3/reading';
import { grade3Vocabulary } from './grade3/vocabulary';
import { grade3Thinking } from './grade3/thinking';
import { grade3Math, grade3Typing } from './grade3/mathTyping';

import { koreanStars } from './korean';
import { buildBsfStars } from './bsf';
import { BSF_WEEKS } from './bsfWeeks';
import { generateMath } from './generators/math';
import { generateTyping } from './generators/typing';

export { SUBJECTS, SUBJECT_BY_ID } from './subjects';

const GRADE1: Star[] = [
  ...grade1Reading,
  ...grade1Vocabulary,
  ...koreanStars(1),
  ...grade1Math,
  ...grade1Thinking,
  ...grade1Typing,
  ...buildBsfStars(BSF_WEEKS, 1),
];

const GRADE3: Star[] = [
  ...grade3Reading,
  ...grade3Vocabulary,
  ...koreanStars(3),
  ...grade3Math,
  ...grade3Thinking,
  ...grade3Typing,
  ...buildBsfStars(BSF_WEEKS, 3),
];

export function starsForGrade(grade: Grade): Star[] {
  return grade === 1 ? GRADE1 : GRADE3;
}

/** Stars in a single constellation, in the order they should be unlocked. */
export function starsForSubject(grade: Grade, subject: SubjectId): Star[] {
  return starsForGrade(grade).filter((s) => s.subject === subject);
}

export function findStar(grade: Grade, starId: string): Star | undefined {
  return starsForGrade(grade).find((s) => s.id === starId);
}

/**
 * Produce the actual challenge list for a star.
 *
 * Fixed stars return their authored challenges. Generated stars build fresh
 * problems from a seed combining the star id and the attempt number, so
 * replaying gives new problems rather than the same ones again.
 */
export function challengesFor(star: Star, attempt: number): Challenge[] {
  switch (star.content.kind) {
    case 'fixed':
    case 'passage':
      return star.content.challenges;
    case 'generated': {
      const rng = createRng(`${star.id}#${attempt}`);
      const spec = star.content.generator;
      if (spec.type === 'math') {
        return generateMath(spec, star.content.count, rng, `${star.id}_${attempt}`);
      }
      return generateTyping(spec, rng, `${star.id}_${attempt}`);
    }
  }
}

/** Total authored minutes for a grade — used by the content report. */
export function totalMinutes(grade: Grade): number {
  return starsForGrade(grade).reduce((sum, s) => sum + s.minutes, 0);
}
