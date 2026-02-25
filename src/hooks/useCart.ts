import { useState, useEffect, useCallback } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  currency: string;
  quantity: number;
  image_url: string | null;
  carbon_offset_kg: number | null;
}

const CART_KEY = "moenviron-cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [itemCount, setItemCount] = useState(0);

  const loadCart = useCallback(() => {
    const saved = localStorage.getItem(CART_KEY);
    const cart = saved ? JSON.parse(saved) : [];
    setItems(cart);
    setItemCount(cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0));
  }, []);

  useEffect(() => {
    loadCart();
    
    // Listen for storage changes (for cross-tab sync)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === CART_KEY) {
        loadCart();
      }
    };
    
    // Custom event for same-tab updates
    const handleCartUpdate = () => loadCart();
    
    window.addEventListener("storage", handleStorage);
    window.addEventListener("cart-updated", handleCartUpdate);
    
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [loadCart]);

  const updateCart = (newCart: CartItem[]) => {
    localStorage.setItem(CART_KEY, JSON.stringify(newCart));
    setItems(newCart);
    setItemCount(newCart.reduce((sum, item) => sum + item.quantity, 0));
    window.dispatchEvent(new CustomEvent("cart-updated"));
  };

  return { items, itemCount, updateCart, loadCart };
}
