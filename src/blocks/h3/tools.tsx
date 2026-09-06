import { Link } from '@/core/i18n/navigation';
import { m } from '@/paraglide/messages.js';

export function H3Tools() {
  const tools = [
    {
      href: '/prompt-generator',
      title: m['h3.tools.prompt'](),
      description: m['h3.tools.prompt_desc'](),
    },
    {
      href: '/cost-calculator',
      title: m['h3.tools.calculator'](),
      description: m['h3.tools.calculator_desc'](),
    },
    {
      href: '/vs/veo-3-1',
      title: m['h3.tools.vs'](),
      description: m['h3.tools.vs_desc'](),
    },
  ];
  return (
    <section
      className="mx-auto max-w-7xl px-5 py-16 sm:px-8"
      aria-labelledby="h3-tools-title"
    >
      <h2 id="h3-tools-title" className="text-3xl font-semibold text-white">
        {m['h3.tools.title']()}
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {tools.map((tool) => (
          <article
            key={tool.href}
            className="rounded-2xl border border-white/15 bg-white/5 p-6"
          >
            <h3 className="text-xl font-semibold text-cyan-100">
              <Link
                href={tool.href}
                className="underline-offset-4 hover:underline"
              >
                {tool.title} →
              </Link>
            </h3>
            <p className="mt-4 leading-7 text-neutral-400">
              {tool.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
