import { and, eq, isNull } from 'drizzle-orm';

import {
  AIMediaType,
  AITaskStatus,
  FalProvider,
  type SaveFilesFunction,
} from '@/core/ai';
import { db } from '@/core/db';
import { aiTask, type AiTask } from '@/config/db/schema';
import {
  H3_IMAGE_MODEL,
  h3ImageProviderOptions,
  isH3ImageTerminal,
  type H3ImageInput,
  type H3ImageTask,
} from '@/lib/h3-image';

type TaskInfo = {
  statusUrl?: string;
  responseUrl?: string;
  errorMessage?: string;
};
type ImageResult = {
  images?: { url?: string }[];
  has_nsfw_concepts?: boolean[];
  status_url?: string;
  response_url?: string;
};
function parse<T>(json?: string | null): T | undefined {
  try {
    return json ? (JSON.parse(json) as T) : undefined;
  } catch {
    return undefined;
  }
}
function publicHttps(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      !url.username &&
      !url.password &&
      !url.port &&
      /\.[a-z]{2,}$/i.test(url.hostname) &&
      !/\.(localhost|local|internal)$/i.test(url.hostname)
    );
  } catch {
    return false;
  }
}
function queueUrl(value: unknown): value is string {
  return publicHttps(value) && new URL(value).hostname === 'queue.fal.run';
}
function clientTask(task: AiTask): H3ImageTask {
  const result = parse<ImageResult>(task.taskResult);
  const info = parse<TaskInfo>(task.taskInfo);
  return {
    id: task.id,
    prompt: task.prompt,
    status: task.status,
    resultUrls:
      task.status === AITaskStatus.SUCCESS
        ? (result?.images ?? []).flatMap((image, index) =>
            !result?.has_nsfw_concepts?.[index] && publicHttps(image.url)
              ? [image.url]
              : []
          )
        : [],
    credits: task.costCredits,
    createdAt: task.createdAt.toISOString(),
    ...(info?.errorMessage ? { errorMessage: info.errorMessage } : {}),
  };
}
async function ownedTask(taskId: string, userId: string) {
  const [task] = await db()
    .select()
    .from(aiTask)
    .where(
      and(
        eq(aiTask.id, taskId),
        eq(aiTask.userId, userId),
        eq(aiTask.provider, 'fal'),
        eq(aiTask.model, H3_IMAGE_MODEL),
        isNull(aiTask.deletedAt)
      )
    )
    .limit(1);
  if (!task) throw new Error('Image task not found');
  return task;
}

/** The API creates and bills the task; this module only submits the owned task. */
export async function submitH3ImageTask(params: {
  apiKey: string;
  input: H3ImageInput;
  taskId: string;
  userId: string;
}): Promise<H3ImageTask> {
  const task = await ownedTask(params.taskId, params.userId);
  if (task.status !== AITaskStatus.PENDING || task.taskId)
    throw new Error('Image task was already submitted');
  const provider = new FalProvider({ apiKey: params.apiKey });
  const remote = await provider.generate({
    params: {
      mediaType: AIMediaType.IMAGE,
      model: H3_IMAGE_MODEL,
      prompt: params.input.prompt,
      options: h3ImageProviderOptions(params.input),
      async: true,
    },
  });
  const result = remote.taskResult as ImageResult | undefined;
  const info: TaskInfo = {
    ...(queueUrl(result?.status_url) ? { statusUrl: result.status_url } : {}),
    ...(queueUrl(result?.response_url)
      ? { responseUrl: result.response_url }
      : {}),
  };
  const values = {
    taskId: remote.taskId,
    status: remote.taskStatus,
    taskInfo: JSON.stringify(info),
    taskResult: JSON.stringify(remote.taskResult),
  };
  await db()
    .update(aiTask)
    .set(values)
    .where(and(eq(aiTask.id, task.id), eq(aiTask.userId, params.userId)));
  return clientTask({ ...task, ...values });
}

/** Poll errors stay retryable; only confirmed terminal failures trigger a refund. */
export async function getH3ImageTask(params: {
  apiKey: string;
  taskId: string;
  userId: string;
  saveFiles?: SaveFilesFunction;
}): Promise<H3ImageTask> {
  const task = await ownedTask(params.taskId, params.userId);
  if (isH3ImageTerminal(task.status) || !task.taskId) return clientTask(task);
  const info = parse<TaskInfo>(task.taskInfo) ?? {};
  const provider = new FalProvider({
    apiKey: params.apiKey,
    ...(params.saveFiles
      ? { customStorage: true, saveFiles: params.saveFiles }
      : {}),
  });
  const remote = await provider.query({
    taskId: task.taskId,
    model: H3_IMAGE_MODEL,
    mediaType: AIMediaType.IMAGE,
    ...(queueUrl(info.statusUrl) ? { statusUrl: info.statusUrl } : {}),
    ...(queueUrl(info.responseUrl) ? { responseUrl: info.responseUrl } : {}),
  });
  const result = remote.taskResult as ImageResult | undefined;
  const hasOutput = result?.images?.some(
    (image, index) =>
      publicHttps(image.url) && !result.has_nsfw_concepts?.[index]
  );
  const status =
    remote.taskStatus === AITaskStatus.SUCCESS && !hasOutput
      ? AITaskStatus.FAILED
      : remote.taskStatus;
  const errorMessage =
    status === AITaskStatus.FAILED || status === AITaskStatus.CANCELED
      ? 'No image was returned. Your credits have been returned; please try another prompt.'
      : undefined;
  const values = {
    status,
    taskInfo: JSON.stringify({
      ...info,
      ...(errorMessage ? { errorMessage } : {}),
    }),
    taskResult: JSON.stringify(remote.taskResult),
  };
  await db()
    .update(aiTask)
    .set(values)
    .where(and(eq(aiTask.id, task.id), eq(aiTask.userId, params.userId)));
  return clientTask({ ...task, ...values });
}
