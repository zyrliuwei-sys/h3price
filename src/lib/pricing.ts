/**
 * MiniMax H3 Max pricing facts used across the public pricing pages.
 *
 * Sources: https://fal.ai/minimax-h3-max and
 * https://fal.ai/models/minimax/h3-max/text-to-video
 * Verified against the official landing on 2026-09-04; rechecked 2026-09-05.
 * Promotional language differs between official surfaces, so this site never
 * derives a sale rate from an unverified percentage. Confirm live offers on
 * fal.ai before purchasing.
 */

export const FAL_H3_MAX_LANDING_URL = 'https://fal.ai/minimax-h3-max';
export const FAL_H3_MAX_MODEL_URL =
  'https://fal.ai/models/minimax/h3-max/text-to-video';
export const FAL_H3_MODEL_URL =
  'https://fal.ai/models/minimax/h3/text-to-video';
export const GOOGLE_VEO_PRICING_URL =
  'https://ai.google.dev/gemini-api/docs/pricing';

export const PRICING_VERIFIED_AT = '2026-09-04';

export const REGULAR = {
  '480p': 0.05,
  '768p': 0.08,
} as const;

/**
 * Keep this at 0 until a single, current official promotional rate is chosen
 * for the calculator. The landing currently describes a 14-day half-price
 * offer; endpoint pages can use different launch language. Link users to the
 * official model page rather than publishing a stale calculated sale price.
 */
export const PROMO = {
  discountPct: 0,
} as const;

export const BASE_H3_RATES = {
  '480p': 0.05,
  '768p': 0.06,
  '2K': 0.13,
  '4K': 0.16,
} as const;

export const H3_MAX_FACTS = {
  launchedAt: '2026-08-25',
  maxDurationSeconds: 15,
  minDurationSeconds: 5,
  defaultResolution: '768p',
  fiveSecondRenderClaim: 'under 3 seconds',
} as const;

export type H3MaxResolution = keyof typeof REGULAR;

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function regularCost(
  resolution: H3MaxResolution,
  seconds: number,
  clips = 1
): number {
  return REGULAR[resolution] * seconds * clips;
}
