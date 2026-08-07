import { describe, it, expect } from 'vitest';
import { ALL_KOREAN_WORDS } from './korean';
import { PICTURE_NAMES } from '../components/WordPicture';

describe('Korean word data', () => {
  it('every word has a picture that actually exists', () => {
    ALL_KOREAN_WORDS.forEach((word) => {
      expect(PICTURE_NAMES, `missing picture "${word.picture}" for ${word.english}`).toContain(
        word.picture,
      );
    });
  });

  it('no duplicate hangul entries', () => {
    const hangul = ALL_KOREAN_WORDS.map((w) => w.hangul);
    expect(new Set(hangul).size).toBe(hangul.length);
  });

  it('every word has sound and romanisation', () => {
    ALL_KOREAN_WORDS.forEach((w) => {
      expect(w.roman.length, `${w.english} missing roman`).toBeGreaterThan(0);
      expect(w.sound.length, `${w.english} missing sound`).toBeGreaterThan(0);
    });
  });
});
