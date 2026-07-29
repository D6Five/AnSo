/**
 * Generative background music.
 *
 * Synthesised at runtime rather than played from a file: nothing to download,
 * nothing to license, and — more usefully — it never loops. A four-minute loop
 * becomes maddening by the third hour of a thirty-hour curriculum, and children
 * notice the seam long before adults do.
 *
 * Everything is drawn from a pentatonic scale, so no combination of notes can
 * clash. Chords change every eight seconds, which is slow enough to sit under
 * concentration rather than compete with it.
 *
 * The music is deliberately subordinate to speech and to reading. See `setScene`
 * and `duckForSpeech`: instrumental music is broadly harmless for arithmetic and
 * measurably unhelpful during reading comprehension, so it steps out of the way
 * on its own rather than relying on anyone to turn it off.
 */

import { getContext, getMusicBus } from './audio';

/** C major pentatonic across three octaves. No semitone clashes are possible. */
const SCALE = [
  130.81, 146.83, 164.81, 196.0, 220.0, // C3 D3 E3 G3 A3
  261.63, 293.66, 329.63, 392.0, 440.0, // C4 D4 E4 G4 A4
  523.25, 587.33, 659.25, 783.99, 880.0, // C5 D5 E5 G5 A5
];

/** Root and chord tones per bar. A gentle I–vi–IV–V, the most reassuring loop there is. */
const PROGRESSION = [
  { root: 65.41, tones: [261.63, 329.63, 392.0] }, // C
  { root: 55.0, tones: [220.0, 261.63, 329.63] }, // Am
  { root: 87.31, tones: [174.61, 220.0, 261.63] }, // F
  { root: 98.0, tones: [196.0, 246.94, 293.66] }, // G
];

const BAR_SECONDS = 8;

export type MusicScene = 'map' | 'activity' | 'reading';

/**
 * How loud the music sits in each context, as a fraction of the user's chosen
 * music volume. Reading is silent on purpose.
 */
const SCENE_LEVEL: Record<MusicScene, number> = {
  map: 1,
  activity: 0.55,
  reading: 0,
};

let running = false;
let barIndex = 0;
let nextBarTime = 0;
let timer: number | null = null;
let sceneGain: GainNode | null = null;
let scene: MusicScene = 'map';
let ducked = false;

/* ------------------------------------------------------------------ */
/* Voices                                                              */
/* ------------------------------------------------------------------ */

function envelope(
  ctx: AudioContext,
  destination: AudioNode,
  start: number,
  attack: number,
  hold: number,
  release: number,
  peak: number,
): GainNode {
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + attack);
  gain.gain.setValueAtTime(peak, start + attack + hold);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + attack + hold + release);
  gain.connect(destination);
  return gain;
}

/** Low sustained root. Gives the bar a floor without drawing attention. */
function scheduleDrone(ctx: AudioContext, out: AudioNode, start: number, freq: number): void {
  for (const detune of [-4, 4]) {
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, start);
    osc.detune.setValueAtTime(detune, start);
    const env = envelope(ctx, out, start, 2.2, BAR_SECONDS - 4.4, 2.2, 0.1);
    osc.connect(env);
    osc.start(start);
    osc.stop(start + BAR_SECONDS + 0.5);
  }
}

/** Soft chord bed, filtered down so it never gets glassy. */
function schedulePad(ctx: AudioContext, out: AudioNode, start: number, tones: number[]): void {
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(700, start);
  filter.frequency.linearRampToValueAtTime(1300, start + BAR_SECONDS * 0.6);
  filter.frequency.linearRampToValueAtTime(700, start + BAR_SECONDS);
  filter.connect(out);

  for (const freq of tones) {
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, start);
    const env = envelope(ctx, filter, start, 2.5, BAR_SECONDS - 5, 2.5, 0.05);
    osc.connect(env);
    osc.start(start);
    osc.stop(start + BAR_SECONDS + 0.5);
  }
}

/**
 * Sparse bell tones. This is the only layer with any melody, and it is
 * deliberately unpredictable so the ear never learns a phrase to anticipate.
 */
function scheduleBells(ctx: AudioContext, out: AudioNode, start: number): void {
  let offset = Math.random() * 2;
  while (offset < BAR_SECONDS - 0.5) {
    const freq = SCALE[5 + Math.floor(Math.random() * (SCALE.length - 5))];
    const at = start + offset;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, at);

    // Long decay, no sustain — a struck bell rather than a held note.
    const env = envelope(ctx, out, at, 0.01, 0, 2.6, 0.055);
    osc.connect(env);
    osc.start(at);
    osc.stop(at + 3);

    offset += 1.6 + Math.random() * 2.6;
  }
}

/* ------------------------------------------------------------------ */
/* Scheduling                                                          */
/* ------------------------------------------------------------------ */

function scheduleBar(ctx: AudioContext, out: AudioNode): void {
  const chord = PROGRESSION[barIndex % PROGRESSION.length];
  scheduleDrone(ctx, out, nextBarTime, chord.root);
  schedulePad(ctx, out, nextBarTime, chord.tones);
  scheduleBells(ctx, out, nextBarTime);
  barIndex++;
  nextBarTime += BAR_SECONDS;
}

function tick(): void {
  const ctx = getContext();
  if (!ctx || !sceneGain || !running) return;
  // Stay two seconds ahead so a busy main thread cannot cause an audible gap.
  while (nextBarTime < ctx.currentTime + 2) {
    scheduleBar(ctx, sceneGain);
  }
}

function applyLevel(): void {
  const ctx = getContext();
  if (!ctx || !sceneGain) return;
  const target = SCENE_LEVEL[scene] * (ducked ? 0.25 : 1);
  // Slow ramp so changes feel like the room shifting, not a switch being thrown.
  sceneGain.gain.setTargetAtTime(Math.max(0.0001, target), ctx.currentTime, 0.35);
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

/** Begin playing. Requires `unlockAudio()` to have run from a user gesture. */
export function startMusic(): void {
  const ctx = getContext();
  const bus = getMusicBus();
  if (!ctx || !bus || running) return;

  sceneGain = ctx.createGain();
  sceneGain.gain.value = SCENE_LEVEL[scene];
  sceneGain.connect(bus);

  running = true;
  barIndex = 0;
  nextBarTime = ctx.currentTime + 0.15;
  tick();
  timer = window.setInterval(tick, 750);
}

export function stopMusic(): void {
  running = false;
  if (timer !== null) {
    window.clearInterval(timer);
    timer = null;
  }
  const ctx = getContext();
  if (sceneGain && ctx) {
    // Fade rather than cut; already-scheduled notes are still sounding.
    sceneGain.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.3);
    const dying = sceneGain;
    window.setTimeout(() => dying.disconnect(), 2000);
  }
  sceneGain = null;
}

export function isMusicRunning(): boolean {
  return running;
}

/**
 * Tell the music what the child is doing. Reading passages silence it entirely:
 * background music is a documented drag on reading comprehension, which is
 * exactly the skill that screen is meant to build.
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
