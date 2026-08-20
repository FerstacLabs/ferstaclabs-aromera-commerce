"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/lib/data";
import { useCart } from "@/lib/cart";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((state) => state.add);
  return (
    <article className="card overflow-hidden">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] bg-[var(--mist)]">
          <Image src={product.mainImageUrl} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
          {product.isBestseller ? <span className="absolute left-3 top-3 rounded bg-[var(--ink)] px-2 py-1 text-xs font-bold text-white">Bestseller</span> : null}
        </div>
      </Link>
      <div className="grid gap-2 p-4">
        <div className="text-xs uppercase text-[var(--gold)]">{product.brand}</div>
        <Link href={`/shop/${product.slug}`} className="font-bold">{product.name}</Link>
        <div className="text-sm text-[var(--soft-ink)]">{product.volume} · {product.concentration}</div>
        <div className="flex items-center gap-2">
          <strong>{product.price} AZN</strong>
          {product.oldPrice ? <span className="text-sm text-[var(--soft-ink)] line-through">{product.oldPrice} AZN</span> : null}
        </div>
        <button
          className="gold-button mt-1 w-full"
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
