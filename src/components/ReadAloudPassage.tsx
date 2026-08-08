import { useEffect, useMemo, useRef } from 'react';
import { useReadAloud, wordsWithOffsets } from './readAloudEngine';

/**
 * A passage that reads itself aloud while underlining each word in time with
 * the voice — the read-along experience used by the scripture stars. The
 * timing engine lives in readAloudEngine; this component only renders the
 * paragraphs as word spans and lights the one being spoken.
 */

interface ReadAloudPassageProps {
  paragraphs: string[];
  /** Speaking rate; scripture reads a touch slower than conversation. */
  rate?: number;
  /** Button label before the first listen. */
  label?: string;
  /** Called when a full read-through finishes naturally. */
  onFinished?: () => void;
}

export function ReadAloudPassage({
  paragraphs,
  rate = 0.88,
  label = '🔊 Read it to me',
  onFinished,
}: ReadAloudPassageProps) {
  const { play, stop, playing, finishedOnce, pos } = useReadAloud({
    segments: paragraphs,
    rate,
    onFinished,
  });
  const activeWordRef = useRef<HTMLSpanElement | null>(null);

  const paraWords = useMemo(() => paragraphs.map(wordsWithOffsets), [paragraphs]);

  // Keep the lit word comfortably in view without yanking the page around.
  useEffect(() => {
    activeWordRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [pos]);

  return (
    <div className="read-along">
      <div className="read-along-controls">
        {playing ? (
          <button type="button" className="btn" onClick={stop}>
            ⏹ Stop
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={play}>
            {finishedOnce ? '🔊 Listen again' : label}
          </button>
        )}
        {playing ? <span className="read-along-live">Follow the moving line…</span> : null}
      </div>

      {paragraphs.map((_, p) => (
        <p key={p} className="read-along-para">
          {paraWords[p].map((w, i) => {
            const active = pos !== null && pos.segment === p && pos.word === i;
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
