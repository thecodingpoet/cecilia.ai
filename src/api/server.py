"""Uvicorn entry for the custom web UI."""

import logging
import webbrowser
from pathlib import Path
from threading import Timer

import uvicorn

from api.app import create_api_app
from api.session_store import SessionStore

_REPO_ROOT = Path(__file__).resolve().parents[2]
_FRONTEND_DIST = _REPO_ROOT / "frontend" / "dist"


def run_custom_ui(
    logger: logging.Logger,
    *,
    verbose: bool = False,
    server_port: int = 8000,
    server_name: str = "127.0.0.1",
    dev_mode: bool = False,
    open_browser: bool = False,
) -> None:
    """Run FastAPI with session-backed chat API and optional static frontend."""
    session_store = SessionStore(logger, verbose=verbose)
    app = create_api_app(session_store, dev_mode=dev_mode)

    url = f"http://{server_name}:{server_port}"
    if dev_mode:
        print(f"\nAPI running at {url}")
        print("Start the frontend dev server: cd frontend && npm run dev")
        print("Vite proxies /api to this server.\n")
    else:
        if not (_FRONTEND_DIST / "index.html").is_file():
            print(
                "\nWarning: frontend not built. Run: cd frontend && npm install && npm run build\n"
            )
        print(f"\nShop Assistant running at {url}")
        print("Press Ctrl+C to stop the server\n")

    if open_browser and not dev_mode:
        Timer(1.0, lambda: webbrowser.open(url)).start()

    uvicorn.run(
        app,
        host=server_name,
        port=server_port,
        log_level="debug" if verbose else "info",
    )
