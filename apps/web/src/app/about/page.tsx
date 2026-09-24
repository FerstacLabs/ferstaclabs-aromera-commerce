import { SiteShell } from "@/components/SiteShell";
import { fetchShop } from "@/lib/shop";
import { BrandLogo } from "@/components/BrandLogo";
export const metadata = { title: "Haqqımızda" };
export default async function AboutPage() {
  const shop = await fetchShop();
  return <SiteShell><section className="container py-12">
    <p className="text-sm text-[var(--gold)]">{shop.slogan}</p><h1 className="display mt-3 text-5xl font-semibold">{shop.name}</h1>
    <p className="display mt-4 text-2xl">{shop.wordmark}</p>
    <p className="mt-6 max-w-3xl leading-8 text-[var(--soft-ink)]">{shop.name} müştərilərə müxtəlif ətir seçimlərini rahat şəkildə təqdim edən parfumeriya mağazasıdır. Onlayn platforma məhsulları izləməyi, seçim etməyi və sifariş prosesini daha rahat həyata keçirməyi təmin edir.</p>
    <div className="mt-10 border-y border-[var(--line)] bg-[var(--ink)] p-6"><BrandLogo src={shop.logoUrl} name={shop.name} /></div>
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{[["Seçim", "Kişi, qadın və unisex ətirlərlə tanış olun."], ["Rahatlıq", "Məhsulları onlayn nəzərdən keçirin və sifariş edin."], ["Xidmət", "Suallarınız üçün mağaza ilə birbaşa əlaqə saxlayın."], ["Müştəri təcrübəsi", "Seçimdən sifarişə qədər aydın və rahat proses."]].map(([title, text]) => <div key={title} className="border-t border-[var(--line)] py-5"><h2 className="display text-2xl">{title}</h2><p className="mt-2 text-sm leading-6 text-[var(--soft-ink)]">{text}</p></div>)}</div>
  </section></SiteShell>;
}
