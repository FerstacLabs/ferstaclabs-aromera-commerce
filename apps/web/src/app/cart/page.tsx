import { CartView } from "@/components/cart/CartView";
import { SiteShell } from "@/components/SiteShell";

export default function CartPage() {
  return (
    <SiteShell>
      <section className="container py-10">
        <h1 className="display mb-6 text-5xl font-bold">Səbət</h1>
        <CartView />
      </section>
    </SiteShell>
  );
}
