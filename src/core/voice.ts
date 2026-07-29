/**
 * AnSo's voice (speech synthesis) and the children's voice (speech recognition).
 *
 * Both use the browser's built-in Web Speech API: no API keys, no audio leaves
 * the machine for synthesis, and it works on a plain laptop. Recognition
 * accuracy on young children's speech is genuinely poor, so every caller is
 * expected to offer a typed or tap fallback — see `isRecognitionSupported`.
 *
 * Note on privacy: synthesis of a local voice happens on the device, but
 * recognition does not. Chrome and Edge implement `SpeechRecognition` by
 * streaming the captured audio to their own speech service. That is why the
 * microphone is opt-out per child and every prompt works without it.
 */

import { duckForSpeech } from './music';

/* ------------------------------------------------------------------ */
/* Speech synthesis — AnSo talking                                     */
/* ------------------------------------------------------------------ */

let cachedVoice: SpeechSynthesisVoice | null = null;
let voicesReady = false;
let enabled = true;

/** Names that reliably mark a modern neural voice across platforms. */
const NATURAL_MARKERS = ['natural', 'online', 'neural', 'premium', 'enhanced'];

/** Warm female voices, best first. AnSo is written as a "she". */
const PREFERRED_NAMES = [
  'aria', 'jenny', 'michelle', 'ava', 'emma', 'sonia', 'libby',
  'samantha', 'serena', 'allison', 'zira', 'hazel', 'susan',
];

/** Old SAPI voices. Usable, but the flat robotic ones — a last resort. */
const LEGACY_NAMES = ['david', 'mark', 'george', 'james', 'ravi'];

/**
 * Score a voice for how well it suits AnSo.
 *
 * Scored rather than matched against exact names, because voice names vary by
 * platform, locale and browser version, and an exact-match list silently falls
 * through to whatever happens to be first. Network voices are ranked *above*
 * local ones: the local SAPI voices Windows ships by default are precisely the
 * robotic-sounding ones.
 */
function scoreVoice(voice: SpeechSynthesisVoice): number {
  const name = voice.name.toLowerCase();
  let score = 0;

  if (!voice.lang.toLowerCase().startsWith('en')) return -1;

  if (NATURAL_MARKERS.some((m) => name.includes(m))) score += 100;
  // Google's web voices are network-backed and markedly better than SAPI.
  if (name.includes('google')) score += 60;
  if (!voice.localService) score += 40;

  const preferredIndex = PREFERRED_NAMES.findIndex((n) => name.includes(n));
  if (preferredIndex >= 0) score += 30 - preferredIndex;

  if (LEGACY_NAMES.some((n) => name.includes(n))) score -= 25;
  // US English is what the curriculum is written in.
  if (voice.lang.toLowerCase().startsWith('en-us')) score += 5;

  return score;
}

/** Every English voice this browser offers, best candidate first. */
export function listVoices(): SpeechSynthesisVoice[] {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  return voices
    .filter((v) => v.lang.toLowerCase().startsWith('en'))
    .sort((a, b) => scoreVoice(b) - scoreVoice(a));
}

/**
 * True when the best available voice is still an old robotic one, so the app
 * can offer the grown-up a way to install something better.
 */
export function bestVoiceIsLegacy(): boolean {
  const best = listVoices()[0];
  return !best || scoreVoice(best) < 40;
}

let preferredName: string | null = null;

/** Pin a specific voice by name. Pass null to go back to automatic choice. */
export function setPreferredVoice(name: string | null): void {
  preferredName = name;
  cachedVoice = pickVoice();
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (voices.length === 0) return null;

  if (preferredName) {
    const chosen = voices.find((v) => v.name === preferredName);
    if (chosen) return chosen;
  }
  return listVoices()[0] ?? voices[0];
}

/** Voice lists populate asynchronously; call once at startup. */
export function initVoices(): void {
  if (!('speechSynthesis' in window)) return;
  const load = () => {
    cachedVoice = pickVoice();
    voicesReady = cachedVoice !== null;
  };
  load();
  window.speechSynthesis.addEventListener('voiceschanged', load);
}

export function setVoiceEnabled(on: boolean): void {
  enabled = on;
  if (!on) stopSpeaking();
}

export function isVoiceEnabled(): boolean {
  return enabled;
}

export function isSynthesisSupported(): boolean {
  return 'speechSynthesis' in window;
}

export interface SpeakOptions {
  /** 1 is normal. Slightly slow suits early readers. */
  rate?: number;
  pitch?: number;
  /** Called when the utterance finishes or is cancelled. */
  onEnd?: () => void;
  /** Cancel anything already speaking. Defaults to true. */
  interrupt?: boolean;
}

/**
 * Speak text as AnSo. Resolves when finished; resolves immediately (without
 * speaking) when voice is disabled or unsupported, so callers can always await.
 */
export function speak(text: string, opts: SpeakOptions = {}): Promise<void> {
  // Pitch sits near neutral. Raising it makes a modern neural voice sound
  // younger, but makes an old SAPI voice sound thin and chipmunk-like — and the
  // old voices are exactly the ones already struggling to sound human.
  const { rate = 0.92, pitch = 1.02, onEnd, interrupt = true } = opts;

  if (!enabled || !isSynthesisSupported() || !text.trim()) {
    onEnd?.();
    return Promise.resolve();
  }

  if (interrupt) window.speechSynthesis.cancel();

  return new Promise((resolve) => {
    const utter = new SpeechSynthesisUtterance(text);
    // Pull the music down for the length of the line, so AnSo is never
    // competing with her own soundtrack.
    duckForSpeech(true);
    if (!voicesReady) cachedVoice = pickVoice();
    if (cachedVoice) utter.voice = cachedVoice;
    utter.rate = rate;
    utter.pitch = pitch;
    utter.volume = 1;

    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      duckForSpeech(false);
      onEnd?.();
      resolve();
    };

    utter.onend = finish;
    utter.onerror = finish;

    // Chrome silently drops long utterances if the tab is backgrounded, so a
    // timeout guarantees the promise always settles and the UI never hangs.
    const guard = window.setTimeout(finish, Math.max(4000, text.length * 120));
    utter.onend = () => {
      window.clearTimeout(guard);
      finish();
    };

    window.speechSynthesis.speak(utter);
  });
}

export function stopSpeaking(): void {
  if (isSynthesisSupported()) window.speechSynthesis.cancel();
  // Cancelling skips the utterance's end handler, so lift the duck by hand or
  // the music stays quiet for the rest of the session.
  duckForSpeech(false);
}

/* ------------------------------------------------------------------ */
/* Speech recognition — the child talking                              */
/* ------------------------------------------------------------------ */

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((e: any) => void) | null;
  onerror: ((e: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  const w = window as any;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function isRecognitionSupported(): boolean {
  return getRecognitionCtor() !== null;
}

export type ListenErrorReason = 'no-speech' | 'denied' | 'unsupported' | 'error';

export interface ListenHandlers {
  /** Fired repeatedly as words are recognised — good for live captions. */
  onPartial?: (text: string) => void;
  onFinal: (text: string) => void;
  onError?: (reason: ListenErrorReason) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface ListenHandle {
  stop: () => void;
}

/**
 * Listen for a single spoken answer. Returns a handle so the UI can stop early.
 * `maxAlternatives` is raised because children's pronunciation often lands on
 * the second or third guess — callers should check every alternative.
 */
export function listenOnce(handlers: ListenHandlers, timeoutMs = 12000): ListenHandle {
  const Ctor = getRecognitionCtor();
  if (!Ctor) {
    handlers.onError?.('unsupported');
    return { stop: () => {} };
  }

  const rec = new Ctor();
  rec.lang = 'en-US';
  rec.continuous = false;
  rec.interimResults = true;
  rec.maxAlternatives = 5;

  let finished = false;
  let best = '';

  const cleanup = () => {
    rec.onresult = null;
    rec.onerror = null;
    rec.onend = null;
    rec.onstart = null;
  };

  const timer = window.setTimeout(() => {
    if (!finished) {
      finished = true;
      try {
        rec.stop();
      } catch {
        /* already stopped */
      }
      if (best) handlers.onFinal(best);
      else handlers.onError?.('no-speech');
    }
  }, timeoutMs);

  rec.onstart = () => handlers.onStart?.();

  rec.onresult = (event: any) => {
    let interim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      // Collect every alternative — the top guess is often not the child's word.
      const alternatives: string[] = [];
      for (let a = 0; a < result.length; a++) alternatives.push(result[a].transcript);

      if (result.isFinal) {
        best = alternatives.join(' | ');
        if (!finished) {
          finished = true;
          window.clearTimeout(timer);
          handlers.onFinal(best);
        }
      } else {
        interim += alternatives[0] ?? '';
      }
    }
    if (interim) handlers.onPartial?.(interim);
  };

  rec.onerror = (event: any) => {
    if (finished) return;
    finished = true;
    window.clearTimeout(timer);
    const code = event?.error;
    if (code === 'not-allowed' || code === 'service-not-allowed') handlers.onError?.('denied');
    else if (code === 'no-speech') handlers.onError?.('no-speech');
    else handlers.onError?.('error');
  };

  rec.onend = () => {
    window.clearTimeout(timer);
    handlers.onEnd?.();
    cleanup();
    if (!finished) {
      finished = true;
      if (best) handlers.onFinal(best);
      else handlers.onError?.('no-speech');
    }
  };

  try {
    rec.start();
  } catch {
    handlers.onError?.('error');
  }

  return {
    stop: () => {
      try {
        rec.stop();
      } catch {
        /* ignore */
      }
    },
  };
}
