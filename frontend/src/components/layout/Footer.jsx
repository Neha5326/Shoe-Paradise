import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-row">
        <Link className="brand footer-brand" to="/">
          <img src="/logo-original.jpg" alt="" />
          <span>Shoe Paradise</span>
        </Link>
        <p>Everyday comfort. Better steps. Find a pair that fits your life.</p>
        <div className="footer-links">
          <Link to="/products">Shop</Link>
          <Link to="/fit-finder">Shoe Fit Finder</Link>
          <Link to="/about">About</Link>
          <Link to="/adminpanel">Admin</Link>
        </div>
        <small>© {new Date().getFullYear()} Shoe Paradise</small>
      </div>
    </footer>
  );
}
