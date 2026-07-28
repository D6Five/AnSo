import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Profile, Star } from '../types';
import { challengesFor } from '../content';
import { completeStar } from '../core/store';
import { sfxStarComplete, sfxStardust, sfxWhoosh } from '../core/audio';
import { speak, stopSpeaking } from '../core/voice';
import { AnSoGuide, type AnSoMood } from './AnSoGuide';
import { ChallengeView, type ChallengeResult } from '../activities/ChallengeView';

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

  useEffect(() => () => stopSpeaking(), []);

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

  const handleResult = (result: ChallengeResult) => {
    const nextScore = score + (result.correct ? 1 : 0);
    setScore(nextScore);

    if (index + 1 < challenges.length) {
      setIndex(index + 1);
      setAnsoLine('');
      setAnsoMood('idle');
      return;
    }

    // Finished the star.
    const stardust = completeStar(star.id, nextScore, challenges.length);
    setAwarded(stardust);
    setPhase('done');
    sfxStarComplete();
    window.setTimeout(sfxStardust, 700);

    const perfect = nextScore === challenges.length;
    const line = perfect
      ? `Every single one. You earned ${stardust} stardust.`
      : nextScore >= challenges.length * 0.7
        ? `${nextScore} out of ${challenges.length}. Strong work. ${stardust} stardust.`
        : `${nextScore} out of ${challenges.length}. This star will be here whenever you want another go. ${stardust} stardust.`;
    setAnsoLine(line);
    setAnsoMood(perfect ? 'happy' : 'encouraging');
  };

  const passage = star.content.kind === 'passage' ? star.content.passage : null;

  const readPassageAloud = () => {
    if (!passage) return;
    void speak([passage.title, ...passage.paragraphs].join('. '), { rate: 0.9 });
  };

  return (
    <div className="star-view">
      <header className="star-header">
        <button type="button" className="btn btn-quiet" onClick={onExit}>
          ← Back to the map
        </button>
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
              <p className="stardust-earned">+{awarded} stardust</p>
            </div>
            <button type="button" className="btn btn-primary btn-large" onClick={onExit}>
              Back to the map →
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
