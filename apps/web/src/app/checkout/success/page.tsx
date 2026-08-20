import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function SuccessPage() {
  return (
    <SiteShell>
      <section className="container py-16 text-center">
        <h1 className="display text-5xl font-bold">Sifariş qəbul olundu</h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--soft-ink)]">Aromera komandası sifarişinizi təsdiqləmək üçün sizinlə əlaqə saxlayacaq.</p>
        <Link className="gold-button mt-6" href="/shop">Alışa davam et</Link>
      </section>
    </SiteShell>
  );
}
