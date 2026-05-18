import type { Order } from "../api/client";

interface Props {
  status: Order["status"];
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  pending: {
    bg: "var(--accent-muted)",
    color: "var(--accent)",
  },
  confirmed: {
    bg: "rgba(155, 126, 217, 0.18)",
    color: "var(--accent-secondary)",
  },
  shipped: {
    bg: "rgba(155, 126, 217, 0.18)",
    color: "var(--accent-secondary)",
  },
  delivered: {
    bg: "rgba(155, 126, 217, 0.18)",
    color: "var(--accent-secondary)",
  },
  cancelled: {
    bg: "transparent",
    color: "var(--text-muted)",
  },
};

export default function OrderStatusBadge({ status }: Props) {
  const normalized = status.toLowerCase();
  const style = STATUS_STYLES[normalized] ?? {
    bg: "var(--bg-elevated)",
    color: "var(--text-muted)",
  };

  return (
    <span
      className="inline-flex shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize"
      style={{
        background: style.bg,
        color: style.color,
        borderColor:
          normalized === "cancelled" ? "var(--border-subtle)" : "transparent",
      }}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
