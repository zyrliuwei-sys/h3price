import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import {
  AITaskStatus as BillingTaskStatus,
  createTask,
  updateTask,
} from '@/modules/ai-tasks/service';
import { getAllConfigs } from '@/modules/config/service';
import {
  FAL_H3_MAX_IMAGE_TO_VIDEO_MODEL,
  FAL_H3_MAX_REFERENCE_TO_VIDEO_MODEL,
  FAL_H3_MAX_TEXT_TO_VIDEO_MODEL,
  getFalH3MaxDownloadUrl,
  getFalH3MaxTask,
  h3MaxModelForMode,
  listFalH3MaxTasks,
  submitFalH3MaxTask,
  validateFalH3MaxInput,
  type FalH3MaxInput,
  type FalH3MaxMode,
  type FalH3MaxResolution,
  type FalH3MaxTask,
} from '@/modules/fal-h3-max/service';
import { enqueueGeneration } from '@/modules/generation-queue/service';
import { h3MaxCreditsForSeconds } from '@/lib/h3-max-retail-plans';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

import { getPersistentOutputSaver } from './-persistent-output';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function stringArray(value: unknown): string[] {
  if (typeof value === 'string') return [value.trim()].filter(Boolean);
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === 'string')
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseInput(body: unknown): FalH3MaxInput {
  const input = isRecord(body) ? body : {};
  const mode: FalH3MaxMode =
    input.mode === 'image-to-video' || input.mode === 'reference-to-video'
      ? input.mode
      : 'text-to-video';
  const resolution: FalH3MaxResolution =
    input.resolution === '480P' ? '480P' : '768P';
  const duration = typeof input.duration === 'number' ? input.duration : 5;

  return {
    aspectRatio:
      typeof input.aspectRatio === 'string'
        ? input.aspectRatio.trim()
        : undefined,
    duration,
    imageUrls: stringArray(input.imageUrls),
    mode,
    prompt: typeof input.prompt === 'string' ? input.prompt.trim() : '',
    promptExpansionMode:
      input.promptExpansionMode === 'quality' ? 'quality' : 'balanced',
    resolution,
    ...(typeof input.seed === 'number' ? { seed: input.seed } : {}),
    videoUrls: stringArray(input.videoUrls),
  };
}

async function configuredApiKey() {
  const apiKey = (await getAllConfigs()).fal_api_key?.trim();
  if (!apiKey) {
    throw new Error(
      'Fal API key is not configured. Add it in Admin → Settings → AI → Fal.'
    );
  }
  return apiKey;
}

async function settleFailedH3Task(task: FalH3MaxTask) {
  if (task.status === 'failed' || task.status === 'canceled') {
    await updateTask({
      taskId: task.id,
      status:
        task.status === 'canceled'
          ? BillingTaskStatus.CANCELED
          : BillingTaskStatus.FAILED,
    });
  }
  return task;
}

async function POST({ request }: { request: Request }) {
  let billingTaskId: string | undefined;
  let submittedUpstream = false;

  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const limited = enforceMinIntervalRateLimit(request, {
      intervalMs: 1_000,
      keyPrefix: 'fal-h3-max',
      extraKey: session.user.id,
    });
    if (limited) return limited;

    const input = parseInput(await request.json().catch(() => ({})));
    validateFalH3MaxInput(input);
    const apiKey = await configuredApiKey();
    const model = h3MaxModelForMode(input.mode);
    const billingTask = await createTask({
      userId: session.user.id,
      mediaType: 'video',
      provider: 'fal',
      model,
      prompt: input.prompt,
      options: input,
      costCredits: h3MaxCreditsForSeconds({
        duration: input.duration ?? 5,
        resolution: input.resolution ?? '768P',
      }),
    });
    billingTaskId = billingTask.id;
    const task = await enqueueGeneration(() =>
      submitFalH3MaxTask({
        apiKey,
        input,
        taskId: billingTask.id,
        userId: session.user.id,
      })
    );
    submittedUpstream = true;
    return respData(await settleFailedH3Task(task));
  } catch (error: unknown) {
    if (billingTaskId && !submittedUpstream) {
      await updateTask({
        taskId: billingTaskId,
        status: BillingTaskStatus.FAILED,
      }).catch(() => undefined);
    }
    return respErr(
      error instanceof Error ? error.message : 'Unable to create H3 Max task'
    );
  }
}

async function GET({ request }: { request: Request }) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) return respErr('Unauthorized');

    const search = new URL(request.url).searchParams;
    const taskId = search.get('taskId')?.trim();
    const wantsDownload = search.get('download') === '1';
    if (wantsDownload) {
      if (!taskId) return respErr('taskId is required');
      const index = Number(search.get('index') ?? '0');
      const url = await getFalH3MaxDownloadUrl({
        index,
        taskId,
        userId: session.user.id,
      });
      return Response.redirect(url, 302);
    }

    if (!taskId) {
      return respData(await listFalH3MaxTasks({ userId: session.user.id }));
    }

    const task = await getFalH3MaxTask({
      apiKey: await configuredApiKey(),
      saveFiles: await getPersistentOutputSaver(),
      taskId,
      userId: session.user.id,
    });
    return respData(await settleFailedH3Task(task));
  } catch (error: unknown) {
    return respErr(
      error instanceof Error ? error.message : 'Unable to load H3 Max task'
    );
  }
}

// Keep the model constants reachable to route-level tests without allowing a
// caller to select an arbitrary Fal model.
export const H3_MAX_MODELS = [
  FAL_H3_MAX_TEXT_TO_VIDEO_MODEL,
  FAL_H3_MAX_IMAGE_TO_VIDEO_MODEL,
  FAL_H3_MAX_REFERENCE_TO_VIDEO_MODEL,
] as const;

export const Route = createFileRoute('/api/fal/h3-max')({
  server: { handlers: { GET, POST } },
});
