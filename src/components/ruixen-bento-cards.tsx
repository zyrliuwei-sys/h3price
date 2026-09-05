import { Plus, type LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

export type RuixenBentoCardItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type RuixenBentoCardsProps = {
  items: RuixenBentoCardItem[];
  className?: string;
};

const cardSpans = [
  'lg:col-span-3 lg:row-span-2',
  'lg:col-span-3 lg:row-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
  'lg:col-span-2',
];

function CornerPlusIcons() {
  return (
    <>
      <Plus
        className="absolute -top-3 -left-3 z-10 size-6 rounded-full bg-[#08090a] p-1 text-cyan-200"
        strokeWidth={1.4}
        aria-hidden="true"
      />
      <Plus
        className="absolute -top-3 -right-3 z-10 size-6 rounded-full bg-[#08090a] p-1 text-cyan-200"
        strokeWidth={1.4}
        aria-hidden="true"
      />
      <Plus
        className="absolute -bottom-3 -left-3 z-10 size-6 rounded-full bg-[#08090a] p-1 text-cyan-200"
        strokeWidth={1.4}
        aria-hidden="true"
      />
      <Plus
        className="absolute -right-3 -bottom-3 z-10 size-6 rounded-full bg-[#08090a] p-1 text-cyan-200"
        strokeWidth={1.4}
        aria-hidden="true"
      />
    </>
  );
}

export function RuixenBentoCards({ items, className }: RuixenBentoCardsProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6',
        className
      )}
    >
      {items.map((item, index) => {
        const Icon = item.icon;

        return (
          <article
            key={item.title}
            className={cn(
              'group relative isolate flex min-h-60 flex-col justify-between overflow-visible rounded-xl border border-dashed border-white/30 bg-[radial-gradient(circle_at_75%_0%,rgba(57,195,239,0.13),transparent_46%),linear-gradient(145deg,rgba(255,255,255,0.065),rgba(255,255,255,0.02))] p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-[border-color,transform,background] duration-300 hover:-translate-y-1 hover:border-cyan-200/65 hover:bg-[radial-gradient(circle_at_75%_0%,rgba(57,195,239,0.2),transparent_50%),linear-gradient(145deg,rgba(255,255,255,0.085),rgba(255,255,255,0.025))]',
              cardSpans[index] ?? 'lg:col-span-2'
            )}
          >
            <CornerPlusIcons />

            <div className="flex items-start justify-between gap-6">
              <div className="flex size-12 items-center justify-center rounded-lg border border-white/15 bg-black/30 shadow-[0_0_30px_rgba(57,195,239,0.1)]">
                <Icon
                  className="size-6 text-cyan-200"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </div>
              <span className="font-mono text-xs tracking-[0.16em] text-white/40">
                0{index + 1}
              </span>
            </div>

            <div className="mt-14 max-w-md">
              <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-white/55 sm:text-base">
                {item.description}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
