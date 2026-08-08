// @vitest-environment jsdom
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReadAloudNotes } from './ReadAloudNotes';

vi.mock('../core/voice', () => ({
  speak: vi.fn(() => Promise.resolve()),
  stopSpeaking: vi.fn(),
}));
vi.mock('../core/audio', () => ({
  sfxVerseChime: vi.fn(),
}));

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

const NOTES = [
  { label: 'Main Truth', text: 'The gospel is the power of God that saves sinners.', emphasis: true },
  { label: "God's Attribute", text: 'Righteous — God is right in all He does.' },
  { label: 'Memory Verse', text: 'The righteous will live by faith.', emphasis: true },
];

describe('ReadAloudNotes', () => {
  it('renders every treasure row with its label and text as followable words', () => {
    render(<ReadAloudNotes notes={NOTES} />);
    expect(screen.getByText('This week’s treasures')).toBeTruthy();
    for (const row of NOTES) {
      expect(screen.getByText(row.label)).toBeTruthy();
    }
    // Text renders word by word so each word can light up.
    expect(document.querySelectorAll('.read-word').length).toBeGreaterThan(10);
  });

  it('reads each row aloud as "Label. Text" in order', async () => {
    const { speak } = await import('../core/voice');
    vi.mocked(speak).mockClear();

    render(<ReadAloudNotes notes={NOTES} />);
    fireEvent.click(screen.getByRole('button', { name: /read the treasures to me/i }));

    await waitFor(() => {
      expect(vi.mocked(speak).mock.calls.length).toBe(3);
    });
    const spoken = vi.mocked(speak).mock.calls.map((c) => c[0]);
    expect(spoken[0]).toBe('Main Truth. The gospel is the power of God that saves sinners.');
    expect(spoken[2]).toBe('Memory Verse. The righteous will live by faith.');

    // After a full listen the button becomes a replay.
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /listen again/i })).toBeTruthy();
    });
  });

  it('pulses its play button when nudged after the passage finishes', () => {
    render(<ReadAloudNotes notes={NOTES} nudge />);
    const play = screen.getByRole('button', { name: /read the treasures to me/i });
    expect(play.className).toContain('pulse');
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
