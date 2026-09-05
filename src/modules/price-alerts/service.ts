import { db } from '@/core/db';
import { priceAlert } from '@/config/db/schema';
import { getUuid } from '@/lib/hash';

export async function subscribe(email: string) {
  // Insert-only: repeat requests must not change an existing consent record.
  const values = { id: getUuid(), email, consentVersion: '2026-09-06' };
  const query = db().insert(priceAlert).values(values);
  if ('onConflictDoNothing' in query) await query.onConflictDoNothing();
  else await query.onDuplicateKeyUpdate({ set: { email } });
}
