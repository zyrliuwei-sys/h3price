import { SiteFooter, type FooterColumn } from '@/components/site-footer';

export function Footer() {
  const columns: FooterColumn[] = [
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy-policy' },
        { label: 'Terms of Service', href: '/terms-of-service' },
      ],
    },
  ];

  return (
    <SiteFooter
      tagline="Published H3 Max pricing facts, free-tier context, and simple tools for planning a video-generation budget."
      columns={columns}
      socials={[]}
    />
  );
}
