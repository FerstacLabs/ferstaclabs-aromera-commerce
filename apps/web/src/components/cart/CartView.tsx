"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart";
import { SafeProductImage } from "../SafeProductImage";
import { useShop } from "../ShopProvider";

export function CartView() {
  const shop = useShop();
  const { items, remove, setQuantity } = useCart();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const fee = total >= shop.freeDeliveryFrom ? 0 : shop.bakuFee;

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center">
        <h1 className="display text-4xl font-bold">Səbət boşdur</h1>
        <p className="mt-3 text-[var(--soft-ink)]">Seçilmiş ətirləri səbətə əlavə edib sifarişi tamamlaya bilərsiniz.</p>
        <Link className="gold-button mt-6" href="/shop">Mağazaya keç</Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="card grid grid-cols-[96px_1fr] gap-4 p-3">
            <div className="relative aspect-square overflow-hidden rounded-md bg-[var(--mist)]">
              <SafeProductImage src={item.mainImageUrl} alt={item.name} fill className="object-cover" sizes="96px" />
            </div>
            <div className="grid gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-bold">{item.name}</h2>
                  <p className="text-sm text-[var(--soft-ink)]">{item.brand} · {item.volume}</p>
                </div>
                <button aria-label="Sil" onClick={() => remove(item.id)}><Trash2 size={18} /></button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-md border border-[var(--line)]">
                  <button className="p-2" aria-label="Azalt" onClick={() => setQuantity(item.id, item.quantity - 1)}><Minus size={16} /></button>
                  <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                  <button className="p-2" aria-label="Artır" onClick={() => setQuantity(item.id, item.quantity + 1)}><Plus size={16} /></button>
                </div>
                <strong>{item.price * item.quantity} AZN</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
      <aside className="card h-fit p-5">
        <h2 className="font-bold">Sifariş xülasəsi</h2>
        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between"><span>Məhsullar</span><strong>{total} AZN</strong></div>
          <div className="flex justify-between"><span>Çatdırılma</span><strong>{fee} AZN</strong></div>
          <div className="border-t border-[var(--line)] pt-3 text-base flex justify-between"><span>Cəmi</span><strong>{total + fee} AZN</strong></div>
        </div>
        <Link className="gold-button mt-5 w-full" href="/checkout">Sifarişi tamamla</Link>
      </aside>
    </div>
  );
}
