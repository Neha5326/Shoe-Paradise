import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct } from "../data/products.js";
import { useCart } from "../features/cart/CartContext.jsx";
import NotFoundPage from "./NotFoundPage.jsx";

export default function ProductDetailPage() {
  const { productId } = useParams();
  const product = getProduct(productId);
  const { addItem } = useCart();
  const [size, setSize] = useState(40);
  if (!product) return <NotFoundPage />;

  return (
    <section className="container detail-layout">
      <div
        className={`shoe-art detail-art shoe-art-${product.brand.toLowerCase()}`}
      >
        <img
          className="product-image"
          src={product.image}
          alt={`${product.brand} ${product.name}`}
        />
      </div>
      <div className="detail-copy">
        <Link className="text-link" to="/products">
          ← Back to shoes
        </Link>
        <span className="eyebrow">
          {product.brand} · {product.category}
        </span>
        <h1>{product.name}</h1>
        <p className="detail-price">Rs {product.price}</p>
        <p className="lead">{product.description}</p>
        <p>
          Fit: {product.widths.join(" and ")} widths · Comfort rating{" "}
          {product.comfort}/5
        </p>
        <label className="size-picker">
          Choose size
          <select
            onChange={(event) => setSize(Number(event.target.value))}
            value={size}
          >
            {product.sizes.map((availableSize) => (
              <option key={availableSize} value={availableSize}>
                {availableSize}
              </option>
            ))}
          </select>
        </label>
        <button
          className="button button-dark"
          onClick={() => addItem(product, size)}
          type="button"
        >
          Add to cart
        </button>
      </div>
    </section>
  );
}
