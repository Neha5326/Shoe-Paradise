import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRequest } from "../../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("someToken");
    if (!token) {
      localStorage.removeItem("shoeParadiseUser");
      setIsLoading(false);
      return;
    }

    apiRequest("/check-token", {
      method: "POST",
      body: JSON.stringify({ token }),
    })
      .then((account) => {
        setUser(account);
        localStorage.setItem("shoeParadiseUser", JSON.stringify(account));
      })
      .catch(() => {
        localStorage.removeItem("someToken");
        localStorage.removeItem("shoeParadiseUser");
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      async signUp(credentials) {
        return apiRequest("/create-user", {
          method: "POST",
          body: JSON.stringify(credentials),
        });
      },
      async logIn(credentials) {
        const result = await apiRequest("/login", {
          method: "POST",
          body: JSON.stringify(credentials),
        });
        localStorage.setItem("someToken", result.myToken);
        localStorage.setItem(
          "shoeParadiseUser",
          JSON.stringify(result.userMilgya),
        );
        setUser(result.userMilgya);
      },
      logOut() {
        localStorage.removeItem("someToken");
        localStorage.removeItem("shoeParadiseUser");
        setUser(null);
      },
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider.");
  return context;
}
