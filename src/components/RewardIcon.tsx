import type { Reward } from '../content/rewards';

/**
 * A small picture of an item, for the wardrobe and the shop.
 *
 * A grid of coloured rectangles with names on them asks a child to read before
 * she can choose. A six-year-old shopping for shoes should be able to see that
 * they are shoes. These are simplified rather than exact — the point is instant
 * recognition of the *kind* of thing at 44px, with the item's own colours.
 */
export function RewardIcon({ item, size = 44 }: { item: Reward; size?: number }) {
  const [light, deep] =
    item.kind === 'dress' ? [item.palette[1], item.palette[2]] : [item.palette[0], item.palette[1]];

  return (
    <svg viewBox="0 0 48 48" width={size} height={size} aria-hidden="true" className="reward-icon">
      <defs>
        <linearGradient id={`ic-${item.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
      </defs>
      <Glyph item={item} fill={`url(#ic-${item.id})`} stroke={deep} />
    </svg>
  );
}

function Glyph({ item, fill, stroke }: { item: Reward; fill: string; stroke: string }) {
  if (item.kind === 'dress') {
    switch (item.silhouette) {
      case 'hanbok':
        return (
          <g>
            <path d="M14 12 Q24 8, 34 12 L35 20 Q24 24, 13 20 Z" fill={fill} stroke={stroke} strokeWidth="1" />
            <path d="M14 20 C 8 28, 5 36, 5 42 Q 24 47, 43 42 C 43 36, 40 28, 34 20 Z" fill={fill} />
            <path d="M24 22 l -3 3 l 6 0 Z" fill={stroke} />
          </g>
        );
      case 'ballgown':
        return (
          <g>
            <path d="M17 10 Q24 7, 31 10 L30 22 Q24 25, 18 22 Z" fill={fill} stroke={stroke} strokeWidth="1" />
            <path d="M18 22 C 10 28, 5 36, 4 43 Q 24 48, 44 43 C 43 36, 38 28, 30 22 Z" fill={fill} />
          </g>
        );
      case 'aline':
        return (
          <g>
            <path d="M17 10 Q24 7, 31 10 L30 22 Q24 25, 18 22 Z" fill={fill} stroke={stroke} strokeWidth="1" />
            <path d="M18 22 L 9 43 Q 24 47, 39 43 L 30 22 Z" fill={fill} />
          </g>
        );
      case 'tiered':
        return (
          <g>
            <path d="M17 9 Q24 6, 31 9 L30 20 Q24 23, 18 20 Z" fill={fill} stroke={stroke} strokeWidth="1" />
            <path d="M18 20 L 12 30 Q 24 34, 36 30 L 30 20 Z" fill={fill} />
            <path d="M12 30 L 7 43 Q 24 47, 41 43 L 36 30 Q 24 34, 12 30 Z" fill={fill} opacity="0.85" />
          </g>
        );
      case 'wrap':
        return (
          <g>
            <path d="M17 10 Q24 7, 31 10 L30 22 Q24 25, 18 22 Z" fill={fill} stroke={stroke} strokeWidth="1" />
            <path d="M17 11 L 30 20 L 30 22 Q 24 25, 18 22 Z" fill={stroke} opacity="0.45" />
            <path d="M18 22 C 11 30, 6 37, 6 43 Q 24 48, 42 43 C 42 37, 37 30, 30 22 Z" fill={fill} />
          </g>
        );
    }
  }

  if (item.kind === 'room') {
    switch (item.slot) {
      case 'bed':
        return (
          <g>
            <rect x="5" y="24" width="38" height="14" rx="3" fill={fill} />
            <rect x="8" y="18" width="14" height="8" rx="3" fill="#fff" opacity="0.9" />
            <rect x="3" y="14" width="4" height="26" rx="2" fill={stroke} />
            <rect x="41" y="14" width="4" height="26" rx="2" fill={stroke} />
          </g>
        );
      case 'rug':
        return <ellipse cx="24" cy="28" rx="20" ry="11" fill={fill} stroke={stroke} strokeWidth="1.5" />;
      case 'lamp':
        return (
          <g>
            <path d="M14 22 L 34 22 L 30 10 L 18 10 Z" fill={fill} />
            <rect x="22" y="22" width="4" height="16" fill={stroke} />
            <ellipse cx="24" cy="39" rx="9" ry="3" fill={stroke} />
          </g>
        );
      case 'plant':
        return (
          <g>
            <path d="M16 30 L 32 30 L 30 42 L 18 42 Z" fill={stroke} />
            <ellipse cx="18" cy="20" rx="5" ry="9" fill={fill} transform="rotate(-22 18 20)" />
            <ellipse cx="30" cy="19" rx="5" ry="9" fill={fill} transform="rotate(22 30 19)" />
            <ellipse cx="24" cy="14" rx="4.5" ry="9" fill={fill} />
          </g>
        );
      case 'window':
        return (
          <g>
            <circle cx="24" cy="24" r="16" fill={fill} stroke={stroke} strokeWidth="2.5" />
            <path d="M24 8 L24 40 M8 24 L40 24" stroke="#fff" strokeWidth="2.5" />
          </g>
        );
      case 'desk':
        return (
          <g>
            <rect x="5" y="20" width="38" height="5" rx="2" fill={fill} />
            <rect x="8" y="25" width="4" height="16" fill={stroke} />
            <rect x="36" y="25" width="4" height="16" fill={stroke} />
            <rect x="16" y="10" width="14" height="10" rx="2" fill={fill} />
          </g>
        );
      default:
        return (
          <g>
            <rect x="9" y="12" width="30" height="26" rx="4" fill={fill} stroke={stroke} strokeWidth="1.5" />
            <circle cx="24" cy="25" r="6" fill="#fff" opacity="0.7" />
          </g>
        );
    }
  }

  // Accessories
  switch (item.type) {
    case 'crown':
    case 'binyeo':
      return (
        <g>
          <path d="M8 32 L 13 12 L 20 24 L 24 8 L 28 24 L 35 12 L 40 32 Z" fill={fill} stroke={stroke} strokeWidth="1.4" strokeLinejoin="round" />
          <rect x="8" y="31" width="32" height="6" rx="3" fill={stroke} />
        </g>
      );
    case 'ribbon':
      return (
        <g>
          <path d="M20 24 q -14 -10, -16 2 q 3 13, 16 6 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <path d="M28 24 q 14 -10, 16 2 q -3 13, -16 6 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <circle cx="24" cy="27" r="6" fill={stroke} />
        </g>
      );
    case 'flower':
      return (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="24" cy="24" rx="14" ry="7" fill={fill} transform={`rotate(${a} 24 24)`} />
          ))}
          <circle cx="24" cy="24" r="6" fill={stroke} />
        </g>
      );
    case 'necklace':
    case 'norigae':
      return (
        <g>
          <path d="M10 12 Q24 34, 38 12" stroke={stroke} strokeWidth="3" fill="none" />
          <circle cx="24" cy="31" r="8" fill={fill} stroke={stroke} strokeWidth="1.4" />
        </g>
      );
    case 'earrings':
      return (
        <g fill={fill} stroke={stroke} strokeWidth="1.4">
          <circle cx="16" cy="18" r="6" />
          <circle cx="32" cy="18" r="6" />
          <path d="M16 24 L16 34 M32 24 L32 34" strokeWidth="2" />
        </g>
      );
    case 'fan':
      return (
        <g>
          <path d="M24 40 A 22 22 0 0 1 4 20 L 24 20 Z" fill={fill} stroke={stroke} strokeWidth="1.4" transform="rotate(45 24 30)" />
          <circle cx="24" cy="40" r="3" fill={stroke} />
        </g>
      );
    case 'cape':
    case 'wings':
      return (
        <g>
          <path d="M24 8 C 10 16, 4 32, 6 42 L 22 38 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <path d="M24 8 C 38 16, 44 32, 42 42 L 26 38 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
        </g>
      );
    case 'shoes':
      return (
        <g>
          <path d="M6 28 q 10 -8, 18 0 q 1 8, -9 9 q -9 0, -9 -9 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <path d="M26 28 q 10 -8, 18 0 q 0 9, -9 9 q -10 -1, -9 -9 Z" fill={fill} stroke={stroke} strokeWidth="1.2" />
          <path d="M11 37 l 2 7 M37 37 l 2 7" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case 'bag':
      return (
        <g>
          <path d="M16 20 q 8 -14, 16 0" stroke={stroke} strokeWidth="2.5" fill="none" />
          <rect x="10" y="19" width="28" height="22" rx="5" fill={fill} stroke={stroke} strokeWidth="1.4" />
          <rect x="10" y="27" width="28" height="4" fill={stroke} opacity="0.5" />
        </g>
      );
    case 'makeup':
      return (
        <g>
          <rect x="14" y="16" width="10" height="26" rx="4" fill={stroke} />
          <rect x="15" y="8" width="8" height="10" rx="3" fill={fill} />
          <circle cx="34" cy="30" r="9" fill={fill} stroke={stroke} strokeWidth="1.4" />
          <circle cx="34" cy="30" r="4" fill="#fff" opacity="0.6" />
        </g>
      );
  }
}
