import { useState } from 'react';
import type { Grade } from '../types';
import { AVATARS, createProfile, deleteProfile, selectProfile, useSave } from '../core/store';
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
  const { status, lastSyncedAt } = useSyncStatus();
  const [addingAnother, setAddingAnother] = useState(false);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>(1);
  const [avatar, setAvatar] = useState(0);

  // Derived rather than stored: profiles can arrive from the server a moment
  // after first paint — on a new device or after a cleared cache — and holding
  // this in state would strand the parent on the "create an explorer" form with
  // their children's profiles already recovered behind it.
  const creating = addingAnother || save.profiles.length === 0;

  // Between first paint and the first sync answering, we genuinely do not know
  // whether this device has explorers. Saying so is better than showing an
  // empty state that is about to be contradicted.
  const awaitingFirstSync =
    save.profiles.length === 0 && lastSyncedAt === null && (status === 'syncing' || status === 'off');

  const pick = (id: string) => {
    unlockAudio();
    sfxTap();
    selectProfile(id);
    onReady();
  };

  const create = () => {
    unlockAudio();
    if (!name.trim()) return;
    createProfile(name, grade, avatar);
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
              const look = AVATARS[profile.avatar % AVATARS.length];
              return (
                <div key={profile.id} className="profile-row">
                  <button
                    type="button"
                    className="profile-card"
                    style={{
                      ['--avatar-color' as string]: look.color,
                      ['--avatar-deep' as string]: look.deep,
                    }}
                    onClick={() => pick(profile.id)}
                  >
                    <span className="avatar-orb" aria-hidden="true" />
                    <span className="profile-name">{profile.name}</span>
                    <span className="profile-meta">
                      Grade {profile.grade} · ✨ {profile.stardust.toLocaleString()}
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
            <legend>Pick your star colour</legend>
            <div className="avatar-choice">
              {AVATARS.map((look, i) => (
                <button
                  key={look.name}
                  type="button"
                  className={`avatar-swatch ${avatar === i ? 'selected' : ''}`}
                  style={{
                    ['--avatar-color' as string]: look.color,
                    ['--avatar-deep' as string]: look.deep,
                  }}
                  onClick={() => {
                    sfxTap();
                    setAvatar(i);
                  }}
                  aria-label={look.name}
                />
              ))}
            </div>
          </fieldset>

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
