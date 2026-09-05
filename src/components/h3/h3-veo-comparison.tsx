import { Link } from '@/core/i18n/navigation';
import {
  FAL_H3_MAX_LANDING_URL,
  FAL_H3_MAX_MODEL_URL,
  GOOGLE_VEO_PRICING_URL,
  REGULAR,
} from '@/lib/pricing';

const comparisonRows = [
  {
    label: 'Pricing',
    h3: `Regular fal.ai API pricing: $${REGULAR['480p'].toFixed(2)}/sec at 480p and $${REGULAR['768p'].toFixed(2)}/sec at 768p.`,
    veo: 'Google lists paid Gemini API rates by Veo 3.1 tier and resolution; see the live official table before budgeting.',
  },
  {
    label: 'Generation speed',
    h3: 'fal officially claims a 5-second 768p H3 Max clip renders in under 3 seconds.',
    veo: 'No directly comparable speed number is stated here; confirm workflow timing in Google’s current documentation.',
  },
  {
    label: 'Max resolution',
    h3: '768p for H3 Max according to fal’s model documentation.',
    veo: 'Google’s Veo 3.1 pricing table lists 4K options for Standard and Fast; Lite does not support 4K.',
  },
  {
    label: 'Audio',
    h3: 'fal describes synchronized audio with every H3 Max generation.',
    veo: 'Google’s Veo 3.1 pricing table labels its listed video rates as including audio.',
  },
  {
    label: 'Access',
    h3: 'fal.ai provides pay-per-use H3 Max API endpoints; confirm current access terms on the official model page.',
    veo: 'Google Gemini API paid tier for the listed Veo 3.1 preview models; availability can change before a preview becomes stable.',
  },
  {
    label: 'Best for',
    h3: 'A published 768p per-second API rate and workflows that value fal’s stated fast render claim.',
    veo: 'A Google API workflow where the available Veo 3.1 tier, resolution, and paid rate suit the project.',
  },
] as const;

export function H3VeoComparison() {
  return (
    <section aria-labelledby="h3-veo-comparison-title">
      <p className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
        Official-source comparison
      </p>
      <h1
        id="h3-veo-comparison-title"
        className="mt-3 max-w-4xl text-4xl font-semibold tracking-[-0.045em] sm:text-5xl"
      >
        H3 Max vs Veo 3.1: Which AI Video Model Is Right for You?
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-300">
        This comparison distinguishes fal’s stated H3 Max facts from Google’s
        published Veo 3.1 API pricing and documentation. It does not treat
        either company’s quality or speed marketing as an independent ranking.
      </p>

      <div className="mt-9 overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[820px] text-left text-sm leading-6">
          <thead className="bg-white/[0.06] text-neutral-100">
            <tr>
              <th className="w-[18%] px-5 py-4 font-semibold">Dimension</th>
              <th className="w-[41%] px-5 py-4 font-semibold">H3 Max by fal</th>
              <th className="w-[41%] px-5 py-4 font-semibold">
                Google Veo 3.1
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-neutral-300">
            {comparisonRows.map((row) => (
              <tr key={row.label}>
                <th className="px-5 py-4 align-top font-semibold text-white">
                  {row.label}
                </th>
                <td className="px-5 py-4 align-top">{row.h3}</td>
                <td className="px-5 py-4 align-top">{row.veo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section className="mt-14 grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-semibold">
            Choose by budget and workflow
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-400">
            Start with H3 Max if you want to plan from fal’s published 480p/768p
            rates. Choose a Veo 3.1 tier only after checking Google’s current
            paid API table for the resolution and throughput you need.
          </p>
          <Link
            href="/cost-calculator"
            className="mt-5 inline-block text-sm font-semibold text-cyan-100 underline underline-offset-4"
          >
            Estimate H3 Max cost
          </Link>
        </article>
        <article className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <h2 className="text-xl font-semibold">
            Verify before a production run
          </h2>
          <p className="mt-3 text-sm leading-6 text-neutral-400">
            Model availability, preview terms, and promotions change. Use the
            official pages as the source of record before committing a budget or
            a delivery schedule.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold text-cyan-100">
            <a
              href={FAL_H3_MAX_LANDING_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              View H3 Max on fal.ai
            </a>
            <a
              href={GOOGLE_VEO_PRICING_URL}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              Google Veo 3.1 pricing
            </a>
          </div>
        </article>
      </section>

      <p className="mt-10 text-sm leading-6 text-neutral-500">
        H3 Max source:{' '}
        <a
          href={FAL_H3_MAX_MODEL_URL}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          fal.ai model documentation
        </a>
        . Veo 3.1 source:{' '}
        <a
          href={GOOGLE_VEO_PRICING_URL}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4"
        >
          Google Gemini API pricing
        </a>
        .
      </p>
    </section>
  );
}
