import { useState } from 'react';
import type { Grade } from '../types';
import {
  createProfile,
  deleteProfile,
  selectProfile,
  setPrincess,
  useSave,
} from '../core/store';
import { PRINCESSES, princessOrDefault, type PrincessId } from '../content/princesses';
import { PrincessArt } from './PrincessArt';
import { useSyncStatus } from '../core/sync';
import { sfxTap, sfxUnlock, unlockAudio } from '../core/audio';
import { AnSoGuide } from './AnSoGuide';

/**
 * Who is exploring today.
 *
 * Also the app's audio unlock point: browsers refuse to play sound until a user
 * gesture, and picking a profile is the first tap in every session.
 */

interface ProfilePickerProps {
  voiceEnabled: boolean;
  onReady: () => void;
}

export function ProfilePicker({ voiceEnabled, onReady }: ProfilePickerProps) {
  const save = useSave();
  const { settled } = useSyncStatus();
  const [addingAnother, setAddingAnother] = useState(false);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>(1);
  const [princess, setPrincessChoice] = useState<PrincessId>(PRINCESSES[0].id);
  const chosenPrincess = princessOrDefault(princess);
  // Kept in step with the princess so the stored value never contradicts her.
  const avatar = Math.max(0, PRINCESSES.findIndex((p) => p.id === princess));

  // Derived rather than stored: profiles can arrive from the server a moment
  // after first paint — on a new device or after a cleared cache — and holding
  // this in state would strand the parent on the "create an explorer" form with
  // their children's profiles already recovered behind it.
  const creating = addingAnother || save.profiles.length === 0;

  // Between first paint and the first sync answering, we genuinely do not know
  // whether this device has explorers. Saying so is better than showing an
  // empty state that is about to be contradicted — but this must key off
  // "the attempt finished", not off its outcome, or a device with no server
  // waits here forever and no explorer can ever be created.
  const awaitingFirstSync = save.profiles.length === 0 && !settled;

  const pick = (id: string) => {
    unlockAudio();
    sfxTap();
    selectProfile(id);
    onReady();
  };

  const create = () => {
    unlockAudio();
    if (!name.trim()) return;
    const created = createProfile(name, grade, avatar);
    setPrincess(created.id, princess);
    setAddingAnother(false);
    sfxUnlock();
    onReady();
  };

  if (awaitingFirstSync) {
    return (
      <div className="profile-picker">
        <div className="picker-hero">
          <AnSoGuide mood="thinking" says="" voice={false} size={140} />
          <p className="restoring-note">Looking for your explorers…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-picker">
      <div className="picker-hero">
        <AnSoGuide
          mood="idle"
          says={
            creating
              ? 'Hello. I am AnSo. Tell me your name and I will show you the universe.'
              : 'Welcome back. Who is exploring today?'
          }
          voice={voiceEnabled}
          size={140}
        />
      </div>

      {!creating ? (
        <>
          <div className="profile-list">
            {save.profiles.map((profile) => {
              // Her colour comes from her princess, not from a separate
              // setting. Two independent colour choices meant picking Ji-woo
              // and still getting a pink card, which reads as the app losing
              // the choice she just made.
              const hers = princessOrDefault(profile.princess);
              return (
                <div key={profile.id} className="profile-row">
                  <button
                    type="button"
                    className="profile-card"
                    style={{
                      ['--avatar-color' as string]: hers.accent,
                      ['--avatar-deep' as string]: hers.accentDeep,
                    }}
                    onClick={() => pick(profile.id)}
                  >
                    <PrincessArt princess={hers} dress={null} accessories={[]} size={64} />
                    <span className="profile-name">{profile.name}</span>
                    <span className="profile-meta">
                      {hers.name} · Grade {profile.grade}
                    </span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-quiet delete-profile"
                    onClick={() => {
                      if (window.confirm(`Remove ${profile.name} and all their progress?`)) {
                        deleteProfile(profile.id);
                      }
                    }}
                    aria-label={`Remove ${profile.name}`}
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>

          <button type="button" className="btn" onClick={() => setAddingAnother(true)}>
            + Add another explorer
          </button>
        </>
      ) : (
        <div className="create-form">
          <label className="field">
            <span>What is your name?</span>
            <input
              className="text-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && create()}
              placeholder="Your name"
              maxLength={20}
              autoComplete="off"
            />
          </label>

          <fieldset className="field">
            <legend>What grade are you in?</legend>
            <div className="grade-choice">
              {([1, 3] as Grade[]).map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`option-btn ${grade === g ? 'selected' : ''}`}
                  onClick={() => {
                    sfxTap();
                    setGrade(g);
                  }}
                >
                  Grade {g}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="field">
            <legend>Choose your princess</legend>
            <div className="princess-choice">
              {PRINCESSES.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`princess-option ${princess === p.id ? 'selected' : ''}`}
                  style={{
                    ['--card-hue' as string]: p.accent,
                    ['--card-hue-deep' as string]: p.accentDeep,
                  }}
                  onClick={() => {
                    sfxTap();
                    setPrincessChoice(p.id);
                  }}
                >
                  <PrincessArt princess={p} dress={null} accessories={[]} size={62} />
                  <span className="option-name">{p.name}</span>
                  <span className="option-hangul">{p.hangul}</span>
                </button>
              ))}
            </div>
            <p className="princess-meaning">
              <strong>
                {chosenPrincess.name} {chosenPrincess.hangul}
              </strong>{' '}
              — {chosenPrincess.meaning}. Also goes by {chosenPrincess.englishName}.
              <br />
              {chosenPrincess.personality}
            </p>
          </fieldset>

          {/* There is deliberately no separate colour picker. The princess is
              the identity, and her colour follows her — a second, independent
              colour choice only ever contradicted the first. */}

          <div className="create-actions">
            {save.profiles.length > 0 ? (
              <button type="button" className="btn btn-quiet" onClick={() => setAddingAnother(false)}>
                Cancel
              </button>
            ) : null}
            <button
              type="button"
              className="btn btn-primary btn-large"
              onClick={create}
              disabled={!name.trim()}
            >
              Start exploring →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
