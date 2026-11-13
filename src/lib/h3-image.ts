import { z } from 'zod';

export const H3_IMAGE_MODEL = 'minimax/h3-image/text-to-image';
export const H3_IMAGE_API = '/api/fal/h3-image';
export const H3_IMAGE_RATIOS = ['1:1', '16:9', '9:16', '4:3', '3:4'] as const;
export const H3_IMAGE_RESOLUTIONS = ['1K', '2K', '4K'] as const;
export const h3ImageInputSchema = z
  .object({
    prompt: z
      .string()
      .trim()
      .min(1, 'Describe the image you want to create.')
      .max(8000),
    aspectRatio: z.enum(H3_IMAGE_RATIOS),
    resolution: z.enum(H3_IMAGE_RESOLUTIONS),
  })
  .strict();
export type H3ImageInput = z.infer<typeof h3ImageInputSchema>;
export type H3ImageResolution = H3ImageInput['resolution'];

/** Fixed site credits per successful image, separate from Fal's token pricing. */
export const H3_IMAGE_CREDITS: Record<H3ImageResolution, number> = {
  '1K': 10,
  '2K': 20,
  '4K': 40,
};

/** Area-based presets stay inside H3 Image's 655,360–20,000,000 pixel limit. */
export function h3ImageDimensions(
  input: Pick<H3ImageInput, 'aspectRatio' | 'resolution'>
) {
  const [a, b] = input.aspectRatio.split(':').map(Number);
  const edge = { '1K': 1024, '2K': 2048, '4K': 4096 }[input.resolution];
  const area = edge * edge;
  return {
    width: Math.round(Math.sqrt((area * a) / b) / 32) * 32,
    height: Math.round(Math.sqrt((area * b) / a) / 32) * 32,
  };
}

export function h3ImageProviderOptions(input: H3ImageInput) {
  return {
    image_size: h3ImageDimensions(input),
    num_images: 1,
    enable_prompt_expansion: true,
    output_format: 'png',
  } as const;
}

export type H3ImageTask = {
  id: string;
  prompt: string;
  status: string;
  resultUrls: string[];
  credits: number;
  createdAt: string;
  errorMessage?: string;
};

export function isH3ImageTerminal(status: string) {
  return ['success', 'failed', 'canceled'].includes(status);
}
