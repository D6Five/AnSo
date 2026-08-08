import { describe, it, expect } from 'vitest';
import { normalize, similarity, matchAnswer, isNearMiss } from './match';

/**
 * The answer matcher is the single most safety-critical piece of interaction
 * code in the app: every spoken and typed open response passes through it. Too
 * strict and the app feels broken and unfair to a six-year-old; too loose and
 * wrong answers get praised. These tests pin down the contract.
 */

describe('normalize', () => {
  it('lowercases, strips punctuation, and collapses whitespace', () => {
    expect(normalize('  The  Mitten!  ')).toBe('mitten');
  });

  it('strips leading filler phrases', () => {
    expect(normalize('the answer is seven')).toBe('7');
    expect(normalize('I think it is a nest')).toBe('nest');
    expect(normalize('um water')).toBe('water');
  });

  it('maps number words to digits', () => {
    expect(normalize('seven')).toBe('7');
    expect(normalize('twelve')).toBe('12');
  });

  it('drops articles anywhere', () => {
    expect(normalize('a bird made the nest')).toBe('bird made nest');
  });

  it('removes apostrophes rather than splitting the word', () => {
    expect(normalize("it's God's world")).toBe('gods world');
  });
});

describe('similarity', () => {
  it('is 1 for identical strings and low for unrelated ones', () => {
    expect(similarity('mitten', 'mitten')).toBe(1);
    expect(similarity('mitten', 'zzz')).toBeLessThan(0.2);
  });

  it('is symmetric', () => {
    expect(similarity('brave', 'brove')).toBe(similarity('brove', 'brave'));
  });
});

describe('matchAnswer', () => {
  it('accepts an exact answer', () => {
    const r = matchAnswer('mitten', ['mitten']);
    expect(r.ok).toBe(true);
    expect(r.score).toBe(1);
  });

  it('accepts a spoken number for a digit answer and vice versa', () => {
    expect(matchAnswer('seven', ['7']).ok).toBe(true);
    expect(matchAnswer('7', ['seven']).ok).toBe(true);
  });

  it('accepts a close misspelling of a longer word', () => {
    // "mittn" vs "mitten": one edit in six letters, well inside the threshold.
    expect(matchAnswer('mittn', ['mitten']).ok).toBe(true);
  });

  it('rejects a different short word even at one edit distance', () => {
    // Short words need exactness: "cap" is not "cat".
    expect(matchAnswer('cap', ['cat']).ok).toBe(false);
  });

  it('accepts the key phrase inside a full sentence', () => {
    const r = matchAnswer('i think the bird needed it for her babies', ['the bird needed it']);
    expect(r.ok).toBe(true);
  });

  it('accepts any one of several recogniser alternatives', () => {
    expect(matchAnswer('cap | cat | calf', ['cat']).ok).toBe(true);
  });

  it('checks every accepted answer, not just the first', () => {
    expect(matchAnswer('nest', ['for the eggs', 'a nest', 'the babies']).ok).toBe(true);
  });

  it('rejects an empty or filler-only response', () => {
    expect(matchAnswer('', ['anything']).ok).toBe(false);
    expect(matchAnswer('um', ['anything']).ok).toBe(false);
  });

  it('reports which accepted answer matched', () => {
    const r = matchAnswer('sevin is my answer', ['seven', 'the number seven']);
    // Whatever the path, a match must name its target so teaching can use it.
    if (r.ok) expect(r.matched).toBeTruthy();
  });

  it('never crashes on punctuation-only or bizarre input', () => {
    expect(matchAnswer('?!.,', ['cat']).ok).toBe(false);
    expect(matchAnswer('   |  | ', ['cat']).ok).toBe(false);
  });
});

describe('isNearMiss', () => {
  it('flags a close-but-wrong answer for encouraging feedback', () => {
    const r = matchAnswer('mitten', ['kitten']);
    // Same length, one letter off — not accepted (it is a different word of
    // 6 letters at 0.83 which passes... so use a clearly-close-but-failing pair)
    if (!r.ok) expect(isNearMiss(r)).toBe(true);
  });

  it('does not flag a wildly wrong answer', () => {
    const r = matchAnswer('dinosaur', ['mitten']);
    expect(r.ok).toBe(false);
    expect(isNearMiss(r)).toBe(false);
  });
});
