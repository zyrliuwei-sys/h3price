import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const destination = fileURLToPath(
  new URL('../public/imgs/guides/', import.meta.url)
);
mkdirSync(destination, { recursive: true });
const cyan = '#a4e5ed';
const coral = '#efac96';
const muted = '#91a2ad';
const esc = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
const text = (x, y, value, size = 22, color = '#eef3f4', extra = '') =>
  `<text x="${x}" y="${y}" font-size="${size}" fill="${color}" ${extra}>${esc(value)}</text>`;
const rect = (x, y, w, h, fill = '#141e25', stroke = '#ffffff16', r = 14) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}"/>`;
const line = (x1, y1, x2, y2, color = '#39535e', extra = '') =>
  `<path d="M${x1} ${y1} L${x2} ${y2}" fill="none" stroke="${color}" stroke-width="2" ${extra}/>`;
const arrow = (x1, y1, x2, y2, color = cyan) =>
  `${line(x1, y1, x2, y2, color)}<path d="M${x2 - 9} ${y2 - 6} L${x2} ${y2} L${x2 - 9} ${y2 + 6}" fill="none" stroke="${color}" stroke-width="2"/>`;
const circle = (x, y, r, fill, extra = '') =>
  `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
const mono = 'font-family="ui-monospace, monospace" letter-spacing="2"';
function shell(title, subtitle, content, accent = cyan) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="680" viewBox="0 0 1200 680" role="img" aria-labelledby="title desc">
<title id="title">${esc(title)}</title><desc id="desc">${esc(subtitle)}</desc>
<defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#ffffff04"/></pattern><radialGradient id="ball" cx="30%" cy="22%"><stop stop-color="#ffdac6"/><stop offset="0.6" stop-color="${coral}"/><stop offset="1" stop-color="#ae5f4e"/></radialGradient></defs>
<rect width="1200" height="680" fill="#0e171e"/><rect width="1200" height="680" fill="url(#grid)"/>
<g font-family="Arial, sans-serif">${text(48, 49, 'H3 FIELD NOTES', 16, accent, mono)}${text(1150, 49, 'EXPLAINED', 14, muted, `text-anchor="end" ${mono}`)}${content}
${line(48, 616, 1152, 616, '#ffffff16')}${text(48, 649, 'ORIGINAL SCHEMATIC / NOT MODEL OUTPUT', 13, muted, mono)}${text(1152, 649, 'MINIMAX H3', 13, muted, `text-anchor="end" ${mono}`)}</g></svg>`;
}
function save(name, content) {
  writeFileSync(`${destination}${name}.svg`, content);
}

let art =
  text(48, 119, 'Four steps. One clearer idea.', 49) +
  text(
    48,
    164,
    'FlashGen distillation: understand the sampling contract.',
    23,
    muted
  );
for (let i = 0; i < 4; i++) {
  const x = 48 + i * 282;
  art += rect(x, 213, 258, 284, '#121f28');
  art += `<g transform="translate(${x + 1} 214)">`;
  art += circle(184, 67, 24, '#a4e5ed', `opacity="${0.2 + i * 0.2}"`);
  art += `<path d="M0 214 L76 103 L126 165 L170 119 L256 226 V267 H0Z" fill="#244653" opacity="${0.32 + i * 0.2}"/>`;
  art += `<path d="M0 232 L63 175 L137 220 L204 160 L256 221 V267 H0Z" fill="#6aa9b4" opacity="${0.15 + i * 0.18}"/>`;
  for (let n = 0; n < (4 - i) * 32; n++) {
    const px = ((n * 79 + i * 41) % 246) + 5;
    const py = ((n * 53 + i * 19) % 255) + 7;
    art += rect(
      px,
      py,
      3 + (n % 7),
      3 + (n % 7),
      n % 2 ? '#9fdce7' : '#030d14',
      'none',
      1
    );
  }
  art +=
    '</g>' +
    rect(x + 16, 229, 62, 31, '#0c151d', '#ffffff20', 6) +
    text(x + 29, 250, `0${i + 1}`, 17, cyan, mono);
  art += text(
    x + 128,
    537,
    ['1.0 → 0.7', '0.7 → 0.4', '0.4 → 0.15', '0.15 → 0'][i],
    19,
    muted,
    'text-anchor="middle"'
  );
  if (i < 3) art += arrow(x + 266, 356, x + 278, 356);
}
art +=
  text(48, 585, '5 sigma points', 20, cyan) +
  text(600, 585, '4 denoising intervals', 20, cyan, 'text-anchor="middle"') +
  text(1152, 585, 'No fixed latency promise', 20, muted, 'text-anchor="end"');
save(
  'flashgen-cover',
  shell(
    'FlashGen four-step sampling',
    'Four intervals between five sigma points. Illustrated, not an actual generated video.',
    art
  )
);

art =
  text(48, 119, 'One setup. One loading path.', 49) +
  text(
    48,
    164,
    'A suggested first-run sequence for a compatible runtime.',
    23,
    muted
  );
art +=
  rect(48, 211, 1104, 83) +
  text(76, 245, '01 / VERIFY THE BASE', 16, cyan, mono) +
  text(
    76,
    276,
    'Save a working H3 clip, prompt, seed, and software version.',
    25
  );
art +=
  line(600, 294, 600, 324) +
  line(300, 324, 900, 324) +
  line(300, 324, 300, 350) +
  line(900, 324, 900, 350);
art += rect(48, 350, 534, 124) + rect(618, 350, 534, 124);
art +=
  text(76, 385, '02A / MERGED CHECKPOINT', 16, cyan, mono) +
  text(76, 422, 'Use the publisher’s merge route.', 24) +
  text(76, 451, 'Keep its schedule with the checkpoint.', 19, muted);
art +=
  text(646, 385, '02B / DYNAMIC ADAPTER', 16, cyan, mono) +
  text(646, 422, 'Use the runtime’s native artifact.', 24) +
  text(646, 451, 'Do not apply it on a merged copy.', 19, muted);
art +=
  line(300, 474, 300, 501) +
  line(900, 474, 900, 501) +
  line(300, 501, 900, 501) +
  line(600, 501, 600, 522);
art +=
  rect(48, 522, 1104, 65, '#142b34', '#a4e5ed40') +
  text(
    76,
    563,
    '03 / Fixed seed + documented 4-step schedule → inspect video and audio',
    23,
    cyan
  );
save(
  'flashgen-workflow',
  shell(
    'FlashGen setup workflow',
    'Verify the baseline, select a merged or dynamic loading route, then run a controlled test.',
    art
  )
);

art =
  text(48, 119, 'Measure what makes a keeper.', 49) +
  text(48, 164, 'Use the same workload. Record every attempt.', 23, muted);
const speedRows = [
  [
    '01',
    'Complete time',
    'Submission to playable video.',
    'Separate warm-up from repeats.',
  ],
  [
    '02',
    'Usable quality',
    'Watch motion and listen to audio.',
    'Count retries as part of the work.',
  ],
  [
    '03',
    'Repeatability',
    'Save the full configuration.',
    'Repeat with recorded seeds.',
  ],
];
for (let i = 0; i < 3; i++) {
  const y = 214 + i * 121;
  art +=
    rect(48, y, 1104, 101) +
    text(74, y + 60, speedRows[i][0], 32, cyan, mono) +
    line(143, y + 22, 143, y + 79) +
    text(170, y + 61, speedRows[i][1], 30);
  art +=
    text(550, y + 42, speedRows[i][2], 23) +
    text(550, y + 74, speedRows[i][3], 20, muted);
}
art += text(
  48,
  594,
  'FEWER STEPS ≠ A UNIVERSAL END-TO-END SPEEDUP',
  17,
  cyan,
  mono
);
save(
  'flashgen-evaluation',
  shell(
    'FlashGen evaluation checklist',
    'Evaluate total time, usable quality, and repeatability. No benchmark results are shown.',
    art
  )
);

art =
  text(48, 119, 'Same object. Through every frame.', 46) +
  text(48, 164, 'VBVR: a consistency goal you can test.', 23, muted);
for (let i = 0; i < 3; i++) {
  const x = 48 + i * 376;
  art += rect(x, 213, 352, 303, '#171e23');
  art += text(
    x + 22,
    249,
    ['01 / BEFORE', '02 / OCCLUDED', '03 / AFTER'][i],
    15,
    coral,
    mono
  );
  art += `<path d="M${x + 23} 422 L${x + 175} 340 L${x + 330} 419 L${x + 175} 493Z" fill="#28353c" stroke="#52616a"/>`;
  const ballX = x + [78, 173, 277][i];
  art +=
    `<ellipse cx="${ballX}" cy="419" rx="36" ry="12" fill="#050c11" opacity="0.55"/>` +
    circle(ballX, 377, 31, 'url(#ball)');
  if (i === 1)
    art += `<path d="M${x + 170} 340 L${x + 238} 365 V438 L${x + 170} 412Z" fill="#66747a"/><path d="M${x + 170} 340 L${x + 203} 321 L${x + 270} 346 L${x + 238} 365Z" fill="#869194"/><path d="M${x + 238} 365 L${x + 270} 346 V420 L${x + 238} 438Z" fill="#45565f"/>`;
  art += `<path d="M${x + 34} 453 Q${x + 166} 487 ${x + 315} 453" fill="none" stroke="${coral}" stroke-width="2" stroke-dasharray="5 8"/>`;
  art += text(
    x + 175,
    552,
    ['One object', 'Continuous path', 'Same identity'][i],
    23,
    coral,
    'text-anchor="middle"'
  );
}
art += text(
  48,
  594,
  'ILLUSTRATED GOAL / NOT A GUARANTEED OUTCOME',
  16,
  muted,
  mono
);
save(
  'vbvr-cover',
  shell(
    'VBVR object consistency',
    'The same illustrated ball moves through a scene and remains recognizable after occlusion.',
    art,
    coral
  )
);

art =
  text(48, 119, 'Keep the experiment controlled.', 46) +
  text(
    48,
    164,
    'Conceptual H3 image-to-video workflow with a VBVR adapter.',
    23,
    muted
  );
const nodes = [
  ['01 / INPUT', 'Reference image', 'One clear interaction'],
  ['02 / MODEL', 'H3 + VBVR', 'A compatible loader'],
  ['03 / SAMPLE', 'Fixed settings', 'Same prompt and seed'],
  ['04 / REVIEW', 'Full video', 'Inspect every phase'],
];
for (let i = 0; i < nodes.length; i++) {
  const x = 48 + i * 282;
  art +=
    rect(x, 237, 258, 222) +
    text(x + 21, 274, nodes[i][0], 15, coral, mono) +
    text(x + 21, 375, nodes[i][1], 26) +
    text(x + 21, 412, nodes[i][2], 17, muted);
  if (i === 0)
    art +=
      rect(x + 24, 296, 69, 45, '#26383f', '#91a2ad50', 5) +
      circle(x + 62, 317, 12, coral);
  if (i === 1)
    art +=
      rect(x + 24, 296, 78, 18, '#30454d', 'none', 4) +
      rect(x + 24, 321, 78, 18, '#754f46', 'none', 4);
  if (i === 2)
    art +=
      line(x + 24, 306, x + 105, 306, muted) +
      circle(x + 54, 306, 6, coral) +
      line(x + 24, 331, x + 105, 331, muted) +
      circle(x + 87, 331, 6, coral);
  if (i === 3)
    art += `<path d="M${x + 28} 302 L${x + 78} 319 L${x + 28} 337Z" fill="${coral}"/>`;
  if (i < 3) art += arrow(x + 265, 345, x + 279, 345, coral);
}
art +=
  rect(48, 499, 1104, 83, '#2a2525', '#efac9630') +
  text(76, 533, 'BASELINE vs CANDIDATE', 15, coral, mono) +
  text(
    76,
    565,
    'Change the adapter. Keep the image, prompt, seed, duration, and sampler.',
    23
  );
save(
  'vbvr-workflow',
  shell(
    'VBVR image-to-video setup',
    'Reference image, compatible H3 LoRA loader, controlled sampling, and full-video review.',
    art,
    coral
  )
);

art =
  text(48, 119, 'Three checks. The whole action.', 46) +
  text(
    48,
    164,
    'Review the interaction, not just a beautiful first frame.',
    23,
    muted
  );
for (let i = 0; i < 3; i++) {
  const x = 48 + i * 376;
  art +=
    rect(x, 213, 352, 354) + text(x + 24, 252, `0${i + 1}`, 18, coral, mono);
  if (i === 0) {
    art +=
      circle(x + 175, 354, 45, 'url(#ball)') +
      `<circle cx="${x + 175}" cy="354" r="70" fill="none" stroke="#efac9670" stroke-dasharray="5 7"/>`;
  } else if (i === 1) {
    art +=
      rect(x + 55, 388, 242, 13, '#49636c', 'none', 3) +
      circle(x + 175, 351, 37, 'url(#ball)') +
      line(x + 113, 389, x + 237, 389, coral);
  } else {
    art +=
      circle(x + 82, 355, 27, 'url(#ball)') +
      circle(x + 270, 355, 27, 'url(#ball)') +
      rect(x + 142, 306, 68, 100, '#45565f', '#7c8f98', 7) +
      `<path d="M${x + 110} 353 H${x + 141} M${x + 210} 353 H${x + 242}" fill="none" stroke="${coral}" stroke-dasharray="4 5"/>`;
  }
  art +=
    text(
      x + 24,
      479,
      ['Object count', 'Clean contact', 'Identity after occlusion'][i],
      i === 2 ? 24 : 28
    ) +
    text(
      x + 24,
      518,
      [
        'One stays one.',
        'Boundaries stay readable.',
        'Same color, shape, and size.',
      ][i],
      20,
      muted
    );
}
art += text(
  48,
  597,
  'PASS / UNCERTAIN / FAIL — KEEP EVERY OUTPUT',
  16,
  coral,
  mono
);
save(
  'vbvr-evaluation',
  shell(
    'VBVR consistency review',
    'Schematic criteria: stable object count, plausible contact, and stable identity after occlusion.',
    art,
    coral
  )
);
console.log('Wrote six original guide illustrations to public/imgs/guides/.');
