import assert from 'node:assert/strict';
import test from 'node:test';

import { AIMediaType, AITaskStatus, FalProvider } from '../src/core/ai';
import {
  H3_IMAGE_MODEL,
  H3_IMAGE_RATIOS,
  H3_IMAGE_RESOLUTIONS,
  h3ImageDimensions,
  h3ImageInputSchema,
  h3ImageProviderOptions,
} from '../src/lib/h3-image';

const valid = {
  prompt: 'A sunlit room with a green chair.',
  aspectRatio: '1:1',
  resolution: '2K',
} as const;

test('the request boundary rejects billing overrides, model injection, and unbounded work', () => {
  for (const extra of [
    { model: 'other/model' },
    { costCredits: 0 },
    { num_images: 100 },
    { enable_safety_checker: false },
    { imageUrls: ['http://127.0.0.1/private'] },
  ]) {
    assert.equal(
      h3ImageInputSchema.safeParse({ ...valid, ...extra }).success,
      false
    );
  }
  for (const prompt of ['', '   ', 'x'.repeat(8001)])
    assert.equal(
      h3ImageInputSchema.safeParse({ ...valid, prompt }).success,
      false
    );
  assert.equal(
    h3ImageInputSchema.safeParse({ ...valid, prompt: 'x'.repeat(8000) })
      .success,
    true
  );
  assert.equal(
    h3ImageInputSchema.parse({ ...valid, prompt: '  One chair.  ' }).prompt,
    'One chair.'
  );
  assert.equal(
    h3ImageInputSchema.safeParse({ ...valid, resolution: '8K' }).success,
    false
  );
  assert.equal(
    h3ImageInputSchema.safeParse({ ...valid, aspectRatio: '10:1' }).success,
    false
  );
});

test('every canvas fits the provider area and aspect-ratio bounds', () => {
  for (const resolution of H3_IMAGE_RESOLUTIONS) {
    for (const aspectRatio of H3_IMAGE_RATIOS) {
      const { width, height } = h3ImageDimensions({ resolution, aspectRatio });
      assert.ok(width * height >= 655360 && width * height <= 20000000);
      assert.ok(
        width >= 468 && height >= 468 && width <= 7745 && height <= 7745
      );
      assert.ok(width / height >= 1 / 3 && width / height <= 3);
      const [a, b] = aspectRatio.split(':').map(Number);
      assert.ok(Math.abs(width / height - a / b) < 0.04);
    }
  }
  assert.deepEqual(
    h3ImageDimensions({ resolution: '4K', aspectRatio: '1:1' }),
    { width: 4096, height: 4096 }
  );
});

test('Fal submit and polling use the H3 model contract and provider-issued queue URLs', async () => {
  const original = globalThis.fetch;
  const requests: string[] = [];
  const statusUrl =
    'https://queue.fal.run/minimax/h3-image/requests/test-job/status';
  const responseUrl =
    'https://queue.fal.run/minimax/h3-image/requests/test-job';
  globalThis.fetch = async (url, options) => {
    requests.push(String(url));
    const headers = options?.headers as Record<string, string>;
    assert.equal(headers.Authorization, 'Key test-key');
    if (options?.method === 'POST') {
      assert.equal(String(url), `https://queue.fal.run/${H3_IMAGE_MODEL}`);
      const payload = JSON.parse(String(options.body));
      assert.deepEqual(payload, {
        prompt: valid.prompt,
        image_size: { width: 2048, height: 2048 },
        num_images: 1,
        enable_prompt_expansion: true,
        output_format: 'png',
      });
      return Response.json({
        request_id: 'test-job',
        status_url: statusUrl,
        response_url: responseUrl,
      });
    }
    if (String(url) === statusUrl)
      return Response.json({ status: 'COMPLETED' });
    if (String(url) === responseUrl)
      return Response.json({
        images: [{ url: 'https://v3b.fal.media/test.png' }],
        has_nsfw_concepts: [false],
      });
    throw new Error(`Unexpected request: ${String(url)}`);
  };
  try {
    const provider = new FalProvider({ apiKey: 'test-key' });
    const created = await provider.generate({
      params: {
        mediaType: AIMediaType.IMAGE,
        model: H3_IMAGE_MODEL,
        prompt: valid.prompt,
        options: h3ImageProviderOptions(valid),
        async: true,
      },
    });
    assert.equal(created.taskStatus, AITaskStatus.PENDING);
    const done = await provider.query({
      taskId: created.taskId,
      model: H3_IMAGE_MODEL,
      mediaType: AIMediaType.IMAGE,
      statusUrl,
      responseUrl,
    });
    assert.equal(done.taskStatus, AITaskStatus.SUCCESS);
    assert.deepEqual(requests, [
      `https://queue.fal.run/${H3_IMAGE_MODEL}`,
      statusUrl,
      responseUrl,
    ]);
    assert.equal(
      (done.taskResult as { images: { url: string }[] }).images[0].url,
      'https://v3b.fal.media/test.png'
    );
  } finally {
    globalThis.fetch = original;
  }
});
