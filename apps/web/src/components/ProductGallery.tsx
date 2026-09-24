"use client";
import { useState } from "react";
import type { Product } from "@/lib/data";
import { SafeProductImage } from "./SafeProductImage";
export function ProductGallery({ product }: { product: Product }) {
  const images = [{ url: product.mainImageUrl, alt: product.name }, ...(product.images ?? [])];
  const [selected, setSelected] = useState(0);
  return <div><div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[var(--mist)]"><SafeProductImage src={images[selected]?.url} alt={images[selected]?.alt || product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 45vw" /></div>
    {images.length > 1 && <div className="mt-3 flex flex-wrap gap-3">{images.map((img, index) => <button key={index} type="button" aria-label={`Şəkil ${index + 1}`} aria-pressed={selected === index} onClick={() => setSelected(index)} className={`relative h-20 w-16 overflow-hidden rounded border-2 ${selected === index ? "border-[var(--gold)]" : "border-transparent"}`}><SafeProductImage src={img.url} alt={img.alt || product.name} fill sizes="64px" className="object-cover" /></button>)}</div>}
  </div>;
}
