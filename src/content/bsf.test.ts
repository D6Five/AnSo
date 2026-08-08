import { describe, it, expect } from 'vitest';
import { BSF_WEEKS } from './bsfWeeks';
import { buildBsfStars } from './bsf';
import { BSF_ART_NAMES } from '../components/BsfArt';
import type { Challenge } from '../types';

const GRADES = [1, 3] as const;

function challengesOf(starContent: { kind: string; challenges?: Challenge[] }): Challenge[] {
  return starContent.challenges ?? [];
}

describe('BSF Romans curriculum', () => {
  it('has exactly 14 lessons', () => {
    expect(BSF_WEEKS.length).toBe(14);
  });

  it('weeks are numbered 1 through 14 with no gaps', () => {
    const nums = BSF_WEEKS.map((w) => w.week).sort((a, b) => a - b);
    expect(nums).toEqual(Array.from({ length: 14 }, (_, i) => i + 1));
  });

  it('every week carries the four treasures and a memory verse', () => {
    BSF_WEEKS.forEach((w) => {
      expect(w.truth.length, `week ${w.week} truth`).toBeGreaterThan(0);
      expect(w.attribute.name.length, `week ${w.week} attribute name`).toBeGreaterThan(0);
      expect(w.attribute.meaning.length, `week ${w.week} attribute meaning`).toBeGreaterThan(0);
      expect(w.doctrine.term.length, `week ${w.week} doctrine term`).toBeGreaterThan(0);
      expect(w.doctrine.meaning.length, `week ${w.week} doctrine meaning`).toBeGreaterThan(0);
      expect(w.gospel.length, `week ${w.week} gospel`).toBeGreaterThan(0);
      expect(w.memoryVerse.text.length, `week ${w.week} verse`).toBeGreaterThan(10);
      expect(w.memoryVerse.reference, `week ${w.week} verse ref`).toMatch(/^Romans /);
    });
  });

  it('every week has a real passage and a valid illustration', () => {
    BSF_WEEKS.forEach((w) => {
      expect(w.passage.length, `week ${w.week} passage empty`).toBeGreaterThan(0);
      w.passage.forEach((p) => expect(p.length).toBeGreaterThan(40));
      expect(BSF_ART_NAMES, `week ${w.week} art "${w.art}" missing`).toContain(w.art);
    });
  });

  for (const grade of GRADES) {
    describe(`grade ${grade} stars`, () => {
      const stars = buildBsfStars(BSF_WEEKS, grade);

      it('builds 14 stars', () => {
        expect(stars.length).toBe(14);
      });

      it('every star is a read-along passage with the five study rows', () => {
        stars.forEach((star) => {
          expect(star.content.kind).toBe('passage');
          if (star.content.kind !== 'passage') return;
          expect(star.content.passage.readAlong, `${star.id} readAlong`).toBe(true);
          expect(star.content.passage.notes?.length, `${star.id} notes`).toBe(5);
          expect(star.content.passage.art, `${star.id} art`).toBeTruthy();
        });
      });

      it('every star has treasure checks, a gospel challenge, and verse work', () => {
        stars.forEach((star) => {
          if (star.content.kind !== 'passage') return;
          const ids = star.content.challenges.map((c) => c.id);
          expect(ids.some((id) => id.endsWith('_truth')), `${star.id} truth check`).toBe(true);
          expect(ids.some((id) => id.endsWith('_attr')), `${star.id} attribute check`).toBe(true);
          expect(ids.some((id) => id.endsWith('_doct')), `${star.id} doctrine check`).toBe(true);
          expect(ids.some((id) => id.endsWith('_gospel')), `${star.id} gospel`).toBe(true);
          expect(ids.some((id) => id.endsWith('_echo')), `${star.id} echo`).toBe(true);
          expect(ids.some((id) => id.endsWith('_type')), `${star.id} typing`).toBe(true);
          expect(ids.some((id) => id.startsWith(`${star.id}_blank`)), `${star.id} blank`).toBe(true);
        });
      });

      it('challenge IDs are unique within each star', () => {
        stars.forEach((star) => {
          const ids = challengesOf(star.content as never).map((c) => c.id);
          expect(new Set(ids).size, `${star.id} duplicate challenge ids`).toBe(ids.length);
        });
      });

      it('every question is marked to be read aloud', () => {
        stars.forEach((star) => {
          challengesOf(star.content as never).forEach((c) => {
            expect(c.speakPrompt, `${c.id} should speak its prompt`).toBe(true);
          });
        });
      });

      it('typing targets contain no untypeable characters', () => {
        stars.forEach((star) => {
          challengesOf(star.content as never).forEach((c) => {
            if (c.kind === 'typing') {
              expect(c.target, `${c.id} has em-dash`).not.toMatch(/—/);
              expect(c.target, `${c.id} has curly quotes`).not.toMatch(/[“”‘’]/);
            }
          });
        });
      });

      it('order challenges have 3 to 5 phrases', () => {
        stars.forEach((star) => {
          challengesOf(star.content as never).forEach((c) => {
            if (c.kind === 'order') {
              expect(c.items.length, `${c.id} phrase count`).toBeGreaterThanOrEqual(3);
              expect(c.items.length, `${c.id} phrase count`).toBeLessThanOrEqual(5);
            }
          });
        });
      });
    });
  }

  it('grade 1 gets a shorter typing target and no order challenge; grade 3 gets both fuller', () => {
    const g1 = buildBsfStars(BSF_WEEKS, 1);
    const g3 = buildBsfStars(BSF_WEEKS, 3);

    for (let i = 0; i < 14; i++) {
      const t1 = challengesOf(g1[i].content as never).find((c) => c.kind === 'typing');
      const t3 = challengesOf(g3[i].content as never).find((c) => c.kind === 'typing');
      expect(t1 && t3).toBeTruthy();
      if (t1?.kind === 'typing' && t3?.kind === 'typing') {
        expect(t1.target.length).toBeLessThanOrEqual(t3.target.length);
      }

      const order1 = challengesOf(g1[i].content as never).some((c) => c.kind === 'order');
      const order3 = challengesOf(g3[i].content as never).some((c) => c.kind === 'order');
      expect(order1, `${g1[i].id} should have no order challenge`).toBe(false);
      expect(order3, `${g3[i].id} should have an order challenge`).toBe(true);

      const blanks1 = challengesOf(g1[i].content as never).filter((c) => c.id.includes('_blank')).length;
      const blanks3 = challengesOf(g3[i].content as never).filter((c) => c.id.includes('_blank')).length;
      expect(blanks1).toBe(1);
      // A very short verse may only offer one blankable word; longer verses give three.
      expect(blanks3).toBeGreaterThanOrEqual(blanks1);
      expect(blanks3).toBeLessThanOrEqual(3);
    }
  });

  it('star building is deterministic', () => {
    const a = buildBsfStars(BSF_WEEKS, 3);
    const b = buildBsfStars(BSF_WEEKS, 3);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});
