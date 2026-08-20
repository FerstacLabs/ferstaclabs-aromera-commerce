import { SiteShell } from "@/components/SiteShell";
import { CheckoutForm } from "./checkout-form";

export default function CheckoutPage() {
  return (
    <SiteShell>
      <section className="container py-10">
        <h1 className="display mb-6 text-5xl font-bold">Checkout</h1>
        <CheckoutForm />
      </section>
    </SiteShell>
  );
}
