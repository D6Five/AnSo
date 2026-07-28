import { useMemo, useState } from 'react';
import type { Profile, Star, SubjectId } from '../types';
import { SUBJECTS, starsForSubject } from '../content';
import { sfxLaunch, sfxTap, sfxWhoosh } from '../core/audio';
import { AnSoGuide } from './AnSoGuide';

/**
 * The universe of learning.
 *
 * Overview shows the six constellations with progress; picking one zooms to its
 * stars. Stars unlock in sequence — the next one opens when the previous is
 * finished, so there is always exactly one obvious next thing to do, which
 * matters a great deal for a six-year-old.
 */

interface GalaxyMapProps {
  profile: Profile;
  voiceEnabled: boolean;
  onOpenStar: (star: Star) => void;
  onSwitchProfile: () => void;
  onOpenSettings: () => void;
}

function isUnlocked(stars: Star[], index: number, profile: Profile): boolean {
  if (index === 0) return true;
  const previous = stars[index - 1];
  return (profile.progress[previous.id]?.completions ?? 0) > 0;
}

/** Deterministic scatter so stars look like a constellation, not a list. */
function starOffset(index: number): { x: number; y: number } {
  const wave = Math.sin(index * 1.1) * 26;
  const drift = Math.cos(index * 0.7) * 12;
  return { x: wave, y: drift };
}

export function GalaxyMap({
  profile,
  voiceEnabled,
  onOpenStar,
  onSwitchProfile,
  onOpenSettings,
}: GalaxyMapProps) {
  const [openSubject, setOpenSubject] = useState<SubjectId | null>(null);

  const progressBySubject = useMemo(() => {
    const out: Record<string, { done: number; total: number }> = {};
    for (const subject of SUBJECTS) {
      const stars = starsForSubject(profile.grade, subject.id);
      const done = stars.filter((s) => (profile.progress[s.id]?.completions ?? 0) > 0).length;
      out[subject.id] = { done, total: stars.length };
    }
    return out;
  }, [profile.grade, profile.progress]);

  const greeting = useMemo(() => {
    const totalDone = Object.values(progressBySubject).reduce((n, p) => n + p.done, 0);
    if (totalDone === 0) return `Welcome, ${profile.name}. Pick a constellation and we will begin.`;
    return `Good to see you again, ${profile.name}. You have lit ${totalDone} star${totalDone === 1 ? '' : 's'} so far.`;
  }, [profile.name, progressBySubject]);

  if (openSubject) {
    const subject = SUBJECTS.find((s) => s.id === openSubject)!;
    const stars = starsForSubject(profile.grade, openSubject);

    return (
      <div className="constellation-view" style={{ ['--subject-color' as string]: subject.color }}>
        <header className="constellation-header">
          <button
            type="button"
            className="btn btn-quiet"
            onClick={() => {
              sfxWhoosh();
              setOpenSubject(null);
            }}
          >
            ← All constellations
          </button>
          <div>
            <h1>
              <span aria-hidden="true">{subject.glyph}</span> {subject.constellation}
            </h1>
            <p className="constellation-sub">{subject.description}</p>
          </div>
        </header>

        {stars.length === 0 ? (
          <div className="empty-constellation">
            <p>
              This constellation is waiting for its stars. Add weeks to{' '}
              <code>src/content/bsfWeeks.ts</code> and they will appear here.
            </p>
          </div>
        ) : (
          <ol className="star-path">
            {stars.map((star, i) => {
              const unlocked = isUnlocked(stars, i, profile);
              const record = profile.progress[star.id];
              const done = (record?.completions ?? 0) > 0;
              const offset = starOffset(i);

              return (
                <li
                  key={star.id}
                  className="star-node"
                  style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
                >
                  <button
                    type="button"
                    className={`star-button ${done ? 'lit' : ''} ${unlocked ? '' : 'locked'}`}
                    onClick={() => {
                      if (!unlocked) {
                        sfxTap();
                        return;
                      }
                      sfxLaunch();
                      onOpenStar(star);
                    }}
                    disabled={!unlocked}
                    aria-label={`${star.title}${unlocked ? '' : ' (locked)'}`}
                  >
                    <span className="star-icon" aria-hidden="true">
                      {done ? '⭐' : unlocked ? '☆' : '🔒'}
                    </span>
                    <span className="star-node-title">{star.title}</span>
                    <span className="star-node-meta">
                      {unlocked ? `${star.minutes} min` : 'Finish the one before'}
                      {record ? ` · best ${record.bestScore}` : ''}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    );
  }

  return (
    <div className="galaxy-map">
      <header className="galaxy-header">
        <div className="profile-chip">
          <span className="chip-name">{profile.name}</span>
          <span className="chip-grade">Grade {profile.grade}</span>
        </div>
        <div className="stardust-counter" title="Stardust earned">
          ✨ {profile.stardust.toLocaleString()}
        </div>
        <div className="header-actions">
          <button type="button" className="btn btn-quiet" onClick={onSwitchProfile}>
            Switch explorer
          </button>
          <button type="button" className="btn btn-quiet" onClick={onOpenSettings}>
            ⚙︎
          </button>
        </div>
      </header>

      <div className="galaxy-greeting">
        <AnSoGuide mood="idle" says={greeting} voice={voiceEnabled} size={110} />
      </div>

      <div className="constellation-grid">
        {SUBJECTS.map((subject) => {
          const progress = progressBySubject[subject.id];
          const pct = progress.total ? (progress.done / progress.total) * 100 : 0;
          return (
            <button
              key={subject.id}
              type="button"
              className="constellation-card"
              style={{ ['--subject-color' as string]: subject.color }}
              onClick={() => {
                sfxWhoosh();
                setOpenSubject(subject.id);
              }}
            >
              <span className="card-glyph" aria-hidden="true">
                {subject.glyph}
              </span>
              <span className="card-name">{subject.constellation}</span>
              <span className="card-subject">{subject.name}</span>
              <span className="card-progress-track">
                <span className="card-progress-fill" style={{ width: `${pct}%` }} />
              </span>
              <span className="card-count">
                {progress.done} of {progress.total} stars lit
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
