import { describe, it, expect } from 'vitest';
import { starsForGrade, starsForSubject, totalMinutes, challengesFor } from './index';
import type { Grade, SubjectId } from '../types';

const GRADES = [1, 3] as const;

/**
 * Minimum star counts per constellation, after the 20-star expansion.
 * Original counts + 20 (korean started at 3, so 23; typing/math kept
 * their originals + 20; bsf is expanded to 14 in its own phase).
 */
const MIN_STARS: Record<Grade, Record<string, number>> = {
  1: { reading: 30, vocabulary: 30, korean: 23, math: 40, thinking: 30, typing: 34, bsf: 2 },
  3: { reading: 28, vocabulary: 40, korean: 23, math: 40, thinking: 30, typing: 32, bsf: 2 },
};

/** ID stems by subject: most subjects abbreviate; bsf uses its own scheme. */
const ID_STEM: Record<string, string> = {
  reading: 'read',
  vocabulary: 'vocab',
  korean: 'kor',
  thinking: 'think',
  typing: 'type',
  math: 'math',
};

describe('Content Structure', () => {
  for (const grade of GRADES) {
    describe(`Grade ${grade}`, () => {
      const stars = starsForGrade(grade);

      it('has stars', () => {
        expect(stars.length).toBeGreaterThan(0);
      });

      it('all stars have unique IDs', () => {
        const ids = stars.map((s) => s.id);
        expect(new Set(ids).size).toBe(ids.length);
      });

      it('all stars have required fields', () => {
        stars.forEach((star) => {
          expect(star.id, `star missing id`).toBeTruthy();
          expect(star.subject, `${star.id} missing subject`).toBeTruthy();
          expect(star.grade, `${star.id} wrong grade`).toBe(grade);
          expect(star.title.length, `${star.id} missing title`).toBeGreaterThan(0);
          expect(star.blurb.length, `${star.id} missing blurb`).toBeGreaterThan(0);
          expect(star.minutes, `${star.id} bad minutes`).toBeGreaterThan(0);
          expect(star.minutes, `${star.id} minutes too long`).toBeLessThan(120);
          expect(star.content, `${star.id} missing content`).toBeDefined();
        });
      });

      it('all stars have valid content kind', () => {
        stars.forEach((star) => {
          expect(['fixed', 'generated', 'passage'], `${star.id} bad kind`).toContain(star.content.kind);
        });
      });

      it('fixed and passage stars have non-empty challenge lists with unique IDs', () => {
        stars.forEach((star) => {
          if (star.content.kind === 'fixed' || star.content.kind === 'passage') {
            const ids = star.content.challenges.map((c) => c.id);
            expect(ids.length, `${star.id} has no challenges`).toBeGreaterThan(0);
            expect(new Set(ids).size, `${star.id} has duplicate challenge IDs`).toBe(ids.length);
          }
        });
      });

      it('choice challenges have a valid correct index', () => {
        stars.forEach((star) => {
          if (star.content.kind !== 'fixed' && star.content.kind !== 'passage') return;
          star.content.challenges.forEach((c) => {
            if (c.kind === 'choice') {
              expect(c.options.length, `${c.id} needs 2+ options`).toBeGreaterThanOrEqual(2);
              expect(c.correct, `${c.id} correct out of range`).toBeGreaterThanOrEqual(0);
              expect(c.correct, `${c.id} correct out of range`).toBeLessThan(c.options.length);
            }
          });
        });
      });

      it('speak challenges have accept lists and sample answers', () => {
        stars.forEach((star) => {
          if (star.content.kind !== 'fixed' && star.content.kind !== 'passage') return;
          star.content.challenges.forEach((c) => {
            if (c.kind === 'speak') {
              expect(c.accept.length, `${c.id} has empty accept list`).toBeGreaterThan(0);
              expect(c.sampleAnswer, `${c.id} missing sampleAnswer`).toBeTruthy();
            }
          });
        });
      });

      it('passage stars have paragraphs', () => {
        stars
          .filter((s) => s.content.kind === 'passage')
          .forEach((star) => {
            const content = star.content as { passage: { title: string; paragraphs: string[] } };
            expect(content.passage.title, `${star.id} passage missing title`).toBeTruthy();
            expect(content.passage.paragraphs.length, `${star.id} passage empty`).toBeGreaterThan(0);
          });
      });

      it('generated stars produce challenges', () => {
        stars
          .filter((s) => s.content.kind === 'generated')
          .forEach((star) => {
            const challenges = challengesFor(star, 1);
            expect(challenges.length, `${star.id} generated nothing`).toBeGreaterThan(0);
          });
      });

      it('generated stars are deterministic per attempt', () => {
        const genStar = stars.find((s) => s.content.kind === 'generated');
        if (!genStar) return;
        const a = challengesFor(genStar, 1);
        const b = challengesFor(genStar, 1);
        expect(JSON.stringify(a)).toBe(JSON.stringify(b));
      });

      for (const [subject, minCount] of Object.entries(MIN_STARS[grade])) {
        describe(`${subject} constellation`, () => {
          const subjectStars = starsForSubject(grade, subject as SubjectId);

          it(`has at least ${minCount} stars`, () => {
            expect(
              subjectStars.length,
              `${subject} grade ${grade}: ${subjectStars.length} stars, expected >= ${minCount}`,
            ).toBeGreaterThanOrEqual(minCount);
          });

          it('all stars have the correct subject', () => {
            subjectStars.forEach((star) => {
              expect(star.subject).toBe(subject);
            });
          });

          if (subject !== 'bsf') {
            it('all stars follow the ID convention', () => {
              const stem = ID_STEM[subject];
              // Base stars: g{grade}_{stem}_{NN}; companions may add a suffix like _fc.
              const pattern = new RegExp(`^g${grade}_${stem}_\\d{2,3}(_[a-z]+)?$`);
              subjectStars.forEach((star) => {
                expect(star.id, `bad id ${star.id}`).toMatch(pattern);
              });
            });

            it('star numbering has no gaps', () => {
              const nums = [
                ...new Set(
                  subjectStars
                    .map((s) => {
                      const m = s.id.match(/_(\d{2,3})(?:_[a-z]+)?$/);
                      return m ? parseInt(m[1], 10) : NaN;
                    })
                    .filter((n) => !Number.isNaN(n)),
                ),
              ].sort((a, b) => a - b);

              for (let i = 1; i < nums.length; i++) {
                expect(nums[i] - nums[i - 1], `gap between ${nums[i - 1]} and ${nums[i]}`).toBe(1);
              }
            });
          }
        });
      }
    });
  }

  describe('Curriculum totals', () => {
    it('Grade 1 has at least 30 hours of authored content', () => {
      expect(totalMinutes(1) / 60).toBeGreaterThanOrEqual(30);
    });

    it('Grade 3 has at least 30 hours of authored content', () => {
      expect(totalMinutes(3) / 60).toBeGreaterThanOrEqual(30);
    });
  });
});
