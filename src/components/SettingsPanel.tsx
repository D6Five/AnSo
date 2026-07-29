import {
  micEnabledFor,
  resetAll,
  setProfileMic,
  updateSettings,
  useActiveProfile,
  useSave,
} from '../core/store';
import { isRecognitionSupported, isSynthesisSupported, setVoiceEnabled } from '../core/voice';
import { setVolume } from '../core/audio';
import { totalMinutes } from '../content';

/** Grown-up settings. Deliberately plain, and reachable from the map only. */
export function SettingsPanel({ onClose }: { onClose: () => void }) {
  const save = useSave();
  const profile = useActiveProfile();
  const { settings } = save;

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
      >
        <h2>Settings</h2>

        <label className="setting-row">
          <span>Sound effects</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={settings.volume}
            onChange={(e) => {
              const v = Number(e.target.value);
              setVolume(v);
              updateSettings({ volume: v });
            }}
          />
        </label>

        <label className="setting-row">
          <span>
            AnSo speaks out loud
            {!isSynthesisSupported() ? <em> — not available in this browser</em> : null}
          </span>
          <input
            type="checkbox"
            checked={settings.voiceEnabled}
            disabled={!isSynthesisSupported()}
            onChange={(e) => {
              setVoiceEnabled(e.target.checked);
              updateSettings({ voiceEnabled: e.target.checked });
            }}
          />
        </label>

        <label className="setting-row">
          <span>Background music</span>
          <input
            type="checkbox"
            checked={settings.musicEnabled}
            onChange={(e) => updateSettings({ musicEnabled: e.target.checked })}
          />
        </label>

        {settings.musicEnabled ? (
          <label className="setting-row">
            <span>Music volume</span>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={settings.musicVolume}
              onChange={(e) => updateSettings({ musicVolume: Number(e.target.value) })}
            />
          </label>
        ) : null}

        {profile ? (
          <label className="setting-row">
            <span>
              {profile.name} can answer out loud
              {!isRecognitionSupported() ? <em> — needs Chrome or Edge</em> : null}
            </span>
            <input
              type="checkbox"
              checked={micEnabledFor(profile)}
              disabled={!isRecognitionSupported()}
              onChange={(e) => setProfileMic(profile.id, e.target.checked)}
            />
          </label>
        ) : null}

        {profile && micEnabledFor(profile) && isRecognitionSupported() ? (
          <p className="setting-note">
            Spoken answers are transcribed by the browser, which sends the audio to
            Google (Chrome) or Microsoft (Edge). Every question can be answered by
            typing instead, and this setting is per child.
          </p>
        ) : null}

        <div className="settings-info">
          <p>
            Curriculum available: <strong>{(totalMinutes(1) / 60).toFixed(1)} hours</strong> for
            Grade 1 and <strong>{(totalMinutes(3) / 60).toFixed(1)} hours</strong> for Grade 3,
            plus unlimited replay on the maths and typing stars.
          </p>
          <p className="muted">
            Music quietens while AnSo is speaking and stops entirely while a reading
            passage is on screen.
          </p>
          <p className="muted">
            Progress is saved on this computer and, when the app is hosted, synced to
            your own server so it follows each explorer between devices. It is never
            sent anywhere else.
          </p>
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-quiet danger"
            onClick={() => {
              if (window.confirm('Erase all explorers and all progress? This cannot be undone.')) {
                resetAll();
                onClose();
              }
            }}
          >
            Erase everything
          </button>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
