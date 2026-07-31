import { useMemo, useState } from 'react';
import type { Profile } from '../types';
import { princessOrDefault } from '../content/princesses';
import {
  REWARD_BY_ID,
  SHOP,
  TOTAL_REWARDS,
  accessorySlot,
  type AccessoryReward,
  type DressReward,
  type RoomReward,
} from '../content/rewards';
import { buyItem, earnedRewards, equipDress, starsCompleted, toggleAccessory } from '../core/store';
import { sfxTap, sfxStardust } from '../core/audio';
import { PrincessArt } from './PrincessArt';
import { RoomArt } from './RoomArt';
import { BackButton } from './BackButton';

/**
 * Wardrobe and bedroom.
 *
 * The collection is derived entirely from how many distinct stars have been
 * finished, so it can never disagree with the map. Dresses and accessories are
 * chosen here; room items place themselves, because a layout tool would be a
 * chore rather than a reward.
 */

interface PrincessScreenProps {
  profile: Profile;
  onBack: () => void;
}

type Tab = 'wardrobe' | 'room' | 'shop';

const TAB_LABEL: Record<Tab, string> = {
  wardrobe: '👗 Wardrobe',
  room: '🛏️ Her Royal Chamber',
  shop: '✨ Stardust Shop',
};

export function PrincessScreen({ profile, onBack }: PrincessScreenProps) {
  const [tab, setTab] = useState<Tab>('wardrobe');
  const princess = princessOrDefault(profile.princess);

  const earned = useMemo(() => earnedRewards(profile), [profile]);
  const dresses = earned.filter((r): r is DressReward => r.kind === 'dress');
  const accessories = earned.filter((r): r is AccessoryReward => r.kind === 'accessory');
  const roomItems = earned.filter((r): r is RoomReward => r.kind === 'room');

  const wornDress =
    (profile.equippedDress ? REWARD_BY_ID[profile.equippedDress] : null) ??
    dresses[dresses.length - 1] ??
    null;

  const wornAccessories = (profile.equippedAccessories ?? [])
    .map((id) => REWARD_BY_ID[id])
    .filter((r): r is AccessoryReward => !!r && r.kind === 'accessory');

  const stars = starsCompleted(profile);

  return (
    <div className="princess-screen">
      <BackButton label="Back to the map" onClick={onBack} />

      <header className="princess-header">
        <div className="princess-title">
          <h1>
            {princess.name} <span className="hangul">{princess.hangul}</span>
          </h1>
          <p className="princess-sub">
            {princess.englishName} · {princess.meaning}
          </p>
        </div>
        <div className="header-counts">
          <span className="treasure-count" title="Treasures earned">
            👑 {earned.length} / {TOTAL_REWARDS}
          </span>
          <span className="stardust-count" title="Stardust to spend in the shop">
            ✨ {profile.stardust.toLocaleString()}
          </span>
        </div>
      </header>

      <div className="tab-row">
        {(['wardrobe', 'room', 'shop'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => {
              sfxTap();
              setTab(t);
            }}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      {tab === 'wardrobe' ? (
        <div className="wardrobe">
          <div className="princess-stage" style={{ ['--accent' as string]: princess.accent }}>
            <PrincessArt
              princess={princess}
              dress={wornDress && wornDress.kind === 'dress' ? wornDress : null}
              accessories={wornAccessories}
              size={230}
            />
            <p className="worn-label">
              {wornDress && wornDress.kind === 'dress' ? wornDress.name : 'Everyday dress'}
            </p>
          </div>

          <div className="closet">
            <h2>Dresses</h2>
            {dresses.length === 0 ? (
              <p className="closet-empty">Finish a star and your first hanbok arrives.</p>
            ) : (
              <div className="swatch-grid">
                {dresses.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    className={`swatch ${wornDress?.id === d.id ? 'worn' : ''}`}
                    style={{
                      ['--sw-a' as string]: d.palette[1],
                      ['--sw-b' as string]: d.palette[2],
                    }}
                    onClick={() => {
                      sfxTap();
                      equipDress(profile.id, d.id);
                    }}
                    title={d.name}
                  >
                    <span className="swatch-name">{d.name}</span>
                  </button>
                ))}
              </div>
            )}

            <h2>Accessories</h2>
            {accessories.length === 0 ? (
              <p className="closet-empty">Keep going — jewellery and crowns are coming.</p>
            ) : (
              <div className="swatch-grid">
                {accessories.map((a) => {
                  const worn = wornAccessories.some((w) => w.id === a.id);
                  return (
                    <button
                      key={a.id}
                      type="button"
                      className={`swatch ${worn ? 'worn' : ''}`}
                      style={{
                        ['--sw-a' as string]: a.palette[0],
                        ['--sw-b' as string]: a.palette[1],
                      }}
                      onClick={() => {
                        sfxTap();
                        toggleAccessory(profile.id, a.id, accessorySlot(a.type));
                      }}
                      title={a.name}
                    >
                      <span className="swatch-name">{a.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : tab === 'shop' ? (
        <div className="shop">
          <p className="shop-intro">
            Stardust is earned from every star, including ones you play again. Spend
            it on whatever you like — these never appear as rewards.
          </p>
          <div className="shop-grid">
            {SHOP.map((item) => {
              const owned = (profile.purchased ?? []).includes(item.id);
              const affordable = profile.stardust >= item.price;
              const swatch =
                item.kind === 'dress'
                  ? [item.palette[1], item.palette[2]]
                  : [item.palette[0], item.palette[1]];
              return (
                <div
                  key={item.id}
                  className={`shop-card ${owned ? 'owned' : ''}`}
                  style={{ ['--sw-a' as string]: swatch[0], ['--sw-b' as string]: swatch[1] }}
                >
                  <span className="shop-icon" aria-hidden="true">
                    {item.kind === 'dress' ? '👗' : item.kind === 'room' ? '🪑' : '💎'}
                  </span>
                  <span className="shop-name">{item.name}</span>
                  <span className="shop-blurb">{item.blurb}</span>
                  <button
                    type="button"
                    className="btn shop-buy"
                    disabled={owned || !affordable}
                    onClick={() => {
                      if (buyItem(profile.id, item.id)) sfxStardust();
                      else sfxTap();
                    }}
                  >
                    {owned ? 'Owned' : `✨ ${item.price}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="room-view">
          {/* The princess stands in her own chamber — a room she has filled but
              never occupies is a showroom, not a bedroom. */}
          <div className="chamber">
            <RoomArt princess={princess} items={roomItems} width={620} />
            <div className="chamber-figure">
              <PrincessArt
                princess={princess}
                dress={wornDress && wornDress.kind === 'dress' ? wornDress : null}
                accessories={wornAccessories}
                size={132}
              />
            </div>
          </div>
          <p className="room-caption">
            {roomItems.length === 0
              ? 'Nothing in here yet. Every few stars adds something.'
              : `${roomItems.length} thing${roomItems.length === 1 ? '' : 's'} in her room so far, from ${stars} star${stars === 1 ? '' : 's'}.`}
          </p>
          <div className="room-list">
            {roomItems.map((r) => (
              <span key={r.id} className="room-chip" title={r.blurb}>
                {r.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * The reward reveal shown when a star is finished. Kept in this file so the
 * treasure presentation lives in one place.
 */
export function RewardReveal({ rewardId, onSeen }: { rewardId: string; onSeen: () => void }) {
  const reward = REWARD_BY_ID[rewardId];
  if (!reward) return null;

  const swatch =
    reward.kind === 'dress'
      ? [reward.palette[1], reward.palette[2]]
      : [reward.palette[0], reward.palette[1]];

  return (
    <div className="reward-reveal">
      <div
        className="reward-orb"
        style={{ ['--sw-a' as string]: swatch[0], ['--sw-b' as string]: swatch[1] }}
        aria-hidden="true"
      >
        {reward.kind === 'dress' ? '👗' : reward.kind === 'accessory' ? '💎' : '🪑'}
      </div>
      <p className="reward-kind">
        New {reward.kind === 'room' ? 'room treasure' : reward.kind}
      </p>
      <h3 className="reward-name">{reward.name}</h3>
      <p className="reward-blurb">{reward.blurb}</p>
      <button
        type="button"
        className="btn"
        onClick={() => {
          sfxStardust();
          onSeen();
        }}
      >
        Lovely
      </button>
    </div>
  );
}
