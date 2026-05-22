import { useCallback, useState } from "react";
import type { Order } from "../api/client";
import {
  formatCurrency,
  formatDateTime,
  formatRelativeTime,
} from "../lib/format";

interface Props {
  order: Order;
}

export default function OrderRow({ order }: Props) {
  const [expanded, setExpanded] = useState(false);
  const detailId = `order-detail-${order.order_id}`;

  const toggle = useCallback(() => setExpanded((v) => !v), []);

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
        className="w-full cursor-pointer px-4 py-3 text-left transition-colors hover:bg-[rgba(255,255,255,0.02)] sm:px-5"
      >
        <div className="hidden gap-4 sm:grid sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1.4fr)_auto_auto_auto] sm:items-center">
          <div className="min-w-0">
            <p className="font-mono text-sm font-medium text-[var(--accent)]">
              {order.order_id}
            </p>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              Tap for line items
            </p>
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{order.customer_name}</p>
            <p className="truncate text-sm text-[var(--text-muted)]">
              {order.customer_email}
            </p>
          </div>
          <p
            className="text-right text-sm tabular-nums text-[var(--text-muted)]"
            title={formatDateTime(order.created_at)}
          >
            {formatRelativeTime(order.created_at)}
          </p>
          <p className="text-right font-medium tabular-nums">
            {formatCurrency(order.total_amount)}
          </p>
          <span className="rounded-md px-2 py-1 text-right text-xs font-medium text-[var(--text-muted)]">
            {expanded ? "Hide" : "Details"}
          </span>
        </div>

        <div className="flex flex-col gap-2 sm:hidden">
          <div className="min-w-0">
            <p className="font-mono text-sm font-medium text-[var(--accent)] [overflow-wrap:anywhere]">
              {order.order_id}
            </p>
            <p className="mt-1 font-medium">{order.customer_name}</p>
          </div>
          <p className="text-sm text-[var(--text-muted)] [overflow-wrap:anywhere]">
            {order.customer_email}
          </p>
          <div className="flex items-center justify-between gap-3 text-sm">
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
          <div className="mt-1 flex items-center justify-end gap-3">
            <span
              className="rounded-md px-2.5 py-1 text-xs font-medium"
              style={{
                color: "var(--accent)",
                background: "var(--accent-muted)",
              }}
            >
              {expanded ? "Hide items" : "View items"}
            </span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="expand-grid expand-grid--open">
          <div>
            <div className="min-w-0">
              <div
                id={detailId}
                onClick={(e) => e.stopPropagation()}
                className="expand-panel-inner border-t px-4 py-4 sm:px-5"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  Line items
                </p>
                <div className="space-y-3 sm:hidden">
                  {order.items.map((item) => (
                    <div
                      key={`${item.product_id}-${item.product_name}`}
                      className="rounded-lg border p-3"
                      style={{ borderColor: "var(--border-subtle)" }}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium [overflow-wrap:anywhere]">
                            {item.product_name}
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-[var(--text-muted)]">
                            {item.product_id}
                          </p>
                        </div>
                        <p className="shrink-0 font-medium tabular-nums">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                      <div className="mt-2 flex justify-between text-sm text-[var(--text-muted)]">
                        <span>Qty {item.quantity}</span>
                        <span>{formatCurrency(item.unit_price)} each</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="hidden overflow-x-auto sm:block">
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
        </div>
      )}
    </article>
  );
}
