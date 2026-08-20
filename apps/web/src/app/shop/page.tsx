import { ProductCard } from "@/components/ProductCard";
import { SiteShell } from "@/components/SiteShell";
import { categories, fetchProducts } from "@/lib/data";

export default async function ShopPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const params = await searchParams;
  const products = await fetchProducts();
  const q = (params.q ?? "").toLowerCase();
  const category = params.category;
  const gender = params.gender;
  const filtered = products.filter((product) =>
    (!q || product.name.toLowerCase().includes(q) || product.brand.toLowerCase().includes(q)) &&
    (!category || product.category?.slug === category) &&
    (!gender || product.gender === gender)
  );

  return (
    <SiteShell>
      <section className="container py-10">
        <h1 className="display text-5xl font-bold">Mağaza</h1>
        <form className="mt-6 grid gap-3 rounded-lg border border-[var(--line)] bg-white p-4 md:grid-cols-[1.4fr_1fr_1fr_auto]">
          <input className="field" name="q" defaultValue={params.q} placeholder="Ətir və ya brand axtar" />
          <select className="field" name="category" defaultValue={category ?? ""}>
            <option value="">Bütün kateqoriyalar</option>
            {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
          </select>
          <select className="field" name="gender" defaultValue={gender ?? ""}>
            <option value="">Bütün genderlər</option>
            <option value="kişi">Kişi</option>
            <option value="qadın">Qadın</option>
            <option value="unisex">Unisex</option>
          </select>
          <button className="gold-button">Filtrlə</button>
        </form>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </SiteShell>
  );
}
