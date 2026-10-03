import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <section className="container content-page">
      <span className="eyebrow">Our story</span>
      <h1>Good shoes make every day feel like a step forward.</h1>
      <p className="lead">
        Shoe Paradise makes finding your next favorite pair simple, welcoming,
        and personal. Browse everyday styles and get a useful starting point
        with our student-built Shoe Fit Finder.
      </p>
      <div className="value-grid">
        <article className="value-card">
          <span>01</span>
          <h2>Comfort comes first</h2>
          <p>
            Find shoes for long walks, busy workdays, and all the plans in
            between.
          </p>
        </article>
        <article className="value-card">
          <span>02</span>
          <h2>Easy to explore</h2>
          <p>
            Browse one organized catalog, compare the details, and add your
            picks to one cart.
          </p>
        </article>
        <article className="value-card">
          <span>03</span>
          <h2>A more helpful fit</h2>
          <p>
            Use your size, preferred width, activity, and budget to find
            relevant suggestions.
          </p>
        </article>
      </div>
      <Link className="button button-dark" to="/products">
        Explore the collection
      </Link>
    </section>
  );
}
