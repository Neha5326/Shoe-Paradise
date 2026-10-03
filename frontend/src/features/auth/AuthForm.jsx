import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const { signUp, logIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    if (values.password.length < 8) {
      setMessage("Password should contain at least 8 characters.");
      setIsError(true);
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      if (isSignup) {
        await signUp(values);
      }
      await logIn(values);
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      setMessage(error.message);
      setIsError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <img
          className="auth-logo"
          src="/logo-original.jpg"
          alt="Shoe Paradise"
        />
        <span className="eyebrow">Shoe Paradise account</span>
        <h1>{isSignup ? "Create your account" : "Welcome back"}</h1>
        <p>
          {isSignup
            ? "Create an account to explore the collection and find your fit."
            : "Log in to continue to the Shoe Paradise store."}
        </p>
        <form className="stacked-form" onSubmit={handleSubmit}>
          <label>
            Email address
            <input autoComplete="email" name="email" required type="email" />
          </label>
          <label>
            Password
            <input
              autoComplete={isSignup ? "new-password" : "current-password"}
              minLength="8"
              name="password"
              required
              type="password"
            />
          </label>
          <button
            className="button button-dark button-full"
            disabled={busy}
            type="submit"
          >
            {busy ? "Please wait..." : isSignup ? "Create account" : "Log in"}
          </button>
        </form>
        {message && (
          <p
            className={
              isError ? "form-message form-error" : "form-message form-success"
            }
            role="status"
          >
            {message}
          </p>
        )}
        <p className="auth-switch">
          {isSignup ? "Already have an account?" : "New to Shoe Paradise?"}{" "}
          <Link to={isSignup ? "/login" : "/signup"}>
            {isSignup ? "Log in" : "Create an account"}
          </Link>
        </p>
      </div>
    </section>
  );
}
