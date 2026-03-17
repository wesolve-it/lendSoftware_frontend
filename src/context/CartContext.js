import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);

const readCartFromStorage = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('cart');
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to parse cart from storage", error);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  // Initialize state lazily
  const [cart, setCartState] = useState(readCartFromStorage);

  // Sync cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Sync state from other tabs
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === 'cart') {
        setCartState(readCartFromStorage());
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addItem = useCallback((item) => {
    setCartState((prev) => [...prev, item]);
  }, []);

  const removeItem = useCallback((id) => {
    setCartState((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const clearCart = useCallback(() => {
    setCartState([]);
  }, []);

  const value = useMemo(() => ({
    cart,
    addItem,
    removeItem,
    clearCart
  }), [cart, addItem, removeItem, clearCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
