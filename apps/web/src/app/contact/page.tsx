import { MessageCircle } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { shop } from "@/lib/data";

export default function ContactPage() {
  return (
    <SiteShell>
      <section className="container grid gap-6 py-12 md:grid-cols-2">
        <div>
          <h1 className="display text-5xl font-bold">Əlaqə</h1>
          <p className="mt-4 text-[var(--soft-ink)]">Məhsul seçimi və sifariş üçün Aromera ilə əlaqə saxlayın.</p>
        </div>
        <div className="card grid gap-3 p-5">
          <strong>{shop.phone}</strong>
          <span>{shop.address}</span>
          <span>{shop.instagram}</span>
          <a className="gold-button mt-2" href={shop.whatsappLink}><MessageCircle size={18} /> WhatsApp</a>
        </div>
      </section>
    </SiteShell>
  );
}
