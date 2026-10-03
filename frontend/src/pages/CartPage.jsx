import { useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api.js";
import { useAuth } from "../features/auth/AuthContext.jsx";
import { useCart } from "../features/cart/CartContext.jsx";

export default function CartPage() {
  const { items, total, removeItem, clear } = useCart();
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  async function placeOrder() {
    if (!user) {
      setMessage("Log in before placing your order.");
      return;
    }
    try {
      await apiRequest("/cart", {
        method: "POST",
        body: JSON.stringify(
          items.map((item) => ({
            name: item.name,
            price: String(item.price),
            size: String(item.size),
            imageSrc: "",
          })),
        ),
      });
      clear();
      setMessage("Your order has been placed.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <section className="container content-page">
      <span className="eyebrow">Your picks</span>
      <h1>Shopping cart</h1>
      {!items.length ? (
        <div className="empty-state">
          <p>
            {message ||
              "Your cart is empty. Find a pair you love and add it here."}
          </p>
          <Link className="button button-dark" to="/products">
            Explore shoes
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <article className="cart-item" key={`${item.id}-${item.size}`}>
                <div>
                  <span className="eyebrow">{item.brand}</span>
                  <h2>{item.name}</h2>
                  <p>
                    Size {item.size} · Qty {item.quantity}
                  </p>
                </div>
                <strong>Rs {item.price * item.quantity}</strong>
                <button
                  className="text-link"
                  onClick={() => removeItem(item.id, item.size)}
                  type="button"
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
          <div className="cart-total">
            <strong>Total: Rs {total}</strong>
            <button
              className="button button-dark"
              onClick={placeOrder}
              type="button"
            >
              Place order
            </button>
          </div>
          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}
        </>
      )}
    </section>
  );
}
