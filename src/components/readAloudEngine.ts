import { useEffect, useRef, useState } from 'react';
import { speak, stopSpeaking } from '../core/voice';
import { sfxVerseChime } from '../core/audio';

/**
 * The shared follow-along engine: speaks a sequence of text segments while
 * reporting which word is currently being said, so the screen can light it up.
 *
 * Word position comes from the speech engine's boundary events when the voice
 * provides them. Many remote voices never fire those events, so a paced timer
 * runs alongside as a fallback: it advances the highlight at an estimated
 * words-per-minute matched to the speaking rate, and the moment a real
 * boundary event arrives the timer stands down for that segment.
 *
 * Both the scripture passage and the study card render through this, so the
 * two read-alongs can never drift apart in behaviour.
 */

export interface WordSpan {
  word: string;
  start: number;
}

/** Split text into words with their starting character offsets. */
export function wordsWithOffsets(text: string): WordSpan[] {
  const out: WordSpan[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) out.push({ word: m[0], start: m.index });
  return out;
}

export interface ReadAloudPos {
  segment: number;
  word: number;
}

export interface ReadAloudHandle {
  play: () => void;
  stop: () => void;
  playing: boolean;
  finishedOnce: boolean;
  /** The word being spoken right now, or null when idle. */
  pos: ReadAloudPos | null;
}

interface ReadAloudOptions {
  /** One utterance per entry; highlighting indexes into these strings. */
  segments: string[];
  /** Speaking rate; scripture reads a touch slower than conversation. */
  rate?: number;
  /** Play the settling chime before the first segment. */
  chime?: boolean;
  onFinished?: () => void;
}

export function useReadAloud({ segments, rate = 0.88, chime = true, onFinished }: ReadAloudOptions): ReadAloudHandle {
  const [pos, setPos] = useState<ReadAloudPos | null>(null);
  const [playing, setPlaying] = useState(false);
  const [finishedOnce, setFinishedOnce] = useState(false);
  // Bumped to abandon an in-flight read loop when the child stops or leaves.
  const runToken = useRef(0);

  useEffect(
    () => () => {
      runToken.current++;
      stopSpeaking();
    },
    [],
  );

  const stop = () => {
    runToken.current++;
    stopSpeaking();
    setPlaying(false);
    setPos(null);
  };

  const play = async () => {
    const token = ++runToken.current;
    setPlaying(true);
    if (chime) sfxVerseChime();

    // Rough pace for the fallback timer. The default speech rate is ~170 wpm
    // at 1.0; scale by our rate and convert to ms per word.
    const msPerWord = 60000 / (170 * rate);

    for (let s = 0; s < segments.length; s++) {
      if (runToken.current !== token) return;
      const words = wordsWithOffsets(segments[s]);
      if (words.length === 0) continue;

      setPos({ segment: s, word: 0 });

      let sawBoundary = false;
      let timerWord = 0;
      const ticker = window.setInterval(() => {
        if (sawBoundary || runToken.current !== token) return;
        timerWord = Math.min(timerWord + 1, words.length - 1);
        setPos({ segment: s, word: timerWord });
      }, msPerWord);

      await speak(segments[s], {
        rate,
        interrupt: s === 0,
        onBoundary: (charIndex) => {
          if (runToken.current !== token) return;
          sawBoundary = true;
          // The word whose span contains this character offset.
          let w = words.length - 1;
          for (let i = 0; i < words.length; i++) {
            if (words[i].start > charIndex) {
              w = Math.max(0, i - 1);
              break;
            }
          }
          setPos({ segment: s, word: w });
        },
      });

      window.clearInterval(ticker);
    }

    if (runToken.current !== token) return;
    setPlaying(false);
    setPos(null);
    setFinishedOnce(true);
    onFinished?.();
  };

  return { play: () => void play(), stop, playing, finishedOnce, pos };
}
