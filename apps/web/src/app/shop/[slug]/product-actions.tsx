"use client";

import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/cart";

export function AddToCartButton({ product }: { product: Product }) {
  const add = useCart((state) => state.add);
  return (
    <button className="gold-button" disabled={product.stockQuantity <= 0} onClick={() => { add(product); toast.success("Məhsul səbətə əlavə olundu"); }}>
      <ShoppingBag size={18} /> Səbətə əlavə et
    </button>
  );
}
