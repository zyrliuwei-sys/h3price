import { createFileRoute } from '@tanstack/react-router';

// Bing Webmaster Tools verification file. Must stay byte-for-byte as issued.
const BING_SITE_AUTH_XML = `<?xml version="1.0"?>
<users>
	<user>B0CDD13837D509DA74D7BD8E5CD0629C</user>
</users>
`;

export const Route = createFileRoute('/BingSiteAuth.xml')({
  server: {
    handlers: {
      GET: () =>
        new Response(BING_SITE_AUTH_XML, {
          headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, max-age=3600',
            'X-Robots-Tag': 'noindex',
          },
        }),
    },
  },
});
