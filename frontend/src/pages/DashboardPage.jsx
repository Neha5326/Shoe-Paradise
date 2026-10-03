import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext.jsx";

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <section className="container content-page">
      <span className="eyebrow">Your account</span>
      <h1>Welcome to Shoe Paradise.</h1>
      <p className="lead">You are signed in as {user?.email}.</p>
      <div className="dashboard-links">
        <Link className="button button-dark" to="/products">
          Continue shopping
        </Link>
        <Link className="button button-outline" to="/cart">
          View your cart
        </Link>
        <Link className="button button-outline" to="/fit-finder">
          Find a better fit
        </Link>
      </div>
    </section>
  );
}
