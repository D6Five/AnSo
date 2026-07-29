import { useSyncStatus } from '../core/sync';

/**
 * Small, quiet indication of where progress is being kept.
 *
 * Deliberately understated — a child should never be worried by it — but it has
 * to be visible, because "saved to this device only" and "saved for every
 * device" are meaningfully different promises and a parent should be able to
 * tell which one is currently true.
 */

const LOOK: Record<string, { dot: string; label: string; title: string }> = {
  off: {
    dot: '#7f79a8',
    label: 'This device',
    title: 'Progress is saved on this device only.',
  },
  syncing: {
    dot: '#8be9fd',
    label: 'Saving…',
    title: 'Saving progress to the server.',
  },
  synced: {
    dot: '#7ee7b4',
    label: 'Saved',
    title: 'Progress is saved and will follow this explorer to any device.',
  },
  offline: {
    dot: '#ffd479',
    label: 'This device',
    title:
      'No connection to the server, so progress is saved on this device only. It will sync when the connection returns.',
  },
  error: {
    dot: '#ff8fa3',
    label: 'Not saving',
    title:
      'Could not save to the server. Progress is safe on this device. Try reloading the page — you may need to sign in again.',
  },
};

export function SyncBadge() {
  const { status } = useSyncStatus();
  const look = LOOK[status] ?? LOOK.off;

  return (
    <span className="sync-badge" title={look.title} aria-label={look.title}>
      <span className="sync-dot" style={{ background: look.dot }} aria-hidden="true" />
      {look.label}
    </span>
  );
}
