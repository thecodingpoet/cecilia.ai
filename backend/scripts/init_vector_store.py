"""
Initialize ChromaDB vector store with product embeddings.
"""

import sys
from pathlib import Path

_BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))

from dotenv import load_dotenv

from database import ProductVectorStore
from utils.logger import setup_logger

load_dotenv()

logger = setup_logger(__name__)

if __name__ == "__main__":
    logger.info("Initializing vector store...")
    store = ProductVectorStore()
    store.initialize()
    logger.info("Vector store ready!")
