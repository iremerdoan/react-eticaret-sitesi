import React, { createContext, useContext, useState, useCallback } from 'react';
 
const ShopContext = createContext(null);
 
export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);       // { product, color, size, qty }
  const [favorites, setFavorites] = useState([]); // product[]
 
  // ─── CART ───────────────────────────────────────
  const addToCart = useCallback((product, color = null, size = null, qty = 1) => {
    setCart(prev => {
      const key = `${product.id}-${color}-${size}`;
      const existing = prev.find(i => `${i.product.id}-${i.color}-${i.size}` === key);
      if (existing) {
        return prev.map(i =>
          `${i.product.id}-${i.color}-${i.size}` === key
            ? { ...i, qty: i.qty + qty }
            : i
        );
      }
      return [...prev, { product, color, size, qty }];
    });
  }, []);
 
  const removeFromCart = useCallback((productId, color, size) => {
    setCart(prev => prev.filter(i => !(i.product.id === productId && i.color === color && i.size === size)));
  }, []);
 
  const updateQty = useCallback((productId, color, size, qty) => {
    if (qty < 1) return;
    setCart(prev => prev.map(i =>
      i.product.id === productId && i.color === color && i.size === size
        ? { ...i, qty }
        : i
    ));
  }, []);
 
  const clearCart = useCallback(() => setCart([]), []);
 
  const cartCount    = cart.reduce((s, i) => s + i.qty, 0);
  const cartSubtotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0);
 
  // ─── FAVORITES ──────────────────────────────────
  const toggleFavorite = useCallback((product) => {
    setFavorites(prev =>
      prev.find(p => p.id === product.id)
        ? prev.filter(p => p.id !== product.id)
        : [...prev, product]
    );
  }, []);
 
  const isFavorite = useCallback((productId) => {
    return favorites.some(p => p.id === productId);
  }, [favorites]);
 
  const removeFromFavorites = useCallback((productId) => {
    setFavorites(prev => prev.filter(p => p.id !== productId));
  }, []);
 
  return (
    <ShopContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      cartCount, cartSubtotal,
      favorites, toggleFavorite, isFavorite, removeFromFavorites,
    }}>
      {children}
    </ShopContext.Provider>
  );
};
 
export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within ShopProvider');
  return ctx;
};
 