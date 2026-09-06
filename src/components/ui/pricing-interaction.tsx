import NumberFlow from '@number-flow/react';
import { Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { BorderTrail } from '@/components/ui/border-trail';
import { cn } from '@/lib/utils';

export interface PricingInteractionOption {
  badgeLabel?: string;
  creditsLabel: string;
  id: string;
  intervalLabel?: string;
  planName: string;
  price: number;
}

export function PricingInteraction({
  options,
  value,
  onValueChange,
}: {
  options: readonly PricingInteractionOption[];
  value?: string;
  onValueChange?: (id: string) => void;
}) {
  const activeIndex = Math.max(
    0,
    options.findIndex((option) => option.id === value)
  );

  if (!options.length) return null;

  return (
    <div aria-label="Pricing options" className="relative w-full" role="radiogroup">
      {/* Plus-mark corners frame the plan group, like a spec sheet. */}
      <div className="relative border border-white/10 p-3 sm:p-4">
        <Plus
          aria-hidden="true"
          className="absolute -top-3 -left-3 size-5 text-neutral-300"
        />
        <Plus
          aria-hidden="true"
          className="absolute -top-3 -right-3 size-5 text-neutral-300"
        />
        <Plus
          aria-hidden="true"
          className="absolute -bottom-3 -left-3 size-5 text-neutral-300"
        />
        <Plus
          aria-hidden="true"
          className="absolute -right-3 -bottom-3 size-5 text-neutral-300"
        />
        <div className="flex flex-col gap-3">
          {options.map((option, index) => {
            const selected = index === activeIndex;

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onValueChange?.(option.id)}
                className={cn(
                  'relative flex min-h-[92px] w-full items-center justify-between rounded-2xl border-2 bg-[#141619] p-4 text-left transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white',
                  selected
                    ? 'border-white/90'
                    : 'border-white/15 hover:border-white/35'
                )}
              >
                {selected ? (
                  <BorderTrail
                    className="bg-[#c92f68]"
                    size={90}
                    style={{
                      boxShadow:
                        '0 0 28px 9px rgb(201 47 104 / 0.6), 0 0 64px 26px rgb(201 47 104 / 0.3)',
                    }}
                  />
                ) : null}
                <span className="relative z-[1] flex min-w-0 items-center gap-4">
                  <span className="flex shrink-0 items-baseline text-neutral-400 tabular-nums">
                    <span className="text-xl">$</span>
                    <span className="px-0.5 text-4xl font-extrabold tracking-tighter text-white">
                      <NumberFlow value={option.price} />
                    </span>
                    {option.intervalLabel ? (
                      <span className="text-sm">{option.intervalLabel}</span>
                    ) : null}
                  </span>
                  <span className="min-w-0 border-l border-white/10 pl-4 text-left">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-semibold text-neutral-100">
                        {option.planName}
                      </span>
                      {option.badgeLabel ? (
                        <Badge
                          variant="secondary"
                          className="bg-[#c92f68] text-white"
                        >
                          {option.badgeLabel}
                        </Badge>
                      ) : null}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-neutral-400">
                      {option.creditsLabel}
                    </span>
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="relative z-[1] flex size-6 shrink-0 items-center justify-center rounded-full border-2 p-1 transition-colors duration-300"
                  style={{ borderColor: selected ? '#f5f5f5' : '#5b6470' }}
                >
                  <span
                    className="size-3 rounded-full bg-white transition-opacity duration-300"
                    style={{ opacity: selected ? 1 : 0 }}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
