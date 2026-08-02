import type { Princess } from '../content/princesses';
import type { AccessoryReward, DressReward } from '../content/rewards';

/**
 * The princess, drawn in SVG.
 *
 * Deliberately chibi: the head is roughly a third of the total height and the
 * body is a simple rounded bell. An earlier version used near-realistic
 * proportions, which meant drawing shoulders, arms, a neck and a waist — a
 * dozen opportunities for hand-placed curves to look wrong, and they did.
 * Large head, tiny body, no visible joints is both more appealing and far more
 * robust, and it stays readable at the 60px used in the profile picker.
 *
 * Canvas: 200 x 270. Head centred at (100, 78) with a 50 unit radius, dress
 * from y=138 to the hem at y=240.
 */

interface PrincessArtProps {
  princess: Princess;
  dress: DressReward | null;
  accessories: AccessoryReward[];
  size?: number;
}

const HEAD_CX = 100;
const HEAD_CY = 64;
const HEAD_RX = 39;
const HEAD_RY = 44;

/* ------------------------------------------------------------------ */
/* Dress                                                               */
/* ------------------------------------------------------------------ */

/** Skirt outline. Shoulders sit at y=124, hem at y=254. */
function skirtPath(silhouette: DressReward['silhouette']): string {
  switch (silhouette) {
    case 'hanbok':
      // Chima: gathered high under the bust and very full — the defining shape.
      return 'M74 136 C 48 168, 36 210, 34 252 Q 100 268, 166 252 C 164 210, 152 168, 126 136 Z';
    case 'ballgown':
      return 'M76 158 C 54 184, 40 214, 38 252 Q 100 268, 162 252 C 160 214, 146 184, 124 158 Z';
    case 'aline':
      return 'M78 158 L 50 252 Q 100 264, 150 252 L 122 158 Z';
    case 'tiered':
      return 'M78 158 C 64 178, 56 196, 54 212 Q 100 224, 146 212 C 144 196, 136 178, 122 158 Z';
    case 'wrap':
      return 'M77 158 C 58 188, 46 216, 44 252 Q 100 266, 156 252 C 154 216, 142 188, 123 158 Z';
  }
}

/** Bodice. Hanbok uses a short jeogori jacket rather than a long bodice. */
function bodicePath(silhouette: DressReward['silhouette']): string {
  if (silhouette === 'hanbok') {
    return 'M72 124 Q 100 116, 128 124 L 129 140 Q 100 148, 71 140 Z';
  }
  return 'M74 124 Q 100 116, 126 124 L 124 160 Q 100 167, 76 160 Z';
}

function DressLayer({ dress }: { dress: DressReward }) {
  const [light, mid, deep] = dress.palette;
  const { silhouette, trim } = dress;
  const uid = dress.id;

  return (
    <g>
      <defs>
        <linearGradient id={`sk-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={mid} />
          <stop offset="100%" stopColor={deep} />
        </linearGradient>
        <linearGradient id={`bo-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light} />
          <stop offset="100%" stopColor={mid} />
        </linearGradient>
      </defs>

      <path d={skirtPath(silhouette)} fill={`url(#sk-${uid})`} />

      {silhouette === 'tiered' ? (
        <>
          <path d="M52 212 Q 100 226, 148 212 C 147 226, 143 234, 141 242 Q 100 254, 59 242 C 57 234, 53 226, 52 212 Z" fill={mid} />
          <path d="M58 234 Q 100 246, 142 234 C 142 238, 141 240, 141 244 Q 100 256, 59 244 C 59 240, 58 238, 58 234 Z" fill={light} opacity="0.9" />
        </>
      ) : null}

      {silhouette === 'hanbok' ? (
        <g stroke={deep} strokeWidth="1.2" opacity="0.3" fill="none">
          <path d="M64 178 C 54 202, 46 224, 44 240" />
          <path d="M82 166 C 78 198, 74 220, 73 244" />
          <path d="M100 162 L 100 248" />
          <path d="M118 166 C 122 198, 126 220, 127 244" />
          <path d="M136 178 C 146 202, 154 224, 156 240" />
        </g>
      ) : null}

      <path d={bodicePath(silhouette)} fill={`url(#bo-${uid})`} />

      {silhouette === 'wrap' ? (
        <path d="M73 142 L 126 162 L 126 170 Q 100 177, 74 170 Z" fill={deep} opacity="0.45" />
      ) : null}

      {/* Goreum — the long ribbon tied at the front of a hanbok. */}
      {silhouette === 'hanbok' ? (
        <g>
          <path d="M100 150 q -9 3, -7 13 q 6 -7, 11 -4 q 6 -7, 11 3 q 3 -11, -7 -12 Z" fill={deep} />
          <path d="M104 161 C 107 182, 105 200, 100 216" stroke={deep} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        </g>
      ) : null}

      {trim === 'lace' ? (
        <g fill={light} opacity="0.92">
          {Array.from({ length: 10 }, (_, i) => (
            <circle key={i} cx={44 + i * 13} cy={239 - Math.abs(i - 4.5) * 1.2} r="5" />
          ))}
        </g>
      ) : null}

      {trim === 'ribbon' && silhouette !== 'hanbok' ? (
        <rect x="72" y="162" width="56" height="9" rx="4.5" fill={deep} />
      ) : null}

      {trim === 'fur' ? (
        <g fill="#fffdf8">
          <path d="M70 140 Q 100 130, 130 140 Q 100 152, 70 140 Z" />
          {Array.from({ length: 8 }, (_, i) => (
            <circle key={i} cx={48 + i * 15} cy={238} r="7" />
          ))}
        </g>
      ) : null}

      {trim === 'sparkle' ? (
        <g fill="#fffdf5" opacity="0.92">
          {[[70, 200], [130, 188], [100, 222], [56, 226], [146, 222], [112, 240], [86, 182]].map(
            ([x, y], i) => (
              <path
                key={i}
                d={`M${x} ${y - 6} L${x + 2} ${y - 2} L${x + 6} ${y} L${x + 2} ${y + 2} L${x} ${y + 6} L${x - 2} ${y + 2} L${x - 6} ${y} L${x - 2} ${y - 2} Z`}
              />
            ),
          )}
        </g>
      ) : null}
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Hair                                                                */
/* ------------------------------------------------------------------ */

/**
 * Hair behind the head. One clean silhouette per style rather than several
 * overlapping paths — the previous version's stacked shapes produced lumpy
 * edges and spikes at the temples.
 */
function BackHair({ princess }: { princess: Princess }) {
  const { hair, hairColor } = princess;

  switch (hair) {
    case 'long':
      return <path d="M100 17 C 140 17, 146 48, 145 78 C 144 112, 142 146, 139 174 C 134 178, 127 178, 123 174 C 127 142, 129 106, 125 78 C 115 90, 85 90, 75 78 C 71 106, 73 142, 77 174 C 73 178, 66 178, 61 174 C 58 146, 56 112, 55 78 C 54 48, 60 17, 100 17 Z" fill={hairColor} />;
    case 'wavy':
      return <path d="M100 17 C 140 17, 146 48, 145 78 C 144 104, 149 124, 141 142 C 145 156, 137 166, 131 170 C 131 138, 129 104, 125 78 C 115 90, 85 90, 75 78 C 71 104, 69 138, 69 170 C 63 166, 55 156, 59 142 C 51 124, 56 104, 55 78 C 54 48, 60 17, 100 17 Z" fill={hairColor} />;
    case 'braid':
      return <path d="M100 17 C 140 17, 146 48, 145 78 C 144 98, 142 116, 140 130 C 135 134, 128 134, 124 130 C 127 110, 129 94, 125 78 C 115 90, 85 90, 75 78 C 71 94, 73 110, 76 130 C 72 134, 65 134, 60 130 C 58 116, 56 98, 55 78 C 54 48, 60 17, 100 17 Z" fill={hairColor} />;
    case 'bun':
      return <path d="M100 17 C 140 17, 146 48, 145 78 C 144 92, 142 104, 140 114 C 135 118, 128 118, 124 114 C 127 100, 127 90, 125 78 C 115 90, 85 90, 75 78 C 73 90, 73 100, 76 114 C 72 118, 65 118, 60 114 C 58 104, 56 92, 55 78 C 54 48, 60 17, 100 17 Z" fill={hairColor} />;
    case 'halfUp':
      return <path d="M100 17 C 140 17, 146 48, 145 78 C 144 108, 142 134, 139 158 C 134 162, 127 162, 123 158 C 127 130, 129 104, 125 78 C 115 90, 85 90, 75 78 C 71 104, 73 130, 77 158 C 73 162, 66 162, 61 158 C 58 134, 56 108, 55 78 C 54 48, 60 17, 100 17 Z" fill={hairColor} />;
  }
}

/**
 * Fringe and crown. A soft side-swept parting with a couple of separated
 * strands, which is what stops hair reading as a solid helmet.
 */
function FrontHair({ princess }: { princess: Princess }) {
  const { hair, hairColor, hairShine, streak } = princess;

  return (
    <g>
      {/* Centre-parted fringe sweeping to both sides, ending above the brows.
          A doll's hairline is neat and shows the forehead. */}
      <path d="M100 18 C 139 18, 145 46, 144 66 C 140 50, 132 39, 118 35 C 111 42, 89 44, 77 39 C 67 44, 60 53, 56 66 C 55 46, 61 18, 100 18 Z" fill={hairColor} />
      <path d="M100 20 C 112 26, 122 33, 128 41 C 118 33, 108 28, 100 26 Z" fill={hairShine} opacity="0.35" />

      {/* Side locks hugging the face, following the head curve rather than
          sticking out from it. */}
      <path d="M57 66 C 53 86, 53 106, 57 122 C 60 106, 60 86, 62 70 Z" fill={hairColor} />
      <path d="M143 66 C 147 86, 147 106, 143 122 C 140 106, 140 86, 138 70 Z" fill={hairColor} />

      {/* The dyed streak: one lock, falling *outside* the jaw rather than over
          the cheek. Crossing the face made it read as a mark on her skin. */}
      <path d="M124 34 C 133 42, 140 54, 142 68 C 141 90, 142 108, 144 122 C 140 106, 138 84, 135 65 C 132 50, 128 40, 124 34 Z" fill={streak} opacity="0.9" />

      {hair === 'bun' ? (
        <>
          {/* Smaller, set back and tucked behind the crown of the head. At full
              size and centred it read as a hat sitting on top of her. */}
          <ellipse cx="100" cy="19" rx="15" ry="12" fill={hairColor} />
          <ellipse cx="100" cy="19" rx="15" ry="12" fill={streak} opacity="0.2" />
          <ellipse cx="95" cy="15" rx="6" ry="3.5" fill={hairShine} opacity="0.55" />
          {/* Strands sweeping up into it, so it grows out of the hair. */}
          <path d="M84 30 C 90 22, 110 22, 116 30 C 108 26, 92 26, 84 30 Z" fill={hairColor} />
        </>
      ) : null}

      {hair === 'braid' ? (
        <g fill={hairColor}>
          {Array.from({ length: 5 }, (_, i) => (
            <ellipse key={i} cx={140 - i * 2} cy={132 + i * 15} rx={10 - i * 0.9} ry="9" />
          ))}
          <ellipse cx="138" cy="147" rx="8" ry="7" fill={streak} opacity="0.65" />
          <circle cx="132" cy="205" r="5.5" fill={streak} />
        </g>
      ) : null}

      {/* Gloss across the crown — the single detail that most makes stylised
          hair look drawn rather than filled. */}
      <path d="M76 32 C 86 24, 114 24, 124 32 C 112 28, 88 28, 76 32 Z" fill={hairShine} opacity="0.85" />
      <path d="M68 46 C 77 33, 90 28, 100 28 C 88 33, 78 40, 70 52 Z" fill={hairShine} opacity="0.45" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Face                                                                */
/* ------------------------------------------------------------------ */

/**
 * One eye, mirrored by the caller.
 *
 * The lash line is a single filled shape, not a stroke with separate hairs
 * drawn on top. Individual lash strokes were the thing that looked wrong: they
 * float off the eyelid like legs. In hand-drawn animation the upper lashes are
 * one continuous mass that starts thin at the inner corner, thickens across the
 * lid, and tapers to a point past the outer corner — with the individual hairs
 * as clumps growing out of that mass rather than free-standing marks.
 *
 * The iris is large and sits high, with a big catchlight and a smaller opposite
 * one. Everything else is kept soft so the eye is the only heavy feature.
 */
function Eye({
  cx,
  cy,
  color,
  side,
}: {
  cx: number;
  cy: number;
  color: string;
  side: 'left' | 'right';
}) {
  const id = `eye-${Math.round(cx)}`;
  const outline = `M${cx - 12} ${cy + 1} C ${cx - 10} ${cy - 9}, ${cx + 3} ${cy - 11}, ${cx + 12} ${cy - 4} C ${cx + 8} ${cy + 8}, ${cx - 5} ${cy + 9}, ${cx - 12} ${cy + 1} Z`;

  /**
   * The lash mass: along the top of the eye, out to a flick, and back
   * underneath — thicker at the outer end than the inner.
   */
  const lashMass =
    `M${cx - 12} ${cy + 1} ` +
    `C ${cx - 10} ${cy - 9}, ${cx + 3} ${cy - 11}, ${cx + 12} ${cy - 4} ` +
    `L ${cx + 19} ${cy - 10} ` +
    `C ${cx + 17} ${cy - 3}, ${cx + 15} ${cy - 1}, ${cx + 11} ${cy - 0.5} ` +
    `C ${cx + 3} ${cy - 6}, ${cx - 7} ${cy - 4}, ${cx - 12} ${cy + 1} Z`;

  /**
   * A second, shorter flick just inside the main one — both sweeping up and
   * *outward* at roughly the same shallow angle.
   *
   * Clumps rising vertically from the middle of the lid was the previous
   * mistake and it read as horns. Real lashes fan outward along the line of the
   * eye, and they only bunch at the outer corner; over the centre of the lid
   * they are short enough to be part of the mass.
   */
  const lashClumps = [
    `M${cx + 8.5} ${cy - 7.8} C ${cx + 11} ${cy - 10.5}, ${cx + 13} ${cy - 12.5}, ${cx + 15.5} ${cy - 14} ` +
      `C ${cx + 13.5} ${cy - 10.5}, ${cx + 12} ${cy - 8.6}, ${cx + 10.5} ${cy - 6.6} Z`,
  ];

  return (
    // Drawn flicking outward to the right, then mirrored in place for the eye
    // on the left, so both flicks point away from the nose.
    <g
      transform={side === 'left' ? `translate(${cx * 2} 0) scale(-1 1)` : undefined}
    >
      <defs>
        <clipPath id={id}>
          <path d={outline} />
        </clipPath>
        <linearGradient id={`iris-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#000" stopOpacity="0.35" />
          <stop offset="55%" stopColor={color} />
          <stop offset="100%" stopColor="#fff" stopOpacity="0.45" />
        </linearGradient>
      </defs>

      <path d={outline} fill="#fffcfa" />

      <g clipPath={`url(#${id})`}>
        {/* A large iris sitting high in the opening, the way an animated eye is
            drawn — a small iris floating in white reads as startled. */}
        <ellipse cx={cx + 0.5} cy={cy - 1.5} rx="8" ry="9.2" fill={color} />
        <ellipse cx={cx + 0.5} cy={cy - 1.5} rx="8" ry="9.2" fill={`url(#iris-${id})`} />
        <ellipse
          cx={cx + 0.5}
          cy={cy - 1.5}
          rx="8"
          ry="9.2"
          fill="none"
          stroke="#2a1420"
          strokeWidth="1.4"
          opacity="0.5"
        />
        <ellipse cx={cx + 0.5} cy={cy - 1} rx="3.6" ry="4.4" fill="#170e15" />
        {/* Shadow cast by the lid onto the top of the eye. */}
        <ellipse cx={cx} cy={cy - 11} rx="14" ry="6" fill="#2a1420" opacity="0.22" />
      </g>

      {/* Soft crease well above the lash line, so the two do not merge. */}
      <path
        d={`M${cx - 7} ${cy - 11} C ${cx - 4} ${cy - 15}, ${cx + 5} ${cy - 15.5}, ${cx + 11} ${cy - 11}`}
        stroke="#a9707e"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* The lash line and its clumps, filled rather than stroked. */}
      <path d={lashMass} fill="#1b1018" />
      {lashClumps.map((d, i) => (
        <path key={i} d={d} fill="#1b1018" />
      ))}

      {/*
       * No lower lashes at all. Small dark marks under the eye read as
       * scratches or tear tracks at this scale, and animated faces almost
       * always leave the lower lid open — it is what keeps the eye looking
       * bright rather than ringed and tired. A faint warm line is enough to
       * suggest the lid.
       */}
      <path
        d={`M${cx - 6} ${cy + 7} C ${cx - 2} ${cy + 9.4}, ${cx + 4} ${cy + 9}, ${cx + 9} ${cy + 5.6}`}
        stroke="#c08a92"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />

      <circle cx={cx - 2.5} cy={cy - 5} r="3.1" fill="#fff" />
      <circle cx={cx + 4.5} cy={cy + 2} r="1.5" fill="#fff" opacity="0.92" />
    </g>
  );
}

function Face({ princess }: { princess: Princess }) {
  return (
    <g>
      {/*
       * Brows are thin, set high and tapered — thick at the inner end, fading
       * to a fine point past the arch. A brow of even weight reads as drawn on
       * with a marker, and the gap above the eye is what makes the eye look
       * large, so they sit well clear of the lash line.
       */}
      <path
        d="M92 47.5 C 87.5 42, 78.5 40.2, 72.5 44.5 C 78.5 42.8, 86.5 44.6, 92 47.5 Z"
        fill="#6b4a52"
        opacity="0.7"
      />
      <path
        d="M108 47.5 C 112.5 42, 121.5 40.2, 127.5 44.5 C 121.5 42.8, 113.5 44.6, 108 47.5 Z"
        fill="#6b4a52"
        opacity="0.7"
      />

      <Eye cx={83} cy={67} color={princess.eyeColor} side="left" />
      <Eye cx={117} cy={67} color={princess.eyeColor} side="right" />

      {/* Nose: one soft shadow under the tip and nothing else. Any outline at
          this scale ages the face immediately. */}
      <path
        d="M97.5 81 q 2.5 2, 5 0"
        stroke={princess.skinShade}
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.85"
      />

      {/*
       * A small mouth with a pronounced cupid's bow and a fuller lower lip.
       * Width matters more than anything here: a mouth as wide as the gap
       * between the eyes looks adult, so this one is deliberately narrow.
       */}
      <path
        d="M92.5 88.5 C 95 85.8, 97.5 85.6, 100 87.4 C 102.5 85.6, 105 85.8, 107.5 88.5
           C 105 93.8, 102 96, 100 96 C 98 96, 95 93.8, 92.5 88.5 Z"
        fill="#dd6274"
      />
      {/* Lip line, lighter in the middle so the mouth reads as slightly open. */}
      <path d="M92.5 88.5 C 96 90.2, 104 90.2, 107.5 88.5" stroke="#b04354" strokeWidth="0.9" fill="none" opacity="0.65" />
      <ellipse cx="102" cy="92" rx="3" ry="1.3" fill="#fff" opacity="0.45" />
      <ellipse cx="97.5" cy="87" rx="2" ry="0.9" fill="#fff" opacity="0.3" />

      {/* Blush, plus cheekbone and jaw contour — what makes a doll face read as
          sculpted rather than flat. */}
      <ellipse cx="72" cy="78" rx="8.5" ry="5" fill="#ef8296" opacity="0.32" transform="rotate(-12 72 78)" />
      <ellipse cx="128" cy="78" rx="8.5" ry="5" fill="#ef8296" opacity="0.32" transform="rotate(12 128 78)" />
      <ellipse cx="74" cy="71" rx="5" ry="2" fill="#fff" opacity="0.35" transform="rotate(-14 74 71)" />
      <ellipse cx="126" cy="71" rx="5" ry="2" fill="#fff" opacity="0.35" transform="rotate(14 126 71)" />
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
          <path d="M70 30 L 78 8 L 90 24 L 100 0 L 110 24 L 122 8 L 130 30 Z" fill={light} stroke={deep} strokeWidth="2" strokeLinejoin="round" />
          <rect x="70" y="28" width="60" height="8" rx="4" fill={deep} />
          <circle cx="100" cy="3" r="3.4" fill="#fff" />
        </g>
      );
    case 'binyeo':
      return (
        <g>
          <rect x="76" y="16" width="48" height="4.4" rx="2.2" fill={deep} transform="rotate(-8 100 18)" />
          <circle cx="74" cy="22" r="6.5" fill={light} stroke={deep} strokeWidth="1.5" />
        </g>
      );
    case 'ribbon':
      return (
        <g transform="translate(0 -4)">
          <path d="M56 40 q -16 -11, -19 3 q 3 12, 19 5 Z" fill={light} stroke={deep} strokeWidth="1.3" />
          <path d="M64 40 q 16 -11, 19 3 q -3 12, -19 5 Z" fill={light} stroke={deep} strokeWidth="1.3" />
          <circle cx="60" cy="43" r="5.4" fill={deep} />
        </g>
      );
    case 'flower':
      return (
        <g transform="translate(-6 -2)">
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="58" cy="44" rx="7.5" ry="4.6" fill={light} transform={`rotate(${a} 58 44)`} />
          ))}
          <circle cx="58" cy="44" r="4" fill={deep} />
        </g>
      );
    case 'necklace':
      return (
        <g>
          <path d="M84 136 Q 100 152, 116 136" stroke={deep} strokeWidth="2.8" fill="none" />
          <circle cx="100" cy="148" r="5.6" fill={light} stroke={deep} strokeWidth="1.4" />
        </g>
      );
    case 'norigae':
      return (
        <g>
          <circle cx="124" cy="164" r="6" fill={light} stroke={deep} strokeWidth="1.4" />
          <path d="M124 170 L 124 194" stroke={deep} strokeWidth="2.8" />
          <path d="M118 194 q 6 14, 12 0 Z" fill={deep} />
        </g>
      );
    case 'earrings':
      return (
        <g fill={light} stroke={deep} strokeWidth="1.2">
          <circle cx="50" cy="96" r="4.6" />
          <circle cx="150" cy="96" r="4.6" />
        </g>
      );
    case 'fan':
      return (
        <g transform="translate(150 186) rotate(16)">
          <path d="M0 0 A 34 34 0 0 1 38 16 L 19 34 Z" fill={light} stroke={deep} strokeWidth="1.6" />
          <g stroke={deep} strokeWidth="1" opacity="0.7">
            <path d="M19 34 L 7 5" />
            <path d="M19 34 L 23 1" />
            <path d="M19 34 L 35 10" />
          </g>
        </g>
      );
    case 'cape':
      return (
        <path d="M70 140 C 40 180, 30 218, 28 240 L 56 240 C 54 200, 60 168, 78 146 Z M130 140 C 160 180, 170 218, 172 240 L 144 240 C 146 200, 140 168, 122 146 Z" fill={light} opacity="0.9" stroke={deep} strokeWidth="1.4" />
      );
    case 'wings':
      return (
        <g opacity="0.75">
          <path d="M72 146 C 34 128, 12 156, 18 194 C 38 184, 60 168, 74 154 Z" fill={light} stroke={deep} strokeWidth="1.4" />
          <path d="M128 146 C 166 128, 188 156, 182 194 C 162 184, 140 168, 126 154 Z" fill={light} stroke={deep} strokeWidth="1.4" />
        </g>
      );
    case 'shoes':
      /*
       * Drawn in front of the hem and standing clear of it. Tucked behind the
       * skirt they were technically correct and completely invisible, which is
       * a poor reward for something a child chose on purpose.
       */
      return (
        <g>
          <ellipse cx="100" cy="256" rx="42" ry="9" fill="#000" opacity="0.18" />
          {[80, 120].map((x) => (
            <g key={x}>
              {/* A little ankle, so the shoe reads as worn rather than placed. */}
              <rect x={x - 5} y={240} width="10" height="14" rx="4" fill="#f2cdb0" />
              <path
                d={`M${x - 12} 254 q 12 -8, 24 0 q 2 10, -12 11 q -14 -1, -12 -11 Z`}
                fill={light}
                stroke={deep}
                strokeWidth="1.6"
              />
              <path d={`M${x - 11} 258 q 11 4, 22 0`} stroke={deep} strokeWidth="1.4" fill="none" opacity="0.7" />
              <ellipse cx={x - 4} cy={256} rx="4" ry="2" fill="#fff" opacity="0.45" />
              <path d={`M${x + 8} 265 l 3 6`} stroke={deep} strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
        </g>
      );
    case 'bag':
      // Held at the side, hanging from the hand.
      return (
        <g>
          <path d="M124 196 q 8 -12, 16 0" stroke={deep} strokeWidth="2" fill="none" />
          <rect x="122" y="196" width="20" height="16" rx="5" fill={light} stroke={deep} strokeWidth="1.4" />
          <rect x="122" y="202" width="20" height="3" fill={deep} opacity="0.5" />
        </g>
      );
    case 'makeup':
      // Worn rather than carried: a wash of colour on the lids and lips.
      return (
        <g>
          <ellipse cx="84" cy="60" rx="9" ry="4" fill={light} opacity="0.5" />
          <ellipse cx="116" cy="60" rx="9" ry="4" fill={light} opacity="0.5" />
          <path
            d="M90 88 C 93 85.5, 96.5 85, 100 87 C 103.5 85, 107 85.5, 110 88 C 106.5 93.5, 102.5 95.5, 100 95.5 C 97.5 95.5, 93.5 93.5, 90 88 Z"
            fill={deep}
            opacity="0.85"
          />
          <ellipse cx="102" cy="91.4" rx="3.6" ry="1.6" fill="#fff" opacity="0.7" />
        </g>
      );
  }
}

const BEHIND: AccessoryReward['type'][] = ['wings', 'cape'];

/* ------------------------------------------------------------------ */

export function PrincessArt({ princess, dress, accessories, size = 240 }: PrincessArtProps) {
  const behind = accessories.filter((a) => BEHIND.includes(a.type));
  const front = accessories.filter((a) => !BEHIND.includes(a.type));

  return (
    <svg
      viewBox="0 0 200 272"
      width={size}
      height={size * 1.36}
      role="img"
      aria-label={`${princess.name}, wearing ${dress ? dress.name : 'a simple dress'}`}
    >
      {behind.map((a) => <Accessory key={a.id} item={a} />)}

      <BackHair princess={princess} />

      {/* Neck and shoulders, drawn before the dress so the neckline sits on top. */}
      <path d="M91 96 L 109 96 L 109 118 Q 100 124, 91 118 Z" fill={princess.skinShade} />
      <path d="M91 96 L 109 96 L 109 106 Q 100 112, 91 106 Z" fill="#000" opacity="0.12" />
      <path d="M74 126 Q 100 116, 126 126 L 126 132 Q 100 124, 74 132 Z" fill={princess.skin} />

      {dress ? (
        <DressLayer dress={dress} />
      ) : (
        <>
          <path d="M78 158 L 50 252 Q 100 264, 150 252 L 122 158 Z" fill="#ded8ef" />
          <path d="M74 124 Q 100 116, 126 124 L 124 160 Q 100 167, 76 160 Z" fill="#efecf8" />
        </>
      )}

      {/* Slim arms at the sides. Kept close to the body: a doll figure reads by
          silhouette, and arms held away from it break that line. */}
      <g fill={princess.skin}>
        <path d="M76 128 C 68 148, 64 170, 65 190 q 5 2, 9 0 C 74 170, 78 150, 84 132 Z" />
        <path d="M124 128 C 132 148, 136 170, 135 190 q -5 2, -9 0 C 126 170, 122 150, 116 132 Z" />
        <ellipse cx="69.5" cy="193" rx="5" ry="6" />
        <ellipse cx="130.5" cy="193" rx="5" ry="6" />
      </g>

      {/* Head last of the body parts, so hair and dress tuck behind it. */}
      <ellipse cx={HEAD_CX} cy={HEAD_CY} rx={HEAD_RX} ry={HEAD_RY} fill={princess.skin} />
      {/* Tapered jaw and chin, which is what separates a doll face from a ball. */}
      <path d="M63 76 C 68 96, 84 108, 100 108 C 116 108, 132 96, 137 76 C 133 94, 118 104, 100 104 C 82 104, 67 94, 63 76 Z" fill={princess.skinShade} opacity="0.35" />
      <ellipse cx="100" cy="44" rx="20" ry="10" fill="#fff" opacity="0.16" />

      <Face princess={princess} />
      <FrontHair princess={princess} />

      {front.map((a) => <Accessory key={a.id} item={a} />)}
    </svg>
  );
}
