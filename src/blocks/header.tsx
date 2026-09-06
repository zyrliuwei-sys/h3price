import { SiteHeader } from '@/components/site-header';

export function Header() {
  const navLinks = [
    { href: '/', label: 'H3 Max Pricing' },
    { href: '/cost-calculator', label: 'Cost Calculator' },
    { href: '/prompt-generator', label: 'Prompt Generator' },
    { href: '/text-to-image', label: 'Text to Image' },
    { href: '/vs/veo-3-1', label: 'H3 Max vs Veo 3.1' },
    { href: '/pricing', label: 'Plans' },
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
