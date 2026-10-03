import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductCard from "../components/products/ProductCard.jsx";
import { products } from "../data/products.js";

const heroSlides = [
  {
    image: "/hero-original.avif",
    alt: "Original Shoe Paradise featured shoe",
    label: "The original Shoe Paradise favorite",
  },
  {
    image: "/images/shoes/white-sneaker.jpg",
    alt: "White everyday sneakers",
    label: "Everyday comfort, easy to wear",
  },
  {
    image: "/images/shoes/sport-runner.jpg",
    alt: "Lightweight sport running shoes",
    label: "Made for your next move",
  },
];

export default function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % heroSlides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">A better fit for every day</span>
            <h1>Find your next favorite pair.</h1>
            <p>
              Explore everyday styles, compare your options, and use our Shoe
              Fit Finder to discover a pair matched to your size, width, and
              routine.
            </p>
            <div className="hero-actions">
              <Link className="button button-dark" to="/products">
                Explore shoes
              </Link>
              <Link className="button button-outline" to="/fit-finder">
                Find my fit
              </Link>
            </div>
            <div className="hero-note">
              <span>✓</span> Simple fit suggestions. No guesswork.
            </div>
          </div>
          <div className="hero-visual" aria-label="Featured shoes">
            {heroSlides.map((slide, index) => (
              <img
                aria-hidden={index !== activeSlide}
                className={`hero-image${index === activeSlide ? " active" : ""}`}
                key={slide.image}
                src={slide.image}
                alt={slide.alt}
              />
            ))}
            <button
              aria-label="Previous featured shoe"
              className="slider-arrow slider-previous"
              onClick={() =>
                setActiveSlide(
                  (current) =>
                    (current + heroSlides.length - 1) % heroSlides.length,
                )
              }
              type="button"
            >
              ‹
            </button>
            <button
              aria-label="Next featured shoe"
              className="slider-arrow slider-next"
              onClick={() =>
                setActiveSlide((current) => (current + 1) % heroSlides.length)
              }
              type="button"
            >
              ›
            </button>
            <div className="slider-dots" aria-label="Choose featured shoe">
              {heroSlides.map((slide, index) => (
                <button
                  aria-label={`Show slide ${index + 1}: ${slide.label}`}
                  aria-pressed={index === activeSlide}
                  className={`slider-dot${index === activeSlide ? " active" : ""}`}
                  key={slide.image}
                  onClick={() => setActiveSlide(index)}
                  type="button"
                />
              ))}
            </div>
            <span className="slider-caption">
              {heroSlides[activeSlide].label}
            </span>
          </div>
        </div>
      </section>
      <section className="container section-block">
        <div className="section-heading">
          <div>
            <span className="eyebrow">The collection</span>
            <h2>Everyday favorites</h2>
          </div>
          <Link className="text-link" to="/products">
            View all shoes →
          </Link>
        </div>
        <div className="product-grid">
          {products.slice(0, 3).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="fit-banner">
        <div className="container fit-banner-row">
          <div>
            <span className="eyebrow">A project feature</span>
            <h2>Not sure what to choose?</h2>
            <p>
              Tell us your size, budget, foot width, and what you need the shoes
              for. Get a ranked list of matches from our collection.
            </p>
          </div>
          <Link className="button button-dark" to="/fit-finder">
            Try Shoe Fit Finder
          </Link>
        </div>
      </section>
    </>
  );
}
