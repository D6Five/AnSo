import { useEffect, useMemo, useRef } from 'react';
import { useReadAloud, wordsWithOffsets } from './readAloudEngine';

/**
 * The study card, read aloud with follow-along highlighting — Main Truth,
 * God's Attribute, Doctrine, Gospel Connection, and the Memory Verse.
 *
 * Each row is spoken as "Label. Text." While the label is being said, the
 * whole label lights; then the text lights word by word, exactly like the
 * scripture read-along above it. When the passage reading finishes, this card
 * receives `nudge` and pulses its play button — the visible "you are here
 * next" signal.
 */

export interface StudyRow {
  label: string;
  text: string;
  emphasis?: boolean;
}

interface ReadAloudNotesProps {
  notes: StudyRow[];
  /** Pulse the play button and scroll into view — the passage has finished. */
  nudge?: boolean;
  onFinished?: () => void;
}

export function ReadAloudNotes({ notes, nudge = false, onFinished }: ReadAloudNotesProps) {
  // One utterance per row. The exact same string drives display, so the
  // highlight can never drift from the audio.
  const segments = useMemo(() => notes.map((n) => `${n.label}. ${n.text}`), [notes]);
  const { play, stop, playing, finishedOnce, pos } = useReadAloud({
    segments,
    rate: 0.9,
    chime: false,
    onFinished,
  });

  const rowWords = useMemo(() => segments.map(wordsWithOffsets), [segments]);
  // Words at an offset past "Label. " belong to the text slot.
  const textStarts = useMemo(() => notes.map((n) => n.label.length + 2), [notes]);

  const cardRef = useRef<HTMLElement | null>(null);
  const nudged = useRef(false);
  useEffect(() => {
    if (nudge && !nudged.current) {
      nudged.current = true;
      cardRef.current?.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [nudge]);

  return (
    <aside className="study-notes" ref={cardRef}>
      <div className="study-notes-head">
        <p className="study-notes-title">This week&rsquo;s treasures</p>
        {playing ? (
          <button type="button" className="btn" onClick={stop}>
            ⏹ Stop
          </button>
        ) : (
          <button
            type="button"
            className={`btn btn-primary ${nudge && !finishedOnce ? 'pulse' : ''}`}
            onClick={play}
          >
            {finishedOnce ? '🔊 Listen again' : '🔊 Read the treasures to me'}
          </button>
        )}
      </div>

      {notes.map((n, rowIndex) => {
        const rowActive = pos !== null && pos.segment === rowIndex;
        const textStart = textStarts[rowIndex];
        const activeWord = rowActive ? rowWords[rowIndex][pos.word] : null;
        const labelLit = activeWord !== null && activeWord.start < textStart;

        return (
          <div key={n.label} className={n.emphasis ? 'study-row emphasis' : 'study-row'}>
            <span className={labelLit ? 'study-label lit-label' : 'study-label'}>{n.label}</span>
            <p className="study-text">
              {rowWords[rowIndex]
                .filter((w) => w.start >= textStart)
                .map((w, i) => {
                  const lit = rowActive && activeWord !== null && activeWord.start === w.start && !labelLit;
                  return (
                    <span key={i} className={lit ? 'read-word lit' : 'read-word'}>
                      {w.word}{' '}
                    </span>
                  );
                })}
            </p>
          </div>
        );
      })}
    </aside>
  );
}
