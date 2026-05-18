import { useCallback, useState } from "react";
import type { Order } from "../api/client";
import {
  formatCurrency,
  formatDateTime,
  formatRelativeTime,
} from "../lib/format";
import OrderStatusBadge from "./OrderStatusBadge";

interface Props {
  order: Order;
}

export default function OrderRow({ order }: Props) {
  const [expanded, setExpanded] = useState(false);
  const detailId = `order-detail-${order.order_id}`;

  const toggle = useCallback(() => setExpanded((v) => !v), []);

  const copyOrderId = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(order.order_id);
    } catch {
      /* ignore */
    }
  }, [order.order_id]);

  return (
    <article
      className="rounded-xl border transition-[box-shadow,border-color] duration-300 hover:border-[var(--accent)]/30"
      style={{
        borderColor: "var(--border-subtle)",
        background: "var(--bg-elevated)",
      }}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        aria-controls={detailId}
        className="w-full px-4 py-3 text-left transition-colors hover:bg-[rgba(255,255,255,0.02)] sm:px-5"
      >
        <div className="hidden gap-4 sm:grid sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto_auto_auto_1.25rem] sm:items-center">
          <div className="min-w-0">
            <p className="font-mono text-sm font-medium text-[var(--accent)]">
              {order.order_id}
            </p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                void copyOrderId();
              }}
              className="mt-0.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              Copy ID
            </button>
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{order.customer_name}</p>
            <p className="truncate text-sm text-[var(--text-muted)]">
              {order.customer_email}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
          <p
            className="text-right text-sm tabular-nums text-[var(--text-muted)]"
            title={formatDateTime(order.created_at)}
          >
            {formatRelativeTime(order.created_at)}
          </p>
          <p className="text-right font-medium tabular-nums">
            {formatCurrency(order.total_amount)}
          </p>
          <span
            className="text-right text-xs text-[var(--text-muted)]"
            aria-hidden
          >
            {expanded ? "▲" : "▼"}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:hidden">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-mono text-sm font-medium text-[var(--accent)]">
                {order.order_id}
              </p>
              <p className="mt-1 font-medium">{order.customer_name}</p>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-[var(--text-muted)]">{order.customer_email}</p>
          <div className="flex items-center justify-between text-sm">
            <span
              className="text-[var(--text-muted)]"
              title={formatDateTime(order.created_at)}
            >
              {formatRelativeTime(order.created_at)}
            </span>
            <span className="font-medium tabular-nums">
              {formatCurrency(order.total_amount)}
            </span>
          </div>
        </div>
      </button>

      <div
        className={`expand-grid${expanded ? " expand-grid--open" : ""}`}
        aria-hidden={!expanded}
      >
        <div>
          <div
            id={detailId}
            className="expand-panel-inner border-t px-4 py-4 sm:px-5"
            style={{ borderColor: "var(--border-subtle)" }}
            hidden={!expanded}
          >
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
            Line items
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="text-xs text-[var(--text-muted)]">
                  <th className="pb-2 pr-3 font-medium">Product</th>
                  <th className="pb-2 pr-3 font-medium">ID</th>
                  <th className="pb-2 pr-3 text-right font-medium">Qty</th>
                  <th className="pb-2 pr-3 text-right font-medium">Unit</th>
                  <th className="pb-2 text-right font-medium">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr
                    key={`${item.product_id}-${item.product_name}`}
                    className="border-t"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <td className="py-2 pr-3">{item.product_name}</td>
                    <td className="py-2 pr-3 font-mono text-xs text-[var(--text-muted)]">
                      {item.product_id}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums">
                      {item.quantity}
                    </td>
                    <td className="py-2 pr-3 text-right tabular-nums text-[var(--text-muted)]">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="py-2 text-right tabular-nums font-medium">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
    </article>
  );
}
