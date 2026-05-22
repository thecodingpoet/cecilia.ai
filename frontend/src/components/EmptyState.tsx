import {
  ASSISTANT_GREETING,
  ASSISTANT_INTRO,
  APP_TAGLINE,
  STARTER_PROMPTS,
} from "../lib/brand";
import { staggerDelay } from "../lib/motion";

interface Props {
  onSelect: (prompt: string) => void;
}

export default function EmptyState({ onSelect }: Props) {
  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center overflow-y-auto px-3 py-8 text-center sm:px-4 sm:py-12">
      <h1
        className="font-display animate-reveal-up mb-2 text-[1.65rem] font-semibold tracking-tight sm:text-3xl"
        style={staggerDelay(1, 55, 120)}
      >
        {ASSISTANT_GREETING}
      </h1>
      <p
        className="animate-reveal-up mb-2 text-sm text-[var(--text-muted)]"
        style={staggerDelay(2, 55, 120)}
      >
        {APP_TAGLINE}
      </p>
      <p
        className="animate-reveal-up mb-6 max-w-md text-[0.9375rem] leading-relaxed text-[var(--text-muted)] sm:mb-8"
        style={staggerDelay(3, 55, 120)}
      >
        {ASSISTANT_INTRO}
      </p>
      <p
        className="animate-reveal-up mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]"
        style={staggerDelay(4, 55, 120)}
      >
        Try asking
      </p>
      <div className="grid w-full max-w-lg gap-2 sm:grid-cols-2">
        {STARTER_PROMPTS.map((prompt, i) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onSelect(prompt)}
            className="starter-chip animate-chip rounded-xl border px-3.5 py-3 text-left text-sm sm:px-4"
            style={staggerDelay(i, 50, 380)}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
