import Image from "next/image";
import Link from "next/link";
import { CreditCard, MessageCircle, MapPin, Truck, Sparkles, ArrowUpRight } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SiteShell } from "@/components/SiteShell";
import { fetchCategories, fetchProducts } from "@/lib/data";
import { fetchShop, whatsappLink } from "@/lib/shop";

export default async function HomePage() {
  const [products, categories, shop] = await Promise.all([fetchProducts(), fetchCategories(), fetchShop()]);
  const featured = products.filter((product) => product.isFeatured).slice(0, 8);
  const bestsellers = products.filter((product) => product.isBestseller).slice(0, 4);
  const trust = [
    { title: "Çatdırılma", text: shop.delivery, Icon: Truck },
    { title: "Rahat ödəniş", text: "Kartla və çatdırılma zamanı ödəniş seçimləri", Icon: CreditCard },
    { title: "WhatsApp dəstəyi", text: "Birbaşa mağaza ilə əlaqə", Icon: MessageCircle },
    { title: "Mağaza", text: shop.address, Icon: MapPin },
  ];
  return <SiteShell>
    <section className="hero">
      <Image src="/products/royal-amber.webp" alt="İşıqlı studiya fonunda kəhrəba rəngli ətir flakonu" fill priority sizes="100vw" className="hero-photo" />
      <div className="container hero-content">
        <p className="text-xs font-semibold text-[#D8C18A]">AZƏRBAYCANDA ƏTRİYYAT SEÇİMİ</p>
        <h1 className="display mt-5 font-semibold">{shop.name}</h1>
        <p className="display mt-3 text-2xl text-[#D8C18A]">{shop.wordmark}</p>
        <h2 className="display hero-copy mt-7 text-3xl leading-tight">{shop.heroText}</h2>
        <p className="hero-copy mt-4 text-sm leading-7 text-white/80">Kişi, qadın və unisex ətirlərdən seçiminizi edin. Məhsulları onlayn kəşf edin, sifariş verin və rahat şəkildə əldə edin.</p>
        <div className="mt-7 flex flex-wrap gap-3"><Link href="/shop" className="gold-button !border-[#D8C18A]">Ətirlərə bax <ArrowUpRight size={18} /></Link><a href={whatsappLink(shop)} className="ghost-button"><MessageCircle size={18} /> WhatsApp ilə əlaqə</a></div>
        <p className="mt-8 text-xs text-[#D8C18A]">{shop.slogan}</p>
      </div>
    </section>
    <section className="border-b border-[var(--line)] bg-white">
      <div className="container grid gap-6 py-7 sm:grid-cols-2 lg:grid-cols-4">
        {trust.map(({ title, text, Icon }) => <div key={title} className="flex gap-3"><Icon className="shrink-0 text-[var(--gold)]" size={23} /><div><h2 className="text-sm font-semibold">{title}</h2><p className="mt-1 text-xs leading-5 text-[var(--soft-ink)]">{text}</p></div></div>)}
      </div>
    </section>
    <section className="container py-12">
      <p className="text-xs font-semibold uppercase text-[var(--gold)]">Ətir dünyası</p><h2 className="display mt-2 text-4xl font-semibold">Seçiminizi kəşf edin</h2>
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => <Link key={category.slug} href={`/categories/${category.slug}`} className="flex items-center justify-between gap-3 border-b border-[var(--line)] py-4 hover:text-[var(--gold)]"><span className="flex items-center gap-3"><Sparkles size={18} className="text-[var(--gold)]" />{category.name}</span><ArrowUpRight size={17} /></Link>)}
      </div>
    </section>
    <section className="container py-8"><div className="mb-6 flex items-end justify-between gap-4"><h2 className="display text-4xl font-semibold">Çox seçilən</h2><Link href="/shop" className="text-sm underline underline-offset-4">Hamısına bax</Link></div><div className="product-grid">{bestsellers.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <section className="container py-10"><p className="text-xs font-semibold uppercase text-[var(--gold)]">Kataloqdan</p><h2 className="display mb-6 mt-2 text-4xl font-semibold">Seçilmiş ətirlər</h2><div className="product-grid">{featured.map((product) => <ProductCard key={product.id} product={product} />)}</div></section>
    <section className="mt-8 border-y border-[var(--line)] bg-[var(--ink)] py-14 text-white"><div className="container"><p className="text-xs text-[#D8C18A]">{shop.slogan}</p><h2 className="display mt-4 text-4xl">Seçimdə sizə kömək edək.</h2><p className="mt-4 max-w-lg leading-7 text-white/75">Ətir seçimi, məhsul məlumatları və sifarişlə bağlı mağazamızla əlaqə saxlayın.</p><a href={whatsappLink(shop)} className="ghost-button mt-6"><MessageCircle size={18} /> WhatsApp ilə əlaqə</a></div></section>
  </SiteShell>;
}
