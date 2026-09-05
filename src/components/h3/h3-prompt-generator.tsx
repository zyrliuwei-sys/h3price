import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';

const fieldClassName =
  'mt-2 w-full rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2.5 text-sm text-white outline-none placeholder:text-neutral-500 focus:border-cyan-200/80';

export function H3PromptGenerator({
  initialSubject,
}: {
  initialSubject?: string;
}) {
  const [subject, setSubject] = useState(
    initialSubject || 'A red vintage scooter'
  );
  const [action, setAction] = useState('rides downhill through a coastal town');
  const [setting, setSetting] = useState(
    'blue-hour light after rain, reflective pavement, lively street ambience'
  );
  const [style, setStyle] = useState('cinematic');
  const [camera, setCamera] = useState('slow push-in');
  const [copied, setCopied] = useState(false);

  const prompt = useMemo(
    () =>
      [
        `Subject: ${subject.trim() || 'the main subject'}.`,
        `Action: ${action.trim() || 'performs a clear action'}.`,
        `Setting and mood: ${setting.trim() || 'a specific setting and mood'}.`,
        `Style: ${style}.`,
        `Camera: ${camera}.`,
        'Audio: describe the dialogue, ambience, music, or foley that should be synchronized with the picture.',
        'Keep the action readable and the visual direction consistent from start to finish.',
      ].join(' '),
    [action, camera, setting, style, subject]
  );

  const copyPrompt = async () => {
    await navigator.clipboard?.writeText(prompt);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section aria-labelledby="h3-prompt-generator-title">
      <p className="text-xs font-semibold tracking-[0.16em] text-cyan-200 uppercase">
        Free, no sign-up
      </p>
      <h1
        id="h3-prompt-generator-title"
        className="mt-3 text-4xl font-semibold tracking-[-0.045em] sm:text-5xl"
      >
        MiniMax H3 Prompt Generator
      </h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-300">
        Fill in the creative direction, then copy a structured English prompt
        for a MiniMax H3 Max video request on fal.ai. This is a local template
        builder, not an LLM service.
      </p>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <form className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6">
          <TextField label="Subject" value={subject} onChange={setSubject} />
          <TextField label="Action" value={action} onChange={setAction} />
          <TextField
            label="Setting & mood"
            value={setting}
            onChange={setSetting}
          />
          <label className="mt-5 block text-sm font-semibold">
            Style
            <select
              value={style}
              onChange={(event) => setStyle(event.target.value)}
              className={fieldClassName}
            >
              <option>cinematic</option>
              <option>photorealistic</option>
              <option>anime</option>
              <option>3D render</option>
              <option>stop-motion claymation</option>
            </select>
          </label>
          <label className="mt-5 block text-sm font-semibold">
            Camera move
            <select
              value={camera}
              onChange={(event) => setCamera(event.target.value)}
              className={fieldClassName}
            >
              <option>slow push-in</option>
              <option>aerial reveal</option>
              <option>tracking shot</option>
              <option>locked-off wide shot</option>
              <option>gentle handheld close-up</option>
            </select>
          </label>
        </form>

        <div className="flex flex-col rounded-2xl border border-cyan-200/20 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.13),rgba(255,255,255,0.04)_55%)] p-5 sm:p-6">
          <h2 className="text-xl font-semibold">Generated English prompt</h2>
          <p className="mt-4 grow rounded-lg border border-white/10 bg-black/25 p-4 text-sm leading-7 text-neutral-200">
            {prompt}
          </p>
          <button
            type="button"
            onClick={copyPrompt}
            className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-black hover:bg-neutral-200"
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? 'Copied' : 'Copy prompt'}
          </button>
        </div>
      </div>

      <section className="mt-14" aria-labelledby="good-prompt-title">
        <h2 id="good-prompt-title" className="text-2xl font-semibold">
          What Makes a Good MiniMax H3 Prompt
        </h2>
        <ul className="mt-5 grid gap-4 text-sm leading-6 text-neutral-300 md:grid-cols-3">
          <PromptTip
            title="Name the subject and action"
            body="Start with who or what is central, then give it one visible action. That makes the intended motion easier to evaluate."
          />
          <PromptTip
            title="Direct the camera and light"
            body="State a camera position or move, time of day, and lighting treatment instead of relying on a broad adjective alone."
          />
          <PromptTip
            title="Describe the sound with the shot"
            body="fal says H3 Max returns synchronized audio, so include the dialogue, ambience, foley, or music direction in the same brief."
          />
        </ul>
      </section>

      <section className="mt-14" aria-labelledby="example-prompts-title">
        <h2 id="example-prompts-title" className="text-2xl font-semibold">
          Example Prompts
        </h2>
        <div className="mt-5 grid gap-4">
          <ExamplePrompt text="A pastry chef dusts a warm croissant in a quiet morning bakery. Golden window light, close 50mm framing, slow push-in. Sound: paper bag rustle, soft oven fan, low café room tone. Photorealistic." />
          <ExamplePrompt text="A small research rover crosses red dunes at sunrise, leaving shallow tracks as the camera follows at ground level. Cinematic science-fiction realism, long shadows, wind over sand and a faint mechanical hum." />
          <ExamplePrompt text="A blue clay fox waters a windowsill garden, notices a new flower opening, and smiles toward camera. Stop-motion claymation, warm practical lamps, gentle handheld close-up. Sound: watering can, ceramic clink, playful pizzicato." />
        </div>
      </section>
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="mt-5 block text-sm font-semibold first:mt-0">
      {label}
      <input
        className={fieldClassName}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function PromptTip({ title, body }: { title: string; body: string }) {
  return (
    <li className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
      <h3 className="font-semibold text-white">{title}</h3>
      <p className="mt-2 text-neutral-400">{body}</p>
    </li>
  );
}

function ExamplePrompt({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm leading-6 text-neutral-300">
      {text}
    </p>
  );
}
