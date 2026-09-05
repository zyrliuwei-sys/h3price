import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import { getAllConfigs } from '@/modules/config/service';
import { respErr } from '@/lib/resp';

// better-auth catch-all — the handler takes a standard Request and
// returns a standard Response, so it mounts directly.
async function handle(request: Request) {
  if (
    request.method === 'POST' &&
    new URL(request.url).pathname.endsWith('/sign-up/email')
  ) {
    const body = await request
      .clone()
      .json()
      .catch(() => null);
    if (body?.privacyConsent !== true)
      return respErr('Privacy consent is required', { status: 400 });
  }
  const configs = await getAllConfigs();
  const auth = getAuth(configs);
  return auth.handler(request);
}

export const Route = createFileRoute('/api/auth/$')({
  server: {
    handlers: {
      GET: ({ request }) => handle(request),
      POST: ({ request }) => handle(request),
    },
  },
});
