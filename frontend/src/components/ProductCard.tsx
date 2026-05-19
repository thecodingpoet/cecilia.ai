import { useState } from "react";
import type { Product } from "../api/client";
import { formatCurrency } from "../lib/format";

interface Props {
  product: Product;
}

function formatStockStatus(status: string): string {
  const labels: Record<string, string> = {
    in_stock: "In stock",
    low_stock: "Low stock",
    out_of_stock: "Out of stock",
  };
  return labels[status] ?? status;
}

function stockClass(status: string): string {
  if (status === "in_stock") return "product-stock--in";
  if (status === "low_stock") return "product-stock--low";
  return "product-stock--out";
}

export default function ProductCard({ product }: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const imageUrl = product.image_url ?? undefined;
  const showImage = imageUrl && !imageFailed;

  return (
    <article className="product-card">
      <div className="product-card__media">
        {showImage ? (
          <img
            src={imageUrl}
            alt={product.name}
            loading="lazy"
            className="product-card__img"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="product-card__placeholder" aria-hidden />
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{product.name}</h3>
        <p className="product-card__price">{formatCurrency(product.price)}</p>
        <p className={`product-stock ${stockClass(product.stock_status)}`}>
          {formatStockStatus(product.stock_status)}
        </p>
        <p className="product-card__id">{product.product_id}</p>
      </div>
    </article>
  );
}
