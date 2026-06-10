// src/context/CartContext.tsx
'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addToCart = (item: any) => {
    setCart((prev) => {
      if (prev.find(i => i.id === item.id)) return prev;
      return [...prev, item];
    });
    setIsOpen(true); // Auto-open on add for feedback
  };

  return (
    <CartContext.Provider value={{ cart, isOpen, setIsOpen, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);