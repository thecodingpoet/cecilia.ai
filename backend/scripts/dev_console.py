"""
Interactive developer console for Cecilia AI.
"""

import sys
from pathlib import Path

_BACKEND_ROOT = Path(__file__).resolve().parents[1]
if str(_BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(_BACKEND_ROOT))

from database import OrderDatabase, ProductCatalog

orders = OrderDatabase("data/ecommerce.db")
products = ProductCatalog()

banner = """
╔════════════════════════════════════════════════════════════╗
║              Cecilia AI — Developer Console                ║
╚════════════════════════════════════════════════════════════╝

Available objects:
  orders     - OrderDatabase instance
  products   - ProductCatalog instance

Examples:
  >>> products.get_product_by_id_or_name("TECH-001")
  >>> products.get_product("TECH-001")
  >>> products.get_all_products()
  >>> orders.get_last_order()
  >>> orders.get_all_orders()
  >>> orders.get_order_count()
  >>> orders.create_order("Test User", "test@example.com", [
    {
        "product_id": "TECH-001",
        "product_name": "MacBook Pro",
        "quantity": 1,
        "unit_price": 2499.99
    }
  ])

Type 'exit()' or Ctrl+D to quit.
"""

print(banner)

try:
    from IPython import embed

    embed(colors="neutral")
except ImportError:
    import code

    code.interact(local=locals(), banner="")
