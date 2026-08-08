// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChallengeView } from './ChallengeView';
import type { ChoiceChallenge, OrderChallenge } from '../types';

/**
 * Interaction regression tests. Every bug a child actually hit in this app —
 * the frozen-looking matching round, the silent crossed-out options, the
 * unreachable Next button — was an interaction bug, not a data bug. These
 * tests drive the real components the way a child taps them.
 */

// Audio and speech reach for browser APIs jsdom does not have; the tests care
// about what is on screen, not what is heard.
vi.mock('../core/audio', () => ({
  sfxCorrect: vi.fn(),
  sfxKey: vi.fn(),
  sfxKeyMiss: vi.fn(),
  sfxTap: vi.fn(),
  sfxTryAgain: vi.fn(),
}));
vi.mock('../core/voice', () => ({
  speak: vi.fn(() => Promise.resolve()),
  stopSpeaking: vi.fn(),
  listenOnce: vi.fn(() => ({ stop: vi.fn() })),
  isRecognitionSupported: () => false,
  isSynthesisSupported: () => false,
}));

beforeAll(() => {
  // jsdom has no layout, so scrollIntoView (used to bring Next to the child)
  // does not exist on elements. The behaviour under test is that Next EXISTS.
  Element.prototype.scrollIntoView = vi.fn();
});

const choice: ChoiceChallenge = {
  kind: 'choice',
  id: 'test_choice',
  prompt: 'What did Mia lose?',
  options: ['Her red mitten', 'Her blue hat', 'Her school bag', 'Her boot'],
  correct: 0,
  hint: 'The first sentence says it.',
  teach: 'She lost her red mitten.',
};

function renderChallenge(challenge: ChoiceChallenge | OrderChallenge) {
  const onResult = vi.fn();
  const onAnSoSay = vi.fn();
  render(
    <ChallengeView
      challenge={challenge}
      micEnabled={false}
      onResult={onResult}
      onAnSoSay={onAnSoSay}
    />,
  );
  return { onResult, onAnSoSay };
}

describe('choice challenge', () => {
  it('shows every option and no Next button before an answer', () => {
    renderChallenge(choice);
    for (const option of choice.options) {
      expect(screen.getByRole('button', { name: option })).toBeTruthy();
    }
    expect(screen.queryByRole('button', { name: /next/i })).toBeNull();
  });

  it('a correct answer settles the question and surfaces Next', () => {
    const { onResult, onAnSoSay } = renderChallenge(choice);
    fireEvent.click(screen.getByRole('button', { name: 'Her red mitten' }));

    const next = screen.getByRole('button', { name: /next/i });
    expect(next).toBeTruthy();
    expect(onAnSoSay).toHaveBeenCalledWith('She lost her red mitten.', 'happy');

    fireEvent.click(next);
    expect(onResult).toHaveBeenCalledWith({ correct: true });
  });

  it('a first wrong answer shows the hint and crosses out another option — and never goes silent', () => {
    const { onResult, onAnSoSay } = renderChallenge(choice);
    fireEvent.click(screen.getByRole('button', { name: 'Her blue hat' }));

    // No Next yet — the child gets another go.
    expect(screen.queryByRole('button', { name: /next/i })).toBeNull();
    expect(screen.getByText(/The first sentence says it/)).toBeTruthy();

    // Exactly one extra wrong option is crossed out as a scaffold.
    const eliminated = document.querySelectorAll('.option-btn.eliminated');
    expect(eliminated.length).toBe(1);

    // Regression: tapping the crossed-out option must answer back, not ignore.
    onAnSoSay.mockClear();
    fireEvent.click(eliminated[0] as HTMLElement);
    expect(onAnSoSay).toHaveBeenCalledWith(
      expect.stringContaining('crossed out'),
      'encouraging',
    );
    expect(onResult).not.toHaveBeenCalled();
  });

  it('recovering on the second try still counts as correct', () => {
    const { onResult } = renderChallenge(choice);
    fireEvent.click(screen.getByRole('button', { name: 'Her blue hat' }));
    fireEvent.click(screen.getByRole('button', { name: 'Her red mitten' }));
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onResult).toHaveBeenCalledWith({ correct: true });
  });

  it('a second miss reveals the answer and always offers a way forward', () => {
    const { onResult, onAnSoSay } = renderChallenge(choice);
    fireEvent.click(screen.getByRole('button', { name: 'Her blue hat' }));

    // Pick the remaining wrong option that is not crossed out.
    const stillWrong = ['Her school bag', 'Her boot']
      .map((name) => screen.getByRole('button', { name }))
      .find((b) => !b.className.includes('eliminated'))!;
    fireEvent.click(stillWrong);

    // Never a dead end: the answer is revealed and Next appears.
    expect(onAnSoSay).toHaveBeenLastCalledWith(
      expect.stringContaining('Her red mitten'),
      'encouraging',
    );
    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(onResult).toHaveBeenCalledWith({ correct: false });
  });
});

describe('spoken questions (speakPrompt)', () => {
  it('reads the prompt aloud on open and offers a replay button', async () => {
    const { speak } = await import('../core/voice');
    vi.mocked(speak).mockClear();

    renderChallenge({ ...choice, id: 'spoken_1', speakPrompt: true });

    expect(speak).toHaveBeenCalledWith('What did Mia lose?');
    const replay = screen.getByRole('button', { name: /hear the question again/i });
    vi.mocked(speak).mockClear();
    fireEvent.click(replay);
    expect(speak).toHaveBeenCalledWith('What did Mia lose?');
  });

  it('does not read or show replay for ordinary challenges', async () => {
    const { speak } = await import('../core/voice');
    vi.mocked(speak).mockClear();

    renderChallenge(choice);

    expect(speak).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: /hear the question again/i })).toBeNull();
  });

  it('yields to challenges that already auto-play audio via pronounce', async () => {
    const { speak } = await import('../core/voice');
    vi.mocked(speak).mockClear();

    renderChallenge({ ...choice, id: 'spoken_2', speakPrompt: true, pronounce: 'mitten' });

    // The prompt must not race the pronounce audio; only one auto-play path.
    expect(vi.mocked(speak).mock.calls.map((c) => c[0])).not.toContain('What did Mia lose?');
    expect(screen.queryByRole('button', { name: /hear the question again/i })).toBeNull();
  });
});

describe('order challenge', () => {
  const order: OrderChallenge = {
    kind: 'order',
    id: 'test_order',
    prompt: 'Put these in order from smallest to biggest.',
    items: ['Ant', 'Cat', 'Horse', 'Elephant'],
    teach: 'Sorted by size.',
  };

  it('renders every item as something tappable', () => {
    renderChallenge(order);
    for (const item of order.items) {
      expect(screen.getByText(item)).toBeTruthy();
    }
  });
});
