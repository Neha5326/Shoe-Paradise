import { useState } from "react";
import ProductCard from "../../components/products/ProductCard.jsx";
import { products } from "../../data/products.js";
import { recommendShoes } from "./fitFinder.js";

const initialPreferences = {
  size: "40",
  width: "regular",
  useCase: "everyday",
  budget: "900",
};

export default function FitFinderPage() {
  const [preferences, setPreferences] = useState(initialPreferences);
  const [matches, setMatches] = useState(null);

  function updatePreference(event) {
    setPreferences((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setMatches(recommendShoes(products, preferences));
  }

  return (
    <section className="container content-page fit-page">
      <span className="eyebrow">Shoe Paradise exclusive</span>
      <h1>Find your fit.</h1>
      <p className="lead">
        Share a few preferences and get a list ranked by size, width, activity,
        and comfort—within your budget.
      </p>
      <form className="fit-form" onSubmit={handleSubmit}>
        <label>
          Shoe size
          <select
            name="size"
            onChange={updatePreference}
            required
            value={preferences.size}
          >
            {Array.from({ length: 10 }, (_, index) => index + 36).map(
              (size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ),
            )}
          </select>
        </label>
        <label>
          Foot width
          <select
            name="width"
            onChange={updatePreference}
            value={preferences.width}
          >
            <option value="narrow">Narrow</option>
            <option value="regular">Regular</option>
            <option value="wide">Wide</option>
          </select>
        </label>
        <label>
          What will you use them for?
          <select
            name="useCase"
            onChange={updatePreference}
            value={preferences.useCase}
          >
            <option value="everyday">Everyday</option>
            <option value="walking">Walking</option>
            <option value="running">Running</option>
            <option value="work">Work</option>
            <option value="casual">Casual</option>
          </select>
        </label>
        <label>
          Maximum budget (Rs)
          <input
            min="1"
            name="budget"
            onChange={updatePreference}
            required
            type="number"
            value={preferences.budget}
          />
        </label>
        <button className="button button-dark" type="submit">
          Show my matches
        </button>
      </form>
      {matches && (
        <section className="fit-results" aria-live="polite">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Your results</span>
              <h2>
                {matches.length
                  ? `${matches.length} shoes to explore`
                  : "No exact matches yet"}
              </h2>
            </div>
          </div>
          {matches.length ? (
            <div className="product-grid">
              {matches.map((product) => (
                <ProductCard
                  initialSize={Number(preferences.size)}
                  key={product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <p className="empty-state">
              Try increasing your budget or selecting another size to see more
              of the collection.
            </p>
          )}
        </section>
      )}
    </section>
  );
}
