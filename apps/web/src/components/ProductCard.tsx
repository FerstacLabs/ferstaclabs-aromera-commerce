"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/cart";
import { SafeProductImage } from "./SafeProductImage";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((state) => state.add);
  return (
    <article className="card product-card overflow-hidden">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-[var(--mist)]">
          <SafeProductImage src={product.mainImageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.isBestseller && <span className="rounded bg-[var(--ink)] px-2 py-1 text-xs font-semibold text-[#D8C18A]">Çox seçilən</span>}
            {product.oldPrice && product.oldPrice > product.price ? <span className="rounded bg-[#EEE5D1] px-2 py-1 text-xs font-semibold">Endirim</span> : null}
            {product.category?.slug === "yeni-gelenler" && <span className="rounded bg-white px-2 py-1 text-xs">Yeni</span>}
          </div>
        </div>
      </Link>
      <div className="grid gap-2 p-4">
        <div className="text-xs uppercase text-[var(--gold)]">{product.brand}</div>
        <Link href={`/shop/${product.slug}`} className="display text-2xl font-semibold leading-tight">{product.name}</Link>
        <div className="text-xs text-[var(--soft-ink)]">{product.volume} · {product.concentration}</div>
        <div className="flex flex-wrap items-center gap-2">
          <strong>{product.price} AZN</strong>
          {product.oldPrice ? <span className="text-sm text-[var(--soft-ink)] line-through">{product.oldPrice} AZN</span> : null}
        </div>
        <p className="text-xs text-[var(--soft-ink)]">{product.stockQuantity > 0 ? "Mövcuddur" : "Stokda yoxdur"}</p>
        <button
          className="gold-button mt-1 w-full" disabled={product.stockQuantity <= 0}
          onClick={() => {
            add(product);
            toast.success("Məhsul səbətə əlavə olundu");
          }}
        >
          <ShoppingBag size={17} /> Səbətə əlavə et
        </button>
      </div>
    </article>
  );
}
