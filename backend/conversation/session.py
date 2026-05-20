"""Conversation session: orchestrator + message history for one dialogue.

Used by SessionStore (web) and run_cli. The React client calls:
  POST /api/chat            { "message", "session_id" } -> { "reply" }
  POST /api/session/reset   { "session_id" } -> 204
"""

import logging
from typing import List, Protocol

from agents.orchestrator import Orchestrator
from agents.schemas import OrchestratorResponse


class ChatService(Protocol):
    """Minimal conversation contract for HTTP clients and tests."""

    def send(self, message: str) -> OrchestratorResponse:
        """Send a user message and return the assistant response."""
        ...

    def reset(self) -> None:
        """Clear conversation history, cart, and orchestrator session state."""
        ...


class ChatSession:
    """One conversation: wraps Orchestrator with server-side message history."""

    def __init__(
        self,
        orchestrator: Orchestrator,
        logger: logging.Logger,
        *,
        verbose: bool = False,
    ):
        self._orchestrator = orchestrator
        self._logger = logger
        self._verbose = verbose
        self._history: List[dict] = []

    def send(self, message: str) -> OrchestratorResponse:
        if not message.strip():
            return OrchestratorResponse(
                message="",
                agent_used="orchestrator",
                products=[],
            )

        try:
            self._logger.debug(
                f"Orchestrator state: {self._orchestrator._state.value}"
            )
            self._logger.debug(f"Chat history length: {len(self._history)}")

            response = self._orchestrator.invoke(
                message, chat_history=self._history
            )
            reply = response.message

            self._history.append({"role": "user", "content": message})
            self._history.append({"role": "assistant", "content": reply})

            return response

        except Exception as e:
            self._logger.error(f"Error: {e}")
            if self._verbose:
                self._logger.exception("Full traceback:")
            return OrchestratorResponse(
                message=(
                    "Something went wrong while processing your request. "
                    f"Details: {e}\n\nPlease try again."
                ),
                agent_used="orchestrator",
                products=[],
            )

    def reset(self) -> None:
        self._history.clear()
        self._orchestrator.reset_session()
