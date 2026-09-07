import type { ProactivGenerationValues } from '@/components/proactiv/proactiv-hero-composer';

// Keep local files across the landing page's client-side navigation.
let draft: ProactivGenerationValues | undefined;

export function saveVideoComposerDraft(value: ProactivGenerationValues) {
  draft = value;
}

export function takeVideoComposerDraft() {
  const value = draft;
  draft = undefined;
  return value;
}
