import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import { subscribe } from '@/modules/price-alerts/service';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

const schema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  consent: z.literal(true),
});
async function POST({ request }: { request: Request }) {
  const origin = request.headers.get('origin');
  if (!origin || origin !== new URL(request.url).origin)
    return respErr('Invalid origin', { status: 403 });
  if (Number(request.headers.get('content-length') || 0) > 2048)
    return respErr('Request too large', { status: 413 });
  const limited = enforceMinIntervalRateLimit(request, {
    intervalMs: 10_000,
    keyPrefix: 'price-alerts',
  });
  if (limited) return limited;
  const raw = await request.text();
  if (raw.length > 2048) return respErr('Request too large', { status: 413 });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return respErr('Invalid request', { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return respErr('A valid email and explicit consent are required', {
      status: 400,
    });
  try {
    await subscribe(parsed.data.email);
    return respData(
      { subscribed: true },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch {
    return respErr('Unable to save your request. Please try again later.', {
      status: 503,
    });
  }
}
export const Route = createFileRoute('/api/price-alerts')({
  server: { handlers: { POST } },
});
