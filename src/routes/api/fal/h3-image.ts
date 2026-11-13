import { createFileRoute } from '@tanstack/react-router';

import { getAuth } from '@/core/auth';
import {
  AITaskStatus,
  createTask,
  updateTask,
} from '@/modules/ai-tasks/service';
import { getAllConfigs } from '@/modules/config/service';
import {
  getH3ImageTask,
  submitH3ImageTask,
} from '@/modules/fal-h3-image/service';
import {
  H3_IMAGE_CREDITS,
  H3_IMAGE_MODEL,
  h3ImageInputSchema,
  type H3ImageTask,
} from '@/lib/h3-image';
import { enforceMinIntervalRateLimit } from '@/lib/rate-limit';
import { respData, respErr } from '@/lib/resp';

import { getPersistentOutputSaver } from './-persistent-output';

async function apiKey() {
  const key = (await getAllConfigs()).fal_api_key?.trim();
  if (!key)
    throw new Error('H3 Image is not configured yet. Please contact support.');
  return key;
}
async function settle(task: H3ImageTask) {
  if (task.status === 'failed' || task.status === 'canceled') {
    await updateTask({
      taskId: task.id,
      status:
        task.status === 'failed' ? AITaskStatus.FAILED : AITaskStatus.CANCELED,
    });
  }
  return task;
}
async function POST({ request }: { request: Request }) {
  let billingTaskId: string | undefined;
  try {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });
    if (!session?.user) return respErr('Unauthorized', { status: 401 });
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin)
      return respErr('Invalid origin', { status: 403 });
    const limited = enforceMinIntervalRateLimit(request, {
      intervalMs: 2000,
      keyPrefix: 'fal-h3-image',
      extraKey: session.user.id,
    });
    if (limited) return limited;
    const body = await request.text();
    if (body.length > 40_000)
      return respErr('Request is too large', { status: 413 });
    const parsed = h3ImageInputSchema.safeParse(JSON.parse(body));
    if (!parsed.success)
      return respErr(
        'Use a prompt of 1–8000 characters and a supported image size.',
        { status: 400 }
      );
    const input = parsed.data;
    const key = await apiKey();
    const billing = await createTask({
      userId: session.user.id,
      mediaType: 'image',
      provider: 'fal',
      model: H3_IMAGE_MODEL,
      prompt: input.prompt,
      options: input,
      costCredits: H3_IMAGE_CREDITS[input.resolution],
    });
    billingTaskId = billing.id;
    return respData(
      await submitH3ImageTask({
        apiKey: key,
        input,
        taskId: billing.id,
        userId: session.user.id,
      })
    );
  } catch (error) {
    if (billingTaskId)
      await updateTask({
        taskId: billingTaskId,
        status: AITaskStatus.FAILED,
      }).catch(() => undefined);
    const message =
      error instanceof Error
        ? error.message
        : 'Unable to start image generation';
    return respErr(
      message === 'Insufficient credits'
        ? message
        : message.startsWith('H3 Image is not configured')
          ? message
          : 'Unable to start image generation. Please try again.'
    );
  }
}
async function GET({ request }: { request: Request }) {
  try {
    const session = await getAuth().api.getSession({
      headers: request.headers,
    });
    if (!session?.user) return respErr('Unauthorized', { status: 401 });
    const search = new URL(request.url).searchParams;
    const taskId = search.get('taskId') ?? '';
    if (!/^[a-zA-Z0-9_-]{10,80}$/.test(taskId))
      return respErr('Invalid task ID', { status: 400 });
    const task = await settle(
      await getH3ImageTask({
        apiKey: await apiKey(),
        taskId,
        userId: session.user.id,
        saveFiles: await getPersistentOutputSaver(),
      })
    );
    if (search.get('download') === '1') {
      if (task.status !== 'success' || !task.resultUrls[0])
        return respErr('Image is not ready', { status: 409 });
      const output = new URL(task.resultUrls[0]);
      const configuredDomain = (await getAllConfigs()).r2_domain?.trim();
      const ownStorage = configuredDomain
        ? new URL(configuredDomain).origin
        : '';
      if (
        !(
          output.hostname === 'fal.media' ||
          output.hostname.endsWith('.fal.media') ||
          output.origin === ownStorage
        )
      ) {
        return Response.redirect(output.href, 302);
      }
      const response = await fetch(output, { redirect: 'error' });
      if (!response.ok || !response.body) throw new Error('Download failed');
      return new Response(response.body, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'private, no-store',
          'Content-Disposition': `attachment; filename="h3-image-${task.id}.png"`,
        },
      });
    }
    return respData(task, {
      headers: { 'Cache-Control': 'private, no-store' },
    });
  } catch (error) {
    return respErr(
      error instanceof Error && error.message === 'Image task not found'
        ? 'Image task not found'
        : 'Unable to check image status. Please retry.'
    );
  }
}
export const Route = createFileRoute('/api/fal/h3-image')({
  server: { handlers: { GET, POST } },
});
