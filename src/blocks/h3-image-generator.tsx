import { m } from '@/paraglide/messages.js';
import { ImageGenerator } from '@/components/h3-image/image-generator';

export const h3ImagePrompts = {
  editorial:
    'An editorial photograph of an astronaut in a pearl-white flight suit buying sunflowers at a tiny street market in Lisbon. Early morning light, pale yellow walls, blue ceramic tiles, natural fabric textures. Frame the astronaut on the right, with generous negative space on the left. Quiet, believable, gently surreal. Landscape composition.',
  product:
    'A studio product photograph of a transparent amber glass perfume bottle on a sculpted limestone pedestal. One dried orange peel curls beside the bottle. Hard afternoon sunlight creates long architectural shadows on a warm white background. Crisp glass edges, subtle caustics, fine mineral texture. No labels or extra objects.',
  poster:
    'A minimalist exhibition poster on textured ivory paper. Exact headline: "THE ART OF SLOW". Place the headline in large dark-green serif type at the top. Below it, a single sculptural red chair in an empty sunlit room. Small footer text: "NOVEMBER 2026". Clear hierarchy, generous margins, restrained editorial design.',
  worlds:
    'Wide cinematic concept art of a small observatory built into the trunk of an enormous ancient tree above a misty valley. A lone botanist stands on the wooden balcony. Copper telescopes, weathered wood, tiny warm windows. Dawn light, layered atmospheric perspective, carefully readable architecture, rich natural textures.',
  interior:
    'A warm, lived-in reading corner with a moss-green armchair, a low walnut bookshelf, and a handmade cream ceramic lamp. Late-afternoon sunlight enters from the left. A single open book rests on the chair. Eye-level photograph, tactile linen, realistic wood grain, balanced negative space, calm neutral palette.',
};

export function H3ImageGeneratorBlock({
  compact = false,
  selectedPrompt,
}: {
  compact?: boolean;
  selectedPrompt?: { prompt: string; id: number };
}) {
  return (
    <ImageGenerator
      compact={compact}
      selectedPrompt={selectedPrompt}
      presets={[
        {
          label: m['h3_image.preset.editorial'](),
          prompt: h3ImagePrompts.editorial,
        },
        {
          label: m['h3_image.preset.product'](),
          prompt: h3ImagePrompts.product,
        },
        { label: m['h3_image.preset.poster'](), prompt: h3ImagePrompts.poster },
      ]}
      copy={{
        prompt: m['h3_image.tool.prompt'](),
        placeholder: m['h3_image.tool.placeholder'](),
        ratio: m['h3_image.tool.ratio'](),
        resolution: m['h3_image.tool.resolution'](),
        generate: m['h3_image.tool.generate'](),
        generating: m['h3_image.tool.generating'](),
        credits: (count) => m['h3_image.tool.credits']({ count }),
        oneImage: m['h3_image.tool.one_image'](),
        model: 'MiniMax H3 Image',
        queued: m['h3_image.tool.queued'](),
        processing: m['h3_image.tool.processing'](),
        ready: m['h3_image.tool.ready'](),
        failed: m['h3_image.tool.failed'](),
        statusError: m['h3_image.tool.status_error'](),
        retry: m['h3_image.tool.retry'](),
        download: m['h3_image.tool.download'](),
        open: m['h3_image.tool.open'](),
        preview: m['h3_image.tool.preview'](),
        example: m['h3_image.tool.example'](),
        login: m['h3_image.tool.login'](),
        insufficient: m['h3_image.tool.insufficient'](),
        improve: m['h3_image.tool.improve'](),
        history: m['h3_image.tool.history'](),
      }}
    />
  );
}
