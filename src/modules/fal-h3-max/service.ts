import { and, desc, eq, inArray, isNull } from 'drizzle-orm';

import {
  AIMediaType,
  AITaskStatus,
  FalProvider,
  type SaveFilesFunction,
} from '@/core/ai';
import { db } from '@/core/db';
import { aiTask, type AiTask } from '@/config/db/schema';

/** MiniMax H3 Max workflow slugs published by Fal. */
export const FAL_H3_MAX_TEXT_TO_VIDEO_MODEL = 'minimax/h3-max/text-to-video';
export const FAL_H3_MAX_IMAGE_TO_VIDEO_MODEL = 'minimax/h3-max/image-to-video';
export const FAL_H3_MAX_REFERENCE_TO_VIDEO_MODEL =
  'minimax/h3-max/reference-to-video';

const h3MaxModels = [
  FAL_H3_MAX_TEXT_TO_VIDEO_MODEL,
  FAL_H3_MAX_IMAGE_TO_VIDEO_MODEL,
  FAL_H3_MAX_REFERENCE_TO_VIDEO_MODEL,
] as const;

const terminalStatuses = new Set<string>([
  AITaskStatus.SUCCESS,
  AITaskStatus.FAILED,
  AITaskStatus.CANCELED,
]);
const aspectRatios = new Set([
  '21:9',
  '16:9',
  '4:3',
  '1:1',
  '3:4',
  '9:16',
  'adaptive',
]);

export type FalH3MaxMode =
  | 'text-to-video'
  | 'image-to-video'
  | 'reference-to-video';
export type FalH3MaxResolution = '480P' | '768P';

export type FalH3MaxInput = {
  aspectRatio?: string;
  duration?: number;
  imageUrls?: string[];
  mode: FalH3MaxMode;
  prompt: string;
  promptExpansionMode?: 'balanced' | 'quality';
  resolution?: FalH3MaxResolution;
  seed?: number;
  videoUrls?: string[];
};

export type FalH3MaxTask = {
  billedCredits?: number;
  createdAt: string;
  errorMessage?: string;
  id: string;
  isArchived: boolean;
  model: string;
  prompt: string;
  progress: number;
  providerTaskId: string | null;
  resultUrls: string[];
  status: string;
};

type StoredTaskInfo = {
  errorMessage?: string;
  progress?: number;
  providerStatus?: string;
  responseUrl?: string;
  statusUrl?: string;
};

type FalVideoResult = {
  response_url?: unknown;
  status_url?: unknown;
  video?: { url?: unknown };
  videos?: Array<{ url?: unknown }>;
};

function parseJson<T>(value: string | null | undefined): T | undefined {
  if (!value) return undefined;

  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

function normalizePublicHttpsUrl(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;

  // Older R2 settings could contain trailing whitespace in the public domain,
  // producing URLs such as `https://example.com /uploads/...`. Normalize that
  // domain/path boundary so completed tasks remain playable after the setting
  // is corrected.
  const normalized = value
    .trim()
    .replace(/^(https:\/\/[^/\s]+)\s+(\/)/, '$1$2');

  try {
    const url = new URL(normalized);
    if (url.protocol !== 'https:') return undefined;

    const hostname = url.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname.endsWith('.localhost') ||
      hostname === '127.0.0.1' ||
      hostname === '::1' ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2\d|3[0-1])\./.test(hostname)
    ) {
      return undefined;
    }

    return url.href;
  } catch {
    return undefined;
  }
}

function resultUrls(value: string | null | undefined): string[] {
  const result = parseJson<FalVideoResult>(value);
  const urls = [
    result?.video?.url,
    ...(result?.videos?.map((video) => video.url) ?? []),
  ];

  return [...new Set(urls)].flatMap((url) => {
    const normalized = normalizePublicHttpsUrl(url);
    return normalized ? [normalized] : [];
  });
}

function isFalQueueUrl(value: unknown): value is string {
  const normalized = normalizePublicHttpsUrl(value);
  return Boolean(
    normalized && new URL(normalized).hostname === 'queue.fal.run'
  );
}

function queueUrls(value: string | null | undefined): {
  responseUrl?: string;
  statusUrl?: string;
} {
  const result = parseJson<FalVideoResult>(value);

  return {
    ...(isFalQueueUrl(result?.response_url)
      ? { responseUrl: result.response_url }
      : {}),
    ...(isFalQueueUrl(result?.status_url)
      ? { statusUrl: result.status_url }
      : {}),
  };
}

function toClientTask(task: AiTask): FalH3MaxTask {
  const info = parseJson<StoredTaskInfo>(task.taskInfo) ?? {};

  return {
    billedCredits: task.costCredits,
    createdAt: task.createdAt.toISOString(),
    id: task.id,
    isArchived: false,
    model: task.model,
    prompt: task.prompt,
    progress: Math.max(0, Math.min(100, Number(info.progress) || 0)),
    providerTaskId: task.taskId ?? null,
    resultUrls: resultUrls(task.taskResult),
    status: task.status,
    ...(info.errorMessage ? { errorMessage: info.errorMessage } : {}),
  };
}

function hasModel(model: string): model is (typeof h3MaxModels)[number] {
  return (h3MaxModels as readonly string[]).includes(model);
}

/** Validate only Fal-supported fields before a paid upstream request. */
export function validateFalH3MaxInput(input: FalH3MaxInput) {
  if (!input.prompt.trim()) throw new Error('Prompt is required');
  if (input.prompt.length > 2_500) {
    throw new Error('Prompt must be 2500 characters or fewer');
  }
  if (
    input.duration !== undefined &&
    (!Number.isInteger(input.duration) ||
      input.duration < 5 ||
      input.duration > 15)
  ) {
    throw new Error('Duration must be a whole number from 5 to 15 seconds');
  }
  if (
    input.resolution &&
    input.resolution !== '480P' &&
    input.resolution !== '768P'
  ) {
    throw new Error('Resolution must be 480P or 768P');
  }
  if (input.aspectRatio && !aspectRatios.has(input.aspectRatio)) {
    throw new Error('Unsupported aspect ratio');
  }
  if (input.mode !== 'reference-to-video' && input.aspectRatio === 'adaptive') {
    throw new Error(
      'Adaptive aspect ratio is only available for reference-to-video'
    );
  }
  if (
    input.promptExpansionMode &&
    input.promptExpansionMode !== 'balanced' &&
    input.promptExpansionMode !== 'quality'
  ) {
    throw new Error('Unsupported prompt expansion mode');
  }
  if (
    input.seed !== undefined &&
    (!Number.isInteger(input.seed) || input.seed < 0)
  ) {
    throw new Error('Seed must be a non-negative integer');
  }

  const imageUrls = input.imageUrls ?? [];
  const videoUrls = input.videoUrls ?? [];
  if (![...imageUrls, ...videoUrls].every(isPublicHttpsUrl)) {
    throw new Error('Reference files must use public HTTPS URLs');
  }

  if (input.mode === 'text-to-video') {
    if (imageUrls.length || videoUrls.length) {
      throw new Error('Text-to-video does not accept reference files');
    }
    return;
  }

  if (input.mode === 'image-to-video') {
    if (imageUrls.length !== 1 || videoUrls.length) {
      throw new Error('Image-to-video requires exactly one reference image');
    }
    return;
  }

  if (!imageUrls.length && !videoUrls.length) {
    throw new Error('Reference-to-video requires at least one reference file');
  }
  if (imageUrls.length + videoUrls.length > 12) {
    throw new Error('Reference-to-video accepts at most 12 reference files');
  }
}

export function h3MaxModelForMode(mode: FalH3MaxMode) {
  switch (mode) {
    case 'image-to-video':
      return FAL_H3_MAX_IMAGE_TO_VIDEO_MODEL;
    case 'reference-to-video':
      return FAL_H3_MAX_REFERENCE_TO_VIDEO_MODEL;
    default:
      return FAL_H3_MAX_TEXT_TO_VIDEO_MODEL;
  }
}

/** Translate our validated input to the exact parameter names Fal expects. */
export function toFalH3MaxOptions(input: FalH3MaxInput) {
  const resolution = input.resolution ?? '768P';
  const common = {
    duration: input.duration ?? 5,
    resolution,
    ...(input.aspectRatio ? { aspect_ratio: input.aspectRatio } : {}),
    ...(input.promptExpansionMode
      ? { prompt_expansion_mode: input.promptExpansionMode }
      : {}),
    ...(input.seed === undefined ? {} : { seed: input.seed }),
  };

  if (input.mode === 'image-to-video') {
    return { ...common, image_url: input.imageUrls![0] };
  }
  if (input.mode === 'reference-to-video') {
    return {
      ...common,
      ...(input.imageUrls?.length
        ? { reference_image_urls: input.imageUrls }
        : {}),
      ...(input.videoUrls?.length
        ? { reference_video_urls: input.videoUrls }
        : {}),
    };
  }
  return common;
}

/** Submit a pre-authorized H3 Max task and persist Fal's queue ID. */
export async function submitFalH3MaxTask(params: {
  apiKey: string;
  input: FalH3MaxInput;
  taskId: string;
  userId: string;
}): Promise<FalH3MaxTask> {
  validateFalH3MaxInput(params.input);
  const model = h3MaxModelForMode(params.input.mode);
  const [localTask] = await db()
    .select()
    .from(aiTask)
    .where(
      and(
        eq(aiTask.id, params.taskId),
        eq(aiTask.userId, params.userId),
        eq(aiTask.provider, 'fal'),
        eq(aiTask.model, model),
        isNull(aiTask.deletedAt)
      )
    )
    .limit(1);

  if (!localTask) throw new Error('H3 Max video task not found');
  if (localTask.status !== AITaskStatus.PENDING) {
    throw new Error('H3 Max video task has already been submitted');
  }

  try {
    const provider = new FalProvider({ apiKey: params.apiKey });
    const remote = await provider.generate({
      params: {
        async: true,
        mediaType: AIMediaType.VIDEO,
        model,
        options: toFalH3MaxOptions(params.input),
        prompt: params.input.prompt.trim(),
      },
    });
    const taskInfo = {
      progress: 0,
      providerStatus: remote.taskStatus,
      ...queueUrls(JSON.stringify(remote.taskResult)),
    } satisfies StoredTaskInfo;
    const updatedTask = {
      ...localTask,
      status: remote.taskStatus,
      taskId: remote.taskId,
      taskInfo: JSON.stringify(taskInfo),
      taskResult: JSON.stringify(remote.taskResult),
    };

    await db()
      .update(aiTask)
      .set({
        status: updatedTask.status,
        taskId: updatedTask.taskId,
        taskInfo: updatedTask.taskInfo,
        taskResult: updatedTask.taskResult,
      })
      .where(eq(aiTask.id, localTask.id));

    return toClientTask(updatedTask);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Fal request failed';
    await db()
      .update(aiTask)
      .set({
        status: AITaskStatus.FAILED,
        taskInfo: JSON.stringify({ errorMessage: message, progress: 0 }),
      })
      .where(eq(aiTask.id, localTask.id));
    throw error;
  }
}

/** Refresh a user-owned H3 Max task until it becomes terminal. */
export async function getFalH3MaxTask(params: {
  apiKey: string;
  saveFiles?: SaveFilesFunction;
  taskId: string;
  userId: string;
}): Promise<FalH3MaxTask> {
  const [task] = await db()
    .select()
    .from(aiTask)
    .where(
      and(
        eq(aiTask.id, params.taskId),
        eq(aiTask.userId, params.userId),
        eq(aiTask.provider, 'fal'),
        inArray(aiTask.model, h3MaxModels),
        isNull(aiTask.deletedAt)
      )
    )
    .limit(1);

  if (!task) throw new Error('H3 Max video task not found');
  if (!task.taskId || terminalStatuses.has(task.status))
    return toClientTask(task);
  if (!hasModel(task.model)) throw new Error('Unsupported H3 Max model');

  try {
    const previousInfo = parseJson<StoredTaskInfo>(task.taskInfo) ?? {};
    const urls = {
      ...queueUrls(task.taskResult),
      ...(previousInfo.responseUrl
        ? { responseUrl: previousInfo.responseUrl }
        : {}),
      ...(previousInfo.statusUrl ? { statusUrl: previousInfo.statusUrl } : {}),
    };
    const provider = new FalProvider({
      apiKey: params.apiKey,
      ...(params.saveFiles
        ? { customStorage: true, saveFiles: params.saveFiles }
        : {}),
    });
    const remote = await provider.query({
      taskId: task.taskId,
      mediaType: AIMediaType.VIDEO,
      model: task.model,
      ...urls,
    });
    const taskInfo = {
      progress: remote.taskStatus === AITaskStatus.SUCCESS ? 100 : 0,
      providerStatus: remote.taskInfo?.status,
      ...urls,
      ...(remote.taskInfo?.errorMessage
        ? { errorMessage: remote.taskInfo.errorMessage }
        : {}),
    } satisfies StoredTaskInfo;
    const updatedTask = {
      ...task,
      status: remote.taskStatus,
      taskInfo: JSON.stringify(taskInfo),
      taskResult: JSON.stringify(remote.taskResult),
    };

    await db()
      .update(aiTask)
      .set({
        status: updatedTask.status,
        taskInfo: updatedTask.taskInfo,
        taskResult: updatedTask.taskResult,
      })
      .where(eq(aiTask.id, task.id));

    return toClientTask(updatedTask);
  } catch (error) {
    // A transient status lookup failure is not evidence that the paid task
    // failed. Preserve the pending task so a later poll can recover. Fal's
    // explicit FAILED/CANCELLED statuses return normally and are refunded by
    // the route layer.
    throw error;
  }
}

/** Return recent H3 Max tasks without triggering provider polling. */
export async function listFalH3MaxTasks(params: {
  limit?: number;
  userId: string;
}): Promise<FalH3MaxTask[]> {
  const limit = Math.min(20, Math.max(1, params.limit ?? 8));
  const tasks = await db()
    .select()
    .from(aiTask)
    .where(
      and(
        eq(aiTask.userId, params.userId),
        eq(aiTask.provider, 'fal'),
        inArray(aiTask.model, h3MaxModels),
        isNull(aiTask.deletedAt)
      )
    )
    .orderBy(desc(aiTask.createdAt))
    .limit(limit);

  return tasks.map(toClientTask);
}

/** Resolve a completed output URL, scoped to its task owner. */
export async function getFalH3MaxDownloadUrl(params: {
  index: number;
  taskId: string;
  userId: string;
}): Promise<string> {
  if (!Number.isInteger(params.index) || params.index < 0) {
    throw new Error('Invalid video index');
  }

  const [task] = await db()
    .select()
    .from(aiTask)
    .where(
      and(
        eq(aiTask.id, params.taskId),
        eq(aiTask.userId, params.userId),
        eq(aiTask.provider, 'fal'),
        inArray(aiTask.model, h3MaxModels),
        isNull(aiTask.deletedAt)
      )
    )
    .limit(1);
  if (!task) throw new Error('H3 Max video task not found');

  const resultUrl = resultUrls(task.taskResult)[params.index];
  if (!resultUrl) throw new Error('Generated video is unavailable');
  return resultUrl;
}
