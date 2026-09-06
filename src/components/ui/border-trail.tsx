import type * as React from 'react';

import { motion, type Transition } from 'motion/react';

import { cn } from '@/lib/utils';

type BorderTrailProps = {
  className?: string;
  delay?: number;
  onAnimationComplete?: () => void;
  size?: number;
  style?: React.CSSProperties;
  transition?: Transition;
};

/** A small glowing square that loops around the parent's rounded border. */
export function BorderTrail({
  className,
  delay,
  onAnimationComplete,
  size = 60,
  style,
  transition,
}: BorderTrailProps) {
  const BASE_TRANSITION: Transition = {
    duration: 5,
    ease: 'linear',
    repeat: Infinity,
  };

  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] border border-transparent [mask-clip:padding-box,border-box] [mask-composite:intersect] [mask-image:linear-gradient(transparent,transparent),linear-gradient(#000,#000)]">
      <motion.div
        className={cn('absolute aspect-square bg-zinc-500', className)}
        style={{
          offsetPath: `rect(0 auto auto 0 round ${size}px)`,
          width: size,
          ...style,
        }}
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        transition={{
          ...(transition ?? BASE_TRANSITION),
          ...(delay === undefined ? {} : { delay }),
        }}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}
