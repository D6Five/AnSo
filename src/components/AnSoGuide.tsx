import { useEffect, useRef, useState } from 'react';
import { speak, stopSpeaking } from '../core/voice';

/**
 * AnSo — the guide who travels with the girls.
 *
 * Drawn entirely in SVG so she scales cleanly and needs no image assets. Her
 * mood drives both the drawing and the animation; when she speaks, her mouth
 * animates for as long as the utterance lasts.
 */

export type AnSoMood = 'idle' | 'talking' | 'happy' | 'thinking' | 'encouraging';

interface AnSoGuideProps {
  mood: AnSoMood;
  /** Text shown in the speech bubble. Empty hides the bubble. */
  says?: string;
  /** Speak `says` aloud when it changes. */
  voice?: boolean;
  size?: number;
  /** Called once the spoken line finishes. */
  onDoneSpeaking?: () => void;
}

const MOOD_COLORS: Record<AnSoMood, { core: string; glow: string }> = {
  idle: { core: '#8be9fd', glow: '#8be9fd' },
  talking: { core: '#8be9fd', glow: '#a5f0ff' },
  happy: { core: '#ffd479', glow: '#ffe9b0' },
  thinking: { core: '#c9a7ff', glow: '#ded0ff' },
  encouraging: { core: '#7ee7b4', glow: '#b6f5d8' },
};

export function AnSoGuide({
  mood,
  says,
  voice = true,
  size = 120,
  onDoneSpeaking,
}: AnSoGuideProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const lastSpoken = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!says || !voice) return;
    // Guard against re-speaking the same line on unrelated re-renders.
    if (lastSpoken.current === says) return;
    lastSpoken.current = says;

    setIsSpeaking(true);
    let cancelled = false;
    void speak(says).then(() => {
      if (cancelled) return;
      setIsSpeaking(false);
      onDoneSpeaking?.();
    });

    return () => {
      cancelled = true;
      stopSpeaking();
      setIsSpeaking(false);
    };
  }, [says, voice, onDoneSpeaking]);

  const colors = MOOD_COLORS[mood];
  const animated = isSpeaking || mood === 'talking';

  return (
    <div className="anso" style={{ ['--anso-size' as string]: `${size}px` }}>
      <div className={`anso-body anso-${mood} ${animated ? 'anso-speaking' : ''}`}>
        <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
          <defs>
            <radialGradient id={`anso-glow-${mood}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={colors.glow} stopOpacity="0.85" />
              <stop offset="60%" stopColor={colors.core} stopOpacity="0.35" />
              <stop offset="100%" stopColor={colors.core} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Outer halo */}
          <circle cx="50" cy="50" r="46" fill={`url(#anso-glow-${mood})`} className="anso-halo" />

          {/* Four-point star body */}
          <path
            d="M50 14 L58 42 L86 50 L58 58 L50 86 L42 58 L14 50 L42 42 Z"
            fill={colors.core}
            opacity="0.92"
            className="anso-star"
          />

          {/* Inner core */}
          <circle cx="50" cy="50" r="17" fill="#0b0a1f" opacity="0.55" />

          {/* Eyes */}
          {mood === 'happy' ? (
            <>
              <path d="M41 48 q4 -5 8 0" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              <path d="M53 48 q4 -5 8 0" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </>
          ) : (
            <>
              <circle cx="44" cy="48" r="3.2" fill="#fff" className="anso-eye" />
              <circle cx="57" cy="48" r="3.2" fill="#fff" className="anso-eye" />
            </>
          )}

          {/* Mouth — animates while speaking */}
          {animated ? (
            <ellipse cx="50" cy="58" rx="4.5" ry="3.5" fill="#fff" opacity="0.9" className="anso-mouth-open" />
          ) : mood === 'thinking' ? (
            <line x1="46" y1="58" x2="54" y2="58" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
          ) : (
            <path d="M45 57 q5 4 10 0" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.9" />
          )}
        </svg>
      </div>

      {says ? (
        <div className="anso-bubble" role="status" aria-live="polite">
          {says}
        </div>
      ) : null}
    </div>
  );
}
