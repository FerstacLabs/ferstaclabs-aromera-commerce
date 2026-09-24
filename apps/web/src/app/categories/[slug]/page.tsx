import { ProductCard } from "@/components/ProductCard";
import { SiteShell } from "@/components/SiteShell";
import { fetchCategories, fetchProducts } from "@/lib/data";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await fetchCategories();
  const category = categories.find((item) => item.slug === slug);
  const products = (await fetchProducts()).filter((product) => product.category?.slug === slug);

  return (
    <SiteShell>
      <section className="container py-10">
        <h1 className="display text-5xl font-bold">{category?.name ?? "Kateqoriya"}</h1>
        <p className="mt-2 text-[var(--soft-ink)]">{category?.description}</p>
        <div className="product-grid mt-8">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </SiteShell>
  );
}
