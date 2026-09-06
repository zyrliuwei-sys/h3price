import { createFileRoute } from '@tanstack/react-router';

import { h3RouteHead } from '@/lib/h3-route-head';
import { PriceAlerts } from '@/blocks/h3/price-alerts';
import { H3CostCalculator } from '@/components/h3/h3-cost-calculator';
import { H3PageFrame } from '@/components/h3/h3-page-frame';

function CostCalculatorPage() {
  return (
    <H3PageFrame>
      <H3CostCalculator />
      <PriceAlerts />
    </H3PageFrame>
  );
}

export const Route = createFileRoute('/cost-calculator')({
  head: () => h3RouteHead('calculator'),
  component: CostCalculatorPage,
});
