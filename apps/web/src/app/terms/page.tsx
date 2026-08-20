import { SiteShell } from "@/components/SiteShell";

export default function TermsPage() {
  return (
    <SiteShell>
      <section className="container py-12">
        <h1 className="display text-5xl font-bold">Şərtlər və qaydalar</h1>
        <div className="mt-5 grid gap-4 leading-8 text-[var(--soft-ink)]">
          <p>Sifariş tamamlandıqdan sonra müştəri ilə əlaqə saxlanılır və çatdırılma detalları təsdiqlənir.</p>
          <p>Qiymətlər AZN ilə göstərilir. Kart ödənişləri təhlükəsiz provayder səhifəsi üzərindən aparılır.</p>
        </div>
      </section>
    </SiteShell>
  );
}
