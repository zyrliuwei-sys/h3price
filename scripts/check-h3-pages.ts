import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';

import { envConfigs } from '../src/config';
import { priceAlert } from '../src/config/db/schema';
import { db } from '../src/core/db';

const base = process.env.H3_CHECK_ORIGIN || 'http://localhost:3001';
const siteOrigin = new URL(envConfigs.site_url).origin;
const paths = ['/', '/cost-calculator', '/prompt-generator', '/vs/veo-3-1'];
for (const path of paths) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /property="og:image" content="https:\/\/[^" ]+\.png"/);
  assert.match(html, /name="twitter:image" content="https:\/\/[^" ]+\.png"/);
  const main = html.match(/<main[ >][\s\S]*?<\/main>/)?.[0] || '';
  assert.ok(main.length > 200);
  if (path === '/') assert.match(main, /id="proactiv-reference-composer"/);
  for (const link of ['/cost-calculator', '/prompt-generator'].filter(
    (link) => link !== path
  ))
    assert.ok(main.includes(`href="${link}"`), `${path} links to ${link}`);
}
for (const path of [
  'sign-in',
  'sign-up',
  'verify-email',
  'forgot-password',
  'reset-password',
  'auth-callback',
  'redeem-invite',
]) {
  const html = await (await fetch(`${base}/${path}`)).text();
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.match(html, /name="description" content="[^" ]/);
}
const sitemap = await fetch(base + '/sitemap.xml');
assert.equal(sitemap.status, 200);
const xml = await sitemap.text();
assert.equal((xml.match(/<loc>/g) || []).length, 4);
for (const path of paths) assert.ok(xml.includes(`${siteOrigin}${path}`));
const robots = await fetch(base + '/robots.txt');
assert.equal(robots.status, 200);
assert.ok((await robots.text()).includes(`Sitemap: ${siteOrigin}/sitemap.xml`));
const png = await fetch(base + '/imgs/h3-price-card.png');
assert.equal(png.status, 200);
const bytes = Buffer.from(await png.arrayBuffer());
assert.equal(bytes.readUInt32BE(16), 1200);
assert.equal(bytes.readUInt32BE(20), 630);
const email = `alert-check-${randomUUID()}@example.invalid`;
const post = (body: unknown, origin = base) =>
  fetch(base + '/api/price-alerts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: origin,
      Cookie: `qa=${randomUUID()}`,
    },
    body: JSON.stringify(body),
  });
try {
  assert.equal((await post({ email, consent: false })).status, 400);
  assert.equal(
    (await post({ email, consent: true }, 'https://example.invalid')).status,
    403
  );
  for (let i = 0; i < 2; i++) {
    const result = await post({ email, consent: true });
    assert.equal(result.status, 200);
    assert.equal((await result.json()).data.subscribed, true);
  }
  const rows = await db()
    .select()
    .from(priceAlert)
    .where(eq(priceAlert.email, email));
  assert.equal(rows.length, 1);
  assert.equal(rows[0].consentVersion, '2026-09-06');
} finally {
  await db().delete(priceAlert).where(eq(priceAlert.email, email));
}
const rejected = await fetch(base + '/api/auth/sign-up/email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Origin: base },
  body: JSON.stringify({ email, password: 'unused-test-password', name: 'QA' }),
});
assert.equal(rejected.status, 400);
console.log(
  'PASS SSR metadata, internal links, auth noindex, sitemap, robots, 1200×630 PNG, anonymous alert persistence/deduplication, consent and origin rejection.'
);
process.exit(0);
