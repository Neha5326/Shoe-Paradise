import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import Layout from "../components/layout/Layout.jsx";
import AboutPage from "../pages/AboutPage.jsx";
import AdminPage from "../pages/AdminPage.jsx";
import CartPage from "../pages/CartPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import FitFinderPage from "../features/fit-finder/FitFinderPage.jsx";
import HomePage from "../pages/HomePage.jsx";
import LoginPage from "../features/auth/LoginPage.jsx";
import NotFoundPage from "../pages/NotFoundPage.jsx";
import ProductDetailPage from "../pages/ProductDetailPage.jsx";
import ProductsPage from "../pages/ProductsPage.jsx";
import SignupPage from "../features/auth/SignupPage.jsx";
import { useAuth } from "../features/auth/AuthContext.jsx";

function RequireAuth() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="auth-loading" role="status">
        Checking your account…
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:productId" element={<ProductDetailPage />} />
        <Route path="/fit-finder" element={<FitFinderPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/adminpanel" element={<AdminPage />} />
        <Route path="/adidas" element={<ProductsPage brand="Adidas" />} />
        <Route path="/nike" element={<ProductsPage brand="Nike" />} />
        <Route path="/service" element={<ProductsPage brand="Service" />} />
        <Route path="/bata" element={<ProductsPage brand="Bata" />} />
        <Route
          path="/BrandProducts"
          element={<Navigate to="/products" replace />}
        />
        <Route
          path="/pendingorders"
          element={<Navigate to="/adminpanel" replace />}
        />
        <Route path="/users" element={<Navigate to="/adminpanel" replace />} />
        <Route
          path="/productdetail/:productId"
          element={<ProductDetailPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
