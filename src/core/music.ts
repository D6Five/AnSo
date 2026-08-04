/**
 * Playful background music, synthesised at runtime.
 *
 * Nothing is loaded from a file, so it never loops — a four minute loop becomes
 * unbearable somewhere in the third hour of a thirty hour curriculum, and
 * children notice the seam long before adults do. Instead the parts are
 * rebuilt bar by bar with rotating melodies and small variations.
 *
 * The feel is a gentle puzzle game rather than a meditation app: a walking
 * tempo, a bouncing marimba pattern, a soft bass and a simple singable tune.
 * Everything is drawn from a major pentatonic scale, so no combination of notes
 * can clash no matter how the variations land.
 *
 * It stays subordinate to the actual work. See `setScene` and `duckForSpeech`:
 * it drops under AnSo's voice and stops altogether during reading passages,
 * because background music measurably hurts reading comprehension and that is
 * the exact skill those screens exist to build.
 */

import { getContext, getMusicBus } from './audio';

const BPM = 104;
const BEAT = 60 / BPM;
const BEATS_PER_BAR = 4;
const BAR = BEAT * BEATS_PER_BAR;

/** C major pentatonic, two octaves, for melody and arpeggios. */
const PENT = [
  261.63, 293.66, 329.63, 392.0, 440.0, // C4 D4 E4 G4 A4
  523.25, 587.33, 659.25, 783.99, 880.0, // C5 D5 E5 G5 A5
];

/**
 * I–V–vi–IV. The most reassuring four bars in popular music, and instantly
 * familiar to a child even if they could not name why.
 */
const PROGRESSION = [
  { bass: 130.81, chord: [261.63, 329.63, 392.0] }, // C
  { bass: 98.0, chord: [246.94, 293.66, 392.0] }, // G
  { bass: 110.0, chord: [261.63, 329.63, 440.0] }, // Am
  { bass: 87.31, chord: [261.63, 349.23, 440.0] }, // F
];

/**
 * Melodic phrases as [scale index, beat offset, beats long].
 * Written to be singable — mostly stepwise, one leap each, landing on a stable
 * tone — rather than randomly generated, which never sounds like a tune.
 */
const MELODIES: [number, number, number][][] = [
  [[5, 0, 1], [6, 1, 0.5], [7, 1.5, 0.5], [8, 2, 1], [7, 3, 1]],
  [[7, 0, 0.5], [8, 0.5, 0.5], [9, 1, 1], [8, 2, 0.5], [7, 2.5, 0.5], [5, 3, 1]],
  [[5, 0, 1.5], [7, 1.5, 0.5], [6, 2, 1], [5, 3, 1]],
  [[9, 0, 0.5], [8, 0.5, 0.5], [7, 1, 1], [6, 2, 1], [5, 3, 1]],
  [[5, 0, 0.5], [7, 0.5, 0.5], [8, 1, 0.5], [9, 1.5, 0.5], [8, 2, 2]],
];

export type MusicScene = 'map' | 'activity' | 'reading';

const SCENE_LEVEL: Record<MusicScene, number> = {
  map: 1,
  activity: 0.5,
  reading: 0,
};

let running = false;
let bar = 0;
let nextBarTime = 0;
let timer: number | null = null;
let sceneGain: GainNode | null = null;
let scene: MusicScene = 'map';
let ducked = false;
let noiseBuffer: AudioBuffer | null = null;

/* ------------------------------------------------------------------ */
/* Instruments                                                         */
/* ------------------------------------------------------------------ */

/**
 * Struck wooden tone — the bounce of the whole track.
 * A mallet instrument is mostly a fast attack, a fast-decaying upper partial,
 * and no sustain whatsoever.
 */
function mallet(
  ctx: AudioContext,
  out: AudioNode,
  at: number,
  freq: number,
  gain: number,
  decay = 0.42,
): void {
  const body = ctx.createOscillator();
  body.type = 'sine';
  body.frequency.setValueAtTime(freq, at);

  const bodyEnv = ctx.createGain();
  bodyEnv.gain.setValueAtTime(0.0001, at);
  bodyEnv.gain.exponentialRampToValueAtTime(gain, at + 0.006);
  bodyEnv.gain.exponentialRampToValueAtTime(0.0001, at + decay);

  body.connect(bodyEnv);
  bodyEnv.connect(out);
  body.start(at);
  body.stop(at + decay + 0.05);

  // The knock: a high partial that dies almost immediately. Without it the
  // note reads as a flute rather than something struck.
  const knock = ctx.createOscillator();
  knock.type = 'sine';
  knock.frequency.setValueAtTime(freq * 3.9, at);

  const knockEnv = ctx.createGain();
  knockEnv.gain.setValueAtTime(0.0001, at);
  knockEnv.gain.exponentialRampToValueAtTime(gain * 0.32, at + 0.004);
  knockEnv.gain.exponentialRampToValueAtTime(0.0001, at + 0.09);

  knock.connect(knockEnv);
  knockEnv.connect(out);
  knock.start(at);
  knock.stop(at + 0.15);
}

/** Round, soft bass. Gives the beat somewhere to land. */
function bassNote(ctx: AudioContext, out: AudioNode, at: number, freq: number, gain: number): void {
  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(freq, at);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(520, at);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(gain, at + 0.02);
  env.gain.exponentialRampToValueAtTime(0.0001, at + 0.55);

  osc.connect(filter);
  filter.connect(env);
  env.connect(out);
  osc.start(at);
  osc.stop(at + 0.6);
}

/** Barely-there shaker. Supplies groove without turning into a drum kit. */
function shaker(ctx: AudioContext, out: AudioNode, at: number, gain: number): void {
  if (!noiseBuffer) return;
  const src = ctx.createBufferSource();
  src.buffer = noiseBuffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(6000, at);

  const env = ctx.createGain();
  env.gain.setValueAtTime(0.0001, at);
  env.gain.exponentialRampToValueAtTime(gain, at + 0.004);
  env.gain.exponentialRampToValueAtTime(0.0001, at + 0.06);

  src.connect(filter);
  filter.connect(env);
  env.connect(out);
  src.start(at);
}

/* ------------------------------------------------------------------ */
/* Arrangement                                                         */
/* ------------------------------------------------------------------ */

function scheduleBar(ctx: AudioContext, out: AudioNode): void {
  const chord = PROGRESSION[bar % PROGRESSION.length];
  const t = nextBarTime;

  // Bass on one and three, with an extra pickup note now and then so the
  // pattern does not become a metronome.
  bassNote(ctx, out, t, chord.bass, 0.16);
  bassNote(ctx, out, t + BEAT * 2, chord.bass, 0.13);
  if (bar % 4 === 3) bassNote(ctx, out, t + BEAT * 3.5, chord.bass * 1.5, 0.1);

  // Marimba arpeggio in eighth notes, alternating direction every bar so the
  // ear keeps finding something slightly new.
  const up = bar % 2 === 0;
  for (let i = 0; i < 8; i++) {
    const step = up ? i % 3 : 2 - (i % 3);
    const octave = i >= 4 ? 2 : 1;
    const freq = chord.chord[step] * octave;
    // Accent the downbeats, so the bar has a shape.
    const gain = i % 2 === 0 ? 0.075 : 0.045;
    mallet(ctx, out, t + i * (BEAT / 2), freq, gain, 0.38);
  }

  // Melody enters on most bars but rests on every fourth, which keeps it from
  // wearing out and gives the arpeggio a moment alone.
  if (bar % 4 !== 2) {
    const phrase = MELODIES[Math.floor(bar / 2) % MELODIES.length];
    for (const [step, beat, length] of phrase) {
      mallet(ctx, out, t + beat * BEAT, PENT[step], 0.085, 0.28 + length * 0.22);
    }
  }

  // Off-beat shaker only, so it lifts rather than marches.
  for (let i = 0; i < 4; i++) {
    shaker(ctx, out, t + i * BEAT + BEAT / 2, 0.018);
  }

  bar++;
  nextBarTime += BAR;
}

function tick(): void {
  const ctx = getContext();
  if (!ctx || !sceneGain || !running) return;
  // Stay ahead so a busy main thread cannot cause an audible stumble.
  while (nextBarTime < ctx.currentTime + 1.5) {
    scheduleBar(ctx, sceneGain);
  }
}

function applyLevel(): void {
  const ctx = getContext();
  if (!ctx || !sceneGain) return;
  const target = SCENE_LEVEL[scene] * (ducked ? 0.22 : 1);
  sceneGain.gain.setTargetAtTime(Math.max(0.0001, target), ctx.currentTime, 0.3);
}

function buildNoise(ctx: AudioContext): void {
  if (noiseBuffer) return;
  const frames = Math.floor(ctx.sampleRate * 0.08);
  noiseBuffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** Begin playing. Requires `unlockAudio()` to have run from a user gesture. */
export function startMusic(): void {
  const ctx = getContext();
  const bus = getMusicBus();
  if (!ctx || !bus || running) return;

  buildNoise(ctx);

  sceneGain = ctx.createGain();
  sceneGain.gain.value = SCENE_LEVEL[scene];
  sceneGain.connect(bus);

  running = true;
  bar = 0;
  nextBarTime = ctx.currentTime + 0.12;
  tick();
  timer = window.setInterval(tick, 400);
}

export function stopMusic(): void {
  running = false;
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
  const ctx = getContext();
  if (sceneGain && ctx) {
    // Fade rather than cut; notes are already scheduled ahead.
    sceneGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.25);
    const dying = sceneGain;
    window.setTimeout(() => dying.disconnect(), 2000);
  }
  sceneGain = null;
}

/**
 * Ensure music stops when the page closes or navigates away.
 * Without this, oscillators scheduled ahead continue playing even after
 * the browser leaves the page.
 */
export function initMusicCleanup(): void {
  window.addEventListener('beforeunload', () => {
    stopMusic();
    const ctx = getContext();
    if (ctx) {
      try {
        ctx.close();
      } catch {
        // Context may already be closed; ignore.
      }
    }
  });
}

export function isMusicRunning(): boolean {
  return running;
}

/**
 * Tell the music what the child is doing. Reading passages silence it entirely.
 */
export function setScene(next: MusicScene): void {
  if (scene === next) return;
  scene = next;
  applyLevel();
}

/** Drop under AnSo's voice so she is never competing with the score. */
export function duckForSpeech(on: boolean): void {
  if (ducked === on) return;
  ducked = on;
  applyLevel();
}
