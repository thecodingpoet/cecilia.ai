import type { Product } from "../api/client";
import ProductCard from "./ProductCard";

interface Props {
  products: Product[];
}

export default function ProductGrid({ products }: Props) {
  if (products.length === 0) return null;

  return (
    <div className="product-grid" role="list">
      {products.map((product) => (
        <div key={product.product_id} role="listitem">
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  );
}
