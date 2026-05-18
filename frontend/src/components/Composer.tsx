import { useCallback, useRef, useEffect } from "react";

interface Props {
  onSend: (text: string) => void;
  loading: boolean;
}

const MAX_ROWS = 6;

export default function Composer({ onSend, loading }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = lineHeight * MAX_ROWS;
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
  }, []);

  useEffect(() => {
    resize();
  }, [resize]);

  const handleSubmit = () => {
    const el = textareaRef.current;
    if (!el || loading) return;
    const text = el.value.trim();
    if (!text) return;
    onSend(text);
    el.value = "";
    resize();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div
      className="animate-composer-enter border-t px-4 py-4 sm:px-6"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <div
        className="mx-auto flex max-w-[var(--max-chat-width)] items-end gap-2 rounded-2xl border px-3 py-2"
        style={{
          borderColor: "var(--border-subtle)",
          background: "var(--bg-elevated)",
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          disabled={loading}
          placeholder="Message Cecilia…"
          onInput={resize}
          onKeyDown={handleKeyDown}
          aria-busy={loading}
          className="max-h-36 min-h-[24px] flex-1 resize-none bg-transparent py-1.5 text-[0.9375rem] outline-none placeholder:text-[var(--text-muted)] disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors disabled:opacity-40"
          style={{
            background: loading ? "var(--border-subtle)" : "var(--accent)",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent-hover)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent)";
            }
          }}
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
      {loading && (
        <p className="mx-auto mt-2 max-w-[var(--max-chat-width)] text-center text-xs text-[var(--text-muted)]">
          Cecilia is thinking…
        </p>
      )}
    </div>
  );
}
