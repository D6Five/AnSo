import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Profile, Star } from '../types';
import { challengesFor } from '../content';
import { bonusAppliesTo, completeStar, starsCompleted } from '../core/store';
import { rewardForMilestone } from '../content/rewards';
import { RewardReveal } from './PrincessScreen';
import { BackButton } from './BackButton';
import { useCurrency, useTerms } from '../../core/runtime/ConfigProvider';
import { sfxStarComplete, sfxStardust, sfxWhoosh } from '../core/audio';
import { speak, stopSpeaking } from '../core/voice';
import { setScene } from '../core/music';
import { AnSoGuide, type AnSoMood } from './AnSoGuide';
import { ChallengeView, type ChallengeResult } from '../activities/ChallengeView';
import { useSyncStatus, applyUpdate } from '../core/sync';

/**
 * Runs a single star from opening line to reward screen.
 *
 * Reading and BSF stars show their passage first and keep it available behind a
 * toggle while questions are answered — the goal is comprehension, not recall.
 */

interface StarViewProps {
  star: Star;
  profile: Profile;
  voiceEnabled: boolean;
  micEnabled: boolean;
  onExit: () => void;
}

type Phase = 'intro' | 'passage' | 'playing' | 'done';

export function StarView({ star, profile, voiceEnabled, micEnabled, onExit }: StarViewProps) {
  const terms = useTerms();
  const currency = useCurrency();
  const syncStatus = useSyncStatus();
  const attempt = profile.progress[star.id]?.completions ?? 0;
  const challenges = useMemo(() => challengesFor(star, attempt), [star, attempt]);

  const hasPassage = star.content.kind === 'passage';
  const [phase, setPhase] = useState<Phase>('intro');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showPassage, setShowPassage] = useState(true);
  const [ansoLine, setAnsoLine] = useState(star.blurb);
  const [ansoMood, setAnsoMood] = useState<AnSoMood>('talking');
  const [awarded, setAwarded] = useState(0);
  const [newReward, setNewReward] = useState<string | null>(null);
  const [rewardSeen, setRewardSeen] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [bonusPaid, setBonusPaid] = useState(false);

  useEffect(() => () => stopSpeaking(), []);


  // Music steps back inside an activity and stops altogether while a passage is
  // on screen, then hands the map its full level back on the way out.
  useEffect(() => {
    setScene(phase === 'passage' ? 'reading' : 'activity');
  }, [phase]);

  useEffect(() => () => setScene('map'), []);

  const say = useCallback((line: string, mood: 'happy' | 'encouraging' | 'thinking') => {
    setAnsoLine(line);
    setAnsoMood(mood);
  }, []);

  const begin = () => {
    sfxWhoosh();
    if (hasPassage) {
      setPhase('passage');
      setAnsoLine('Read it through first. I can read it to you if you like.');
      setAnsoMood('idle');
    } else {
      setPhase('playing');
      setAnsoLine('');
      setAnsoMood('idle');
    }
  };

  const startQuestions = () => {
    sfxWhoosh();
    setPhase('playing');
    setAnsoLine('');
    setAnsoMood('idle');
  };

  const finishStar = useCallback(
    (finalScore: number, ranOutOfTime = false) => {
      // A treasure is granted only for a star finished for the first time, so
      // replaying a favourite cannot farm the whole wardrobe in an afternoon.
      const firstTime = (profile.progress[star.id]?.completions ?? 0) === 0;
      const collectedBefore = starsCompleted(profile);

      // Worked out before completing, since finishing changes the answer.
      const paidBonus = bonusAppliesTo(profile, star);
      const stardust = completeStar(star.id, finalScore, challenges.length, paidBonus);
      setAwarded(stardust);
      setBonusPaid(paidBonus);
      if (firstTime) {
        const treasure = rewardForMilestone(collectedBefore + 1);
        setNewReward(treasure ? treasure.id : null);
      }
      setPhase('done');
      setSecondsLeft(null);
      sfxStarComplete();
      window.setTimeout(sfxStardust, 700);

      const perfect = finalScore === challenges.length;
      const earned = currency.amount(stardust);
      const line = ranOutOfTime
        ? `Time is up. You got ${finalScore} of them, and they all still count. ${earned}.`
        : perfect
          ? `Every single one. You earned ${earned}.`
          : finalScore >= challenges.length * 0.7
            ? `${finalScore} out of ${challenges.length}. Strong work. ${earned}.`
            : `${finalScore} out of ${challenges.length}. This ${terms.lesson} will be here whenever you want another go. ${earned}.`;
      setAnsoLine(line);
      setAnsoMood(perfect && !ranOutOfTime ? 'happy' : 'encouraging');
    },
    [profile, star.id, challenges.length, currency, terms.lesson],
  );

  /**
   * Countdown for timed stars. Running out finishes the star with whatever has
   * been answered — it never throws the work away, which would be a miserable
   * thing to do to a child thirty questions in.
   */
  useEffect(() => {
    if (phase !== 'playing' || !star.timeLimitSeconds) return;
    if (secondsLeft === null) {
      setSecondsLeft(star.timeLimitSeconds);
      return;
    }
    if (secondsLeft <= 0) {
      finishStar(score, true);
      return;
    }
    const tick = window.setTimeout(() => setSecondsLeft((s) => (s === null ? null : s - 1)), 1000);
    return () => window.clearTimeout(tick);
  }, [phase, secondsLeft, star.timeLimitSeconds, score, finishStar]);

  const handleResult = (result: ChallengeResult) => {
    const nextScore = score + (result.correct ? 1 : 0);
    setScore(nextScore);

    if (index + 1 < challenges.length) {
      setIndex(index + 1);
      setAnsoLine('');
      setAnsoMood('idle');
      return;
    }
    finishStar(nextScore);
  };

  const passage = star.content.kind === 'passage' ? star.content.passage : null;

  const readPassageAloud = () => {
    if (!passage) return;
    void speak([passage.title, ...passage.paragraphs].join('. '), { rate: 0.9 });
  };

  return (
    <div className="star-view">
      <header className="star-header">
        <BackButton label="Back to the map" onClick={onExit} />
        <div className="star-title-block">
          <h1>{star.title}</h1>
          {phase === 'playing' ? (
            <div className="progress-track" aria-label={`Question ${index + 1} of ${challenges.length}`}>
              <div
                className="progress-fill"
                style={{ width: `${((index) / challenges.length) * 100}%` }}
              />
              <span className="progress-label">
                {index + 1} / {challenges.length}
              </span>
            </div>
          ) : null}
          {phase === 'playing' && secondsLeft !== null ? (
            <p className={`star-timer ${secondsLeft <= 60 ? 'low' : ''}`}>
              ⏱ {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, '0')}
            </p>
          ) : null}
        </div>
      </header>

      <div className="star-body">
        {phase === 'intro' ? (
          <div className="intro-panel">
            <AnSoGuide mood={ansoMood} says={ansoLine} voice={voiceEnabled} size={150} />
            <button type="button" className="btn btn-primary btn-large" onClick={begin}>
              I am ready
            </button>
          </div>
        ) : null}

        {phase === 'passage' && passage ? (
          <div className="passage-panel">
            <article className="passage">
              <h2>{passage.title}</h2>
              {passage.preview?.length ? (
                <aside className="preview-words">
                  <h3>Words to know first</h3>
                  <ul>
                    {passage.preview.map((p) => (
                      <li key={p.word}>
                        <strong>{p.word}</strong> — {p.meaning}
                      </li>
                    ))}
                  </ul>
                </aside>
              ) : null}
              {passage.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </article>

            <div className="passage-actions">
              <button type="button" className="btn" onClick={readPassageAloud}>
                🔊 Read it to me
              </button>
              <button type="button" className="btn btn-primary" onClick={startQuestions}>
                I have read it →
              </button>
            </div>
          </div>
        ) : null}

        {phase === 'playing' ? (
          <div className="play-panel">
            {passage ? (
              <div className="passage-drawer">
                <button
                  type="button"
                  className="btn btn-quiet"
                  onClick={() => setShowPassage((v) => !v)}
                >
                  {showPassage ? '▾ Hide the story' : '▸ Show the story again'}
                </button>
                {showPassage ? (
                  <article className="passage passage-compact">
                    {passage.paragraphs.map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </article>
                ) : null}
              </div>
            ) : null}

            <ChallengeView
              challenge={challenges[index]}
              micEnabled={micEnabled}
              onResult={handleResult}
              onAnSoSay={say}
            />

            <div className="anso-dock">
              <AnSoGuide mood={ansoMood} says={ansoLine} voice={voiceEnabled} size={92} />
            </div>
          </div>
        ) : null}

        {phase === 'done' ? (
          <div className="done-panel">
            <div className="star-burst" aria-hidden="true">⭐</div>
            <AnSoGuide mood={ansoMood} says={ansoLine} voice={voiceEnabled} size={150} />
            <div className="score-summary">
              <p className="score-big">
                {score} <span>/ {challenges.length}</span>
              </p>
              <p className="stardust-earned">+{currency.amount(awarded)}</p>
              {bonusPaid ? (
                <p className="bonus-note">
                  ✨ Double for exploring somewhere new
                </p>
              ) : null}
            </div>

            {newReward && !rewardSeen ? (
              <RewardReveal rewardId={newReward} onSeen={() => setRewardSeen(true)} />
            ) : syncStatus.updateAvailable ? (
              <div className="update-prompt">
                <p>✨ A new version is ready!</p>
                <button type="button" className="btn btn-primary btn-large" onClick={applyUpdate}>
                  Get the latest →
                </button>
              </div>
            ) : (
              <button type="button" className="btn btn-primary btn-large" onClick={onExit}>
                Back to the map →
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
