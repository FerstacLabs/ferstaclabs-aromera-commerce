"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "./data";

export type CartLine = Product & { quantity: number };

type CartState = {
  items: CartLine[];
  add: (product: Product) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product) =>
        set((state) => {
          const current = state.items.find((item) => item.id === product.id);
          if (current) {
            return { items: state.items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)) };
          }
          return { items: [...state.items, { ...product, quantity: 1 }] };
        }),
      remove: (id) => set((state) => ({ items: state.items.filter((item) => item.id !== id) })),
      setQuantity: (id, quantity) =>
        set((state) => ({ items: state.items.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)) })),
      clear: () => set({ items: [] }),
    }),
    { name: "aromera-cart" },
  ),
);
