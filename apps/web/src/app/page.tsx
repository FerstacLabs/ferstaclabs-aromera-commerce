import Link from "next/link";
import { CreditCard, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { SiteShell } from "@/components/SiteShell";
import { categories, fetchProducts, shop } from "@/lib/data";

export default async function HomePage() {
  const products = await fetchProducts();
  const featured = products.filter((product) => product.isFeatured).slice(0, 8);
  const bestsellers = products.filter((product) => product.isBestseller).slice(0, 4);

  return (
    <SiteShell>
      <section className="border-b border-[var(--line)] bg-[#efe8da]">
        <div className="container grid min-h-[78vh] items-center gap-10 py-12 md:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[var(--gold)]">Bakıdan premium ətir seçimi</p>
            <h1 className="display mt-4 max-w-3xl text-6xl font-bold leading-[0.94] md:text-7xl">Aromera</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-[var(--soft-ink)]">{shop.tagline}. Qoxunu sadəcə almırsınız, öz imzanıza çevirirsiniz.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="gold-button" href="/shop">Kolleksiyaya bax</Link>
              <a className="ghost-button" href={shop.whatsappLink}><MessageCircle size={18} /> WhatsApp ilə sifariş</a>
            </div>
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-[url('https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1100&q=85')] bg-cover bg-center shadow-2xl" />
        </div>
      </section>

      <section className="container py-12">
        <div className="grid gap-3 md:grid-cols-3">
          {[["Çatdırılma", shop.delivery, Truck], ["Təhlükəsiz ödəniş", "Kartla və yerində ödəniş seçimləri", ShieldCheck], ["Dəstək", shop.whatsapp, CreditCard]].map(([title, text, Icon]) => (
            <div key={String(title)} className="card flex items-center gap-4 p-5">
              <Icon className="text-[var(--gold)]" size={26} />
              <div><strong>{String(title)}</strong><p className="text-sm text-[var(--soft-ink)]">{String(text)}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="container py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="display text-4xl font-bold">Kateqoriyalar</h2>
            <p className="text-[var(--soft-ink)]">Stilinizə uyğun not ailəsini seçin.</p>
          </div>
          <Link className="ghost-button" href="/shop">Hamısı</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {categories.slice(0, 7).map((category) => (
            <Link key={category.slug} href={`/categories/${category.slug}`} className="card p-5 transition hover:-translate-y-0.5 hover:border-[var(--gold)]">
              <h3 className="font-bold">{category.name}</h3>
              <p className="mt-2 text-sm text-[var(--soft-ink)]">{category.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-6">
          <h2 className="display text-4xl font-bold">Bestsellerlər</h2>
          <p className="text-[var(--soft-ink)]">Aromera müştərilərinin ən çox seçdiyi ətirlər.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="container py-10">
        <div className="mb-6">
          <h2 className="display text-4xl font-bold">Yeni gələnlər</h2>
          <p className="text-[var(--soft-ink)]">Vitrinə təzə əlavə olunmuş seçilmiş kompozisiyalar.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>

      <section className="bg-[#ece4d6] py-14">
        <div className="container grid gap-8 md:grid-cols-[1fr_1fr]">
          <div>
            <h2 className="display text-4xl font-bold">Niyə Aromera?</h2>
            <p className="mt-3 leading-7 text-[var(--soft-ink)]">Hər məhsul qoxu xarakteri, qalıcı təsiri və hədiyyə təqdimatı düşünülərək seçilir. Məqsəd sadədir: gündəlik stiliniz üçün etibarlı, zövqlü və rahat alış təcrübəsi.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Premium seçim", "Səliqəli paketləmə", "WhatsApp məsləhəti", "Bakı daxili çatdırılma"].map((item) => <div className="card p-4 font-bold" key={item}>{item}</div>)}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
