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
};

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
