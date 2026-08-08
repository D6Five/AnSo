/**
 * Illustrations for the fourteen BSF Romans lessons.
 *
 * One quiet emblem per week, drawn to carry the lesson's central image: a
 * letter for the gospel arriving, scales for judgment, a cross at the centre
 * of the series, broken chains for freedom, a crown for glory. Soft luminous
 * colours sit well on the app's night-sky background.
 */

const ART: Record<string, JSX.Element> = {
  scroll: (
    <g>
      <rect x="22" y="20" width="56" height="62" rx="4" fill="#f2e8d5" />
      <rect x="22" y="20" width="56" height="62" rx="4" fill="none" stroke="#d8c9a8" strokeWidth="2" />
      <path d="M30 34 h40 M30 44 h40 M30 54 h28" stroke="#a58a5c" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="66" cy="66" r="11" fill="#c0392b" />
      <path d="M62 66 l 3 3 l 6 -7" stroke="#f2e8d5" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  ),
  storm: (
    <g>
      <circle cx="50" cy="70" r="22" fill="#4f7b52" />
      <path d="M28 70 a22 22 0 0 1 44 0 Z" fill="#5e9462" />
      <ellipse cx="38" cy="34" rx="18" ry="11" fill="#5a6478" />
      <ellipse cx="58" cy="30" rx="20" ry="12" fill="#6b7690" />
      <path d="M52 42 l -8 14 h7 l -5 14 l 14 -18 h-7 l 7 -10 Z" fill="#f5c542" />
    </g>
  ),
  scales: (
    <g>
      <path d="M50 18 v 52" stroke="#c79e5e" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M26 30 h 48" stroke="#c79e5e" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M26 30 l -8 18 h 16 Z" fill="none" stroke="#c79e5e" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M18 48 a 8 8 0 0 0 16 0" fill="#e9d7b0" />
      <path d="M74 30 l -8 18 h 16 Z" fill="none" stroke="#c79e5e" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M66 48 a 8 8 0 0 0 16 0" fill="#e9d7b0" />
      <path d="M38 76 h 24 M42 70 h 16" stroke="#c79e5e" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="50" cy="24" r="4" fill="#e9d7b0" />
    </g>
  ),
  mirror: (
    <g>
      <ellipse cx="50" cy="44" rx="24" ry="30" fill="#b9d4e8" />
      <ellipse cx="50" cy="44" rx="24" ry="30" fill="none" stroke="#c79e5e" strokeWidth="4" />
      <path d="M38 30 q 8 -8 16 0" stroke="#e8f2f8" strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d="M40 44 l 20 0 M50 34 l 0 20" stroke="#7fa8c4" strokeWidth="2" strokeLinecap="round" transform="rotate(45 50 44)" />
      <rect x="44" y="74" width="12" height="14" rx="3" fill="#c79e5e" />
    </g>
  ),
  cross: (
    <g>
      <circle cx="50" cy="46" r="34" fill="#f5e9c8" opacity="0.25" />
      <rect x="44" y="16" width="12" height="64" rx="3" fill="#c79e5e" />
      <rect x="26" y="32" width="48" height="12" rx="3" fill="#c79e5e" />
      <circle cx="50" cy="46" r="42" fill="none" stroke="#f5e9c8" strokeWidth="1.5" opacity="0.5" />
    </g>
  ),
  gift_hands: (
    <g>
      <path d="M14 66 q 10 -14 24 -8 l 12 5 q 6 3 3 8 l -14 -3" fill="#f0c6a8" />
      <path d="M86 66 q -10 -14 -24 -8 l -12 5 q -6 3 -3 8 l 14 -3" fill="#e8b894" />
      <rect x="36" y="28" width="28" height="24" rx="3" fill="#e05c6e" />
      <rect x="47" y="28" width="6" height="24" fill="#f5c542" />
      <path d="M50 28 q -8 -12 -14 -4 q 4 6 14 4 M50 28 q 8 -12 14 -4 q -4 6 -14 4" fill="#f5c542" />
    </g>
  ),
  stars_promise: (
    <g>
      <rect x="10" y="12" width="80" height="60" rx="6" fill="#1c2740" />
      {[[24, 24, 2.5], [40, 18, 1.8], [58, 26, 2.2], [74, 18, 1.6], [30, 40, 1.7], [50, 36, 2.6], [68, 42, 1.9], [80, 34, 1.4], [20, 54, 1.5], [62, 56, 1.7]].map(([x, y, r], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="#f5e9c8" />
      ))}
      <path d="M50 36 l 1.5 4 h4 l -3.2 2.6 l 1.2 4.2 l -3.5 -2.6 l -3.5 2.6 l 1.2 -4.2 l -3.2 -2.6 h4 Z" fill="#f5c542" />
      <path d="M20 82 q 30 -12 60 0" stroke="#8a6f45" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  ),
  dove: (
    <g>
      <circle cx="50" cy="48" r="34" fill="#aee0f2" opacity="0.3" />
      <path d="M36 52 q 12 -14 30 -10 q -4 8 -12 10 q 10 2 16 -2 q -2 12 -18 14 q -14 2 -20 -6 Z" fill="#f4f7f9" />
      <circle cx="61" cy="44" r="1.8" fill="#20293a" />
      <path d="M66 46 l 8 2 l -8 2 Z" fill="#f0a642" />
      <path d="M40 46 q -2 -12 8 -18 q 4 8 -2 16" fill="#dfe9ef" />
      <path d="M30 62 q 4 4 10 4 l -3 6 q -6 -2 -7 -10" fill="#7cc47f" />
    </g>
  ),
  gift: (
    <g>
      <rect x="24" y="42" width="52" height="40" rx="4" fill="#e05c6e" />
      <rect x="20" y="32" width="60" height="14" rx="3" fill="#c94b5c" />
      <rect x="45" y="32" width="10" height="50" fill="#f5c542" />
      <path d="M50 32 q -12 -16 -20 -6 q 6 8 20 6 M50 32 q 12 -16 20 -6 q -6 8 -20 6" fill="#f5c542" />
      <circle cx="50" cy="30" r="4" fill="#dba61f" />
    </g>
  ),
  chains: (
    <g>
      {[0, 1].map((i) => (
        <g key={i} transform={i === 0 ? 'translate(14 26) rotate(-18 20 20)' : 'translate(50 48) rotate(14 20 20)'}>
          <rect x="0" y="6" width="16" height="24" rx="8" fill="none" stroke="#9aa4b8" strokeWidth="5" />
          <rect x="20" y="6" width="16" height="24" rx="8" fill="none" stroke="#9aa4b8" strokeWidth="5" />
        </g>
      ))}
      <path d="M44 40 l 4 -8 M50 42 l 1 -9 M56 42 l 6 -7" stroke="#f5c542" strokeWidth="3" strokeLinecap="round" />
    </g>
  ),
  sunrise: (
    <g>
      <rect x="8" y="60" width="84" height="4" rx="2" fill="#6a5a8c" />
      <path d="M26 60 a 24 24 0 0 1 48 0 Z" fill="#f5a642" />
      <path d="M34 60 a 16 16 0 0 1 32 0 Z" fill="#f5c542" />
      {[[-38, 0], [-24, -22], [0, -32], [24, -22], [38, 0]].map(([dx, dy], i) => (
        <line key={i} x1={50 + dx * 0.62} y1={58 + dy * 0.62} x2={50 + dx} y2={58 + dy} stroke="#f5c542" strokeWidth="3.5" strokeLinecap="round" />
      ))}
      <path d="M16 74 q 34 10 68 0" stroke="#7cc47f" strokeWidth="4" fill="none" strokeLinecap="round" />
    </g>
  ),
  tablets_heart: (
    <g>
      <path d="M20 34 a 14 14 0 0 1 28 0 v 40 h -28 Z" fill="#cfd6e4" />
      <path d="M52 34 a 14 14 0 0 1 28 0 v 40 h -28 Z" fill="#cfd6e4" />
      <path d="M27 40 h 14 M27 48 h 14 M27 56 h 10 M59 40 h 14 M59 48 h 14 M59 56 h 10" stroke="#8a94ac" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M50 88 C 40 80 30 72 30 62 a 10 10 0 0 1 20 -4 a 10 10 0 0 1 20 4 c 0 10 -10 18 -20 26 Z" fill="#e05c6e" />
    </g>
  ),
  flame: (
    <g>
      <circle cx="50" cy="52" r="34" fill="#f5a642" opacity="0.18" />
      <path d="M50 14 C 62 32 74 44 74 60 a 24 24 0 0 1 -48 0 C 26 44 38 32 50 14 Z" fill="#f0812c" />
      <path d="M50 34 C 57 44 64 52 64 62 a 14 14 0 0 1 -28 0 C 36 52 43 44 50 34 Z" fill="#f5c542" />
      <path d="M50 50 C 54 56 57 60 57 65 a 7 7 0 0 1 -14 0 C 43 60 46 56 50 50 Z" fill="#fdf0d0" />
    </g>
  ),
  crown: (
    <g>
      <circle cx="50" cy="46" r="36" fill="#f5e9c8" opacity="0.2" />
      {[[-34, -8], [-20, -26], [0, -34], [20, -26], [34, -8]].map(([dx, dy], i) => (
        <line key={i} x1={50 + dx * 0.7} y1={44 + dy * 0.7} x2={50 + dx} y2={44 + dy} stroke="#f5e9c8" strokeWidth="2.5" strokeLinecap="round" opacity="0.8" />
      ))}
      <path d="M26 46 l 8 18 h 32 l 8 -18 l -12 8 l -12 -16 l -12 16 Z" fill="#f5c542" />
      <rect x="32" y="64" width="36" height="8" rx="3" fill="#dba61f" />
      <circle cx="50" cy="38" r="3.5" fill="#e05c6e" />
      <circle cx="34" cy="50" r="2.5" fill="#4a90d9" />
      <circle cx="66" cy="50" r="2.5" fill="#4a90d9" />
    </g>
  ),
};

export const BSF_ART_NAMES: string[] = Object.keys(ART);

export function BsfArt({ name, size = 120 }: { name: string; size?: number }) {
  const art = ART[name];
  if (!art) return null;
  return (
    <svg
      className="bsf-art"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      role="img"
      aria-hidden="true"
    >
      {art}
    </svg>
  );
}
