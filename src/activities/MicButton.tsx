import { useEffect, useRef, useState } from 'react';
import { isRecognitionSupported, listenOnce, type ListenHandle } from '../core/voice';
import { sfxTap } from '../core/audio';

/**
 * Push-to-talk button for spoken answers.
 *
 * Recognition on young children's speech fails often enough that this component
 * treats failure as normal: errors are phrased as "I did not catch that" rather
 * than as the child's mistake, and the caller always shows a typing fallback
 * alongside.
 */

interface MicButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
  /** Hidden entirely when the browser has no recognition support. */
  micEnabled: boolean;
}

export function MicButton({ onTranscript, disabled, micEnabled }: MicButtonProps) {
  const [listening, setListening] = useState(false);
  const [partial, setPartial] = useState('');
  const [error, setError] = useState<string | null>(null);
  const handle = useRef<ListenHandle | null>(null);

  useEffect(() => () => handle.current?.stop(), []);

  if (!micEnabled || !isRecognitionSupported()) return null;

  const start = () => {
    if (listening || disabled) return;
    sfxTap();
    setError(null);
    setPartial('');
    setListening(true);

    handle.current = listenOnce({
      onPartial: (text) => setPartial(text),
      onFinal: (text) => {
        setListening(false);
        setPartial('');
        onTranscript(text);
      },
      onError: (reason) => {
        setListening(false);
        setPartial('');
        setError(
          reason === 'denied'
            ? 'I need permission to use the microphone. You can type instead.'
            : reason === 'unsupported'
              ? 'This browser cannot listen. Typing works though.'
              : 'I did not catch that. Try again, or type it.',
        );
      },
      onEnd: () => setListening(false),
    });
  };

  const stop = () => {
    handle.current?.stop();
    setListening(false);
  };

  return (
    <div className="mic-wrap">
      <button
        type="button"
        className={`mic-button ${listening ? 'listening' : ''}`}
        onClick={listening ? stop : start}
        disabled={disabled}
        aria-label={listening ? 'Stop listening' : 'Answer out loud'}
      >
        <span className="mic-icon" aria-hidden="true">
          {listening ? '⏹' : '🎤'}
        </span>
        <span>{listening ? 'Listening…' : 'Say it out loud'}</span>
      </button>

      {partial ? <p className="mic-partial">“{partial}”</p> : null}
      {error ? <p className="mic-error">{error}</p> : null}
    </div>
  );
}
