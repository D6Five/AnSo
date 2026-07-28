import { useEffect, useState } from 'react';
import type { Star } from './types';
import { selectProfile, useActiveProfile, useSave } from './core/store';
import { initVoices, setVoiceEnabled, stopSpeaking } from './core/voice';
import { setVolume, unlockAudio } from './core/audio';
import { ProfilePicker } from './components/ProfilePicker';
import { GalaxyMap } from './components/GalaxyMap';
import { StarView } from './components/StarView';
import { SettingsPanel } from './components/SettingsPanel';
import { StarField } from './components/StarField';

type Screen = 'picker' | 'map' | 'star';

export function App() {
  const save = useSave();
  const profile = useActiveProfile();
  const [screen, setScreen] = useState<Screen>(profile ? 'map' : 'picker');
  const [activeStar, setActiveStar] = useState<Star | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    initVoices();
  }, []);

  // Keep the audio and voice engines in step with saved settings.
  useEffect(() => {
    setVolume(save.settings.volume);
    setVoiceEnabled(save.settings.voiceEnabled);
  }, [save.settings.volume, save.settings.voiceEnabled]);

  // Any first gesture is enough to unlock the audio context.
  useEffect(() => {
    const unlock = () => unlockAudio();
    window.addEventListener('pointerdown', unlock, { once: true });
    window.addEventListener('keydown', unlock, { once: true });
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // A profile removed from the settings panel must not leave us on a dead screen.
  useEffect(() => {
    if (!profile && screen !== 'picker') setScreen('picker');
  }, [profile, screen]);

  const openStar = (star: Star) => {
    setActiveStar(star);
    setScreen('star');
  };

  const leaveStar = () => {
    stopSpeaking();
    setActiveStar(null);
    setScreen('map');
  };

  return (
    <div className="app">
      <StarField />

      <main className="app-main">
        {screen === 'picker' || !profile ? (
          <ProfilePicker
            voiceEnabled={save.settings.voiceEnabled}
            onReady={() => setScreen('map')}
          />
        ) : screen === 'star' && activeStar ? (
          <StarView
            star={activeStar}
            profile={profile}
            voiceEnabled={save.settings.voiceEnabled}
            micEnabled={save.settings.micEnabled}
            onExit={leaveStar}
          />
        ) : (
          <GalaxyMap
            profile={profile}
            voiceEnabled={save.settings.voiceEnabled}
            onOpenStar={openStar}
            onSwitchProfile={() => {
              stopSpeaking();
              selectProfile(null);
              setScreen('picker');
            }}
            onOpenSettings={() => setShowSettings(true)}
          />
        )}
      </main>

      {showSettings ? <SettingsPanel onClose={() => setShowSettings(false)} /> : null}
    </div>
  );
}
