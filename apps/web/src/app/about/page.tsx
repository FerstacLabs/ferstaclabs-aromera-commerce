import { SiteShell } from "@/components/SiteShell";
import { shop } from "@/lib/data";

export default function AboutPage() {
  return (
    <SiteShell>
      <section className="container py-12">
        <h1 className="display text-5xl font-bold">Aromera haqqında</h1>
        <p className="mt-4 max-w-3xl leading-8 text-[var(--soft-ink)]">{shop.tagline}. Biz ətiri şəxsi stilin ən incə imzası kimi görürük və hər kolleksiyanı gündəlik istifadə, xüsusi günlər və hədiyyə təqdimatı üçün seçirik.</p>
      </section>
    </SiteShell>
  );
}
