import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { Link } from '@/core/i18n/navigation';
import {
  FAL_H3_MAX_MODEL_URL,
  formatUsd,
  PROMO,
  REGULAR,
  regularCost,
  type H3MaxResolution,
} from '@/lib/pricing';

const inputClassName =
  'mt-2 w-full rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-white outline-none focus:border-cyan-200/80';

/** Client-side only arithmetic; no model API, account, or payment dependency. */
export function H3CostCalculator() {
  const [resolution, setResolution] = useState<H3MaxResolution>('768p');
  const [seconds, setSeconds] = useState(15);
  const [clips, setClips] = useState(5);
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    const unitCost = regularCost(resolution, seconds);
    const total = regularCost(resolution, seconds, clips);

    return { total, unitCost };
  }, [clips, resolution, seconds]);

  const copyResult = async () => {
    const text = [
      `H3 Max estimate: ${resolution}, ${seconds}s × ${clips} clip${clips === 1 ? '' : 's'}`,
      `Regular single-clip cost: ${formatUsd(result.unitCost)}`,
      `Estimated total: ${formatUsd(result.total)}`,
      `Verify current pricing: ${FAL_H3_MAX_MODEL_URL}`,
    ].join('\n');
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section aria-labelledby="h3-cost-calculator-title">
      <p className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
        Free planning tool
      </p>
      <h1
        id="h3-cost-calculator-title"
        className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl"
      >
        H3 Max Cost Calculator
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-300">
        Estimate the published fal.ai API cost from resolution, duration, and
        output count. This calculator does not call an API or purchase anything.
      </p>

      <aside className="mt-8 rounded-xl border border-amber-200/30 bg-amber-100/10 px-4 py-3 text-sm leading-6 text-amber-50">
        <strong>Launch promo:</strong> official surfaces may show different
        launch wording. Rates below are regular prices.{' '}
        {PROMO.discountPct > 0 ? (
          <span>
            This estimate includes the configured {PROMO.discountPct}% promo.
          </span>
        ) : (
          <a
            href={FAL_H3_MAX_MODEL_URL}
            target="_blank"
            rel="noreferrer"
            className="font-semibold underline underline-offset-4"
          >
            Check fal.ai for the live promotional rate.
          </a>
        )}
      </aside>

      <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <form className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          <label className="block text-sm font-semibold text-white">
            Resolution
            <select
              value={resolution}
              onChange={(event) =>
                setResolution(event.target.value as H3MaxResolution)
              }
              className={inputClassName}
            >
              {Object.entries(REGULAR).map(([value, rate]) => (
                <option key={value} value={value}>
                  {value} — ${rate.toFixed(2)}/sec
                </option>
              ))}
            </select>
          </label>

          <label className="mt-6 block text-sm font-semibold text-white">
            Duration: {seconds} seconds
            <input
              className="mt-4 w-full accent-cyan-200"
              type="range"
              min="1"
              max="60"
              value={seconds}
              onChange={(event) => setSeconds(Number(event.target.value))}
            />
            <span className="mt-2 block text-xs leading-5 font-normal text-neutral-400">
              Official H3 Max pages describe individual generations from 5 to 15
              seconds. Values outside that range are rate estimates only, not a
              claim about a supported single generation.
            </span>
          </label>

          <label className="mt-6 block text-sm font-semibold text-white">
            Number of clips
            <input
              className={inputClassName}
              type="number"
              min="1"
              max="100"
              value={clips}
              onChange={(event) =>
                setClips(
                  Math.min(100, Math.max(1, Number(event.target.value) || 1))
                )
              }
            />
          </label>
        </form>

        <div className="rounded-2xl border border-cyan-200/20 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.13),rgba(255,255,255,0.04)_55%)] p-5 sm:p-6">
          <p className="text-sm font-medium text-neutral-300">Your estimate</p>
          <p className="mt-2 text-5xl font-semibold tracking-[-0.06em] text-white tabular-nums">
            {formatUsd(result.total)}
          </p>
          <p className="mt-3 text-sm leading-6 text-neutral-300">
            {clips} clip{clips === 1 ? '' : 's'} at the published regular rate.
          </p>

          <dl className="mt-8 grid gap-3 sm:grid-cols-2">
            <ResultItem
              label="Regular cost per clip"
              value={formatUsd(result.unitCost)}
            />
            <ResultItem label="Clips billed" value={String(clips)} />
            <ResultItem
              label="Regular price per second"
              value={`$${REGULAR[resolution].toFixed(2)}`}
            />
          </dl>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={copyResult}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200"
            >
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
              {copied ? 'Copied' : 'Copy result'}
            </button>
            <a
              href={FAL_H3_MAX_MODEL_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-lg border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Verify on fal.ai
            </a>
          </div>
        </div>
      </div>

      <CostExamples />
      <section className="mt-14 grid gap-8 border-t border-white/10 pt-12 md:grid-cols-3">
        <CopySection
          title="What Affects H3 Max Pricing"
          body="Regular cost is the published per-second rate multiplied by output duration and the number of generations. The selected resolution changes the rate."
        />
        <CopySection
          title="How to Save on H3 Max API Costs"
          body="Test a short brief before making more versions, set the duration deliberately, and confirm any live launch offer on fal.ai."
        />
        <CopySection
          title="Write before you render"
          body="A specific prompt can reduce unplanned reruns. Use the free prompt generator to assemble the subject, action, style, camera, and sound direction first."
          link={{
            href: '/prompt-generator',
            label: 'Open the prompt generator',
          }}
        />
      </section>

      <nav className="mt-12 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-cyan-100">
        <Link href="/" className="underline underline-offset-4">
          H3 Max pricing explained
        </Link>
        <Link href="/prompt-generator" className="underline underline-offset-4">
          MiniMax H3 prompt generator
        </Link>
      </nav>
    </section>
  );
}

function ResultItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/20 p-3">
      <dt className="text-xs text-neutral-400">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-white tabular-nums">
        {value}
      </dd>
    </div>
  );
}

function CostExamples() {
  const rows = [5, 15, 60].map((seconds) => ({
    seconds,
    paid: regularCost('768p', seconds),
  }));
  return (
    <section className="mt-14" aria-labelledby="cost-examples-title">
      <h2 id="cost-examples-title" className="text-2xl font-semibold">
        Cost Examples
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
        These examples use the regular 768p rate. The one-minute entry is a rate
        comparison, not a claim that H3 Max accepts a 60-second request.
      </p>
      <div className="mt-5 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[620px] text-left text-sm">
          <thead className="bg-white/[0.06] text-neutral-300">
            <tr>
              <th className="px-4 py-3 font-semibold">Duration</th>
              <th className="px-4 py-3 font-semibold">Regular 768p cost</th>
              <th className="px-4 py-3 font-semibold">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10 text-neutral-300">
            {rows.map(({ seconds, paid }) => (
              <tr key={seconds}>
                <td className="px-4 py-3">
                  {seconds === 60 ? '1 minute' : `${seconds} seconds`}
                </td>
                <td className="px-4 py-3 tabular-nums">{formatUsd(paid)}</td>
                <td className="px-4 py-3 text-neutral-400">
                  {seconds <= 15
                    ? 'Typical individual-generation duration'
                    : 'Rate illustration only'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CopySection({
  title,
  body,
  link,
}: {
  title: string;
  body: string;
  link?: { href: string; label: string };
}) {
  return (
    <section>
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-neutral-400">{body}</p>
      {link ? (
        <Link
          href={link.href}
          className="mt-4 inline-block text-sm font-semibold text-cyan-100 underline underline-offset-4"
        >
          {link.label}
        </Link>
      ) : null}
    </section>
  );
}
