import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Zoom from "react-medium-image-zoom";
import type { Message } from "../hooks/useChat";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (message.role === "user") {
    return (
      <div className="message-enter flex justify-end">
        <div className="user-bubble max-w-[85%] rounded-2xl px-4 py-2.5 text-[0.9375rem] leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="message-enter group relative">
      <div className="prose-chat">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {message.content}
        </ReactMarkdown>
      </div>
      {message.products && message.products.length > 0 && (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {message.products.map((product) => (
            <div
              key={product.product_id}
              className="rounded-xl border border-white/10 bg-[var(--bg-elevated)]/40 p-3"
            >
              {product.image_url && (
                <Zoom zoomImg={{ alt: product.name }}>
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-28 w-full cursor-zoom-in rounded-lg object-cover"
                    loading="lazy"
                  />
                </Zoom>
              )}
              <div className="mt-3">
                <div className="text-sm font-semibold text-[var(--text-primary)]">
                  {product.name}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  ${product.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={handleCopy}
        className="mt-1 rounded-md px-2 py-1 text-xs text-[var(--text-muted)] opacity-0 transition-opacity hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] group-hover:opacity-100"
        aria-label="Copy message"
      >
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
