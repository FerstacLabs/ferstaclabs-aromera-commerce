import { SiteShell } from "@/components/SiteShell";
import { fetchShop, whatsappLink } from "@/lib/shop";

export default async function ReturnPolicyPage() {
  const shop = await fetchShop();
  return (
    <SiteShell>
      <section className="container py-12">
        <h1 className="display text-5xl font-bold">Çatdırılma və qaytarılma</h1>
        <h2 className="display mt-8 text-3xl">Çatdırılma</h2>
        <p className="mt-4 max-w-3xl leading-8 text-[var(--soft-ink)]">{shop.delivery}. Bakı üzrə {shop.bakuFee} AZN, regionlar üzrə {shop.regionsFee} AZN. {shop.freeDeliveryFrom} AZN-dən başlayan sifarişlərdə çatdırılma pulsuzdur. Çatdırılma vaxtı mağaza ilə dəqiqləşdirilir.</p>
        <h2 className="display mt-8 text-3xl">Qaytarılma müraciəti</h2>
        <p className="mt-4 max-w-3xl leading-8 text-[var(--soft-ink)]">Qaytarılma və dəyişmə şərtlərini dəqiqləşdirmək üçün sifariş nömrənizlə mağazaya müraciət edin.</p>
        <a className="gold-button mt-6" href={whatsappLink(shop)}>Mağaza ilə əlaqə</a>
      </section>
    </SiteShell>
  );
}
