export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock_status: string;
  image_url?: string | null;
}

export interface ChatResult {
  reply: string;
  products: Product[];
}

export async function sendMessage(
  sessionId: string,
  message: string
): Promise<ChatResult> {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { detail?: string }).detail ?? `Request failed (${res.status})`
    );
  }
  const data = (await res.json()) as ChatResult;
  return {
    reply: data.reply,
    products: data.products ?? [],
  };
}

export async function resetSession(sessionId: string): Promise<void> {
  const res = await fetch("/api/session/reset", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId }),
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(`Reset failed (${res.status})`);
  }
}

export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
}

export interface Order {
  order_id: string;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  orders: Order[];
  count: number;
}

function apiErrorMessage(
  res: Response,
  err: { detail?: string },
  fallback: string
): string {
  if (res.status === 404) {
    return "Orders API not found. Restart the backend (uv run backend/main.py --ui).";
  }
  return err.detail ?? `${fallback} (${res.status})`;
}

export async function fetchOrders(): Promise<OrdersResponse> {
  const res = await fetch("/api/orders");
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      apiErrorMessage(res, err as { detail?: string }, "Failed to load orders")
    );
  }
  return (await res.json()) as OrdersResponse;
}
