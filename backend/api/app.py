"""FastAPI application factory."""

from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from api.schemas import (
    ChatRequest,
    ChatResponse,
    HealthResponse,
    OrderResponse,
    OrdersListResponse,
    ResetRequest,
)
from api.session_store import SessionStore
from database.orders import OrderDatabase

_REPO_ROOT = Path(__file__).resolve().parents[2]
_FRONTEND_DIST = _REPO_ROOT / "frontend" / "dist"
_ORDERS_DB = OrderDatabase(db_path=str(_REPO_ROOT / "data" / "ecommerce.db"))


def create_api_app(
    session_store: SessionStore,
    *,
    dev_mode: bool = False,
) -> FastAPI:
    """Create FastAPI app with API routes and optional static SPA mount."""
    app = FastAPI(title="Cecilia AI API")

    if dev_mode:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    @app.get("/api/health", response_model=HealthResponse)
    def health() -> HealthResponse:
        return HealthResponse()

    @app.post("/api/chat", response_model=ChatResponse)
    def chat(body: ChatRequest) -> ChatResponse:
        message = body.message.strip()
        if not message:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        service = session_store.get(body.session_id)
        reply = service.send(message)
        return ChatResponse(reply=reply)

    @app.post("/api/session/reset", status_code=204)
    def reset_session(body: ResetRequest) -> None:
        session_store.reset(body.session_id)

    @app.get("/api/orders", response_model=OrdersListResponse)
    def list_orders(limit: int = 100) -> OrdersListResponse:
        limit = min(max(limit, 1), 100)
        orders = _ORDERS_DB.get_all_orders(limit=limit)
        payload = [OrderResponse.from_order(o) for o in orders]
        return OrdersListResponse(orders=payload, count=len(payload))

    if _FRONTEND_DIST.is_dir() and (_FRONTEND_DIST / "index.html").is_file():
        assets_dir = _FRONTEND_DIST / "assets"
        if assets_dir.is_dir():
            app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

        @app.get("/{full_path:path}")
        def spa_fallback(full_path: str):
            if full_path.startswith("api/"):
                raise HTTPException(status_code=404)
            file_path = _FRONTEND_DIST / full_path
            if full_path and file_path.is_file():
                return FileResponse(file_path)
            return FileResponse(_FRONTEND_DIST / "index.html")

    return app
