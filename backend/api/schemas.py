"""API request/response models."""

from datetime import datetime

from pydantic import BaseModel, Field

from agents.schemas import ProductInfo
from database.orders import Order


def _dt_iso(dt: datetime) -> str:
    return dt.isoformat() + "Z"


class ChatRequest(BaseModel):
    session_id: str = Field(min_length=1)
    message: str = Field(min_length=1)


class ChatResponse(BaseModel):
    reply: str
    products: list[ProductInfo] = Field(default_factory=list)


class ResetRequest(BaseModel):
    session_id: str = Field(min_length=1)


class HealthResponse(BaseModel):
    status: str = "ok"


class OrderItemResponse(BaseModel):
    product_id: str
    product_name: str
    quantity: int
    unit_price: float
    subtotal: float


class OrderResponse(BaseModel):
    order_id: str
    customer_name: str
    customer_email: str
    total_amount: float
    created_at: str
    updated_at: str
    items: list[OrderItemResponse]

    @classmethod
    def from_order(cls, order: Order) -> "OrderResponse":
        return cls(
            order_id=order.order_id,
            customer_name=order.customer_name,
            customer_email=order.customer_email,
            total_amount=order.total_amount,
            created_at=_dt_iso(order.created_at),
            updated_at=_dt_iso(order.updated_at),
            items=[
                OrderItemResponse(
                    product_id=item.product_id,
                    product_name=item.product_name,
                    quantity=item.quantity,
                    unit_price=item.unit_price,
                    subtotal=item.subtotal,
                )
                for item in order.items
            ],
        )


class OrdersListResponse(BaseModel):
    orders: list[OrderResponse]
    count: int
