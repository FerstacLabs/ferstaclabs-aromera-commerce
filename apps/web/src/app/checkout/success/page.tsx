import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default async function SuccessPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const orderNumber = params.orderNumber;
  const isPaid = params.paymentStatus === "paid";

  return (
    <SiteShell>
      <section className="container py-16 text-center">
        <h1 className="display text-5xl font-bold">Sifariş qəbul olundu</h1>
        {orderNumber ? <p className="mt-3 text-sm font-bold text-[var(--gold)]">Sifariş nömrəsi: {orderNumber}</p> : null}
        <p className="mx-auto mt-3 max-w-xl text-[var(--soft-ink)]">Sifarişiniz qəbul edildi.</p>
        {isPaid ? <p className="mx-auto mt-2 max-w-xl font-semibold text-[var(--ink)]">Ödəniş uğurla tamamlandı.</p> : null}
        <p className="mx-auto mt-2 max-w-xl text-[var(--soft-ink)]">Aromera komandası sifarişinizi təsdiqləmək üçün sizinlə əlaqə saxlayacaq.</p>
        <Link className="gold-button mt-6" href="/shop">Alışa davam et</Link>
      </section>
    </SiteShell>
  );
}
