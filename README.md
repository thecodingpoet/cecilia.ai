<p align="center">
  <img src="frontend/public/cecilia-logo.png" alt="Cecilia.AI" width="420" />
</p>

**Cecilia** is an intelligent shopping assistant that handles product inquiries and order processing through natural conversation. The system uses RAG (Retrieval-Augmented Generation) to answer product questions and guides customers through the entire purchase journey—from product discovery to order completion—using natural language dialogue.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Usage](#usage)
- [Testing](#testing)
- [Limitations](#limitations)

## Features

- **🤖 Conversational AI**: Natural language interface for product search and ordering
- **🌐 Web UI**: React + TypeScript chat interface with orders view
- **⚡ FastAPI backend**: REST API with per-session conversation isolation
- **💻 CLI Interface**: Terminal-based interactions for scripting and debugging
- **🔍 Intelligent Product Search**: RAG-powered hybrid search (exact match + ChromaDB semantic)
- **🛒 Seamless Order Processing**: Conversational checkout that collects customer details through dialogue
- **🧠 Multi-Agent Architecture**: Orchestrator, RAG, and Order agents working in concert
- **💬 Stateful Conversations**: Context preserved per session across multiple turns
- **📦 Order Management**: Order lifecycle from placement to SQLite persistence
- **🎯 Smart Intent Detection**: Routes queries to the appropriate specialist agent
- **🔄 Dynamic Mode Switching**: Transitions between product search and checkout modes
- **💾 Dual Storage System**:
  - Vector embeddings in ChromaDB for semantic search
  - Relational data in SQLite for orders and transactions
- **🛠️ Admin Console**: Interactive Python shell for data inspection and maintenance

## Architecture

The system has three layers:

1. **Presentation** — CLI (`backend/main.py`) or React SPA (`frontend/`) backed by FastAPI (`backend/api/`)
2. **Agents** — LangChain orchestrator with RAG and Order specialist agents (`backend/agents/`)
3. **Data** — ChromaDB for product search, SQLite for orders (`backend/database/`)

The web UI sends `session_id` with each request. The server maintains a separate orchestrator, chat history, and shopping cart per session via `SessionStore`.

For diagrams, API routes, session model, and agent internals, see [Architecture Documentation](docs/architecture.md).

## Project Structure

```
ecommerce-bot/
├── frontend/          # React UI (Vite + TypeScript + Tailwind)
├── backend/
│   ├── agents/        # Orchestrator, RAG, Order agents
│   ├── api/           # FastAPI routes and session store
│   ├── database/      # Products, orders, vector store
│   ├── chat/          # ChatSession (orchestrator + history per conversation)
│   └── main.py        # CLI and --ui entry point
├── data/              # products.json, ecommerce.db, chroma/
├── docs/              # architecture.md
└── examples/          # Manual test conversation scripts
```

## Setup

### Prerequisites

- **Python 3.12 or higher**
- **Node.js 18+** (for the web UI)
- **[uv](https://github.com/astral-sh/uv)** (recommended) or `pip`
- **OpenAI API Key** — [Get one here](https://platform.openai.com/api-keys)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd ecommerce-bot
```

#### 2. Install Dependencies

Python (backend):

```bash
uv sync
```

Frontend (web UI):

```bash
cd frontend && npm install && cd ..
```

#### 3. Configure Environment

```bash
cp .env.example .env
```

Add your OpenAI API key to `.env`:

```
OPENAI_API_KEY=sk-...
```

#### 4. Initialize Data

Populate the vector store with the product catalog:

```bash
uv run backend/initialize_vector_store.py
```

## Usage

The application supports a **Web UI** and a **CLI**.

### Web UI

<img width="1913" height="2067" alt="image" src="https://github.com/user-attachments/assets/1bc4c178-ba2b-40e3-bbdf-a7d02b05651a" />


Build the frontend and start the server:

```bash
cd frontend && npm run build && cd ..
uv run backend/main.py --ui
```

- App: `http://127.0.0.1:8000` (default)
- Add `--open` to launch the browser

**Development** (hot reload):

```bash
# Terminal 1 — API
uv run backend/main.py --ui --dev

# Terminal 2 — Vite dev server
cd frontend && npm run dev
```

- UI: `http://localhost:5173` (proxies `/api` → port 8000)
- API: `http://127.0.0.1:8000`

**Custom port:**

```bash
uv run backend/main.py --ui --port 8080
```

### Command-Line Interface (CLI)

<img width="892" height="629" alt="Screenshot 2025-12-16 at 08 12 08" src="https://github.com/user-attachments/assets/a55c40e3-f498-44af-a3b6-86708052d170" />

```bash
uv run backend/main.py
```

### Verbose Mode

Works with CLI and web UI:

```bash
uv run backend/main.py --verbose
uv run backend/main.py --ui --verbose
uv run backend/main.py --ui -v
```

Verbose mode enables DEBUG logging, orchestrator state traces, chat history length, full tracebacks, and agent decision visibility.

### Command-Line Options

```bash
uv run backend/main.py --help

# CLI
uv run backend/main.py
uv run backend/main.py --verbose

# Web UI
uv run backend/main.py --ui
uv run backend/main.py --ui --dev
uv run backend/main.py --ui --port 8080
uv run backend/main.py --ui --open
uv run backend/main.py --ui --verbose
```

### Developer Console

<img width="947" height="829" alt="Screenshot 2025-12-16 at 08 16 46" src="https://github.com/user-attachments/assets/94289124-4a7c-4b49-873c-1908278d202e" />

```bash
uv run backend/console.py
```

Pre-initialized objects:

- **`products`**: `ProductCatalog` — e.g. `products.get_product("TECH-001")`
- **`orders`**: `OrderDatabase` — e.g. `orders.get_last_order()`, `orders.get_order_count()`

## Testing

Manual test scenarios and expected conversation flows: [Conversation Test Guide](examples/test_conversations.md).

Covers product queries, multi-turn flows, order confirmation, ambiguous queries, and edge cases.

## Limitations

- **In-memory sessions**: Chat history, orchestrator state, and carts live in server memory. A restart clears active sessions (orders in SQLite remain).
- **Session cap**: Up to 100 concurrent server sessions; oldest sessions are evicted when the limit is reached.
- **In-memory shopping cart**: Cart data is per-session and not persisted to disk.
- **No payment processing**: Checkout is simulated; no real payment or shipping integrations.
- **Local/demo scope**: Designed for development and demos—not hardened for production deployment without auth, rate limiting, and persistent session storage.
