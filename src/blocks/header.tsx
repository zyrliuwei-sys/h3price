import { m } from '@/paraglide/messages.js';
import { SiteHeader } from '@/components/site-header';

export function Header() {
  const navLinks = [
    { href: '/', label: 'H3 Max Pricing' },
    { href: '/cost-calculator', label: 'Cost Calculator' },
    { href: '/prompt-generator', label: 'Prompt Generator' },
    { href: '/text-to-video', label: 'Text to Video' },
    { href: '/vs/veo-3-1', label: 'H3 Max vs Veo 3.1' },
    { href: '/pricing', label: m['landing.nav.pricing']() },
  ];

  return (
    <SiteHeader
      navLinks={navLinks}
      tone="cinema"
      primaryAction={{
        href: '/sign-in',
        label: 'Sign in',
      }}
    />
  );
}
