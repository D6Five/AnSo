import type { RoomReward, RoomSlot } from '../content/rewards';
import type { Princess } from '../content/princesses';

/**
 * The princess's room, drawn in SVG.
 *
 * Every earned item appears in its own fixed spot, so the room fills in as the
 * curriculum is worked through. Placement is automatic rather than drag-and-drop:
 * a six-year-old gets the satisfaction of a room that visibly becomes hers
 * without a fiddly layout tool standing in the way.
 */

interface RoomArtProps {
  princess: Princess;
  items: RoomReward[];
  width?: number;
}

/** Drawing order, back of the room to the front. */
const DEPTH: RoomSlot[] = [
  'canopy', 'window', 'curtain', 'art', 'banner', 'clock', 'lights',
  'shelf', 'bed', 'desk', 'mirror', 'rug', 'lamp', 'plant', 'books',
  'tea', 'cushion', 'pet',
];

function Item({ item }: { item: RoomReward }) {
  const [light, deep] = item.palette;

  switch (item.slot) {
    case 'canopy':
      return (
        <g>
          <path d="M0 0 L400 0 L400 34 Q 200 58, 0 34 Z" fill={deep} opacity="0.55" />
          <g fill="#fff8dc">
            {[[40, 22], [92, 34], [148, 18], [206, 38], [262, 22], [318, 36], [366, 20]].map(([x, y], i) => (
              <path key={i} d={`M${x} ${y - 4} l1.4 2.8 l3 .6 l-2.2 2.2 l.6 3 l-2.8 -1.5 l-2.8 1.5 l.6 -3 l-2.2 -2.2 l3 -.6 Z`} />
            ))}
          </g>
        </g>
      );

    case 'window':
      return (
        <g>
          <circle cx="72" cy="66" r="34" fill={light} stroke="#fff" strokeWidth="5" />
          <circle cx="72" cy="66" r="34" fill="none" stroke={deep} strokeWidth="2" />
          <path d="M72 32 L72 100 M38 66 L106 66" stroke="#fff" strokeWidth="3.5" />
          <circle cx="60" cy="52" r="4" fill="#fffbe8" opacity="0.9" />
          <circle cx="86" cy="78" r="2.6" fill="#fffbe8" opacity="0.8" />
        </g>
      );

    case 'curtain':
      return (
        <g fill={deep} opacity="0.9">
          <path d="M22 18 C 34 60, 30 110, 24 140 L 6 140 C 12 100, 12 56, 8 18 Z" />
          <path d="M122 18 C 110 60, 114 110, 120 140 L 138 140 C 132 100, 132 56, 136 18 Z" />
          <path d="M8 18 L136 18 L136 28 L8 28 Z" fill={light} />
        </g>
      );

    case 'art':
      return (
        <g>
          <rect x="286" y="34" width="62" height="48" rx="4" fill="#f6efe4" stroke={deep} strokeWidth="3.5" />
          <path d="M290 74 L 306 54 L 318 68 L 332 46 L 344 74 Z" fill={light} />
          <circle cx="300" cy="47" r="5" fill="#fbd98f" />
        </g>
      );

    case 'banner':
      return (
        <g>
          <path d="M176 8 L 224 8 L 224 52 L 200 42 L 176 52 Z" fill={light} stroke={deep} strokeWidth="2" />
          <circle cx="200" cy="24" r="7" fill={deep} opacity="0.55" />
        </g>
      );

    case 'clock':
      return (
        <g>
          <circle cx="358" cy="30" r="15" fill="#fffdf6" stroke={deep} strokeWidth="3" />
          <path d="M358 30 L358 21 M358 30 L365 33" stroke={deep} strokeWidth="2.2" strokeLinecap="round" />
        </g>
      );

    case 'lights':
      return (
        <g>
          <path d="M0 14 Q 100 42, 200 16 Q 300 42, 400 14" stroke={deep} strokeWidth="1.6" fill="none" opacity="0.6" />
          {Array.from({ length: 14 }, (_, i) => {
            const x = 14 + i * 28;
            const y = 14 + Math.sin((i / 13) * Math.PI * 2) * 13 + 12;
            return <circle key={i} cx={x} cy={y} r="4" fill={light} opacity="0.95" />;
          })}
        </g>
      );

    case 'shelf':
      return (
        <g fill={deep}>
          <rect x="256" y="96" width="96" height="6" rx="3" />
          <rect x="256" y="130" width="96" height="6" rx="3" />
          <g fill={light}>
            <rect x="264" y="76" width="9" height="20" rx="2" />
            <rect x="276" y="82" width="9" height="14" rx="2" />
            <rect x="288" y="72" width="9" height="24" rx="2" />
            <rect x="306" y="80" width="9" height="16" rx="2" />
            <rect x="268" y="112" width="9" height="18" rx="2" />
            <rect x="280" y="108" width="9" height="22" rx="2" />
          </g>
        </g>
      );

    case 'bed':
      return (
        <g>
          <rect x="18" y="150" width="132" height="42" rx="8" fill={deep} />
          <rect x="18" y="140" width="132" height="20" rx="9" fill={light} />
          <rect x="26" y="128" width="42" height="24" rx="9" fill="#fffdf8" />
          <rect x="10" y="112" width="10" height="82" rx="5" fill={deep} />
          <rect x="148" y="112" width="10" height="82" rx="5" fill={deep} />
          <path d="M10 116 Q 84 96, 158 116 L 158 124 Q 84 106, 10 124 Z" fill={light} />
        </g>
      );

    case 'desk':
      return (
        <g fill={deep}>
          <rect x="284" y="142" width="94" height="8" rx="4" />
          <rect x="290" y="150" width="8" height="42" rx="3" />
          <rect x="364" y="150" width="8" height="42" rx="3" />
          <rect x="302" y="124" width="26" height="18" rx="3" fill={light} />
          <rect x="336" y="132" width="14" height="10" rx="2" fill={light} />
        </g>
      );

    case 'mirror':
      return (
        <g>
          <ellipse cx="376" cy="126" rx="19" ry="30" fill="#eaf4fb" stroke={deep} strokeWidth="4" />
          <path d="M366 108 Q 372 124, 366 142" stroke="#fff" strokeWidth="4" fill="none" opacity="0.8" />
        </g>
      );

    case 'rug':
      return (
        <g>
          <ellipse cx="204" cy="216" rx="106" ry="30" fill={deep} />
          <ellipse cx="204" cy="216" rx="84" ry="22" fill={light} />
          <ellipse cx="204" cy="216" rx="52" ry="13" fill={deep} opacity="0.55" />
        </g>
      );

    case 'lamp':
      return (
        <g>
          <rect x="176" y="150" width="6" height="46" rx="3" fill={deep} />
          <path d="M162 150 L 196 150 L 190 126 L 168 126 Z" fill={light} />
          <ellipse cx="179" cy="196" rx="16" ry="5" fill={deep} />
          <ellipse cx="179" cy="150" rx="24" ry="10" fill="#fff6d8" opacity="0.35" />
        </g>
      );

    case 'plant':
      return (
        <g>
          <path d="M24 196 L 52 196 L 48 176 L 28 176 Z" fill={deep} />
          <g fill={light}>
            <ellipse cx="30" cy="164" rx="8" ry="14" transform="rotate(-24 30 164)" />
            <ellipse cx="46" cy="162" rx="8" ry="15" transform="rotate(22 46 162)" />
            <ellipse cx="38" cy="152" rx="7" ry="16" />
          </g>
        </g>
      );

    case 'books':
      return (
        <g>
          <rect x="238" y="182" width="34" height="8" rx="2" fill={light} />
          <rect x="240" y="174" width="30" height="8" rx="2" fill={deep} />
          <rect x="243" y="166" width="26" height="8" rx="2" fill={light} />
        </g>
      );

    case 'tea':
      return (
        <g>
          <rect x="140" y="196" width="60" height="7" rx="3.5" fill={deep} />
          <rect x="146" y="203" width="6" height="16" rx="2" fill={deep} />
          <rect x="188" y="203" width="6" height="16" rx="2" fill={deep} />
          <circle cx="158" cy="190" r="6" fill="#fffdf8" stroke={deep} strokeWidth="1.6" />
          <circle cx="180" cy="191" r="5" fill={light} />
        </g>
      );

    case 'cushion':
      return (
        <g>
          <ellipse cx="268" cy="212" rx="24" ry="14" fill={light} />
          <ellipse cx="300" cy="220" rx="20" ry="12" fill={deep} />
        </g>
      );

    case 'pet':
      return (
        <g>
          <ellipse cx="132" cy="212" rx="26" ry="13" fill={light} />
          <circle cx="112" cy="205" r="11" fill={light} />
          <path d="M105 198 l 3 -8 l 6 5 Z M118 197 l 5 -7 l 2 8 Z" fill={light} />
          <path d="M154 210 q 14 -4, 10 -14" stroke={light} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M107 205 q 3 2, 6 0" stroke={deep} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <circle cx="109" cy="203" r="1.4" fill={deep} />
          <circle cx="116" cy="203" r="1.4" fill={deep} />
        </g>
      );
  }
}

export function RoomArt({ princess, items, width = 400 }: RoomArtProps) {
  const bySlot = new Map(items.map((i) => [i.slot, i]));
  const ordered = DEPTH.map((slot) => bySlot.get(slot)).filter((i): i is RoomReward => !!i);

  return (
    <svg viewBox="0 0 400 250" width={width} height={width * 0.625} role="img"
      aria-label={`${princess.name}'s room, with ${items.length} things in it`}>
      <defs>
        <linearGradient id="room-wall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b2f6b" />
          <stop offset="100%" stopColor="#584a92" />
        </linearGradient>
        <linearGradient id="room-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8a6b52" />
          <stop offset="100%" stopColor="#6b503c" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="400" height="194" fill="url(#room-wall)" />
      <rect x="0" y="194" width="400" height="56" fill="url(#room-floor)" />
      <rect x="0" y="192" width="400" height="4" fill="#2d2350" opacity="0.5" />

      {ordered.map((item) => <Item key={item.id} item={item} />)}

      {/* An empty room should read as waiting, not broken. */}
      {items.length === 0 ? (
        <text x="200" y="120" textAnchor="middle" fill="#b9b0e0" fontSize="13" fontFamily="inherit">
          Finish a star to start filling this room
        </text>
      ) : null}
    </svg>
  );
}
