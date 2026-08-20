import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export default function FailedPage() {
  return (
    <SiteShell>
      <section className="container py-16 text-center">
        <h1 className="display text-5xl font-bold">Ödəniş tamamlanmadı</h1>
        <p className="mx-auto mt-3 max-w-xl text-[var(--soft-ink)]">Kart ödənişində problem yarandı. Sifarişi yenidən yoxlaya və ya WhatsApp ilə tamamlaya bilərsiniz.</p>
        <Link className="gold-button mt-6" href="/checkout">Yenidən cəhd et</Link>
      </section>
    </SiteShell>
  );
}
