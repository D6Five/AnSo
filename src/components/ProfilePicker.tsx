import { useState } from 'react';
import type { Grade } from '../types';
import { AVATARS, createProfile, deleteProfile, selectProfile, useSave } from '../core/store';
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
  const [creating, setCreating] = useState(save.profiles.length === 0);
  const [name, setName] = useState('');
  const [grade, setGrade] = useState<Grade>(1);
  const [avatar, setAvatar] = useState(0);

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
    sfxUnlock();
    onReady();
  };

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
                    style={{ ['--avatar-color' as string]: look.color }}
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

          <button type="button" className="btn" onClick={() => setCreating(true)}>
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
                  style={{ ['--avatar-color' as string]: look.color }}
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
              <button type="button" className="btn btn-quiet" onClick={() => setCreating(false)}>
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
