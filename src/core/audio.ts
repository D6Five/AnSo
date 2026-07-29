/**
 * Procedural sound effects via the Web Audio API.
 *
 * Every sound is synthesised at runtime — no audio files to download, license,
 * or lose. Tones are deliberately soft: this app is used at close range by
 * small children, and "wrong answer" never gets a harsh buzzer.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let volume = 0.7;
let musicVolume = 0.35;

/** Browsers block audio until a user gesture; call this from a click handler. */
export function unlockAudio(): void {
  if (ctx) {
    if (ctx.state === 'suspended') void ctx.resume();
    return;
  }
  const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
  if (!Ctor) return;
  ctx = new Ctor();

  master = ctx.createGain();
  master.gain.value = volume;
  master.connect(ctx.destination);

  // Music runs on its own bus so it can be ducked under AnSo's voice without
  // touching the effect volumes, and so the two are independently adjustable.
  musicBus = ctx.createGain();
  musicBus.gain.value = musicVolume;
  musicBus.connect(ctx.destination);
}

/** The shared context, so the music engine schedules on the same clock. */
export function getContext(): AudioContext | null {
  return ctx;
}

export function getMusicBus(): GainNode | null {
  return musicBus;
}

export function setMusicVolume(v: number): void {
  musicVolume = Math.max(0, Math.min(1, v));
  if (musicBus && ctx) musicBus.gain.setTargetAtTime(musicVolume, ctx.currentTime, 0.1);
}

export function getMusicVolume(): number {
  return musicVolume;
}

export function setVolume(v: number): void {
  volume = Math.max(0, Math.min(1, v));
  if (master && ctx) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.02);
}

export function getVolume(): number {
  return volume;
}

interface ToneOptions {
  freq: number;
  duration: number;
  type?: OscillatorType;
  /** Delay before the tone starts, in seconds. */
  at?: number;
  gain?: number;
  /** Slide to this frequency across the tone. */
  glideTo?: number;
}

function tone({ freq, duration, type = 'sine', at = 0, gain = 0.25, glideTo }: ToneOptions): void {
  if (!ctx || !master) return;
  const start = ctx.currentTime + at;
  const osc = ctx.createOscillator();
  const env = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (glideTo !== undefined) {
    osc.frequency.exponentialRampToValueAtTime(Math.max(1, glideTo), start + duration);
  }

  // Short attack, smooth exponential release — avoids clicks and harshness.
  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + 0.015);
  env.gain.exponentialRampToValueAtTime(0.0001, start + duration);

  osc.connect(env);
  env.connect(master);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

function noise(duration: number, gain = 0.12, filterFreq = 1200): void {
  if (!ctx || !master) return;
  const frames = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frames; i++) {
    // Fade the noise out over its length so it reads as a "whoosh", not a hiss.
    data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;

  const lp = ctx.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.value = filterFreq;

  const env = ctx.createGain();
  env.gain.value = gain;

  src.connect(lp);
  lp.connect(env);
  env.connect(master);
  src.start();
}

/** Ascending major triad — the "you got it" sound. */
export function sfxCorrect(): void {
  tone({ freq: 523.25, duration: 0.16, gain: 0.22 });
  tone({ freq: 659.25, duration: 0.16, at: 0.09, gain: 0.22 });
  tone({ freq: 783.99, duration: 0.34, at: 0.18, gain: 0.24 });
}

/** Two gentle low notes. Reads as "not quite", never as failure. */
export function sfxTryAgain(): void {
  tone({ freq: 349.23, duration: 0.16, type: 'triangle', gain: 0.16 });
  tone({ freq: 293.66, duration: 0.26, type: 'triangle', at: 0.12, gain: 0.16 });
}

/** Shimmering cascade for earning stardust. */
export function sfxStardust(): void {
  const notes = [1046.5, 1318.5, 1568, 2093];
  notes.forEach((f, i) => tone({ freq: f, duration: 0.5, at: i * 0.06, gain: 0.1, type: 'sine' }));
}

/** Big arrival sound when a whole star is finished. */
export function sfxStarComplete(): void {
  const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
  notes.forEach((f, i) => tone({ freq: f, duration: 0.7, at: i * 0.1, gain: 0.16 }));
  noise(0.8, 0.06, 2400);
}

/** Navigation between screens. */
export function sfxWhoosh(): void {
  noise(0.4, 0.09, 900);
  tone({ freq: 220, duration: 0.35, type: 'sine', gain: 0.08, glideTo: 660 });
}

/** Rocket launch — used when entering a star. */
export function sfxLaunch(): void {
  noise(0.9, 0.1, 700);
  tone({ freq: 110, duration: 0.8, type: 'sawtooth', gain: 0.07, glideTo: 440 });
}

/** Soft tick for each correct keystroke in typing drills. */
export function sfxKey(): void {
  tone({ freq: 1200 + Math.random() * 200, duration: 0.04, type: 'square', gain: 0.05 });
}

/** Distinct low tick for a typing mistake. */
export function sfxKeyMiss(): void {
  tone({ freq: 180, duration: 0.07, type: 'square', gain: 0.06 });
}

/** UI affordance click. */
export function sfxTap(): void {
  tone({ freq: 660, duration: 0.06, type: 'sine', gain: 0.09 });
}

/** Fanfare for unlocking a new constellation. */
export function sfxUnlock(): void {
  const notes = [392, 523.25, 659.25, 783.99, 1046.5, 1318.5];
  notes.forEach((f, i) => tone({ freq: f, duration: 0.9, at: i * 0.11, gain: 0.14 }));
  noise(1.2, 0.05, 3000);
}
