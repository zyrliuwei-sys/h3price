import { m } from '@/paraglide/messages.js';
import { SiteFooter, type FooterColumn } from '@/components/site-footer';

export function Footer() {
  const columns: FooterColumn[] = [
    {
      title: m['h3.tools.title'](),
      links: [
        { label: m['h3.tools.home'](), href: '/' },
        { label: m['h3.tools.prompt'](), href: '/prompt-generator' },
        { label: m['h3.tools.calculator'](), href: '/cost-calculator' },
        { label: m['h3.tools.vs'](), href: '/vs/veo-3-1' },
      ],
    },
    {
      title: m['h3.footer.legal'](),
      links: [
        { label: m['h3.footer.privacy'](), href: '/privacy-policy' },
        { label: m['h3.footer.terms'](), href: '/terms-of-service' },
      ],
    },
  ];
  return (
    <SiteFooter
      tagline={m['h3.footer.tagline']()}
      columns={columns}
      socials={[]}
      badges={[
        {
          href: 'https://fazier.com/launches/www.h3price.com',
          src: 'https://fazier.com/api/v1/public/badges/launch_badges.svg?badge_type=featured&theme=light',
          alt: 'Fazier badge',
          width: 250,
        },
        {
          href: 'https://tooldirs.com',
          src: 'https://tooldirs.com/badge/badge_dark.svg',
          alt: 'Featured on ToolDirs',
          width: 200,
          height: 54,
        },
      ]}
    />
  );
}
