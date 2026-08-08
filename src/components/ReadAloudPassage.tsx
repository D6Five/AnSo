import { useEffect, useMemo, useRef, useState } from 'react';
import { speak, stopSpeaking } from '../core/voice';
import { sfxVerseChime } from '../core/audio';

/**
 * A passage that reads itself aloud while underlining each word in time with
 * the voice — the read-along experience used by the scripture stars.
 *
 * Word position comes from the speech engine's boundary events when the voice
 * provides them. Many remote voices never fire those events, so a paced timer
 * runs alongside as a fallback: it advances the underline at an estimated
 * words-per-minute matched to the speaking rate, and the moment a real
 * boundary event arrives the timer stands down for that paragraph. Either way
 * the child sees the words light up as they are spoken.
 */

interface ReadAloudPassageProps {
  paragraphs: string[];
  /** Speaking rate; scripture reads a touch slower than conversation. */
  rate?: number;
  /** Called when a full read-through finishes naturally. */
  onFinished?: () => void;
}

interface WordPos {
  para: number;
  word: number;
}

/** Split a paragraph into words with their starting character offsets. */
function wordsWithOffsets(text: string): { word: string; start: number }[] {
  const out: { word: string; start: number }[] = [];
  const re = /\S+/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) out.push({ word: m[0], start: m.index });
  return out;
}

export function ReadAloudPassage({ paragraphs, rate = 0.88, onFinished }: ReadAloudPassageProps) {
  const [pos, setPos] = useState<WordPos | null>(null);
  const [playing, setPlaying] = useState(false);
  const [finishedOnce, setFinishedOnce] = useState(false);
  // Bumped to abandon an in-flight read loop when the child stops or leaves.
  const runToken = useRef(0);
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  const paraWords = useMemo(() => paragraphs.map(wordsWithOffsets), [paragraphs]);

  useEffect(
    () => () => {
      runToken.current++;
      stopSpeaking();
    },
    [],
  );

  // Keep the lit word comfortably in view without yanking the page around.
  useEffect(() => {
    activeWordRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [pos]);

  const stop = () => {
    runToken.current++;
    stopSpeaking();
    setPlaying(false);
    setPos(null);
  };

  const play = async () => {
    const token = ++runToken.current;
    setPlaying(true);
    sfxVerseChime();

    // Rough pace for the fallback timer. The default speech rate is ~170 wpm
    // at 1.0; scale by our rate and convert to ms per word.
    const msPerWord = 60000 / (170 * rate);

    for (let p = 0; p < paragraphs.length; p++) {
      if (runToken.current !== token) return;
      const words = paraWords[p];
      if (words.length === 0) continue;

      setPos({ para: p, word: 0 });

      let sawBoundary = false;
      let timerWord = 0;
      const ticker = window.setInterval(() => {
        if (sawBoundary || runToken.current !== token) return;
        timerWord = Math.min(timerWord + 1, words.length - 1);
        setPos({ para: p, word: timerWord });
      }, msPerWord);

      await speak(paragraphs[p], {
        rate,
        interrupt: p === 0,
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
          setPos({ para: p, word: w });
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

  return (
    <div className="read-along">
      <div className="read-along-controls">
        {playing ? (
          <button type="button" className="btn" onClick={stop}>
            ⏹ Stop
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => void play()}>
            {finishedOnce ? '🔊 Listen again' : '🔊 Read it to me'}
          </button>
        )}
        {playing ? <span className="read-along-live">Follow the moving line…</span> : null}
      </div>

      {paragraphs.map((_, p) => (
        <p key={p} className="read-along-para">
          {paraWords[p].map((w, i) => {
            const active = pos !== null && pos.para === p && pos.word === i;
            return (
              <span
                key={i}
                ref={active ? activeWordRef : undefined}
                className={active ? 'read-word lit' : 'read-word'}
              >
                {w.word}{' '}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
