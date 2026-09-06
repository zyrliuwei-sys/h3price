import { useForm } from '@tanstack/react-form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { Link } from '@/core/i18n/navigation';
import { apiPost } from '@/lib/api-client';
import { m } from '@/paraglide/messages.js';
import { TextField } from '@/components/form-field';
import { Button } from '@/components/ui/button';

export function PriceAlerts() {
  const mutation = useMutation({
    mutationFn: (value: { email: string; consent: boolean }) =>
      apiPost('/api/price-alerts', value),
  });
  const form = useForm({
    defaultValues: { email: '', consent: false },
    validators: {
      onSubmit: z.object({
        email: z.string().email().max(254),
        consent: z.boolean().refine(Boolean),
      }),
    },
    onSubmit: async ({ value }) => {
      try {
        await mutation.mutateAsync(value);
      } catch {
        /* Render the mutation error below. */
      }
    },
  });
  return (
    <section className="mt-12 rounded-2xl border border-cyan-200/20 bg-white/5 p-6 sm:p-8">
      <h2 className="text-2xl font-semibold text-white">
        {m['h3.alert.title']()}
      </h2>
      <p className="mt-3 text-neutral-400">{m['h3.alert.description']()}</p>
      {mutation.isSuccess ? (
        <p role="status" className="mt-5 text-cyan-200">
          {m['h3.alert.success']()}
        </p>
      ) : (
        <form
          className="mt-6 max-w-lg space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="email">
            {(field) => (
              <TextField
                field={field}
                type="email"
                label={m['h3.alert.email']()}
                autoComplete="email"
                required
              />
            )}
          </form.Field>
          <form.Field name="consent">
            {(field) => (
              <label className="flex items-start gap-3 text-sm text-neutral-300">
                <input
                  type="checkbox"
                  required
                  className="mt-1"
                  checked={field.state.value}
                  onChange={(e) => field.handleChange(e.target.checked)}
                />
                {m['h3.alert.consent']()}
              </label>
            )}
          </form.Field>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? '…' : m['h3.alert.submit']()}
          </Button>
          {mutation.isError && (
            <p role="alert" className="text-red-300">
              {mutation.error.message}
            </p>
          )}
        </form>
      )}
      <Link
        href="/privacy-policy"
        className="mt-4 inline-block text-sm text-cyan-100 underline"
      >
        {m['h3.footer.privacy']()}
      </Link>
    </section>
  );
}
