import { useMemo } from 'react';
import { createRng } from '../core/rng';

/**
 * The drifting star background.
 *
 * Positions come from a fixed seed so the sky is the same every visit — it
 * should feel like a place, not a screensaver. Pure CSS animation, so it costs
 * nothing on an old laptop.
 */
export function StarField() {
  const stars = useMemo(() => {
    const rng = createRng('anso-sky');
    return Array.from({ length: 90 }, (_, i) => ({
      id: i,
      left: rng.next() * 100,
      top: rng.next() * 100,
      size: 1 + rng.next() * 2.2,
      delay: rng.next() * 6,
      duration: 3 + rng.next() * 5,
      opacity: 0.25 + rng.next() * 0.6,
    }));
  }, []);

  return (
    <div className="star-field" aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.id}
          className="sky-star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}
