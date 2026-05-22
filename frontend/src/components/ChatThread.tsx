import { useEffect, useRef } from "react";
import type { Message } from "../hooks/useChat";
import EmptyState from "./EmptyState";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

interface Props {
  messages: Message[];
  loading: boolean;
  error: string | null;
  onStarterSelect: (prompt: string) => void;
}

export default function ChatThread({
  messages,
  loading,
  error,
  onStarterSelect,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  if (messages.length === 0 && !loading) {
    return <EmptyState onSelect={onStarterSelect} />;
  }

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto px-3 py-4 sm:gap-6 sm:px-6 sm:py-6">
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {loading && <TypingIndicator />}
      {error && (
        <p className="text-center text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
