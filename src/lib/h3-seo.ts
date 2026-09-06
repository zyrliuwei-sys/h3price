import { envConfigs } from '@/config';

export const SITE_URL = new URL(envConfigs.site_url).origin;
export const DEFAULT_SOCIAL_IMAGE_URL = `${SITE_URL}/imgs/h3-price-card.png`;

export const h3PageSeo = {
  home: {
    title: `H3 Max Pricing: Cost per Second & Deals (2026) | ${envConfigs.app_name}`,
    description:
      'H3 Max by fal.ai costs $0.08/sec at 768p ($4.80/min). See the full pricing table, launch promo, and cost calculator.',
    path: '/',
  },
  calculator: {
    title: `H3 Max Cost Calculator: Estimate Your API Bill | ${envConfigs.app_name}`,
    description:
      'Calculate what H3 Max video generation costs. Pick resolution, duration, and volume to estimate your API cost.',
    path: '/cost-calculator',
  },
  promptGenerator: {
    title: `MiniMax H3 Prompt Generator (Free, No Sign-up) | ${envConfigs.app_name}`,
    description:
      'Write better H3 Max video prompts in seconds. Pick a subject, action, style & camera move — generate an optimized English prompt.',
    path: '/prompt-generator',
  },
  veoComparison: {
    title: `H3 Max vs Veo 3.1: Pricing, Speed & Quality Compared | ${envConfigs.app_name}`,
    description:
      'H3 Max vs Google Veo 3.1 head to head: pricing, speed, and use cases. Which video model fits your budget and workflow?',
    path: '/vs/veo-3-1',
  },
} as const;

export type H3PageKey = keyof typeof h3PageSeo;

export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
