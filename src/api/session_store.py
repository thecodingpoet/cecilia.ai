"""Per-session ChatSession instances."""

import logging
from threading import Lock

from agents.orchestrator import Orchestrator
from chat.session import ChatSession


class SessionStore:
    """Maps session_id to an isolated chat session (orchestrator + history)."""

    def __init__(
        self,
        logger: logging.Logger,
        *,
        verbose: bool = False,
        max_sessions: int = 100,
    ):
        self._logger = logger
        self._verbose = verbose
        self._max_sessions = max_sessions
        self._sessions: dict[str, ChatSession] = {}
        self._lock = Lock()

    def get(self, session_id: str) -> ChatSession:
        with self._lock:
            if session_id not in self._sessions:
                if len(self._sessions) >= self._max_sessions:
                    oldest = next(iter(self._sessions))
                    del self._sessions[oldest]
                self._sessions[session_id] = ChatSession(
                    Orchestrator(),
                    self._logger,
                    verbose=self._verbose,
                )
            return self._sessions[session_id]

    def reset(self, session_id: str) -> None:
        with self._lock:
            if session_id in self._sessions:
                self._sessions[session_id].reset()

    def delete(self, session_id: str) -> None:
        with self._lock:
            self._sessions.pop(session_id, None)
