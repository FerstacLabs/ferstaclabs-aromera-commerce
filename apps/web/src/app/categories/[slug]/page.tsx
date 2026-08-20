import { ProductCard } from "@/components/ProductCard";
import { SiteShell } from "@/components/SiteShell";
import { categories, fetchProducts } from "@/lib/data";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categories.find((item) => item.slug === slug);
  const products = (await fetchProducts()).filter((product) => product.category?.slug === slug);

  return (
    <SiteShell>
      <section className="container py-10">
        <h1 className="display text-5xl font-bold">{category?.name ?? "Kateqoriya"}</h1>
        <p className="mt-2 text-[var(--soft-ink)]">{category?.description}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </SiteShell>
  );
}
