import { useEffect, useRef, useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowDownToLine,
  ArrowUpRight,
  ImagePlus,
  Loader2,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

import { useSession } from '@/core/auth/client';
import { Link, useRouter } from '@/core/i18n/navigation';
import { apiGet, apiPost } from '@/lib/api-client';
import {
  H3_IMAGE_API,
  H3_IMAGE_CREDITS,
  H3_IMAGE_RATIOS,
  H3_IMAGE_RESOLUTIONS,
  h3ImageDimensions,
  h3ImageInputSchema,
  isH3ImageTerminal,
  type H3ImageInput,
  type H3ImageTask,
} from '@/lib/h3-image';

export type ImageGeneratorCopy = {
  prompt: string;
  placeholder: string;
  ratio: string;
  resolution: string;
  generate: string;
  generating: string;
  credits: (count: number) => string;
  oneImage: string;
  model: string;
  queued: string;
  processing: string;
  ready: string;
  failed: string;
  statusError: string;
  retry: string;
  download: string;
  open: string;
  preview: string;
  example: string;
  login: string;
  insufficient: string;
  improve: string;
  history: string;
};
export type ImagePromptPreset = { label: string; prompt: string };
type Props = {
  copy: ImageGeneratorCopy;
  presets: ImagePromptPreset[];
  compact?: boolean;
  selectedPrompt?: { prompt: string; id: number };
};
const initialValues: H3ImageInput = {
  prompt: '',
  aspectRatio: '1:1',
  resolution: '2K',
};
const draftKey = 'h3-image:prompt-draft';

/** One paid image per submission; both public entry points use this component. */
export function ImageGenerator({
  copy,
  presets,
  compact = false,
  selectedPrompt,
}: Props) {
  const { data: session, isPending: sessionPending } = useSession();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const userId = session?.user.id;
  const storageKey = userId ? `h3-image:task:${userId}` : null;

  const taskQuery = useQuery({
    queryKey: ['h3-image-task', userId, taskId],
    queryFn: () =>
      apiGet<H3ImageTask>(
        `${H3_IMAGE_API}?taskId=${encodeURIComponent(taskId!)}`
      ),
    enabled: Boolean(userId && taskId),
    retry: 2,
    refetchInterval: (query) =>
      query.state.status === 'error' ||
      isH3ImageTerminal(query.state.data?.status ?? '')
        ? false
        : 3000,
    refetchIntervalInBackground: false,
  });
  const task = taskQuery.data;
  const pending = Boolean(
    taskId && !isH3ImageTerminal(task?.status ?? '') && !taskQuery.isError
  );
  const mutation = useMutation({
    mutationFn: (value: H3ImageInput) =>
      apiPost<H3ImageTask>(H3_IMAGE_API, value),
    onSuccess: (created) => {
      queryClient.setQueryData(['h3-image-task', userId, created.id], created);
      setTaskId(created.id);
      try {
        if (storageKey) sessionStorage.setItem(storageKey, created.id);
      } catch {
        /* Storage is optional. */
      }
      queryClient.invalidateQueries({ queryKey: ['credits'] });
    },
    onError: (cause: Error) =>
      setError(
        cause.message === 'Insufficient credits'
          ? copy.insufficient
          : cause.message
      ),
  });
  const busy = mutation.isPending || pending;
  const form = useForm({
    defaultValues: initialValues,
    validators: { onSubmit: h3ImageInputSchema },
    onSubmit: async ({ value }) => {
      setError('');
      if (!userId) {
        try {
          sessionStorage.setItem(draftKey, JSON.stringify(value));
        } catch {
          /* Storage is optional. */
        }
        router.push(
          `/sign-in?callbackUrl=${encodeURIComponent('/h3-image#create')}`
        );
        return;
      }
      await mutation.mutateAsync(value).catch(() => undefined);
    },
  });

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(draftKey);
      if (raw) {
        const parsed = h3ImageInputSchema.safeParse(JSON.parse(raw));
        if (parsed.success) {
          form.setFieldValue('prompt', parsed.data.prompt);
          form.setFieldValue('aspectRatio', parsed.data.aspectRatio);
          form.setFieldValue('resolution', parsed.data.resolution);
        }
        sessionStorage.removeItem(draftKey);
      }
    } catch {
      /* A saved draft is optional. */
    }
  }, []);
  useEffect(() => {
    setTaskId(null);
    if (!storageKey) return;
    try {
      setTaskId(sessionStorage.getItem(storageKey));
    } catch {
      /* Storage is optional. */
    }
  }, [storageKey]);
  useEffect(() => {
    if (!selectedPrompt) return;
    form.setFieldValue('prompt', selectedPrompt.prompt);
    textareaRef.current?.focus({ preventScroll: true });
  }, [selectedPrompt]);
  useEffect(() => {
    if (task && isH3ImageTerminal(task.status))
      queryClient.invalidateQueries({ queryKey: ['credits'] });
  }, [task?.id, task?.status, queryClient]);

  const result = task?.resultUrls[0];
  const showResult = !compact || Boolean(taskId || mutation.isPending || error);
  return (
    <div
      className={
        compact
          ? 'h3-image-tool'
          : 'h3-image-tool grid gap-5 lg:grid-cols-[0.9fr_1.1fr]'
      }
    >
      <form
        className={`flex min-w-0 flex-col rounded-2xl border border-white/10 bg-[#181a1d] ${compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'}`}
        onSubmit={(event) => {
          event.preventDefault();
          if (!busy) void form.handleSubmit();
        }}
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-sm font-medium text-[#f4eee4]">
            <Sparkles className="size-4 text-[#eab574]" aria-hidden="true" />
            {copy.model}
          </span>
          <span className="font-mono text-[10px] tracking-wider text-neutral-400">
            TEXT → IMAGE
          </span>
        </div>
        <form.Field name="prompt">
          {(field) => (
            <div>
              <label
                htmlFor={compact ? 'h3-image-prompt-home' : 'h3-image-prompt'}
                className="mb-2 block text-xs text-neutral-400"
              >
                {copy.prompt}
              </label>
              <textarea
                ref={textareaRef}
                id={compact ? 'h3-image-prompt-home' : 'h3-image-prompt'}
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder={copy.placeholder}
                maxLength={8000}
                disabled={busy}
                aria-invalid={field.state.meta.errors.length > 0}
                className={`w-full resize-y rounded-xl border border-white/10 bg-[#101214] p-4 text-sm leading-7 text-neutral-100 outline-none placeholder:text-neutral-400 focus:border-[#eab574]/60 focus:ring-2 focus:ring-[#eab574]/10 disabled:opacity-60 ${compact ? 'min-h-28' : 'min-h-44'}`}
              />
              <div className="mt-2 flex justify-end font-mono text-[10px] text-neutral-400">
                {field.state.value.length.toLocaleString()} / 8,000
              </div>
            </div>
          )}
        </form.Field>
        <div className="mt-1 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset.label}
              type="button"
              disabled={busy}
              onClick={() => form.setFieldValue('prompt', preset.prompt)}
              className="min-h-9 rounded-full border border-white/10 px-3 text-xs text-neutral-400 transition-colors hover:border-[#eab574]/40 hover:text-[#eab574] disabled:opacity-50"
            >
              {preset.label}
            </button>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3">
          <form.Field name="aspectRatio">
            {(field) => (
              <label className="grid gap-2 text-xs text-neutral-400">
                {copy.ratio}
                <select
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value as H3ImageInput['aspectRatio']
                    )
                  }
                  disabled={busy}
                  className="min-h-11 w-full rounded-lg border border-white/10 bg-[#101214] px-3 text-sm text-neutral-100 outline-none focus:border-[#eab574]"
                >
                  {H3_IMAGE_RATIOS.map((ratio) => (
                    <option key={ratio}>{ratio}</option>
                  ))}
                </select>
              </label>
            )}
          </form.Field>
          <form.Field name="resolution">
            {(field) => (
              <label className="grid gap-2 text-xs text-neutral-400">
                {copy.resolution}
                <select
                  value={field.state.value}
                  onChange={(event) =>
                    field.handleChange(
                      event.target.value as H3ImageInput['resolution']
                    )
                  }
                  disabled={busy}
                  className="min-h-11 w-full rounded-lg border border-white/10 bg-[#101214] px-3 text-sm text-neutral-100 outline-none focus:border-[#eab574]"
                >
                  {H3_IMAGE_RESOLUTIONS.map((size) => (
                    <option key={size}>{size}</option>
                  ))}
                </select>
              </label>
            )}
          </form.Field>
        </div>
        <form.Subscribe selector={(state) => state.values}>
          {(values) => {
            const dimensions = h3ImageDimensions(values);
            return (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-400">
                <span>
                  {copy.oneImage} · {dimensions.width} × {dimensions.height}
                </span>
                <span className="text-[#eab574]">
                  {copy.credits(H3_IMAGE_CREDITS[values.resolution])}
                </span>
              </div>
            );
          }}
        </form.Subscribe>
        {error && (
          <p role="alert" className="mt-4 text-sm leading-6 text-red-300">
            {error}
            {error === copy.insufficient && (
              <>
                {' '}
                <Link href="/pricing" className="underline">
                  {copy.improve}
                </Link>
              </>
            )}
          </p>
        )}
        <form.Subscribe selector={(state) => state.values.prompt}>
          {(prompt) => (
            <button
              type="submit"
              disabled={busy || !prompt.trim() || sessionPending}
              className="mt-6 flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#eab574] px-4 text-sm font-semibold text-[#1c1710] transition-colors hover:bg-[#f4c990] disabled:cursor-not-allowed disabled:bg-[#38342e] disabled:text-neutral-400"
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="size-4" aria-hidden="true" />
              )}
              {busy
                ? copy.generating
                : !userId && !sessionPending
                  ? copy.login
                  : copy.generate}
            </button>
          )}
        </form.Subscribe>
        {!compact && (
          <p className="mt-3 text-center text-[11px] leading-5 text-neutral-400">
            {copy.history}
          </p>
        )}
      </form>
      {showResult && (
        <div
          ref={resultRef}
          aria-label={copy.preview}
          className={`relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141619] ${compact ? 'mt-4' : ''}`}
        >
          {result ? (
            <>
              <a
                href={result}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-64 flex-1 items-center justify-center bg-[#0c0d0f]"
              >
                <img
                  src={result}
                  alt={task?.prompt || copy.preview}
                  className="max-h-[640px] w-full object-contain"
                />
              </a>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
                <span className="text-xs text-neutral-400">
                  {copy.ready} · {copy.credits(task?.credits ?? 0)}
                </span>
                <a
                  href={`${H3_IMAGE_API}?taskId=${encodeURIComponent(taskId!)}&download=1`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/15 px-3 text-xs text-white hover:border-[#eab574]"
                >
                  <ArrowDownToLine className="size-3.5" aria-hidden="true" />
                  {copy.download}
                </a>
              </div>
            </>
          ) : busy ? (
            <div
              className="flex min-h-72 flex-1 flex-col items-center justify-center gap-4 p-8 text-center"
              role="status"
              aria-live="polite"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl border border-[#eab574]/25 bg-[#eab574]/5">
                <Loader2
                  className="size-6 animate-spin text-[#eab574]"
                  aria-hidden="true"
                />
              </div>
              <p className="text-sm text-neutral-300">
                {task?.status === 'processing' ? copy.processing : copy.queued}
              </p>
            </div>
          ) : taskQuery.isError ||
            (task && ['failed', 'canceled'].includes(task.status)) ? (
            <div
              className="flex min-h-56 flex-1 flex-col items-center justify-center gap-4 p-7 text-center"
              role="alert"
            >
              <ImagePlus className="size-7 text-neutral-400" />
              <p className="max-w-sm text-sm leading-7 text-neutral-400">
                {taskQuery.isError
                  ? copy.statusError
                  : task?.errorMessage || copy.failed}
              </p>
              {taskQuery.isError && (
                <button
                  type="button"
                  onClick={() => void taskQuery.refetch()}
                  className="flex min-h-10 items-center gap-2 text-sm text-[#eab574]"
                >
                  <RotateCcw className="size-4" />
                  {copy.retry}
                </button>
              )}
            </div>
          ) : !compact ? (
            <>
              <div className="relative flex-1">
                <img
                  src="/h3-image/editorial.webp"
                  alt={copy.example}
                  width={1800}
                  height={1013}
                  className="h-full min-h-80 w-full object-cover"
                />
                <span className="absolute top-4 left-4 rounded bg-black/60 px-2.5 py-1.5 font-mono text-[10px] tracking-widest text-white">
                  {copy.example}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-white/10 px-5 py-4 text-xs text-neutral-400">
                <span>{copy.preview}</span>
                <a
                  href="https://fal.ai/models/minimax/h3-image/text-to-image"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 hover:text-white"
                >
                  fal.ai
                  <ArrowUpRight className="size-3.5" />
                </a>
              </div>
            </>
          ) : null}
        </div>
      )}
    </div>
  );
}
