import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import OrderList from "../components/OrderList";
import TypingIndicator from "../components/TypingIndicator";
import { useOrders } from "../hooks/useOrders";
import {
  ORDERS_EMPTY_MESSAGE,
  ORDERS_PAGE_TITLE,
} from "../lib/brand";
import { formatCurrency } from "../lib/format";
import { staggerDelay } from "../lib/motion";

export default function OrdersPage() {
  const { orders, count, loading, error, refresh } = useOrders();

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.total_amount, 0),
    [orders]
  );

  useEffect(() => {
    const prev = document.title;
    document.title = `Orders · Cecilia AI`;
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <main className="mx-auto flex w-full min-h-0 max-w-[var(--max-content-width)] flex-1 flex-col overflow-y-auto px-4 py-6 sm:px-6">
      <div
        className="animate-reveal-up mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        style={staggerDelay(0, 0, 40)}
      >
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">
            {ORDERS_PAGE_TITLE}
          </h1>
          {!loading && !error && (
            <p className="mt-1 text-sm text-[var(--text-muted)]">
              {count === 0
                ? "No orders in the database"
                : `${count} order${count === 1 ? "" : "s"}${
                    count > 0
                      ? ` · ${formatCurrency(totalRevenue)} total`
                      : ""
                  }`}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => void refresh()}
          disabled={loading}
          className="shrink-0 self-start rounded-lg border px-3 py-1.5 text-sm transition-colors hover:bg-[var(--bg-elevated)] disabled:opacity-40 sm:self-auto"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="animate-reveal-scale flex flex-1 flex-col items-center justify-center py-16">
          <TypingIndicator />
          <p className="mt-3 text-sm text-[var(--text-muted)]">Loading orders…</p>
        </div>
      )}

      {error && !loading && (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="rounded-lg px-3 py-1.5 text-sm font-medium"
            style={{ color: "var(--accent)" }}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && count === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <h2
            className="font-display animate-reveal-up mb-2 text-xl font-semibold"
            style={staggerDelay(0, 55, 80)}
          >
            No orders yet
          </h2>
          <p
            className="animate-reveal-up mb-6 max-w-sm text-[0.9375rem] text-[var(--text-muted)]"
            style={staggerDelay(1, 55, 80)}
          >
            {ORDERS_EMPTY_MESSAGE}
          </p>
          <Link
            to="/"
            className="starter-chip animate-reveal-up rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
            style={staggerDelay(2, 55, 80)}
          >
            Go to chat
          </Link>
        </div>
      )}

      {!loading && !error && count > 0 && <OrderList orders={orders} />}
    </main>
  );
}
