import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

function loadCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("shoeParadiseCart") || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    localStorage.removeItem("shoeParadiseCart");
    return [];
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart);

  function updateCart(update) {
    setItems((current) => {
      const next = update(current);
      localStorage.setItem("shoeParadiseCart", JSON.stringify(next));
      return next;
    });
  }

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem(product, size = product.sizes[0]) {
        updateCart((current) => {
          const existing = current.find(
            (item) => item.id === product.id && item.size === size,
          );
          return existing
            ? current.map((item) =>
                item.id === product.id && item.size === size
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              )
            : [...current, { ...product, size, quantity: 1 }];
        });
      },
      removeItem(productId, size) {
        updateCart((current) =>
          current.filter((item) => item.id !== productId || item.size !== size),
        );
      },
      clear() {
        updateCart(() => []);
      },
    }),
    [items],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider.");
  return context;
}
