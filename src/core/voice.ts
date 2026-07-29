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

/**
 * Voices Chrome/Edge/Windows commonly ship, warmest first. Falls back to any
 * en-* voice, then to the platform default.
 */
const PREFERRED_VOICES = [
  'Microsoft Aria Online (Natural) - English (United States)',
  'Microsoft Jenny Online (Natural) - English (United States)',
  'Microsoft Michelle Online (Natural) - English (United States)',
  'Google US English',
  'Microsoft Zira - English (United States)',
  'Samantha',
];

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis?.getVoices() ?? [];
  if (voices.length === 0) return null;

  for (const name of PREFERRED_VOICES) {
    const hit = voices.find((v) => v.name === name);
    if (hit) return hit;
  }
  const localEnglish = voices.find((v) => v.lang.startsWith('en') && v.localService);
  if (localEnglish) return localEnglish;
  return voices.find((v) => v.lang.startsWith('en')) ?? voices[0];
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
  const { rate = 0.95, pitch = 1.15, onEnd, interrupt = true } = opts;

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
