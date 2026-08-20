"use client";

import { useCart } from "@/lib/cart";

export function CartBadge() {
  const count = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  return <span>Səbət {count > 0 ? `(${count})` : ""}</span>;
}
