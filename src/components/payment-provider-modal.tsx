'use client';

import { CreditCard, Loader2 } from 'lucide-react';

import { m } from '@/paraglide/messages.js';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { PricingInteraction } from '@/components/ui/pricing-interaction';

export type PaymentProvider =
  | 'stripe'
  | 'creem'
  | 'paypal'
  | 'alipay'
  | 'wechat';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: PaymentProvider[];
  loadingProvider?: PaymentProvider | null;
  onSelect: (provider: PaymentProvider) => void;
  priceOptions?: readonly {
    badgeLabel?: string;
    creditsLabel: string;
    id: string;
    intervalLabel?: string;
    planName: string;
    price: number;
  }[];
  selectedPriceOptionId?: string;
  onSelectPriceOption?: (id: string) => void;
  title?: string;
  description?: string;
  planName?: string;
  price?: string;
}

const providerLabel: Record<PaymentProvider, string> = {
  stripe: 'Stripe',
  creem: 'Creem',
  paypal: 'PayPal',
  alipay: 'Alipay',
  wechat: 'WeChat Pay',
};

export function PaymentProviderModal({
  open,
  onOpenChange,
  providers,
  loadingProvider,
  onSelect,
  priceOptions,
  selectedPriceOptionId,
  onSelectPriceOption,
  title,
  description,
  planName,
  price,
}: Props) {
  const dialogDescription =
    description ??
    (planName
      ? price
        ? m['common.pricing.payment_for']({ plan: planName, price })
        : m['common.pricing.payment_for_plan']({ plan: planName })
      : m['common.pricing.choose_payment_desc']());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`overflow-hidden border-white/10 bg-[#101214] p-0 shadow-[0_24px_80px_rgba(0,0,0,0.6)] ${
          priceOptions?.length ? 'sm:max-w-2xl' : 'sm:max-w-md'
        }`}
      >
        <DialogHeader className="px-6 pt-6 sm:px-7 sm:pt-7">
          <DialogTitle className="text-neutral-100">
            {title ?? m['common.pricing.choose_payment']()}
          </DialogTitle>
          <DialogDescription className="text-neutral-400">
            {dialogDescription}
          </DialogDescription>
        </DialogHeader>

        {priceOptions?.length ? (
          <div className="px-6 pt-5 sm:px-7">
            <PricingInteraction
              options={priceOptions}
              value={selectedPriceOptionId}
              onValueChange={onSelectPriceOption}
            />
          </div>
        ) : null}

        <div className="mt-5 border-t border-white/10 bg-[#0d0f11] px-6 py-5 sm:px-7 sm:py-6">
          <div className="space-y-2">
            {providers.map((p) => {
              const loading = loadingProvider === p;
              return (
                <Button
                  key={p}
                  variant="outline"
                  className="h-14 w-full justify-start gap-3 rounded-xl border-white/15 bg-[#141619] px-4 text-base text-neutral-100 transition hover:border-[#efb0c4] hover:bg-white/[0.06]"
                  disabled={!!loadingProvider}
                  onClick={() => onSelect(p)}
                >
                  {loading ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CreditCard className="size-4" />
                  )}
                  <span>{providerLabel[p]}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
