import { MapPin, MessageCircle, Phone, ArrowUpRight } from "lucide-react";
import { SiteShell } from "@/components/SiteShell";
import { fetchShop, whatsappLink, phoneLink, displayPhone } from "@/lib/shop";
export const metadata = { title: "Əlaqə" };
export default async function ContactPage() {
  const shop = await fetchShop();
  return <SiteShell><section className="container py-12"><p className="text-sm text-[var(--gold)]">{shop.wordmark}</p><h1 className="display mt-3 text-5xl font-semibold">Əlaqə</h1>
    <div className="mt-10 grid gap-10 border-t border-[var(--line)] pt-8 md:grid-cols-2"><div><h2 className="display text-3xl">{shop.name}</h2><p className="mt-4 max-w-md leading-7 text-[var(--soft-ink)]">Məhsul seçimi, sifariş və çatdırılma barədə mağazamızla əlaqə saxlayın.</p><a className="gold-button mt-6" href={whatsappLink(shop)}><MessageCircle size={18} /> WhatsApp ilə əlaqə</a></div>
    <address className="grid content-start gap-6 not-italic"><a className="flex items-center gap-3 text-xl" href={phoneLink(shop)}><Phone size={22} className="text-[var(--gold)]" />{displayPhone(shop.phone)}</a><p className="flex items-start gap-3 leading-7"><MapPin className="shrink-0 text-[var(--gold)]" size={22} />{shop.address}</p><a className="inline-flex items-center gap-2 underline underline-offset-4" target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shop.address)}`}>Google Maps-də aç <ArrowUpRight size={18} /></a></address></div>
  </section></SiteShell>;
}
