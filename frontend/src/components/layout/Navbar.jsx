import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/AuthContext.jsx";
import { useCart } from "../../features/cart/CartContext.jsx";

export default function Navbar() {
  const { user, logOut } = useAuth();
  const { itemCount } = useCart();

  return (
    <header className="site-header">
      <div className="container nav-row">
        <Link className="brand" to="/" aria-label="Shoe Paradise home">
          <img src="/logo-original.jpg" alt="" />
          <span>Shoe Paradise</span>
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/products">Shop</NavLink>
          <NavLink to="/fit-finder">Fit Finder</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="nav-actions">
          <Link className="cart-link" to="/cart">
            Cart <span>{itemCount}</span>
          </Link>
          {user ? (
            <>
              <Link className="nav-account" to="/dashboard">
                My account
              </Link>
              <button
                className="button button-small button-quiet"
                onClick={logOut}
                type="button"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link className="nav-account" to="/login">
                Log in
              </Link>
              <Link className="button button-small button-dark" to="/signup">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
