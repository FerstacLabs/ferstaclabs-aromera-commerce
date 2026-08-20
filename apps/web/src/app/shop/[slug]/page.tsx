import { notFound } from "next/navigation";
import { MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { SafeProductImage } from "@/components/SafeProductImage";
import { SiteShell } from "@/components/SiteShell";
import { fetchProduct, products, shop } from "@/lib/data";
import { AddToCartButton } from "./product-actions";

export async function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await fetchProduct(slug);
  if (!product) notFound();

  return (
    <SiteShell>
      <section className="container grid gap-8 py-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[var(--mist)]">
          <SafeProductImage src={product.mainImageUrl} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 45vw" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase text-[var(--gold)]">{product.brand}</p>
          <h1 className="display mt-2 text-5xl font-bold">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <strong className="text-2xl">{product.price} AZN</strong>
            {product.oldPrice ? <span className="text-[var(--soft-ink)] line-through">{product.oldPrice} AZN</span> : null}
          </div>
          <p className="mt-5 leading-8 text-[var(--soft-ink)]">{product.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-3 text-sm">
            {[
              ["Gender", product.gender],
              ["Həcm", product.volume],
              ["Konsentrasiya", product.concentration],
              ["Stok", product.stockQuantity > 0 ? "Mövcuddur" : "Bitib"],
            ].map(([label, value]) => (
              <div className="card p-3" key={label}><dt className="text-[var(--soft-ink)]">{label}</dt><dd className="font-bold">{value}</dd></div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <AddToCartButton product={product} />
            <a className="ghost-button" href={`${shop.whatsappLink}?text=${encodeURIComponent(`${product.name} sifariş etmək istəyirəm`)}`}><MessageCircle size={18} /> WhatsApp sifariş</a>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="card flex gap-3 p-4"><Truck className="text-[var(--gold)]" /><span>{shop.delivery}</span></div>
            <div className="card flex gap-3 p-4"><ShieldCheck className="text-[var(--gold)]" /><span>Təhlükəsiz kart ödənişi</span></div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
