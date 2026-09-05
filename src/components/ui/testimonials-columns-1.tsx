import type { CSSProperties } from 'react';
import { ArrowUpRight, Film } from 'lucide-react';
import { motion } from 'motion/react';

import { cn } from '@/lib/utils';

export interface Testimonial {
  text: string;
  name: string;
  role: string;
  image?: string;
  href?: string;
}

export function TestimonialsColumn({
  className,
  testimonials,
  duration = 10,
  decorative = false,
}: {
  className?: string;
  testimonials: readonly Testimonial[];
  duration?: number;
  decorative?: boolean;
}) {
  return (
    <div className={cn('price-column w-full max-w-sm min-w-0 flex-1', className)} aria-hidden={decorative || undefined}>
      <motion.div
        className="price-column-track flex flex-col gap-5 pb-5"
        style={{ '--column-duration': `${duration > 0 ? duration : 10}s` } as CSSProperties}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="price-column-copy flex flex-col gap-5" aria-hidden={copy === 1 || undefined} inert={copy === 1 || decorative}>
            {testimonials.map(({ text, image, name, role, href }, index) => (
              <article key={`${name}-${index}`} className="flex min-h-64 flex-col rounded-3xl border border-white/12 bg-[#111416] p-7 text-white shadow-lg shadow-black/15">
                <p className="flex-1 text-lg leading-relaxed font-medium tracking-tight">{text}</p>
                <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
                  {image ? (
                    <img width={40} height={40} src={image} alt="" loading="lazy" className="size-10 rounded-full object-cover" />
                  ) : (
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200/15 bg-cyan-200/5 text-cyan-200"><Film className="size-5" aria-hidden="true" /></span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm leading-5 font-semibold">{name}</p>
                    {href ? (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-xs leading-5 text-neutral-400 underline-offset-4 hover:text-cyan-200 hover:underline focus-visible:outline-2 focus-visible:outline-cyan-200">
                        {role}<ArrowUpRight className="size-3 shrink-0" aria-hidden="true" />
                      </a>
                    ) : <p className="mt-1 text-xs leading-5 text-neutral-400">{role}</p>}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
