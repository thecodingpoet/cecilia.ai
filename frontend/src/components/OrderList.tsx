import type { Order } from "../api/client";
import { staggerDelay } from "../lib/motion";
import OrderRow from "./OrderRow";

interface Props {
  orders: Order[];
}

export default function OrderList({ orders }: Props) {
  return (
    <ul className="flex flex-col gap-3" role="list">
      {orders.map((order, i) => (
        <li
          key={order.order_id}
          className="animate-list-item"
          style={staggerDelay(i, 45, 60)}
        >
          <OrderRow order={order} />
        </li>
      ))}
    </ul>
  );
}
