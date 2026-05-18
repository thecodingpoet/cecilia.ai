import { useChat } from "../hooks/useChat";
import ChatThread from "../components/ChatThread";
import Composer from "../components/Composer";

export default function ChatPage() {
  const { messages, loading, error, send } = useChat();

  return (
    <>
      <main className="mx-auto flex w-full min-h-0 max-w-[var(--max-chat-width)] flex-1 flex-col">
        <ChatThread
          messages={messages}
          loading={loading}
          error={error}
          onStarterSelect={send}
        />
      </main>
      <Composer onSend={send} loading={loading} />
    </>
  );
}
