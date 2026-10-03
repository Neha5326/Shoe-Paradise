import { useState } from "react";
import { apiRequest } from "../services/api.js";

export default function AdminPage() {
  const [token, setToken] = useState(
    () => localStorage.getItem("adminToken") || "",
  );
  const [code, setCode] = useState("");
  const [orders, setOrders] = useState(null);
  const [message, setMessage] = useState("");

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const result = await apiRequest("/admin-login", {
        method: "POST",
        body: JSON.stringify({ code }),
      });
      localStorage.setItem("adminToken", result.adminToken);
      setToken(result.adminToken);
      setMessage("Admin access granted.");
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function loadOrders() {
    try {
      const result = await apiRequest("/orders-lao", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(result);
      setMessage("");
    } catch (error) {
      setMessage(error.message);
      setToken("");
      localStorage.removeItem("adminToken");
    }
  }

  return (
    <section className="container content-page">
      <span className="eyebrow">Store tools</span>
      <h1>Admin panel</h1>
      {!token ? (
        <form className="stacked-form admin-form" onSubmit={handleLogin}>
          <label>
            Admin code
            <input
              onChange={(event) => setCode(event.target.value)}
              required
              type="password"
              value={code}
            />
          </label>
          <button className="button button-dark" type="submit">
            Log in as admin
          </button>
        </form>
      ) : (
        <button
          className="button button-dark"
          onClick={loadOrders}
          type="button"
        >
          Load orders
        </button>
      )}
      {message && (
        <p className="form-message" role="status">
          {message}
        </p>
      )}
      {orders && (
        <div className="admin-orders">
          <h2>Orders ({orders.length})</h2>
          {orders.map((order) => (
            <article className="cart-item" key={order._id}>
              <div>
                <strong>{order.name || "Shoe order"}</strong>
                <p>
                  Size {order.size} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span>Rs {order.price}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
