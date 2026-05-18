export default function TypingIndicator() {
  return (
    <div className="message-enter flex items-center gap-1 px-1 py-3">
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-muted)]" />
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-muted)]" />
      <span className="typing-dot h-2 w-2 rounded-full bg-[var(--text-muted)]" />
    </div>
  );
}
