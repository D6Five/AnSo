/**
 * Pictures for the Korean vocabulary lessons.
 *
 * The picture has to carry the meaning on its own — if a child needs the
 * English caption to work out what she is looking at, the drawing has failed
 * and she is translating rather than learning. So these are the most ordinary
 * possible version of each thing, at a size that reads across a room.
 */

const PICTURES: Record<string, JSX.Element> = {
  water: (
    <g>
      <path d="M50 14 C 68 42, 80 58, 80 70 a 30 30 0 0 1 -60 0 C 20 58, 32 42, 50 14 Z" fill="#5fc7ea" />
      <path d="M50 24 C 62 44, 70 58, 70 68 a 20 20 0 0 1 -8 16 C 70 74, 66 58, 50 24 Z" fill="#fff" opacity="0.4" />
    </g>
  ),
  apple: (
    <g>
      <path d="M50 30 C 34 22, 16 34, 20 54 C 23 72, 38 86, 50 86 C 62 86, 77 72, 80 54 C 84 34, 66 22, 50 30 Z" fill="#e8534f" />
      <path d="M50 30 C 46 22, 47 14, 52 10 C 54 18, 53 25, 50 30 Z" fill="#7a4a2a" />
      <path d="M52 12 C 62 6, 72 10, 72 18 C 63 22, 55 19, 52 12 Z" fill="#4fae5a" />
      <ellipse cx="36" cy="46" rx="7" ry="10" fill="#fff" opacity="0.3" transform="rotate(-20 36 46)" />
    </g>
  ),
  cat: (
    <g>
      <path d="M24 34 L 28 12 L 42 26 Z" fill="#9b8579" />
      <path d="M76 34 L 72 12 L 58 26 Z" fill="#9b8579" />
      <ellipse cx="50" cy="52" rx="30" ry="27" fill="#b39a8c" />
      <ellipse cx="39" cy="47" rx="4.5" ry="6" fill="#2a1d1d" />
      <ellipse cx="61" cy="47" rx="4.5" ry="6" fill="#2a1d1d" />
      <circle cx="40.5" cy="45" r="1.6" fill="#fff" />
      <circle cx="62.5" cy="45" r="1.6" fill="#fff" />
      <path d="M50 58 l -4 -4 l 8 0 Z" fill="#7a5c52" />
      <path d="M50 62 q -6 5, -12 2 M50 62 q 6 5, 12 2" stroke="#7a5c52" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M18 52 l -12 -4 M18 58 l -12 3 M82 52 l 12 -4 M82 58 l 12 3" stroke="#7a5c52" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  ),
  dog: (
    <g>
      <ellipse cx="26" cy="42" rx="10" ry="18" fill="#a9764a" transform="rotate(-14 26 42)" />
      <ellipse cx="74" cy="42" rx="10" ry="18" fill="#a9764a" transform="rotate(14 74 42)" />
      <ellipse cx="50" cy="52" rx="28" ry="25" fill="#c79262" />
      <ellipse cx="50" cy="66" rx="16" ry="12" fill="#e5c39c" />
      <ellipse cx="40" cy="46" rx="4.5" ry="5.5" fill="#2a1d1d" />
      <ellipse cx="60" cy="46" rx="4.5" ry="5.5" fill="#2a1d1d" />
      <circle cx="41.5" cy="44" r="1.6" fill="#fff" />
      <circle cx="61.5" cy="44" r="1.6" fill="#fff" />
      <ellipse cx="50" cy="60" rx="6" ry="4.5" fill="#3a2723" />
      <path d="M50 65 q 0 6, -7 7 M50 65 q 0 6, 7 7" stroke="#3a2723" strokeWidth="2" fill="none" strokeLinecap="round" />
    </g>
  ),
  house: (
    <g>
      <path d="M50 12 L 92 46 L 82 46 L 82 88 L 18 88 L 18 46 L 8 46 Z" fill="#e07a5f" />
      <rect x="18" y="46" width="64" height="42" fill="#f2cc8f" />
      <rect x="40" y="60" width="20" height="28" rx="2" fill="#8a5a44" />
      <circle cx="55" cy="75" r="2" fill="#f2cc8f" />
      <rect x="24" y="54" width="12" height="12" rx="2" fill="#81b7d6" />
      <rect x="64" y="54" width="12" height="12" rx="2" fill="#81b7d6" />
    </g>
  ),
  star: (
    <path
      d="M50 8 L 61 38 L 93 38 L 67 57 L 77 88 L 50 69 L 23 88 L 33 57 L 7 38 L 39 38 Z"
      fill="#f5c542"
      stroke="#dba61f"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
  ),
  moon: (
    <g>
      <path d="M62 10 A 40 40 0 1 0 62 90 A 32 32 0 1 1 62 10 Z" fill="#f2e6a8" />
      <circle cx="44" cy="34" r="5" fill="#ddd08c" />
      <circle cx="34" cy="56" r="7" fill="#ddd08c" />
      <circle cx="49" cy="72" r="4" fill="#ddd08c" />
    </g>
  ),
  flower: (
    <g>
      <path d="M50 58 L 50 92" stroke="#4fae5a" strokeWidth="5" strokeLinecap="round" />
      <path d="M50 76 q -16 -6, -20 -18 q 16 0, 20 12 Z" fill="#4fae5a" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="50" cy="40" rx="18" ry="10" fill="#f07fb0" transform={`rotate(${a} 50 40)`} />
      ))}
      <circle cx="50" cy="40" r="9" fill="#f5c542" />
    </g>
  ),
  book: (
    <g>
      <path d="M12 22 C 28 16, 42 18, 50 26 L 50 84 C 42 76, 28 74, 12 80 Z" fill="#6a8fd8" />
      <path d="M88 22 C 72 16, 58 18, 50 26 L 50 84 C 58 76, 72 74, 88 80 Z" fill="#8aa8e4" />
      <path d="M50 26 L 50 84" stroke="#3f5da3" strokeWidth="3" />
      <path d="M20 34 L 40 31 M20 44 L 40 41 M60 31 L 80 34 M60 41 L 80 44" stroke="#fff" strokeWidth="2" opacity="0.65" strokeLinecap="round" />
    </g>
  ),
  hand: (
    <g>
      <path d="M32 88 L 32 46 q 0 -7, 7 -7 q 7 0, 7 7 L 46 30 q 0 -7, 7 -7 q 7 0, 7 7 L 60 34 q 0 -7, 7 -7 q 7 0, 7 7 L 74 44 q 0 -6, 6 -6 q 6 0, 6 6 L 86 70 q 0 18, -18 18 Z" fill="#f0c6a8" />
      <path d="M32 60 q -10 -12, -16 -6 q -4 6, 6 16 L 32 82 Z" fill="#f0c6a8" />
      <path d="M46 44 L 46 62 M60 40 L 60 62 M74 48 L 74 64" stroke="#d9a985" strokeWidth="2" strokeLinecap="round" />
    </g>
  ),
  tree: (
    <g>
      <rect x="44" y="58" width="12" height="32" rx="3" fill="#8a5a44" />
      <circle cx="50" cy="38" r="26" fill="#4fae5a" />
      <circle cx="32" cy="48" r="16" fill="#5cbd68" />
      <circle cx="68" cy="48" r="16" fill="#5cbd68" />
    </g>
  ),
  sun: (
    <g>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="50" y1="8" x2="50" y2="20" stroke="#f5c542" strokeWidth="5" strokeLinecap="round" transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="22" fill="#f5c542" />
      <circle cx="50" cy="50" r="16" fill="#fadf7e" />
    </g>
  ),
  bird: (
    <g>
      <ellipse cx="46" cy="54" rx="26" ry="20" fill="#6a8fd8" />
      <circle cx="68" cy="38" r="13" fill="#6a8fd8" />
      <path d="M78 36 l 12 4 l -12 4 Z" fill="#f5a742" />
      <circle cx="70" cy="35" r="2.5" fill="#20293a" />
      <path d="M30 52 q -8 8, -2 16 q 10 -2, 14 -10 Z" fill="#5379c4" />
      <path d="M40 74 l -4 12 M52 74 l 4 12" stroke="#f5a742" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  fish: (
    <g>
      <ellipse cx="44" cy="50" rx="28" ry="18" fill="#f0925c" />
      <path d="M68 50 L 90 34 L 90 66 Z" fill="#e07a44" />
      <circle cx="32" cy="45" r="3.5" fill="#20293a" />
      <path d="M40 34 q 8 6, 0 14" stroke="#e07a44" strokeWidth="2.5" fill="none" />
      <circle cx="14" cy="30" r="3" fill="#5fc7ea" opacity="0.7" />
      <circle cx="10" cy="20" r="2" fill="#5fc7ea" opacity="0.7" />
    </g>
  ),
  milk: (
    <g>
      <path d="M34 26 L 66 26 L 66 34 L 72 46 L 72 88 L 28 88 L 28 46 L 34 34 Z" fill="#f4f0e6" stroke="#d8cfbd" strokeWidth="2" />
      <path d="M34 26 L 66 26 L 66 34 L 34 34 Z" fill="#81b7d6" />
      <path d="M28 46 L 72 46 L 72 60 L 28 60 Z" fill="#81b7d6" opacity="0.5" />
      <ellipse cx="50" cy="74" rx="12" ry="8" fill="#fff" />
    </g>
  ),
  rice: (
    <g>
      <path d="M18 56 a 32 20 0 0 0 64 0 Z" fill="#e07a5f" />
      <ellipse cx="50" cy="54" rx="30" ry="10" fill="#c96a50" />
      <ellipse cx="50" cy="48" rx="24" ry="10" fill="#fff" />
      <circle cx="38" cy="44" r="5" fill="#f7f3ea" />
      <circle cx="50" cy="40" r="6" fill="#f7f3ea" />
      <circle cx="62" cy="44" r="5" fill="#f7f3ea" />
    </g>
  ),
  eye: (
    <g>
      <path d="M10 50 Q 50 18, 90 50 Q 50 82, 10 50 Z" fill="#fff" stroke="#20293a" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="16" fill="#7a5c3f" />
      <circle cx="50" cy="50" r="8" fill="#20293a" />
      <circle cx="55" cy="45" r="3.5" fill="#fff" />
      <path d="M22 34 Q 50 12, 78 34" stroke="#20293a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
    </g>
  ),
  nose: (
    <g>
      <path d="M50 18 L 50 52 Q 50 64, 42 68 Q 34 74, 42 80 Q 50 84, 58 80 Q 66 74, 58 68 Q 50 64, 50 52" fill="#f0c6a8" stroke="#d9a985" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="40" cy="76" rx="4" ry="3" fill="#c98f6a" />
      <ellipse cx="60" cy="76" rx="4" ry="3" fill="#c98f6a" />
    </g>
  ),
  mouth: (
    <g>
      <path d="M14 50 Q 30 38, 50 44 Q 70 38, 86 50 Q 70 76, 50 76 Q 30 76, 14 50 Z" fill="#e8534f" />
      <path d="M14 50 Q 50 58, 86 50 Q 70 46, 50 48 Q 30 46, 14 50 Z" fill="#fff" />
      <path d="M30 62 Q 50 70, 70 62 Q 60 68, 50 68 Q 40 68, 30 62 Z" fill="#c93a3a" />
    </g>
  ),
  foot: (
    <g>
      <path d="M38 12 Q 56 10, 60 30 L 62 52 Q 64 68, 76 72 Q 86 76, 84 84 Q 80 92, 62 90 L 40 88 Q 28 86, 30 70 L 34 32 Q 34 16, 38 12 Z" fill="#f0c6a8" />
      <circle cx="36" cy="14" r="6" fill="#f0c6a8" />
      <circle cx="46" cy="10" r="5" fill="#f0c6a8" />
      <circle cx="55" cy="12" r="4.5" fill="#f0c6a8" />
      <circle cx="62" cy="16" r="4" fill="#f0c6a8" />
      <circle cx="67" cy="22" r="3.5" fill="#f0c6a8" />
    </g>
  ),
  mom: (
    <g>
      <path d="M28 44 Q 26 16, 50 14 Q 74 16, 72 44 L 74 66 Q 62 60, 50 62 Q 38 60, 26 66 Z" fill="#7a4a2a" />
      <circle cx="50" cy="42" r="20" fill="#f0c6a8" />
      <circle cx="43" cy="40" r="2.5" fill="#20293a" />
      <circle cx="57" cy="40" r="2.5" fill="#20293a" />
      <path d="M44 50 q 6 5, 12 0" stroke="#c95a5a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M30 88 Q 34 66, 50 66 Q 66 66, 70 88 Z" fill="#e07aa0" />
    </g>
  ),
  dad: (
    <g>
      <path d="M32 34 Q 32 16, 50 16 Q 68 16, 68 34 L 68 40 L 32 40 Z" fill="#3a2723" />
      <circle cx="50" cy="44" r="20" fill="#f0c6a8" />
      <circle cx="43" cy="42" r="2.5" fill="#20293a" />
      <circle cx="57" cy="42" r="2.5" fill="#20293a" />
      <path d="M44 52 q 6 5, 12 0" stroke="#a06a4a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M30 90 Q 34 68, 50 68 Q 66 68, 70 90 Z" fill="#4a6a9a" />
    </g>
  ),
  baby: (
    <g>
      <circle cx="50" cy="48" r="24" fill="#f6d7bd" />
      <path d="M50 22 q -2 -8, 6 -10 q 2 6, -3 10 Z" fill="#7a4a2a" />
      <circle cx="42" cy="46" r="3" fill="#20293a" />
      <circle cx="58" cy="46" r="3" fill="#20293a" />
      <circle cx="36" cy="54" r="4" fill="#f0a8a0" opacity="0.7" />
      <circle cx="64" cy="54" r="4" fill="#f0a8a0" opacity="0.7" />
      <path d="M45 58 q 5 4, 10 0" stroke="#c95a5a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M34 82 Q 40 72, 50 72 Q 60 72, 66 82 Q 60 90, 50 90 Q 40 90, 34 82 Z" fill="#a8d8ea" />
    </g>
  ),
  one: (
    <g>
      <circle cx="50" cy="30" r="14" fill="#e8534f" />
      <path d="M44 58 L 54 52 L 54 88 M44 88 L 64 88" stroke="#20293a" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  two: (
    <g>
      <circle cx="36" cy="28" r="12" fill="#e8534f" />
      <circle cx="64" cy="28" r="12" fill="#5fc7ea" />
      <path d="M38 56 Q 38 48, 50 48 Q 62 48, 62 58 Q 62 66, 50 74 L 38 86 L 64 86" stroke="#20293a" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  three: (
    <g>
      <circle cx="30" cy="26" r="10" fill="#e8534f" />
      <circle cx="50" cy="22" r="10" fill="#5fc7ea" />
      <circle cx="70" cy="26" r="10" fill="#f5c542" />
      <path d="M38 52 Q 40 46, 50 46 Q 62 46, 60 56 Q 59 63, 50 65 Q 62 66, 62 76 Q 62 88, 50 88 Q 40 88, 38 82" stroke="#20293a" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  ),
  red: (
    <g>
      <path d="M50 12 C 64 30, 82 44, 80 62 a 30 30 0 0 1 -60 0 C 18 44, 36 30, 50 12 Z" fill="#e8534f" />
      <ellipse cx="40" cy="58" rx="8" ry="12" fill="#fff" opacity="0.25" transform="rotate(-15 40 58)" />
      <rect x="20" y="82" width="60" height="8" rx="4" fill="#c93a3a" />
    </g>
  ),
  blue: (
    <g>
      <path d="M50 12 C 64 30, 82 44, 80 62 a 30 30 0 0 1 -60 0 C 18 44, 36 30, 50 12 Z" fill="#3f7ac9" />
      <ellipse cx="40" cy="58" rx="8" ry="12" fill="#fff" opacity="0.25" transform="rotate(-15 40 58)" />
      <rect x="20" y="82" width="60" height="8" rx="4" fill="#2e5da3" />
    </g>
  ),
  yellow: (
    <g>
      <path d="M50 12 C 64 30, 82 44, 80 62 a 30 30 0 0 1 -60 0 C 18 44, 36 30, 50 12 Z" fill="#f5c542" />
      <ellipse cx="40" cy="58" rx="8" ry="12" fill="#fff" opacity="0.35" transform="rotate(-15 40 58)" />
      <rect x="20" y="82" width="60" height="8" rx="4" fill="#dba61f" />
    </g>
  ),
  ball: (
    <g>
      <circle cx="50" cy="50" r="34" fill="#e8534f" />
      <path d="M50 16 a 34 34 0 0 1 0 68" fill="#f5c542" />
      <path d="M50 16 Q 30 50, 50 84 M50 16 Q 70 50, 50 84" stroke="#fff" strokeWidth="3" fill="none" />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#c93a3a" strokeWidth="2.5" />
    </g>
  ),
};

/** The picture names that exist. Content tests check every Korean word against this. */
export const PICTURE_NAMES: string[] = Object.keys(PICTURES);

export function WordPicture({ name, size = 128 }: { name: string; size?: number }) {
  const art = PICTURES[name];
  if (!art) return null;
  return (
    <div className="word-picture" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true">
        {art}
      </svg>
    </div>
  );
}
