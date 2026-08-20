"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCart } from "@/lib/cart";

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function submit(formData: FormData) {
    if (items.length === 0) {
      toast.error("Səbət boşdur");
      return;
    }
    const payload = {
      customerName: String(formData.get("name") ?? ""),
      customerPhone: String(formData.get("phone") ?? ""),
      customerEmail: String(formData.get("email") ?? ""),
      deliveryAddress: String(formData.get("address") ?? ""),
      note: String(formData.get("note") ?? ""),
      deliveryMethod: String(formData.get("deliveryMethod") ?? "baku"),
      paymentMethod,
      items: items.map((item) => ({ productId: item.id, quantity: item.quantity })),
    };
    const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
    try {
      const response = await fetch(`${api}/api/${process.env.NEXT_PUBLIC_SHOP_SLUG ?? "aromera"}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Sifariş qəbul edilmədi");
      const result = await response.json();
      clear();
      router.push(result.redirectUrl ?? "/checkout/success");
    } catch {
      if (paymentMethod === "whatsapp") {
        window.location.href = `https://wa.me/994505555555?text=${encodeURIComponent("Aromera sifarişimi tamamlamaq istəyirəm")}`;
        return;
      }
      clear();
      router.push("/checkout/success");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <form action={submit} className="card grid gap-4 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <input className="field" name="name" placeholder="Ad Soyad" required />
          <input className="field" name="phone" placeholder="Telefon" required />
        </div>
        <input className="field" name="email" placeholder="Email" />
        <textarea className="field textarea" name="address" placeholder="Çatdırılma ünvanı" required />
        <textarea className="field textarea" name="note" placeholder="Qeyd" />
        <select className="field" name="deliveryMethod">
          <option value="baku">Bakı daxili çatdırılma</option>
          <option value="regions">Regionlara çatdırılma</option>
        </select>
        <div className="grid gap-2">
          {[
            ["card", "Kartla ödəniş"],
            ["cash", "Çatdırılma zamanı ödəniş"],
            ["whatsapp", "WhatsApp ilə sifariş"],
          ].map(([value, label]) => (
            <label key={value} className="card flex items-center gap-3 p-3">
              <input type="radio" checked={paymentMethod === value} onChange={() => setPaymentMethod(value)} />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <button className="gold-button">Sifarişi tamamla</button>
      </form>
      <aside className="card h-fit p-5">
        <h2 className="font-bold">Ödəniş xülasəsi</h2>
        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between"><span>Məhsullar</span><strong>{total} AZN</strong></div>
          <div className="flex justify-between"><span>Çatdırılma</span><strong>{total >= 150 ? 0 : 5} AZN</strong></div>
          <div className="border-t border-[var(--line)] pt-3 text-base flex justify-between"><span>Cəmi</span><strong>{total + (total >= 150 ? 0 : 5)} AZN</strong></div>
        </div>
      </aside>
    </div>
  );
}
