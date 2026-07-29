/**
 * The treasure catalogue.
 *
 * Every star a princess finishes grants exactly one item, in the order listed
 * here — deterministic rather than random, so the collection feels designed and
 * a child can never be unlucky. Replaying a star she has already finished does
 * not grant another; the collection tracks distinct stars completed.
 *
 * Items are described parametrically (a silhouette plus a palette plus a trim)
 * rather than as fifty separate drawings. One renderer then covers the whole
 * catalogue, and adding a gown is three lines rather than an afternoon of SVG.
 *
 * Korean dress and ornament traditions are used alongside western princess
 * staples, because these girls are Korean-American and both belong to them.
 */

export type RewardKind = 'dress' | 'accessory' | 'room';

export type DressSilhouette = 'hanbok' | 'ballgown' | 'aline' | 'tiered' | 'wrap';
export type DressTrim = 'none' | 'lace' | 'ribbon' | 'sparkle' | 'fur';

export type AccessoryType =
  | 'crown'
  | 'binyeo'
  | 'norigae'
  | 'ribbon'
  | 'necklace'
  | 'fan'
  | 'flower'
  | 'earrings'
  | 'cape'
  | 'wings';

export type RoomSlot =
  | 'rug'
  | 'bed'
  | 'window'
  | 'lamp'
  | 'shelf'
  | 'plant'
  | 'art'
  | 'desk'
  | 'pet'
  | 'lights'
  | 'cushion'
  | 'mirror'
  | 'clock'
  | 'banner'
  | 'tea'
  | 'books'
  | 'curtain'
  | 'canopy';

interface RewardBase {
  id: string;
  name: string;
  /** One line AnSo says when it is unlocked. */
  blurb: string;
}

export interface DressReward extends RewardBase {
  kind: 'dress';
  silhouette: DressSilhouette;
  /** Bodice, skirt, accent. */
  palette: [string, string, string];
  trim: DressTrim;
}

export interface AccessoryReward extends RewardBase {
  kind: 'accessory';
  type: AccessoryType;
  palette: [string, string];
}

export interface RoomReward extends RewardBase {
  kind: 'room';
  slot: RoomSlot;
  palette: [string, string];
}

export type Reward = DressReward | AccessoryReward | RoomReward;

const dress = (
  id: string,
  name: string,
  silhouette: DressSilhouette,
  palette: [string, string, string],
  trim: DressTrim,
  blurb: string,
): DressReward => ({ id, name, kind: 'dress', silhouette, palette, trim, blurb });

const acc = (
  id: string,
  name: string,
  type: AccessoryType,
  palette: [string, string],
  blurb: string,
): AccessoryReward => ({ id, name, kind: 'accessory', type, palette, blurb });

const room = (
  id: string,
  name: string,
  slot: RoomSlot,
  palette: [string, string],
  blurb: string,
): RoomReward => ({ id, name, kind: 'room', slot, palette, blurb });

/**
 * Unlock order. Deliberately interleaved so the first hour brings a dress, a
 * thing to wear on your head, and a change to the room — rather than eleven
 * gowns before the room has a rug.
 */
export const REWARDS: Reward[] = [
  dress('d_first', 'First Hanbok', 'hanbok', ['#fdf3ee', '#f9b6ce', '#ee87af'], 'ribbon',
    'Your very first hanbok. The ribbon at the front is called a goreum.'),
  acc('a_ribbon', 'Silk Ribbon', 'ribbon', ['#f9b6ce', '#ee87af'],
    'A silk ribbon for your hair.'),
  room('r_rug', 'Soft Rug', 'rug', ['#f9c4a1', '#efa271'],
    'Something warm for the floor.'),
  dress('d_sky', 'Sky Gown', 'aline', ['#e8f8fd', '#8fe0f0', '#4fbfd9'], 'none',
    'The colour of the sky just before morning.'),
  acc('a_flower', 'Blossom Pin', 'flower', ['#f9b6ce', '#f47ba8'],
    'A blossom for behind your ear.'),
  room('r_lamp', 'Paper Lamp', 'lamp', ['#fbd98f', '#f3bc5c'],
    'A paper lamp, so you can read after dark.'),
  dress('d_mint', 'Mint Hanbok', 'hanbok', ['#f2fbf6', '#9ee6c4', '#63d6a2'], 'ribbon',
    'A jeogori in mint, with a long chima.'),
  acc('a_binyeo', 'Jade Binyeo', 'binyeo', ['#9ee6c4', '#3fb98a'],
    'A binyeo is a hairpin that holds a bun in place. This one is jade.'),
  room('r_plant', 'Little Plant', 'plant', ['#9ee6c4', '#4fae83'],
    'A plant for the windowsill. Remember to water it.'),
  dress('d_lilac', 'Lilac Ballgown', 'ballgown', ['#f4efff', '#c7b4f6', '#a68deb'], 'lace',
    'A ballgown with lace at the hem.'),
  acc('a_pearls', 'Pearl Necklace', 'necklace', ['#fdfbf7', '#e8dcc8'],
    'Small pearls, one for each star you have lit.'),
  room('r_window', 'Round Window', 'window', ['#8fe0f0', '#4fbfd9'],
    'A round window with the whole sky in it.'),
  dress('d_sun', 'Sunrise Dress', 'tiered', ['#fff6e4', '#fbd98f', '#f3bc5c'], 'none',
    'Three tiers, each a little warmer than the last.'),
  acc('a_norigae', 'Norigae Pendant', 'norigae', ['#ee87af', '#c94f80'],
    'A norigae hangs from the ribbon of a hanbok. It is for luck.'),
  room('r_cushion', 'Floor Cushions', 'cushion', ['#c7b4f6', '#a68deb'],
    'Cushions, for sitting on the floor with a book.'),
  dress('d_rose', 'Rose Wrap', 'wrap', ['#fff0f4', '#f4a0bd', '#d96f97'], 'ribbon',
    'It wraps across and ties at the side.'),
  acc('a_crownSmall', 'Little Crown', 'crown', ['#fbd98f', '#e0a83c'],
    'A small crown. You do not have to be loud to be a princess.'),
  room('r_bed', 'Canopy Bed', 'bed', ['#f9b6ce', '#ee87af'],
    'A proper bed, with posts at the corners.'),
  dress('d_ocean', 'Ocean Gown', 'ballgown', ['#eaf8fb', '#7fd4e8', '#3aa8c8'], 'sparkle',
    'It catches the light like water does.'),
  acc('a_fan', 'Painted Fan', 'fan', ['#fdf3ee', '#ee87af'],
    'A folding fan with a plum branch painted on it.'),
  room('r_shelf', 'Book Shelf', 'shelf', ['#f9c4a1', '#c98553'],
    'Shelves. You are going to need them.'),
  dress('d_forest', 'Forest Hanbok', 'hanbok', ['#f0faf4', '#7fd8b0', '#3fae82'], 'sparkle',
    'Deep green, like somewhere quiet.'),
  acc('a_earrings', 'Drop Earrings', 'earrings', ['#fbd98f', '#e0a83c'],
    'Two small drops of gold.'),
  room('r_art', 'Framed Painting', 'art', ['#c7b4f6', '#8f74d8'],
    'A painting for the wall. You chose it yourself.'),
  dress('d_plum', 'Plum Blossom', 'aline', ['#fdf1f6', '#eda2c4', '#c96794'], 'lace',
    'Plum blossoms open before the winter is even finished.'),
  acc('a_crownTall', 'Tall Crown', 'crown', ['#e8f8fd', '#8fd6ea'],
    'A taller crown, for taller occasions.'),
  room('r_desk', 'Study Desk', 'desk', ['#f9c4a1', '#c98553'],
    'A desk of your own to work at.'),
  dress('d_snow', 'Snow Gown', 'ballgown', ['#ffffff', '#eaf2ff', '#c3d8f5'], 'fur',
    'White, with soft trim at the collar.'),
  acc('a_capeGold', 'Golden Cape', 'cape', ['#fbd98f', '#e0a83c'],
    'A cape that moves when you walk.'),
  room('r_pet', 'Sleeping Cat', 'pet', ['#f9c4a1', '#c98553'],
    'A cat has decided to live here now. That is how cats work.'),
  dress('d_night', 'Starlight Gown', 'tiered', ['#efeaff', '#a68deb', '#6f52c9'], 'sparkle',
    'The night sky, made into a dress.'),
  acc('a_ribbonGold', 'Gold Ribbon', 'ribbon', ['#fbd98f', '#e0a83c'],
    'Gold ribbon, for the days that deserve it.'),
  room('r_lights', 'String Lights', 'lights', ['#fbd98f', '#f3bc5c'],
    'Tiny lights along the wall.'),
  dress('d_coral', 'Coral Hanbok', 'hanbok', ['#fff4ef', '#f9b193', '#e4795a'], 'ribbon',
    'Warm coral, with a wide sash.'),
  acc('a_flowerCrown', 'Flower Crown', 'flower', ['#9ee6c4', '#f9b6ce'],
    'A crown made entirely of flowers.'),
  room('r_mirror', 'Standing Mirror', 'mirror', ['#f9c4a1', '#c98553'],
    'For checking the whole outfit at once.'),
  dress('d_jade', 'Jade Court Dress', 'wrap', ['#eefaf4', '#7fd8b0', '#2f9d74'], 'lace',
    'The sort of thing you wear to a very important meeting.'),
  acc('a_norigaeJade', 'Jade Norigae', 'norigae', ['#9ee6c4', '#3fb98a'],
    'A second norigae, in jade this time.'),
  room('r_tea', 'Tea Table', 'tea', ['#f9c4a1', '#c98553'],
    'A low table, for tea with somebody you like.'),
  dress('d_peach', 'Peach Tiers', 'tiered', ['#fff5ee', '#f9c4a1', '#e79b6d'], 'ribbon',
    'Peach, all the way down.'),
  acc('a_pearlCrown', 'Pearl Crown', 'crown', ['#fdfbf7', '#e8dcc8'],
    'Pearls set into silver.'),
  room('r_books', 'Stack of Books', 'books', ['#8fe0f0', '#ee87af'],
    'Books you have already read, kept where you can see them.'),
  dress('d_ruby', 'Ruby Ballgown', 'ballgown', ['#fff0f0', '#f08a8a', '#c94f4f'], 'sparkle',
    'Deep red. Impossible to miss.'),
  acc('a_capeSilver', 'Silver Cape', 'cape', ['#f2f6fb', '#c3d0e0'],
    'Silver, and very light.'),
  room('r_clock', 'Little Clock', 'clock', ['#fbd98f', '#e0a83c'],
    'A clock, so you know how long you have been reading.'),
  dress('d_dawn', 'Dawn Hanbok', 'hanbok', ['#fff8f0', '#f7c8dc', '#c78fb4'], 'sparkle',
    'The exact colours of the sky at dawn.'),
  acc('a_fanGold', 'Golden Fan', 'fan', ['#fbd98f', '#e0a83c'],
    'A fan with gold leaf along the edge.'),
  room('r_banner', 'Silk Banner', 'banner', ['#c7b4f6', '#a68deb'],
    'A banner with your own name on it.'),
  dress('d_aurora', 'Aurora Gown', 'ballgown', ['#eefcff', '#9be8d8', '#7fa8f0'], 'sparkle',
    'It changes colour depending on where you stand.'),
  acc('a_wings', 'Star Wings', 'wings', ['#e8f8fd', '#c7b4f6'],
    'Not for flying. For looking like you could.'),
  room('r_curtain', 'Velvet Curtains', 'curtain', ['#c7b4f6', '#8f74d8'],
    'Heavy curtains, for keeping the morning out a little longer.'),
  dress('d_royal', 'Royal Hanbok', 'hanbok', ['#fffaf0', '#f0c987', '#c9922f'], 'fur',
    'The one you would wear to meet a queen.'),
  acc('a_grandCrown', 'The Grand Crown', 'crown', ['#fff3d1', '#e0a83c'],
    'You have earned this one outright.'),
  room('r_canopy', 'Star Canopy', 'canopy', ['#a68deb', '#6f52c9'],
    'The whole ceiling, full of stars. Your own sky indoors.'),
];

export const REWARD_BY_ID: Record<string, Reward> = Object.fromEntries(
  REWARDS.map((r) => [r.id, r]),
);

/**
 * Which part of the princess an accessory occupies. Two things cannot share a
 * slot — a crown inside a flower crown looks like a mistake rather than a
 * choice — but a crown and a necklace happily coexist.
 */
export function accessorySlot(type: AccessoryType): string {
  switch (type) {
    case 'crown':
    case 'binyeo':
    case 'ribbon':
    case 'flower':
      return 'head';
    case 'necklace':
    case 'norigae':
      return 'neck';
    case 'earrings':
      return 'ears';
    case 'fan':
      return 'hand';
    case 'cape':
    case 'wings':
      return 'back';
  }
}

/**
 * Which items a princess has earned, given how many distinct stars she has
 * finished. Progress alone determines the collection — nothing to lose track of
 * and nothing that can drift out of step with the map.
 */
export function rewardsEarned(starsCompleted: number): Reward[] {
  return REWARDS.slice(0, Math.min(starsCompleted, REWARDS.length));
}

/** The item granted by finishing the nth distinct star, if there is one left. */
export function rewardForMilestone(starsCompleted: number): Reward | null {
  return REWARDS[starsCompleted - 1] ?? null;
}

export const TOTAL_REWARDS = REWARDS.length;
