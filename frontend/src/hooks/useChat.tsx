import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { loadSessionId, saveSessionId } from "../lib/brand";
import { resetSession, sendMessage } from "../api/client";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function getOrCreateSessionId(): string {
  const existing = loadSessionId();
  if (existing) return existing;
  const id = uuidv4();
  saveSessionId(id);
  return id;
}

export interface ChatContextValue {
  messages: Message[];
  loading: boolean;
  error: string | null;
  send: (text: string) => Promise<void>;
  clear: () => Promise<void>;
  hasMessages: boolean;
}

const ChatContext = createContext<ChatContextValue | null>(null);

function useChatState(): ChatContextValue {
  const [sessionId] = useState(getOrCreateSessionId);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || loading) return;

      setError(null);
      const userMsg: Message = {
        id: uuidv4(),
        role: "user",
        content: trimmed,
      };
      setMessages((prev) => [...prev, userMsg]);
      setLoading(true);

      try {
        const reply = await sendMessage(sessionId, trimmed);
        setMessages((prev) => [
          ...prev,
          { id: uuidv4(), role: "assistant", content: reply },
        ]);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    },
    [loading, sessionId]
  );

  const clear = useCallback(async () => {
    try {
      await resetSession(sessionId);
    } catch {
      /* session may not exist on server yet */
    }
    setMessages([]);
    setError(null);
  }, [sessionId]);

  return {
    messages,
    loading,
    error,
    send,
    clear,
    hasMessages: messages.length > 0,
  };
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const value = useChatState();
  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return ctx;
}
