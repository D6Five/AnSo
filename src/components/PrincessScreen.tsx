import { useMemo, useState } from 'react';
import type { Profile } from '../types';
import { princessOrDefault } from '../content/princesses';
import {
  REWARD_BY_ID,
  TOTAL_REWARDS,
  accessorySlot,
  type AccessoryReward,
  type DressReward,
  type RoomReward,
} from '../content/rewards';
import { earnedRewards, equipDress, starsCompleted, toggleAccessory } from '../core/store';
import { sfxTap, sfxStardust } from '../core/audio';
import { PrincessArt } from './PrincessArt';
import { RoomArt } from './RoomArt';

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

type Tab = 'wardrobe' | 'room';

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
      <header className="princess-header">
        <button type="button" className="btn btn-quiet" onClick={onBack}>
          ← Back to the map
        </button>
        <div className="princess-title">
          <h1>
            {princess.name} <span className="hangul">{princess.hangul}</span>
          </h1>
          <p className="princess-sub">
            {princess.englishName} · {princess.meaning}
          </p>
        </div>
        <div className="treasure-count" title="Treasures earned">
          👑 {earned.length} / {TOTAL_REWARDS}
        </div>
      </header>

      <div className="tab-row">
        {(['wardrobe', 'room'] as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            className={`tab-btn ${tab === t ? 'active' : ''}`}
            onClick={() => {
              sfxTap();
              setTab(t);
            }}
          >
            {t === 'wardrobe' ? '👗 Wardrobe' : '🛏️ Her Room'}
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
      ) : (
        <div className="room-view">
          <RoomArt princess={princess} items={roomItems} width={620} />
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
