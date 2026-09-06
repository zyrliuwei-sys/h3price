import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { h3RouteHead } from '@/lib/h3-route-head';
import { H3Tools } from '@/blocks/h3/tools';
import { H3PageFrame } from '@/components/h3/h3-page-frame';
import { H3PromptGenerator } from '@/components/h3/h3-prompt-generator';

const promptGeneratorSearchSchema = z.object({
  prompt: z.string().max(4000).optional(),
});

function PromptGeneratorPage() {
  const { prompt } = Route.useSearch();
  return (
    <H3PageFrame>
      <H3PromptGenerator initialSubject={prompt} />
      <H3Tools />
    </H3PageFrame>
  );
}

export const Route = createFileRoute('/prompt-generator')({
  validateSearch: promptGeneratorSearchSchema,
  head: () => h3RouteHead('promptGenerator'),
  component: PromptGeneratorPage,
});
