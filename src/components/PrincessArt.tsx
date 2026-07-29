import type { Princess } from '../content/princesses';
import type { AccessoryReward, DressReward } from '../content/rewards';

/**
 * The princess, drawn in SVG so she scales cleanly and needs no image files.
 *
 * Layered back to front: wings, cape, back hair, skirt, bodice, arms, head,
 * face, front hair, then worn accessories. The dress is drawn from the
 * silhouette and palette on the reward, so every gown in the catalogue is
 * covered by the same code.
 */

interface PrincessArtProps {
  princess: Princess;
  dress: DressReward | null;
  accessories: AccessoryReward[];
  size?: number;
}

/* ------------------------------------------------------------------ */
/* Dress silhouettes                                                   */
/* ------------------------------------------------------------------ */

/** Skirt outline per silhouette. Shoulders sit at y=104, hem at y=268. */
function skirtPath(silhouette: DressReward['silhouette']): string {
  switch (silhouette) {
    case 'hanbok':
      // Chima: gathered right under the bust and very full, the defining shape.
      return 'M74 116 C 44 160, 26 220, 24 266 Q 100 280, 176 266 C 174 220, 156 160, 126 116 Z';
    case 'ballgown':
      return 'M80 150 C 52 186, 32 228, 28 264 Q 100 278, 172 264 C 168 228, 148 186, 120 150 Z';
    case 'aline':
      return 'M82 150 L 46 264 Q 100 274, 154 264 L 118 150 Z';
    case 'tiered':
      return 'M82 150 C 62 176, 50 200, 46 220 Q 100 232, 154 220 C 150 200, 138 176, 118 150 Z';
    case 'wrap':
      return 'M80 150 C 56 190, 40 230, 38 264 Q 100 276, 162 264 C 160 230, 144 190, 120 150 Z';
  }
}

/** Bodice outline. Hanbok uses a short jeogori jacket instead of a long bodice. */
function bodicePath(silhouette: DressReward['silhouette']): string {
  if (silhouette === 'hanbok') {
    return 'M76 104 Q 100 98, 124 104 L 127 120 Q 100 126, 73 120 Z';
  }
  return 'M78 104 Q 100 98, 122 104 L 119 152 Q 100 157, 81 152 Z';
}

function DressLayer({ dress }: { dress: DressReward }) {
  const [light, mid, deep] = dress.palette;
  const { silhouette, trim } = dress;

  return (
    <g>
      <defs>
        <linearGradient id={`skirt-${dress.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mid} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
        <linearGradient id={`bodice-${dress.id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={mid} />
        </linearGradient>
      </defs>

      <path d={skirtPath(silhouette)} fill={`url(#skirt-${dress.id})`} />

      {/* Tiered gowns need their ruffles drawn as separate overlapping sweeps. */}
      {silhouette === 'tiered' ? (
        <>
          <path d="M46 218 Q 100 232, 154 218 C 152 238, 146 252, 142 266 Q 100 278, 58 266 C 54 252, 48 238, 46 218 Z" fill={mid} />
          <path d="M52 250 Q 100 262, 148 250 C 148 258, 146 262, 145 268 Q 100 280, 55 268 C 54 262, 52 258, 52 250 Z" fill={light} opacity="0.85" />
        </>
      ) : null}

      {/* Hanbok: the chima is pleated, which is most of what makes it read. */}
      {silhouette === 'hanbok' ? (
        <g stroke={deep} strokeWidth="1.1" opacity="0.35" fill="none">
          <path d="M62 150 C 54 190, 46 230, 44 264" />
          <path d="M82 138 C 78 184, 74 226, 73 268" />
          <path d="M100 132 L 100 272" />
          <path d="M118 138 C 122 184, 126 226, 127 268" />
          <path d="M138 150 C 146 190, 154 230, 156 264" />
        </g>
      ) : null}

      <path d={bodicePath(silhouette)} fill={`url(#bodice-${dress.id})`} />

      {/* Wrap dresses cross at the front. */}
      {silhouette === 'wrap' ? (
        <path d="M79 106 L 118 140 L 119 152 Q 100 157, 81 152 Z" fill={deep} opacity="0.5" />
      ) : null}

      {/* Goreum — the long ribbon tied at the front of a hanbok. */}
      {silhouette === 'hanbok' ? (
        <g>
          <path d="M100 118 q -8 3, -6 12 q 5 -6, 10 -4 q 5 -6, 10 3 q 3 -10, -6 -12 Z" fill={deep} />
          <path d="M103 128 C 106 146, 104 162, 100 176" stroke={deep} strokeWidth="4" fill="none" strokeLinecap="round" />
        </g>
      ) : null}

      {/* Trims */}
      {trim === 'lace' ? (
        <g fill={light} opacity="0.9">
          {Array.from({ length: 11 }, (_, i) => (
            <circle key={i} cx={34 + i * 13} cy={266 - Math.abs(i - 5) * 1.6} r="4.5" />
          ))}
        </g>
      ) : null}

      {trim === 'ribbon' && silhouette !== 'hanbok' ? (
        <rect x="78" y="144" width="44" height="8" rx="4" fill={deep} />
      ) : null}

      {trim === 'fur' ? (
        <g fill="#fffdf8">
          <path d="M74 104 Q 100 96, 126 104 Q 100 114, 74 104 Z" />
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={40 + i * 15} cy={264} r="6" opacity="0.95" />
          ))}
        </g>
      ) : null}

      {trim === 'sparkle' ? (
        <g fill="#fffdf5" opacity="0.9">
          {[
            [72, 190], [126, 176], [96, 214], [58, 232], [142, 226], [110, 250], [84, 168],
          ].map(([x, y], i) => (
            <path
              key={i}
              d={`M${x} ${y - 5} L${x + 1.6} ${y - 1.6} L${x + 5} ${y} L${x + 1.6} ${y + 1.6} L${x} ${y + 5} L${x - 1.6} ${y + 1.6} L${x - 5} ${y} L${x - 1.6} ${y - 1.6} Z`}
            />
          ))}
        </g>
      ) : null}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Hair                                                                */
/* ------------------------------------------------------------------ */

function BackHair({ princess }: { princess: Princess }) {
  const { hair, hairColor } = princess;
  switch (hair) {
    case 'long':
      return <path d="M68 52 C 58 74, 58 120, 62 160 Q 100 172, 138 160 C 142 120, 142 74, 132 52 Q 100 34, 68 52 Z" fill={hairColor} />;
    case 'wavy':
      return <path d="M66 52 C 54 78, 58 118, 60 150 Q 74 162, 68 172 Q 100 182, 132 172 Q 126 162, 140 150 C 142 118, 146 78, 134 52 Q 100 34, 66 52 Z" fill={hairColor} />;
    case 'braid':
      return <path d="M68 52 C 60 76, 62 108, 66 136 Q 100 148, 134 136 C 138 108, 140 76, 132 52 Q 100 34, 68 52 Z" fill={hairColor} />;
    case 'bun':
      return <path d="M70 54 C 64 74, 66 98, 70 118 Q 100 128, 130 118 C 134 98, 136 74, 130 54 Q 100 38, 70 54 Z" fill={hairColor} />;
    case 'halfUp':
      return <path d="M68 52 C 58 76, 60 116, 64 148 Q 100 160, 136 148 C 140 116, 142 76, 132 52 Q 100 34, 68 52 Z" fill={hairColor} />;
  }
}

function FrontHair({ princess }: { princess: Princess }) {
  const { hair, hairColor, hairShine, streak } = princess;
  return (
    <g>
      {/* Crown of the head and a swept fringe with a visible parting — a flat
          curtain of hair is the thing that makes a face look unfinished. */}
      <path d="M70 60 C 70 38, 84 28, 100 28 C 116 28, 130 38, 130 60 C 126 45, 114 37, 100 37 C 86 37, 74 45, 70 60 Z" fill={hairColor} />
      <path d="M100 34 C 88 36, 78 44, 74 60 C 76 46, 84 40, 94 38 Z" fill={hairColor} />
      <path d="M100 34 C 112 36, 122 46, 126 62 C 128 46, 118 38, 106 36 Z" fill={hairColor} />

      {/* Face-framing pieces down past the jaw, which reads as styled rather
          than merely long. */}
      <path d="M73 52 C 68 66, 68 84, 71 100 C 74 84, 75 66, 78 54 Z" fill={hairColor} />
      <path d="M127 52 C 132 66, 132 84, 129 100 C 126 84, 125 66, 122 54 Z" fill={hairColor} />

      {/* The dyed streak. One bold colour per princess, the way an idol group
          tells its members apart at a glance — but a narrow lock following the
          fall of the hair, not a panel of colour stuck over the face. */}
      <path d="M107 37 C 114 43, 118 52, 120 62 C 119 76, 120 88, 122 99 C 118.5 88, 117 72, 115 59 C 112.5 49, 110 41, 107 37 Z" fill={streak} opacity="0.9" />
      <path d="M84 40 C 80 48, 78.5 58, 78 68 C 77 58, 78 47, 81.5 39 Z" fill={streak} opacity="0.55" />

      {hair === 'bun' ? (
        <>
          <circle cx="100" cy="22" r="15" fill={hairColor} />
          <circle cx="100" cy="22" r="15" fill={streak} opacity="0.25" />
          <ellipse cx="95" cy="18" rx="6" ry="4" fill={hairShine} opacity="0.6" />
          <path d="M86 30 q 14 -6, 28 0" stroke={hairShine} strokeWidth="2" fill="none" opacity="0.5" />
        </>
      ) : null}

      {hair === 'braid' ? (
        <g fill={hairColor}>
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={i} cx={132 - i * 1.5} cy={122 + i * 15} rx={9 - i * 0.7} ry="9" />
          ))}
          <ellipse cx="130" cy="137" rx="7" ry="6" fill={streak} opacity="0.7" />
          <circle cx="126" cy="212" r="5" fill={streak} />
        </g>
      ) : null}

      {hair === 'wavy' ? (
        <path d="M126 60 C 134 76, 128 96, 134 116 C 126 100, 130 78, 122 62 Z" fill={streak} opacity="0.6" />
      ) : null}

      {/* Sheen across the crown. Idol-animation hair is always glossy. */}
      <path d="M82 44 C 90 36, 110 36, 118 44 C 108 41, 92 41, 82 44 Z" fill={hairShine} opacity="0.85" />
      <path d="M79 50 C 85 42, 94 39, 101 40 C 92 43, 85 48, 80 57 Z" fill={hairShine} opacity="0.55" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Face                                                                */
/* ------------------------------------------------------------------ */

/**
 * One eye, mirrored by the caller.
 *
 * The idol-animation look lives almost entirely here: a large almond opening,
 * a heavy upper lash line that thickens and flicks upward at the outer corner,
 * a tall iris that reads as looking straight at you, and two highlights rather
 * than one — a big soft catchlight plus a small hard sparkle opposite it.
 */
function Eye({ cx, cy, color, flip }: { cx: number; cy: number; color: string; flip: boolean }) {
  const dir = flip ? -1 : 1;
  const id = `${flip ? 'r' : 'l'}-${Math.round(cx)}`;

  return (
    <g transform={flip ? `translate(${cx * 2} 0) scale(-1 1)` : undefined}>
      <defs>
        <clipPath id={`eyeclip-${id}`}>
          <path d={`M${cx - 9} ${cy + 1} C ${cx - 7} ${cy - 8}, ${cx + 3} ${cy - 10}, ${cx + 9} ${cy - 3} C ${cx + 6} ${cy + 6}, ${cx - 4} ${cy + 8}, ${cx - 9} ${cy + 1} Z`} />
        </clipPath>
      </defs>

      {/* White of the eye */}
      <path
        d={`M${cx - 9} ${cy + 1} C ${cx - 7} ${cy - 8}, ${cx + 3} ${cy - 10}, ${cx + 9} ${cy - 3} C ${cx + 6} ${cy + 6}, ${cx - 4} ${cy + 8}, ${cx - 9} ${cy + 1} Z`}
        fill="#fdf8f6"
      />

      <g clipPath={`url(#eyeclip-${id})`}>
        {/* Iris, taller than wide so it fills the opening like a cel drawing. */}
        <ellipse cx={cx + 1} cy={cy - 1} rx="5.4" ry="6.4" fill={color} />
        <ellipse cx={cx + 1} cy={cy + 1.4} rx="5.4" ry="4" fill="#000" opacity="0.16" />
        <ellipse cx={cx + 1} cy={cy - 1} rx="2.7" ry="3.4" fill="#1b1119" />
        {/* Upper lash line, drawn inside the clip so it sits on the eye. */}
        <path
          d={`M${cx - 9} ${cy + 1} C ${cx - 7} ${cy - 8}, ${cx + 3} ${cy - 10}, ${cx + 9} ${cy - 3}`}
          stroke="#1b1119"
          strokeWidth="3.4"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Outer flick, the eyeliner detail. */}
      <path
        d={`M${cx + 7} ${cy - 4} q ${dir * 5} -1.5, ${dir * 7} -4`}
        stroke="#1b1119"
        strokeWidth="2.4"
        fill="none"
        strokeLinecap="round"
      />

      {/* Highlights: one big and soft, one small and hard. */}
      <circle cx={cx - 1.6} cy={cy - 3.6} r="2.3" fill="#fff" />
      <circle cx={cx + 3.4} cy={cy + 2} r="1.1" fill="#fff" opacity="0.85" />

      {/* Lower lash accent — a short line, not a full outline. */}
      <path
        d={`M${cx - 4} ${cy + 6.4} q 4 1.6, 8 -0.6`}
        stroke="#4a2c39"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
        opacity="0.75"
      />
    </g>
  );
}

function Face({ princess }: { princess: Princess }) {
  return (
    <g>
      {/*
       * Brows arch upward from the inner end outward. Raising the inner ends
       * instead reads as a scowl — which is a real risk when chasing a
       * confident idol look, and wrong for a six-year-old's companion. The peak
       * sits above the middle of the eye, which is warm and still defined.
       */}
      <path d="M95 43 C 91 37.5, 84 36.5, 79 41.5" stroke="#33222c" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M105 43 C 109 37.5, 116 36.5, 121 41.5" stroke="#33222c" strokeWidth="2.2" fill="none" strokeLinecap="round" />

      <Eye cx={88} cy={62} color={princess.eyeColor} flip={false} />
      <Eye cx={112} cy={62} color={princess.eyeColor} flip />

      {/* Nose: a suggestion only. Anything more reads as older. */}
      <path d="M100 71 q 2.4 1.6, 0 3" stroke={princess.skinShade} strokeWidth="1.5" fill="none" strokeLinecap="round" />

      {/* Mouth: small, slightly asymmetric smile. */}
      <path d="M95 79 q 5 4.4, 10 -0.6" stroke="#a4444f" strokeWidth="2.1" fill="none" strokeLinecap="round" />
      <path d="M96.5 80.5 q 3.5 2.4, 7 -0.4" stroke="#e08a95" strokeWidth="1.1" fill="none" strokeLinecap="round" opacity="0.8" />

      {/* Blush plus a cheekbone highlight, which is what makes skin read as lit. */}
      <ellipse cx="80" cy="70" rx="5.6" ry="3.2" fill="#f28a9e" opacity="0.35" />
      <ellipse cx="120" cy="70" rx="5.6" ry="3.2" fill="#f28a9e" opacity="0.35" />
      <ellipse cx="81" cy="66" rx="3.4" ry="1.4" fill="#fff" opacity="0.4" />
      <ellipse cx="119" cy="66" rx="3.4" ry="1.4" fill="#fff" opacity="0.4" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Accessories                                                         */
/* ------------------------------------------------------------------ */

function Accessory({ item }: { item: AccessoryReward }) {
  const [light, deep] = item.palette;

  switch (item.type) {
    case 'crown':
      return (
        <g>
          <path d="M78 30 L 84 14 L 92 26 L 100 8 L 108 26 L 116 14 L 122 30 Z" fill={light} stroke={deep} strokeWidth="1.5" strokeLinejoin="round" />
          <rect x="78" y="29" width="44" height="6" rx="3" fill={deep} />
          <circle cx="100" cy="10" r="2.6" fill="#fff" />
        </g>
      );
    case 'binyeo':
      return (
        <g>
          <rect x="82" y="24" width="38" height="3.4" rx="1.7" fill={deep} transform="rotate(-8 100 26)" />
          <circle cx="80" cy="29" r="5" fill={light} stroke={deep} strokeWidth="1.2" />
        </g>
      );
    case 'ribbon':
      return (
        <g>
          <path d="M86 34 q -12 -8, -14 2 q 2 9, 14 4 Z" fill={light} stroke={deep} strokeWidth="1" />
          <path d="M92 34 q 12 -8, 14 2 q -2 9, -14 4 Z" fill={light} stroke={deep} strokeWidth="1" />
          <circle cx="89" cy="36" r="4" fill={deep} />
        </g>
      );
    case 'flower':
      return (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="78" cy="30" rx="5.5" ry="3.4" fill={light} transform={`rotate(${a} 78 30)`} />
          ))}
          <circle cx="78" cy="30" r="3" fill={deep} />
        </g>
      );
    case 'necklace':
      return (
        <g>
          <path d="M88 96 Q 100 110, 112 96" stroke={deep} strokeWidth="2.2" fill="none" />
          <circle cx="100" cy="106" r="4.4" fill={light} stroke={deep} strokeWidth="1.2" />
        </g>
      );
    case 'norigae':
      return (
        <g>
          <circle cx="118" cy="128" r="5" fill={light} stroke={deep} strokeWidth="1.2" />
          <path d="M118 133 L 118 156" stroke={deep} strokeWidth="2.4" />
          <path d="M113 156 q 5 12, 10 0 Z" fill={deep} />
        </g>
      );
    case 'earrings':
      return (
        <g fill={light} stroke={deep} strokeWidth="1">
          <circle cx="74" cy="72" r="3.4" />
          <circle cx="126" cy="72" r="3.4" />
        </g>
      );
    case 'fan':
      return (
        <g transform="translate(150 168) rotate(18)">
          <path d="M0 0 A 30 30 0 0 1 34 14 L 17 30 Z" fill={light} stroke={deep} strokeWidth="1.4" />
          <g stroke={deep} strokeWidth="0.9" opacity="0.7">
            <path d="M17 30 L 6 4" />
            <path d="M17 30 L 20 1" />
            <path d="M17 30 L 31 9" />
          </g>
        </g>
      );
    case 'cape':
      return (
        <path d="M74 104 C 44 150, 34 220, 32 266 L 60 266 C 58 210, 66 152, 82 110 Z M126 104 C 156 150, 166 220, 168 266 L 140 266 C 142 210, 134 152, 118 110 Z" fill={light} opacity="0.92" stroke={deep} strokeWidth="1.2" />
      );
    case 'wings':
      return (
        <g opacity="0.75">
          <path d="M76 108 C 40 92, 20 118, 26 154 C 44 146, 66 132, 78 118 Z" fill={light} stroke={deep} strokeWidth="1.2" />
          <path d="M124 108 C 160 92, 180 118, 174 154 C 156 146, 134 132, 122 118 Z" fill={light} stroke={deep} strokeWidth="1.2" />
        </g>
      );
  }
}

/** Accessories that must be drawn behind the body rather than on top of it. */
const BEHIND: AccessoryReward['type'][] = ['wings', 'cape'];

/* ------------------------------------------------------------------ */

export function PrincessArt({ princess, dress, accessories, size = 260 }: PrincessArtProps) {
  const behind = accessories.filter((a) => BEHIND.includes(a.type));
  const front = accessories.filter((a) => !BEHIND.includes(a.type));

  return (
    <svg viewBox="0 0 200 290" width={size} height={size * 1.45} role="img"
      aria-label={`${princess.name}, wearing ${dress ? dress.name : 'a simple dress'}`}>
      {behind.map((a) => <Accessory key={a.id} item={a} />)}

      <BackHair princess={princess} />

      {/* Neck */}
      <rect x="93" y="82" width="14" height="20" rx="6" fill={princess.skinShade} />

      {dress ? (
        <DressLayer dress={dress} />
      ) : (
        <>
          <path d="M80 150 L 46 264 Q 100 274, 154 264 L 120 150 Z" fill="#e8e4f5" />
          <path d="M78 104 Q 100 98, 122 104 L 119 152 Q 100 157, 81 152 Z" fill="#f4f1fb" />
        </>
      )}

      {/* Arms, drawn after the bodice so sleeves sit correctly. */}
      <g fill={princess.skin}>
        <path d="M78 106 C 66 126, 62 148, 64 168 q 6 3, 10 0 C 74 148, 78 128, 86 112 Z" />
        <path d="M122 106 C 134 126, 138 148, 136 168 q -6 3, -10 0 C 126 148, 122 128, 114 112 Z" />
        <circle cx="69" cy="171" r="5.4" />
        <circle cx="131" cy="171" r="5.4" />
      </g>

      {/* Head. A soft heart shape with a defined jaw and chin rather than a
          plain circle — the single biggest thing that separates a stylised
          idol-animation face from a generic cute one. */}
      <path
        d="M100 30 C 119 30, 128 43, 128 58 C 128 68, 125 76, 119 82 C 113 88, 106 92, 100 93 C 94 92, 87 88, 81 82 C 75 76, 72 68, 72 58 C 72 43, 81 30, 100 30 Z"
        fill={princess.skin}
      />
      <path d="M100 93 C 106 92, 113 88, 119 82 C 114 86, 107 89, 100 90 C 93 89, 86 86, 81 82 C 87 88, 94 92, 100 93 Z" fill={princess.skinShade} opacity="0.4" />

      <Face princess={princess} />

      {/* Ears, kept small and tucked so the hair reads as the silhouette. */}
      <g fill={princess.skin}>
        <ellipse cx="72" cy="63" rx="3.6" ry="5.4" />
        <ellipse cx="128" cy="63" rx="3.6" ry="5.4" />
      </g>

      <FrontHair princess={princess} />

      {front.map((a) => <Accessory key={a.id} item={a} />)}
    </svg>
  );
}
