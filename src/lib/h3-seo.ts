export const SITE_URL = 'https://h3price.com';
export const DEFAULT_SOCIAL_IMAGE_URL = `${SITE_URL}/favicon.svg`;

export const h3PageSeo = {
  home: {
    title: 'H3 Max Pricing: Cost per Second & Deals (2026) | h3price.com',
    description:
      'H3 Max by fal.ai costs $0.08/sec at 768p ($4.80/min). See the full pricing table, launch promo, and cost calculator.',
    path: '/',
  },
  calculator: {
    title: 'H3 Max Cost Calculator: Estimate Your API Bill | h3price.com',
    description:
      'Calculate what H3 Max video generation costs. Pick resolution, duration, and volume to estimate your API cost.',
    path: '/cost-calculator',
  },
  promptGenerator: {
    title: 'MiniMax H3 Prompt Generator (Free, No Sign-up) | h3price.com',
    description:
      'Write better H3 Max video prompts in seconds. Pick a subject, action, style & camera move — generate an optimized English prompt.',
    path: '/prompt-generator',
  },
  veoComparison: {
    title: 'H3 Max vs Veo 3.1: Pricing, Speed & Quality Compared | h3price.com',
    description:
      'H3 Max vs Google Veo 3.1 head to head: pricing, speed, and use cases. Which video model fits your budget and workflow?',
    path: '/vs/veo-3-1',
  },
} as const;

export type H3PageKey = keyof typeof h3PageSeo;

export function canonicalUrl(path: string): string {
  return `${SITE_URL}${path}`;
}
