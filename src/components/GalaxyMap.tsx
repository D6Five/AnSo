import { useMemo, useState } from 'react';
import type { Profile, Star, SubjectId } from '../types';
import { SUBJECTS, starsForSubject } from '../content';
import { sfxLaunch, sfxWhoosh } from '../core/audio';
import { AnSoGuide } from './AnSoGuide';
import { SyncBadge } from './SyncBadge';
import { PrincessArt } from './PrincessArt';
import { BackButton } from './BackButton';
import { princessOrDefault } from '../content/princesses';
import { REWARD_BY_ID, type AccessoryReward, type DressReward } from '../content/rewards';
import { earnedRewards, spendableStardust } from '../core/store';

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
  onOpenPrincess: () => void;
  onSwitchProfile: () => void;
  onOpenSettings: () => void;
}


export function GalaxyMap({
  profile,
  voiceEnabled,
  onOpenStar,
  onOpenPrincess,
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

  const princess = princessOrDefault(profile.princess);
  const treasures = earnedRewards(profile);

  const wornDress = useMemo(() => {
    const equipped = profile.equippedDress ? REWARD_BY_ID[profile.equippedDress] : null;
    if (equipped && equipped.kind === 'dress') return equipped;
    const dresses = treasures.filter((r): r is DressReward => r.kind === 'dress');
    return dresses[dresses.length - 1] ?? null;
  }, [profile.equippedDress, treasures]);

  const wornAccessories = useMemo(
    () =>
      (profile.equippedAccessories ?? [])
        .map((id) => REWARD_BY_ID[id])
        .filter((r): r is AccessoryReward => !!r && r.kind === 'accessory'),
    [profile.equippedAccessories],
  );

  const greeting = useMemo(() => {
    const totalDone = Object.values(progressBySubject).reduce((n, p) => n + p.done, 0);
    if (totalDone === 0) return `Welcome, ${profile.name}. Pick a constellation and we will begin.`;
    return `Good to see you again, ${profile.name}. You have lit ${totalDone} star${totalDone === 1 ? '' : 's'} so far.`;
  }, [profile.name, progressBySubject]);

  if (openSubject) {
    const subject = SUBJECTS.find((s) => s.id === openSubject)!;
    const stars = starsForSubject(profile.grade, openSubject);

    // Unlocking is sequential, so the first unfinished star is the one that is
    // open. Everything after it stays out of sight until she gets there.
    const nextStar = stars.find((s) => (profile.progress[s.id]?.completions ?? 0) === 0);
    const litStars = stars.filter((s) => (profile.progress[s.id]?.completions ?? 0) > 0);

    return (
      <div
        className="constellation-view"
        style={{
          ['--subject-color' as string]: subject.color,
          ['--subject-deep' as string]: subject.colorDeep,
        }}
      >
        <BackButton label="Go Home" onClick={() => setOpenSubject(null)} />

        <header className="constellation-header">
          <h1>
            <span aria-hidden="true">{subject.glyph}</span> {subject.constellation}
          </h1>
          <p className="constellation-sub">{subject.description}</p>
        </header>

        {stars.length === 0 ? (
          <div className="empty-constellation">
            <p>
              This constellation is waiting for its stars. Add weeks to{' '}
              <code>src/content/bsfWeeks.ts</code> and they will appear here.
            </p>
          </div>
        ) : nextStar ? (
          <>
            {/*
             * Only the one star she can actually open. A list of twenty rows,
             * seventeen of them locked, is a wall rather than a path — it shows
             * a child mostly what she cannot do yet, and the choice itself is
             * work she does not need at six.
             */}
            <button
              type="button"
              className="next-star"
              onClick={() => {
                sfxLaunch();
                onOpenStar(nextStar);
              }}
            >
              <span className="next-label">Your next star</span>
              <span className="next-title">{nextStar.title}</span>
              <span className="next-blurb">{nextStar.blurb}</span>
              <span className="next-go">Start ▸</span>
            </button>

            {litStars.length > 0 ? (
              <section className="lit-section">
                <h2 className="lit-heading">
                  ⭐ {litStars.length} star{litStars.length === 1 ? '' : 's'} you have lit
                </h2>
                <p className="lit-note">You can play any of these again whenever you like.</p>
                <div className="lit-row">
                  {litStars.map((star) => (
                    <button
                      key={star.id}
                      type="button"
                      className="lit-chip"
                      onClick={() => {
                        sfxLaunch();
                        onOpenStar(star);
                      }}
                    >
                      ⭐ {star.title}
                    </button>
                  ))}
                </div>
              </section>
            ) : null}
          </>
        ) : (
          <div className="constellation-done">
            <p className="done-glyph" aria-hidden="true">👑</p>
            <h2>Every star here is lit.</h2>
            <p>You finished the whole constellation. Play any of them again below.</p>
            <div className="lit-row">
              {litStars.map((star) => (
                <button
                  key={star.id}
                  type="button"
                  className="lit-chip"
                  onClick={() => {
                    sfxLaunch();
                    onOpenStar(star);
                  }}
                >
                  ⭐ {star.title}
                </button>
              ))}
            </div>
          </div>
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
        <div className="stardust-counter" title="Stardust left to spend in the shop">
          ✨ {spendableStardust(profile).toLocaleString()}
        </div>
        <div className="header-actions">
          <SyncBadge />
          <button type="button" className="btn btn-quiet" onClick={onSwitchProfile}>
            Switch explorer
          </button>
          <button type="button" className="btn btn-quiet" onClick={onOpenSettings}>
            ⚙︎
          </button>
        </div>
      </header>

      {/*
       * Two columns: the journey on the left, her princess down the right,
       * running alongside the greeting and the constellations rather than
       * sitting as a wide band above them. The reward for the work, next to
       * the work.
       */}
      <div className="galaxy-body">
      <div className="galaxy-main">
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
              style={{
                ['--subject-color' as string]: subject.color,
                ['--subject-deep' as string]: subject.colorDeep,
              }}
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

      <button
        type="button"
        className="princess-panel"
        style={{
          ['--card-hue' as string]: princess.accent,
          ['--card-hue-deep' as string]: princess.accentDeep,
        }}
        onClick={() => {
          sfxWhoosh();
          onOpenPrincess();
        }}
      >
        <span className="panel-name">
          {princess.name} <span className="hangul">{princess.hangul}</span>
        </span>
        <PrincessArt
          princess={princess}
          dress={wornDress}
          accessories={wornAccessories}
          size={190}
        />
        <span className="panel-meta">
          👑 {treasures.length} treasure{treasures.length === 1 ? '' : 's'}
        </span>
        <span className="panel-cta">Tap to dress her</span>
      </button>
      </div>
    </div>
  );
}
