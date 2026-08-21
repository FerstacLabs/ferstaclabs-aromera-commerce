"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CardPaymentModal } from "@/components/checkout/CardPaymentModal";
import { useCart } from "@/lib/cart";

type CheckoutResponse = {
  orderId: string;
  orderNumber: string;
  paymentRequired: boolean;
  paymentProvider: string;
  paymentStatus: string;
  redirectUrl?: string | null;
};

type PaymentCreateResponse = {
  orderId: string;
  orderNumber: string;
  provider: string;
  amount: number;
  currency: string;
  requiresInternalCardModal: boolean;
  redirectUrl?: string | null;
  paymentUrl?: string | null;
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, clear } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [submitting, setSubmitting] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [cardPayment, setCardPayment] = useState<PaymentCreateResponse | null>(null);
  const [paymentError, setPaymentError] = useState("");
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const payableTotal = total + (total >= 150 ? 0 : 5);

  async function submit(formData: FormData) {
    if (items.length === 0) {
      toast.error("Səbət boşdur");
      return;
    }
    setSubmitting(true);
    setPaymentError("");
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
      const result = (await response.json()) as CheckoutResponse;

      if (paymentMethod === "whatsapp") {
        const summary = items.map((item) => `${item.name} x${item.quantity}`).join(", ");
        window.open(`https://wa.me/994505555555?text=${encodeURIComponent(`Aromera sifarişi ${result.orderNumber}: ${summary}. Cəmi: ${payableTotal} AZN`)}`, "_blank");
        clear();
        router.push(`/checkout/success?orderNumber=${encodeURIComponent(result.orderNumber)}&paymentStatus=${result.paymentStatus}`);
        return;
      }

      if (!result.paymentRequired) {
        clear();
        router.push(result.redirectUrl ?? `/checkout/success?orderNumber=${encodeURIComponent(result.orderNumber)}&paymentStatus=${result.paymentStatus}`);
        return;
      }

      const paymentResponse = await fetch(`${api}/api/${process.env.NEXT_PUBLIC_SHOP_SLUG ?? "aromera"}/payments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: result.orderId }),
      });
      if (!paymentResponse.ok) throw new Error("Ödəniş başladıla bilmədi");
      const payment = (await paymentResponse.json()) as PaymentCreateResponse;

      if (payment.requiresInternalCardModal) {
        setCardPayment(payment);
        return;
      }

      const hostedUrl = payment.paymentUrl ?? payment.redirectUrl;
      if (hostedUrl) {
        window.location.href = hostedUrl;
        return;
      }
      throw new Error("Ödəniş linki tapılmadı");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sifariş tamamlanmadı");
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmCardPayment(result: "success" | "failed") {
    if (!cardPayment) return;
    setConfirmingPayment(true);
    setPaymentError("");
    const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
    try {
      const response = await fetch(`${api}/api/${process.env.NEXT_PUBLIC_SHOP_SLUG ?? "aromera"}/payments/mock/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: cardPayment.orderId, result }),
      });
      if (!response.ok) throw new Error("Ödəniş nəticəsi təsdiqlənmədi");
      const confirmation = await response.json();
      if (result === "failed") {
        setPaymentError("Ödəniş bank tərəfindən rədd edildi. Zəhmət olmasa başqa kartla yoxlayın.");
        return;
      }
      clear();
      router.push(`/checkout/success?orderNumber=${encodeURIComponent(confirmation.orderNumber ?? cardPayment.orderNumber)}&paymentStatus=paid`);
    } catch (error) {
      setPaymentError(error instanceof Error ? error.message : "Ödəniş tamamlanmadı.");
    } finally {
      setConfirmingPayment(false);
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
        <button className="gold-button" disabled={submitting}>{submitting ? "Sifariş hazırlanır..." : "Sifarişi tamamla"}</button>
      </form>
      <aside className="card h-fit p-5">
        <h2 className="font-bold">Ödəniş xülasəsi</h2>
        <div className="mt-4 grid gap-2 text-sm">
          <div className="flex justify-between"><span>Məhsullar</span><strong>{total} AZN</strong></div>
          <div className="flex justify-between"><span>Çatdırılma</span><strong>{total >= 150 ? 0 : 5} AZN</strong></div>
          <div className="border-t border-[var(--line)] pt-3 text-base flex justify-between"><span>Cəmi</span><strong>{payableTotal} AZN</strong></div>
        </div>
      </aside>
      <CardPaymentModal
        open={Boolean(cardPayment)}
        amount={cardPayment?.amount ?? payableTotal}
        currency={cardPayment?.currency ?? "AZN"}
        orderNumber={cardPayment?.orderNumber ?? ""}
        processing={confirmingPayment}
        error={paymentError}
        onCancel={() => {
          if (!confirmingPayment) setCardPayment(null);
        }}
        onConfirm={confirmCardPayment}
      />
    </div>
  );
}
