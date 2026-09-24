import Link from "next/link";
import { MessageCircle, ShoppingBag } from "lucide-react";
import { fetchShop, whatsappLink, phoneLink, displayPhone } from "@/lib/shop";
import { CartBadge } from "./cart/CartBadge";
import { BrandLogo } from "./BrandLogo";
import { MobileNavigation } from "./MobileNavigation";

export async function Header() {
  const shop = await fetchShop();
  return <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(247,243,234,0.94)] backdrop-blur-md">
    <div className="container flex min-h-20 items-center justify-between gap-3">
      <Link href="/" aria-label={shop.name}><span className="lg:hidden"><BrandLogo compact src={shop.logoUrl !== "/brand/ehdi-hasan-logo.svg" ? shop.logoUrl : undefined} name={shop.name} /></span><span className="hidden lg:block"><BrandLogo src={shop.logoUrl} name={shop.name} /></span></Link>
      <nav className="hidden items-center gap-5 text-sm font-semibold lg:flex">
        <Link href="/shop">Mağaza</Link><Link href="/about">Haqqımızda</Link><Link href="/contact">Əlaqə</Link><Link href="/return-policy">Çatdırılma və qaytarılma</Link>
      </nav>
      <div className="flex items-center gap-2">
        <span className="hidden xl:block"><a className="ghost-button" href={whatsappLink(shop)}><MessageCircle size={18} /> WhatsApp</a></span>
        <Link className="gold-button !px-3" href="/cart" aria-label="Səbət"><ShoppingBag size={18} /><CartBadge /></Link>
        <MobileNavigation />
      </div>
    </div>
  </header>;
}
export async function Footer() {
  const shop = await fetchShop();
  return <footer className="mt-16 border-t border-[var(--line)] bg-[var(--ink)] text-white">
    <div className="container grid gap-8 py-12 md:grid-cols-[1.2fr_1fr_1fr]">
      <div><BrandLogo src={shop.logoUrl} name={shop.name} /><p className="mt-3 text-sm text-[#D8C18A]">{shop.slogan}</p></div>
      <nav className="grid content-start gap-3 text-sm text-white/80">
        <Link href="/shop">Mağaza</Link><Link href="/about">Haqqımızda</Link><Link href="/return-policy">Çatdırılma və qaytarılma</Link><Link href="/contact">Əlaqə</Link><Link href="/terms">Şərtlər</Link><Link href="/admin/login">Admin</Link>
      </nav>
      <address className="grid content-start gap-4 text-sm not-italic text-white/80"><a href={phoneLink(shop)}>{displayPhone(shop.phone)}</a><span>{shop.address}</span><a href={whatsappLink(shop)} className="inline-flex items-center gap-2"><MessageCircle size={18} /> WhatsApp</a></address>
    </div>
    <div className="container border-t border-white/15 py-5 text-xs text-white/60">{shop.name} · {shop.wordmark}</div>
  </footer>;
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  return <><Header /><main id="main-content">{children}</main><Footer /></>;
}
