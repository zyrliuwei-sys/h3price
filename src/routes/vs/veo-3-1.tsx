import { createFileRoute } from '@tanstack/react-router';

import { h3RouteHead } from '@/lib/h3-route-head';
import { H3PageFrame } from '@/components/h3/h3-page-frame';
import { H3VeoComparison } from '@/components/h3/h3-veo-comparison';

function VeoComparisonPage() {
  return (
    <H3PageFrame>
      <H3VeoComparison />
    </H3PageFrame>
  );
}

export const Route = createFileRoute('/vs/veo-3-1')({
  head: () => h3RouteHead('veoComparison'),
  component: VeoComparisonPage,
});
