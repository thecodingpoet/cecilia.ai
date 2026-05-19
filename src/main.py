"""
Cecilia AI — CLI and web UI entry point.
Interactive assistant for product search and order placement.
"""

import argparse
import logging

from dotenv import load_dotenv

from agents.orchestrator import Orchestrator
from api.server import run_custom_ui
from chat.session import ChatSession
from utils.logger import setup_logger
from utils.spinner import Spinner

load_dotenv()


def setup_logging(verbose: bool = False) -> logging.Logger:
    """
    Configure logging for all components.

    Args:
        verbose: Enable verbose logging if True

    Returns:
        Logger instance for CLI
    """
    log_level = logging.DEBUG if verbose else logging.WARNING

    for component in [
        "agents.order_agent",
        "agents.orchestrator",
        "agents.rag_agent",
        "database.products",
    ]:
        setup_logger(component, level=log_level)

    return setup_logger("cli", level=log_level)


def run_cli(verbose: bool = False):
    """Run CLI interface for Cecilia AI with product search and ordering.

    Args:
        verbose: Enable verbose output for debugging
    """

    def print_banner(verbose: bool = False):
        """Print welcome banner with application info and commands.

        Args:
            verbose: Whether verbose mode is enabled
        """
        print("\n" + "=" * 70)
        print("🛍️  Cecilia AI")
        print("=" * 70)
        print("Hi, I'm Cecilia — your AI shopping assistant. I can help you:")
        print("  • Search and browse products")
        print("  • Get detailed product information")
        print("  • Place orders with ease")
        print()
        print("Commands:")
        print("  • Type 'exit' or 'quit' to end the conversation")
        if verbose:
            print("  • Verbose mode is enabled - debug info will be shown")
        print("=" * 70)

    logger = setup_logging(verbose)
    session = ChatSession(Orchestrator(), logger, verbose=verbose)

    print_banner(verbose)

    while True:
        user_input = input("\nYou: ").strip()

        if user_input.lower() in ["exit", "quit"]:
            print("\nThank you for shopping with us! Goodbye!")
            break

        if not user_input:
            continue

        try:
            spinner = Spinner("Processing")
            spinner.start()
            try:
                reply = session.send(user_input)
            finally:
                spinner.stop()

            print(f"Assistant: {reply}")

        except KeyboardInterrupt:
            print("\n\nThank you for shopping with us! Goodbye!")
            break


def main(
    ui: bool = False,
    dev: bool = False,
    verbose: bool = False,
    port: int | None = None,
    host: str = "127.0.0.1",
    open_browser: bool = False,
):
    """Main entry point for Cecilia AI."""
    if ui:
        logger = setup_logging(verbose)
        run_custom_ui(
            logger,
            verbose=verbose,
            server_port=port or 8000,
            server_name=host,
            dev_mode=dev,
            open_browser=open_browser,
        )
    else:
        run_cli(verbose=verbose)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Cecilia AI — CLI and web UI",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
        Examples:
          python src/main.py
          python src/main.py --ui
          python src/main.py --ui --dev
        """,
    )
    parser.add_argument(
        "-v",
        "--verbose",
        action="store_true",
        help="Enable verbose output for debugging",
    )
    parser.add_argument(
        "--ui",
        action="store_true",
        help="Launch custom web UI (FastAPI + React)",
    )
    parser.add_argument(
        "--dev",
        action="store_true",
        help="API only; run Vite dev server separately (use with --ui)",
    )
    parser.add_argument(
        "--port",
        type=int,
        default=None,
        help="Port for web UI (default: 8000)",
    )
    parser.add_argument(
        "--host",
        type=str,
        default="127.0.0.1",
        help="Host to bind for web UI",
    )
    parser.add_argument(
        "--open",
        action="store_true",
        help="Open the web UI in your default browser",
    )
    args = parser.parse_args()

    main(
        ui=args.ui,
        dev=args.dev,
        verbose=args.verbose,
        port=args.port,
        host=args.host,
        open_browser=args.open,
    )
