import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="container content-page">
      <span className="eyebrow">Page not found</span>
      <h1>We could not find that page.</h1>
      <p className="lead">
        Try the shop, or go back to the Shoe Paradise home page.
      </p>
      <Link className="button button-dark" to="/">
        Go home
      </Link>
    </section>
  );
}
