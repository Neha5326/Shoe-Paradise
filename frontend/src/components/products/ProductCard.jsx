import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../features/cart/CartContext.jsx";

export default function ProductCard({ product, initialSize = 40 }) {
  const { addItem } = useCart();
  const [size, setSize] = useState(initialSize);

  return (
    <article className="product-card">
      <div className={`shoe-art shoe-art-${product.brand.toLowerCase()}`}>
        <img
          className="product-image"
          src={product.image}
          alt={`${product.brand} ${product.name}`}
        />
        <span className="product-image-brand">
          {product.brand} · {product.category}
        </span>
      </div>
      <div className="product-card-body">
        <div className="product-heading">
          <div>
            <span className="eyebrow">{product.brand}</span>
            <h3>{product.name}</h3>
          </div>
          <strong>Rs {product.price}</strong>
        </div>
        <p>{product.description}</p>
        <div className="product-actions">
          <label className="product-size">
            Size
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
          <Link
            className="button button-outline button-small"
            to={`/products/${product.id}`}
          >
            Details
          </Link>
          <button
            className="button button-dark button-small"
            onClick={() => addItem(product, size)}
            type="button"
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
