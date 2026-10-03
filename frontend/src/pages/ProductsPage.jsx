import { useMemo, useState } from "react";
import ProductCard from "../components/products/ProductCard.jsx";
import { products } from "../data/products.js";

export default function ProductsPage({ brand = "" }) {
  const [query, setQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState(brand);
  const filtered = useMemo(
    () =>
      products.filter((product) => {
        const matchesBrand = !selectedBrand || product.brand === selectedBrand;
        const searchText =
          `${product.name} ${product.brand} ${product.category}`.toLowerCase();
        return matchesBrand && searchText.includes(query.trim().toLowerCase());
      }),
    [query, selectedBrand],
  );

  return (
    <section className="container content-page">
      <span className="eyebrow">The collection</span>
      <h1>
        {selectedBrand ? `${selectedBrand} shoes` : "Shoes for every day"}
      </h1>
      <p className="lead">
        Browse the collection by brand or search for a style, activity, or
        category.
      </p>
      <div className="catalog-tools">
        <label className="search-field">
          Search shoes
          <input
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “running” or “Bata”"
            value={query}
          />
        </label>
        <label className="search-field">
          Brand
          <select
            onChange={(event) => setSelectedBrand(event.target.value)}
            value={selectedBrand}
          >
            <option value="">All brands</option>
            <option>Adidas</option>
            <option>Nike</option>
            <option>Service</option>
            <option>Bata</option>
          </select>
        </label>
      </div>
      {filtered.length ? (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="empty-state">
          No shoes match those filters. Try another search or choose all brands.
        </p>
      )}
    </section>
  );
}
