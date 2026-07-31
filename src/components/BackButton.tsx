import { sfxWhoosh } from '../core/audio';

/**
 * The way back, in one place.
 *
 * Deliberately large, high contrast and always the first thing at the top left
 * of a screen. A small grey "← back" in a header is fine for an adult skimming
 * a page; a six-year-old who cannot find her way out of a screen simply gets
 * stuck and calls for help, and the same control has to look the same
 * everywhere for her to learn it once.
 */
export function BackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="back-button"
      onClick={() => {
        sfxWhoosh();
        onClick();
      }}
    >
      <span className="back-arrow" aria-hidden="true">
        ←
      </span>
      {label}
    </button>
  );
}
