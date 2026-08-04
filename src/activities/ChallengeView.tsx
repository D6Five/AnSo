import { useEffect, useMemo, useRef, useState } from 'react';
import type {
  Challenge,
  ChoiceChallenge,
  MatchChallenge,
  MathChallenge,
  OrderChallenge,
  SpeakChallenge,
  TypingChallenge,
} from '../types';
import { isNearMiss, matchAnswer } from '../core/match';
import { createRng } from '../core/rng';
import { sfxCorrect, sfxKey, sfxKeyMiss, sfxTap, sfxTryAgain } from '../core/audio';
import { speak } from '../core/voice';
import { WordPicture } from '../components/WordPicture';
import { MicButton } from './MicButton';

/**
 * Renders one challenge of any kind and reports the outcome upward.
 *
 * Every engine follows the same contract: the child may answer more than once,
 * `onResult` fires only when the challenge is finished, and `correct` reflects
 * whether they got it without needing the answer revealed. Nothing is ever a
 * dead end — there is always a way forward.
 */

export interface ChallengeResult {
  correct: boolean;
  /** Extra detail for typing challenges. */
  wpm?: number;
  accuracy?: number;
}

interface ChallengeViewProps {
  challenge: Challenge;
  micEnabled: boolean;
  /** Fired when the challenge is complete and the child has seen the feedback. */
  onResult: (result: ChallengeResult) => void;
  /** Ask AnSo to say something (feedback, hints). */
  onAnSoSay: (line: string, mood: 'happy' | 'encouraging' | 'thinking') => void;
}

export function ChallengeView(props: ChallengeViewProps) {
  const { challenge } = props;
  // Remount every engine when the challenge changes so no state leaks across.
  const key = challenge.id;

  switch (challenge.kind) {
    case 'choice':
      return <ChoiceView key={key} {...props} challenge={challenge} />;
    case 'speak':
      return <SpeakView key={key} {...props} challenge={challenge} />;
    case 'order':
      return <OrderView key={key} {...props} challenge={challenge} />;
    case 'match':
      return <MatchView key={key} {...props} challenge={challenge} />;
    case 'math':
      return <MathView key={key} {...props} challenge={challenge} />;
    case 'typing':
      return <TypingView key={key} {...props} challenge={challenge} />;
  }
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function ContinueButton({ onClick, label = 'Next' }: { onClick: () => void; label?: string }) {
  const ref = useRef<HTMLButtonElement>(null);

  /*
   * Bring the button to her.
   *
   * On a reading star the passage stays on screen above the question, so by the
   * time four options are answered the Next button can sit below the fold —
   * under the guide, who is stuck to the bottom of the viewport. It looked like
   * the lesson had frozen; the button was simply somewhere she had not thought
   * to scroll. autoFocus alone does not reliably scroll it into view.
   */
  useEffect(() => {
    const timer = window.setTimeout(
      () => ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
      60,
    );
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <button ref={ref} type="button" className="btn btn-primary continue-btn" onClick={onClick} autoFocus>
      {label} →
    </button>
  );
}

function HintLine({ hint, show }: { hint?: string; show: boolean }) {
  if (!hint || !show) return null;
  return <p className="hint-line">💡 {hint}</p>;
}

/**
 * A hint for a challenge that was not written with one.
 *
 * Reading, vocabulary, Korean, thinking and BSF questions are authored by hand
 * and many have no hint, so a child who guessed wrong got the same screen back
 * with nothing new to work from — which teaches guessing rather than thinking.
 * Maths and typing are excluded: they generate their own hints, and a typing
 * hint is about finger position rather than the answer.
 */
function fallbackHint(challenge: Challenge): string | undefined {
  switch (challenge.kind) {
    case 'speak': {
      const words = challenge.sampleAnswer.trim().split(/\s+/).length;
      const first = challenge.accept[0] ?? '';
      return words === 1 && first
        ? `It starts with the letter ${first[0].toUpperCase()}.`
        : 'Say it in your own words — a whole sentence is fine.';
    }
    case 'order':
      return `The first one is "${challenge.items[0]}".`;
    case 'match':
      return 'Take the one you are most sure about first.';
    case 'choice':
      // The elimination below is the real help here; this just names it.
      return 'I have crossed one out for you. Now pick between what is left.';
    default:
      return undefined;
  }
}

/**
 * Speaks a vocabulary word on demand, and once automatically when it appears.
 * A word learned only by sight cannot be used in conversation or recognised
 * when somebody else says it.
 */
function PronounceButton({
  word,
  meaning,
  lang,
}: {
  word: string;
  meaning?: string;
  lang?: string;
}) {
  useEffect(() => {
    // Slightly slow and clearly separated from AnSo's own chatter.
    const timer = window.setTimeout(() => void speak(word, { rate: 0.72, lang }), 350);
    return () => window.clearTimeout(timer);
  }, [word, lang]);

  return (
    <div className="pronounce-row">
      <button
        type="button"
        className="pronounce-btn"
        onClick={() => void speak(word, { rate: 0.62, lang })}
        aria-label={`Hear the word ${word} again`}
      >
        🔊 Say the word
      </button>
      {meaning ? (
        <button
          type="button"
          className="pronounce-btn"
          onClick={() => void speak(meaning, { rate: 0.85 })}
          aria-label={`Hear what ${word} means`}
        >
          📖 What it means
        </button>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Choice                                                              */
/* ------------------------------------------------------------------ */

function ChoiceView({
  challenge,
  onResult,
  onAnSoSay,
}: ChallengeViewProps & { challenge: ChoiceChallenge }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [wrongOnce, setWrongOnce] = useState(false);
  const [settled, setSettled] = useState(false);

  /**
   * Options are shuffled at display time rather than trusted as authored.
   *
   * Measured across the whole curriculum, the correct answer landed in the
   * second slot 35% of the time and the fourth only 18% — enough for a child to
   * start guessing by position instead of reading. Shuffling here fixes every
   * choice challenge at once, authored and generated alike, and the seed is the
   * challenge id so the order is stable if the component re-renders.
   */
  const order = useMemo(
    () => createRng(`opts:${challenge.id}`).shuffle(challenge.options.map((_, i) => i)),
    [challenge.id, challenge.options],
  );

  /** An option crossed out as a hint after the first wrong answer. */
  const [eliminated, setEliminated] = useState<number | null>(null);

  const choose = (index: number) => {
    if (settled) return;

    /*
     * A crossed-out option still answers back.
     *
     * Silently ignoring the tap is what makes a screen feel broken — the same
     * mistake that made the matching round look frozen. Two of four options
     * going quiet after one wrong answer reads as the app having stopped, not
     * as a hint, especially to a child who taps everything to find what works.
     */
    if (index === eliminated || (wrongOnce && index === picked)) {
      sfxTryAgain();
      onAnSoSay('That one is crossed out. Pick one of the other two.', 'encouraging');
      return;
    }

    sfxTap();
    setPicked(index);

    if (index === challenge.correct) {
      sfxCorrect();
      setSettled(true);
      onAnSoSay(challenge.teach ?? 'That is right.', 'happy');
      return;
    }

    sfxTryAgain();
    if (wrongOnce) {
      // Second miss: show the answer and move on rather than let them stall.
      setSettled(true);
      onAnSoSay(
        `The answer is "${challenge.options[challenge.correct]}". ${challenge.teach ?? ''}`,
        'encouraging',
      );
      return;
    }

    /*
     * First miss. Cross out one more wrong option, so the second attempt is a
     * genuinely narrower choice rather than the same screen again. With four
     * options this leaves two: enough to still require knowing the answer, and
     * little enough that a child who is close can get there.
     */
    const remainingWrong = order.filter(
      (i) => i !== challenge.correct && i !== index,
    );
    if (remainingWrong.length > 0) {
      const rng = createRng(`elim:${challenge.id}`);
      setEliminated(rng.pick(remainingWrong));
    }

    setWrongOnce(true);
    onAnSoSay(
      challenge.hint
        ? `Not that one. ${challenge.hint}`
        : 'Not that one. I have crossed out another, so there are two left.',
      'encouraging',
    );
  };

  return (
    <div className="challenge choice-challenge">
      {challenge.picture ? (
        <div className="picture-holder">
          <WordPicture name={challenge.picture} size={150} />
        </div>
      ) : null}
      {challenge.display ? <p className="challenge-display">{challenge.display}</p> : null}
      {challenge.pronounce ? (
        <PronounceButton
          word={challenge.pronounce}
          meaning={challenge.pronounceMeaning}
          lang={challenge.pronounceLang}
        />
      ) : null}
      <h2 className="challenge-prompt">{challenge.prompt}</h2>

      <div className="option-grid">
        {order.map((originalIndex) => {
          const isCorrect = originalIndex === challenge.correct;
          const isPicked = picked === originalIndex;
          const isOut = eliminated === originalIndex;
          const state = settled && isCorrect
            ? 'correct'
            : isPicked && !isCorrect
              ? 'wrong'
              : isOut
                ? 'eliminated'
                : '';
          return (
            <button
              key={originalIndex}
              type="button"
              className={`option-btn ${state}`}
              onClick={() => choose(originalIndex)}
              // Only a finished question disables anything. Crossed-out options
              // stay clickable and explain themselves; they simply cannot be
              // chosen, so re-tapping one never burns the second chance.
              disabled={settled}
            >
              {challenge.options[originalIndex]}
            </button>
          );
        })}
      </div>

      <HintLine
        hint={challenge.hint ?? fallbackHint(challenge)}
        show={wrongOnce && !settled}
      />

      {settled ? (
        <ContinueButton onClick={() => onResult({ correct: picked === challenge.correct })} />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Speak (voice or typed open response)                                */
/* ------------------------------------------------------------------ */

function SpeakView({
  challenge,
  micEnabled,
  onResult,
  onAnSoSay,
}: ChallengeViewProps & { challenge: SpeakChallenge }) {
  const [typed, setTyped] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [settled, setSettled] = useState(false);
  const [gotIt, setGotIt] = useState(false);
  const [heard, setHeard] = useState<string | null>(null);

  const judge = (raw: string) => {
    if (settled) return;
    // The recogniser hands back alternatives joined by "|"; show only the first.
    setHeard(raw.split('|')[0].trim());

    const result = matchAnswer(raw, challenge.accept);
    const next = attempts + 1;
    setAttempts(next);

    if (result.ok) {
      sfxCorrect();
      setGotIt(true);
      setSettled(true);
      onAnSoSay(challenge.teach ?? 'Yes, exactly.', 'happy');
      return;
    }

    sfxTryAgain();
    if (next >= 2) {
      setSettled(true);
      onAnSoSay(
        `Here is one way to say it: ${challenge.sampleAnswer}${challenge.teach ? ` ${challenge.teach}` : ''}`,
        'encouraging',
      );
    } else if (isNearMiss(result)) {
      onAnSoSay('So close. Try saying it once more.', 'encouraging');
    } else {
      onAnSoSay('Not quite. Have another go.', 'encouraging');
    }
  };

  const submitTyped = () => {
    if (!typed.trim()) return;
    judge(typed);
    setTyped('');
  };

  if (challenge.flashcard) {
    return (
      <div className="challenge speak-challenge flashcard-challenge">
        <div className={`flashcard-face ${settled ? (gotIt ? 'good' : 'missed') : ''}`}>
          <span className="flashcard-eyebrow">What does this word mean?</span>
          <span className="flashcard-word">{challenge.display}</span>
        </div>

        {challenge.pronounce ? (
          <PronounceButton word={challenge.pronounce} lang={challenge.pronounceLang} />
        ) : null}

        {heard ? (
          <p className={`heard-line ${gotIt ? 'good' : ''}`}>
            I heard: <strong>“{heard}”</strong>
          </p>
        ) : null}

        {!settled ? (
          <>
            <MicButton onTranscript={judge} micEnabled={micEnabled} />

            <div className="type-fallback">
              <label htmlFor="speak-input" className="type-label">
                or type your answer
              </label>
              <div className="type-row">
                <input
                  id="speak-input"
                  className="text-input"
                  value={typed}
                  onChange={(e) => setTyped(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submitTyped()}
                  placeholder="Type here…"
                  autoComplete="off"
                />
                <button type="button" className="btn" onClick={submitTyped} disabled={!typed.trim()}>
                  Check
                </button>
              </div>
            </div>

            <HintLine hint={challenge.hint} show={attempts >= 1} />
          </>
        ) : (
          <>
            <div className={`answer-reveal ${gotIt ? 'good' : ''}`}>
              {gotIt ? '⭐ You got it.' : `A good answer: ${challenge.sampleAnswer}`}
            </div>
            <ContinueButton onClick={() => onResult({ correct: gotIt })} />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="challenge speak-challenge">
      <h2 className="challenge-prompt">{challenge.prompt}</h2>

      {heard ? (
        <p className={`heard-line ${gotIt ? 'good' : ''}`}>
          I heard: <strong>“{heard}”</strong>
        </p>
      ) : null}

      {!settled ? (
        <>
          <MicButton onTranscript={judge} micEnabled={micEnabled} />

          <div className="type-fallback">
            <label htmlFor="speak-input" className="type-label">
              or type your answer
            </label>
            <div className="type-row">
              <input
                id="speak-input"
                className="text-input"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitTyped()}
                placeholder="Type here…"
                autoComplete="off"
              />
              <button type="button" className="btn" onClick={submitTyped} disabled={!typed.trim()}>
                Check
              </button>
            </div>
          </div>

          <HintLine hint={challenge.hint ?? fallbackHint(challenge)} show={attempts >= 1} />
        </>
      ) : (
        <>
          <div className={`answer-reveal ${gotIt ? 'good' : ''}`}>
            {gotIt ? '⭐ You got it.' : `A good answer: ${challenge.sampleAnswer}`}
          </div>
          <ContinueButton onClick={() => onResult({ correct: gotIt })} />
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Order                                                               */
/* ------------------------------------------------------------------ */

function OrderView({
  challenge,
  onResult,
  onAnSoSay,
}: ChallengeViewProps & { challenge: OrderChallenge }) {
  // Shuffle once per mount, seeded by id so it is stable across re-renders.
  const shuffled = useMemo(() => {
    const rng = createRng(challenge.id);
    let attempt = rng.shuffle(challenge.items);
    // A shuffle that happens to be already correct would give the puzzle away.
    if (attempt.every((item, i) => item === challenge.items[i]) && attempt.length > 1) {
      attempt = [...attempt.slice(1), attempt[0]];
    }
    return attempt;
  }, [challenge.id, challenge.items]);

  const [placed, setPlaced] = useState<string[]>([]);
  const [settled, setSettled] = useState(false);
  const [gotIt, setGotIt] = useState(false);

  const remaining = shuffled.filter((item) => !placed.includes(item));

  const place = (item: string) => {
    if (settled) return;
    sfxTap();
    const next = [...placed, item];
    setPlaced(next);

    if (next.length === challenge.items.length) {
      const correct = next.every((value, i) => value === challenge.items[i]);
      setGotIt(correct);
      setSettled(true);
      if (correct) {
        sfxCorrect();
        onAnSoSay(challenge.teach ?? 'That is the right order.', 'happy');
      } else {
        sfxTryAgain();
        onAnSoSay('Not quite that order. Look at the right one and see where it differs.', 'encouraging');
      }
    }
  };

  const undo = () => {
    if (settled) return;
    sfxTap();
    setPlaced(placed.slice(0, -1));
  };

  return (
    <div className="challenge order-challenge">
      <h2 className="challenge-prompt">{challenge.prompt}</h2>

      <ol className="order-slots">
        {challenge.items.map((_, i) => {
          const value = settled && !gotIt ? challenge.items[i] : placed[i];
          const wasWrong = settled && !gotIt;
          return (
            <li key={i} className={`order-slot ${value ? 'filled' : ''} ${wasWrong ? 'revealed' : ''}`}>
              <span className="order-num">{i + 1}</span>
              <span className="order-text">{value ?? '—'}</span>
            </li>
          );
        })}
      </ol>

      {!settled ? (
        <>
          <div className="order-pool">
            {remaining.map((item) => (
              <button key={item} type="button" className="option-btn" onClick={() => place(item)}>
                {item}
              </button>
            ))}
          </div>
          {placed.length > 0 ? (
            <button type="button" className="btn btn-quiet" onClick={undo}>
              ↩ Take back the last one
            </button>
          ) : null}
          <HintLine hint={challenge.hint ?? fallbackHint(challenge)} show={placed.length > 0} />
        </>
      ) : (
        <ContinueButton onClick={() => onResult({ correct: gotIt })} />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Match                                                               */
/* ------------------------------------------------------------------ */

function MatchView({
  challenge,
  onResult,
  onAnSoSay,
}: ChallengeViewProps & { challenge: MatchChallenge }) {
  const rights = useMemo(
    () => createRng(challenge.id).shuffle(challenge.pairs.map((p) => p.right)),
    [challenge.id, challenge.pairs],
  );

  /**
   * Which card is currently picked up, and from which column.
   *
   * Either side can be tapped first. Requiring the left column first meant the
   * right column sat disabled and silent, and a child tapping the English words
   * got no response at all — which reads as the game being broken rather than
   * as an instruction she missed.
   */
  const [held, setHeld] = useState<{ side: 'left' | 'right'; value: string } | null>(null);
  const [solved, setSolved] = useState<Record<string, string>>({});
  const [misses, setMisses] = useState(0);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);

  const done = Object.keys(solved).length === challenge.pairs.length;

  useEffect(() => {
    if (!done) return;
    sfxCorrect();
    onAnSoSay(challenge.teach ?? 'All matched.', 'happy');
  }, [done, challenge.teach, onAnSoSay]);

  const pick = (side: 'left' | 'right', value: string) => {
    if (done) return;

    // Nothing held, or tapping the same column again: just change what is held.
    if (!held || held.side === side) {
      sfxTap();
      setHeld({ side, value });
      return;
    }

    const left = side === 'left' ? value : held.value;
    const right = side === 'left' ? held.value : value;
    const pair = challenge.pairs.find((p) => p.left === left);

    if (pair && pair.right === right) {
      sfxCorrect();
      setSolved({ ...solved, [left]: right });
      setHeld(null);
    } else {
      sfxTryAgain();
      setMisses(misses + 1);
      setWrongFlash(value);
      window.setTimeout(() => setWrongFlash(null), 450);
      // Keep hold of the first card so she can simply try another partner.
    }
  };

  return (
    <div className="challenge match-challenge">
      <h2 className="challenge-prompt">{challenge.prompt}</h2>

      {/* Instruction above the columns, where it is read before tapping
          rather than discovered after nothing happened. */}
      {!done ? (
        <p className="match-help">
          {held
            ? `Now tap the one that goes with "${held.value}".`
            : 'Tap a card, then tap its partner.'}
        </p>
      ) : null}

      <div className="match-columns">
        <div className="match-col">
          {challenge.pairs.map((pair) => {
            const isSolved = solved[pair.left] !== undefined;
            const isHeld = held?.side === 'left' && held.value === pair.left;
            return (
              <button
                key={pair.left}
                type="button"
                className={`option-btn ${isSolved ? 'correct' : ''} ${isHeld ? 'selected' : ''} ${wrongFlash === pair.left ? 'wrong' : ''}`}
                onClick={() => pick('left', pair.left)}
                disabled={isSolved}
              >
                {pair.left}
              </button>
            );
          })}
        </div>

        <div className="match-col">
          {rights.map((right) => {
            const isSolved = Object.values(solved).includes(right);
            const isHeld = held?.side === 'right' && held.value === right;
            return (
              <button
                key={right}
                type="button"
                className={`option-btn ${isSolved ? 'correct' : ''} ${isHeld ? 'selected' : ''} ${wrongFlash === right ? 'wrong' : ''}`}
                onClick={() => pick('right', right)}
                // Only a solved card is ever dead. Everything else responds.
                disabled={isSolved}
              >
                {right}
              </button>
            );
          })}
        </div>
      </div>

      {/* After a couple of misses, offer a way in rather than let her keep
          guessing pairs at random. */}
      <HintLine hint={fallbackHint(challenge)} show={!done && misses >= 2} />

      {done ? (
        // One miss is normal exploration; several means it was not really known.
        <ContinueButton onClick={() => onResult({ correct: misses <= 1 })} />
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Math                                                                */
/* ------------------------------------------------------------------ */

function MathView({
  challenge,
  onResult,
  onAnSoSay,
}: ChallengeViewProps & { challenge: MathChallenge }) {
  const [entry, setEntry] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [settled, setSettled] = useState(false);
  const [gotIt, setGotIt] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const judge = (value: number) => {
    if (settled) return;
    const next = attempts + 1;
    setAttempts(next);

    if (value === challenge.answer) {
      sfxCorrect();
      setGotIt(true);
      setSettled(true);
      onAnSoSay(challenge.teach ?? 'Correct.', 'happy');
      return;
    }

    sfxTryAgain();
    if (next >= 2) {
      setSettled(true);
      onAnSoSay(`The answer is ${challenge.answer}. ${challenge.teach ?? ''}`, 'encouraging');
    } else {
      onAnSoSay('Not quite. Try once more.', 'encouraging');
      setEntry('');
      inputRef.current?.focus();
    }
  };

  return (
    <div className="challenge math-challenge">
      <p className="math-expression">{challenge.expression}</p>
      <h2 className="challenge-prompt">{challenge.prompt}</h2>

      {challenge.options ? (
        <div className="option-grid math-options">
          {challenge.options.map((value) => (
            <button
              key={value}
              type="button"
              className={`option-btn ${settled && value === challenge.answer ? 'correct' : ''}`}
              onClick={() => {
                sfxTap();
                judge(value);
              }}
              disabled={settled}
            >
              {value}
            </button>
          ))}
        </div>
      ) : !settled ? (
        <div className="type-row math-entry">
          <input
            ref={inputRef}
            className="text-input number-input"
            inputMode="numeric"
            value={entry}
            onChange={(e) => setEntry(e.target.value.replace(/[^0-9-]/g, ''))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && entry.trim()) judge(Number(entry));
            }}
            placeholder="?"
            autoComplete="off"
          />
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => entry.trim() && judge(Number(entry))}
            disabled={!entry.trim()}
          >
            Check
          </button>
        </div>
      ) : null}

      <HintLine hint={challenge.hint} show={attempts >= 1 && !settled} />

      {settled ? (
        <>
          <div className={`answer-reveal ${gotIt ? 'good' : ''}`}>
            {gotIt ? '⭐ Correct.' : `The answer was ${challenge.answer}.`}
          </div>
          <ContinueButton onClick={() => onResult({ correct: gotIt })} />
        </>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Typing                                                              */
/* ------------------------------------------------------------------ */

const HOME_ROW_GUIDE = 'ASDF — JKL;';

function TypingView({
  challenge,
  onResult,
  onAnSoSay,
}: ChallengeViewProps & { challenge: TypingChallenge }) {
  const [input, setInput] = useState('');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [errorCount, setErrorCount] = useState(0);
  const [settled, setSettled] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastLength = useRef(0);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const target = challenge.target;

  const handleChange = (value: string) => {
    if (settled) return;
    if (value.length > target.length) return;

    if (startedAt === null && value.length > 0) setStartedAt(Date.now());

    // Only judge the character that was just added, so backspacing to fix a
    // mistake is not counted as a second error.
    if (value.length > lastLength.current) {
      const index = value.length - 1;
      if (value[index] === target[index]) {
        sfxKey();
      } else {
        sfxKeyMiss();
        setErrorCount((n) => n + 1);
      }
    }
    lastLength.current = value.length;
    setInput(value);

    if (value.length === target.length) {
      const elapsedMs = Date.now() - (startedAt ?? Date.now());
      const minutes = Math.max(elapsedMs / 60000, 1 / 60);
      // Standard WPM convention: five characters counts as one word.
      const wpm = Math.round(target.length / 5 / minutes);
      const typedCorrect = [...value].filter((ch, i) => ch === target[i]).length;
      const accuracy = Math.round((typedCorrect / target.length) * 100);

      setSettled(true);
      const clean = value === target;
      if (clean) sfxCorrect();

      onAnSoSay(
        clean
          ? `Perfect. ${wpm} words per minute.`
          : `${accuracy} percent accurate at ${wpm} words per minute. Accuracy first — speed follows.`,
        clean ? 'happy' : 'encouraging',
      );

      window.setTimeout(() => onResult({ correct: accuracy >= 90, wpm, accuracy }), 50);
    }
  };

  return (
    <div className="challenge typing-challenge">
      <h2 className="challenge-prompt">{challenge.prompt}</h2>

      <div className="typing-target" aria-hidden="true">
        {[...target].map((ch, i) => {
          const typed = input[i];
          const state =
            typed === undefined ? 'pending' : typed === ch ? 'ok' : 'bad';
          const isCursor = i === input.length;
          return (
            <span key={i} className={`typing-char ${state} ${isCursor ? 'cursor' : ''}`}>
              {ch === ' ' ? ' ' : ch}
            </span>
          );
        })}
      </div>

      <input
        ref={inputRef}
        className="typing-input"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
        disabled={settled}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        aria-label="Type the text shown above"
      />

      {challenge.mode === 'keys' ? <p className="typing-guide">{HOME_ROW_GUIDE}</p> : null}

      <div className="typing-stats">
        <span>{input.length} / {target.length}</span>
        <span>{errorCount} slip{errorCount === 1 ? '' : 's'}</span>
      </div>

      <HintLine hint={challenge.hint} show={errorCount >= 3 && !settled} />
    </div>
  );
}
