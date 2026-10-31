export type GuideMeta = {
  title: string;
  description: string;
  category: string;
  readMinutes: number;
  publishedAt: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
  takeaway: string;
  sections: { id: string; title: string }[];
};

const publishedAt = '2026-10-31';

export const guideMetadata: Record<string, Record<'en' | 'zh', GuideMeta>> = {
  'minimax-h3-flashgen-4step': {
    en: {
      title: 'MiniMax H3 FlashGen 4step: Setup, Prompts & Testing',
      description:
        'Understand the FlashGen four-step LoRA, choose a compatible setup, write a first test prompt, and compare speed and quality without misleading benchmarks.',
      category: 'Speed & sampling',
      readMinutes: 8,
      publishedAt,
      image: '/imgs/guides/flashgen-cover.svg',
      imageAlt:
        'An illustrated four-stage denoising sequence with a cyan landscape becoming clearer across four frames.',
      imageCaption:
        'Four sampling steps, illustrated. An explanatory diagram, not actual H3 output.',
      takeaway:
        'FlashGen is a four-step distillation adapter for H3 text-to-video with audio. Match the artifact, runtime, and sampling schedule before measuring end-to-end speed. Four steps is not a four-second promise.',
      sections: [
        { id: 'what-it-is', title: 'What FlashGen does' },
        { id: 'choose-your-path', title: 'Choose your starting point' },
        { id: 'setup', title: 'First-run workflow' },
        { id: 'prompt', title: 'A prompt to try' },
        { id: 'evaluate', title: 'Speed & quality checks' },
        { id: 'troubleshooting', title: 'Troubleshooting' },
        { id: 'faq', title: 'Frequently asked questions' },
        { id: 'sources', title: 'Sources & editorial notes' },
      ],
    },
    zh: {
      title: 'MiniMax H3 FlashGen 4step 指南：四步采样与部署验证',
      description:
        '看懂 FlashGen 四步蒸馏 LoRA，选择适配的部署路径，复制首个测试提示词，并用可复现的方法比较生成速度与画质。',
      category: '速度与采样',
      readMinutes: 8,
      publishedAt,
      image: '/imgs/guides/flashgen-cover.svg',
      imageAlt: '四阶段去噪示意图：青色风景在四个画面中逐步变清晰。',
      imageCaption: '四步采样的概念示意。原创说明图，并非 H3 实际生成结果。',
      takeaway:
        'FlashGen 是面向 H3 文生音视频的四步蒸馏适配器。先匹配权重、运行框架和采样调度，再比较完整生成耗时。“四步”指采样步数，不代表四秒出片。',
      sections: [
        { id: 'what-it-is', title: 'FlashGen 到底是什么' },
        { id: 'choose-your-path', title: '选择适合你的起点' },
        { id: 'setup', title: '首次运行的操作顺序' },
        { id: 'prompt', title: '可复制的测试提示词' },
        { id: 'evaluate', title: '速度与质量怎么测' },
        { id: 'troubleshooting', title: '常见问题排查' },
        { id: 'faq', title: 'FAQ' },
        { id: 'sources', title: '来源与编辑说明' },
      ],
    },
  },
  'minimax-h3-vbvr': {
    en: {
      title: 'MiniMax H3 VBVR: Setup, Prompts & Consistency Tests',
      description:
        'Learn what the H3 VBVR LoRA targets, how to add it to a compatible image-to-video workflow, and how to test object consistency with practical prompts.',
      category: 'Motion & consistency',
      readMinutes: 9,
      publishedAt,
      image: '/imgs/guides/vbvr-cover.svg',
      imageAlt:
        'Three illustrated frames tracking the same coral-colored object along a continuous path through a scene.',
      imageCaption:
        'One object across time. An illustration of the consistency goal, not a before-and-after claim.',
      takeaway:
        'VBVR is an H3 image-to-video LoRA aimed at reducing object duplication, clipping, and incoherent actions. Test it against the same image, prompt, and seed; its goal is better consistency, not guaranteed physical correctness.',
      sections: [
        { id: 'what-it-is', title: 'What VBVR does' },
        { id: 'when-to-use', title: 'When to try it' },
        { id: 'setup', title: 'Add it to your workflow' },
        { id: 'prompt', title: 'Two test prompts' },
        { id: 'evaluate', title: 'Evaluate consistency' },
        { id: 'troubleshooting', title: 'Common problems' },
        { id: 'faq', title: 'Frequently asked questions' },
        { id: 'sources', title: 'Sources & editorial notes' },
      ],
    },
    zh: {
      title: 'MiniMax H3 VBVR 指南：让图生视频更连贯',
      description:
        '了解 H3 VBVR LoRA 的用途与边界，按步骤接入适配的图生视频工作流，用两组提示词验证物体一致性、接触关系与动作逻辑。',
      category: '动作与一致性',
      readMinutes: 9,
      publishedAt,
      image: '/imgs/guides/vbvr-cover.svg',
      imageAlt:
        '三个画面追踪同一个珊瑚色物体沿连续路径移动，说明跨帧一致性的目标。',
      imageCaption:
        '同一物体在时间中的连续性。原创概念示意，并非效果对比或性能证明。',
      takeaway:
        'VBVR 是面向 H3 图生视频的 LoRA，目标是减少物体重复、穿模和不连贯的动作。用同一首帧、提示词和种子做对照，才能判断它是否适合你的场景；它不保证所有运动都符合物理规律。',
      sections: [
        { id: 'what-it-is', title: 'VBVR 到底是什么' },
        { id: 'when-to-use', title: '哪些场景值得尝试' },
        { id: 'setup', title: '接入工作流的四个步骤' },
        { id: 'prompt', title: '两组可复制的测试提示词' },
        { id: 'evaluate', title: '怎样判断有没有改善' },
        { id: 'troubleshooting', title: '常见问题与排查' },
        { id: 'faq', title: 'FAQ' },
        { id: 'sources', title: '来源与编辑说明' },
      ],
    },
  },
};
