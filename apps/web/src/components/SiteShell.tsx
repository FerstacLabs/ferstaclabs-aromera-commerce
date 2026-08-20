import Link from "next/link";
import { AtSign, MessageCircle, ShoppingBag } from "lucide-react";
import { shop } from "@/lib/data";
import { CartBadge } from "./cart/CartBadge";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[rgba(251,250,247,0.92)] backdrop-blur">
      <div className="container flex min-h-16 items-center justify-between gap-4">
        <Link href="/" className="display text-3xl font-bold">Aromera</Link>
        <nav className="hidden items-center gap-6 text-sm font-semibold text-[var(--soft-ink)] md:flex">
          <Link href="/shop">Mağaza</Link>
          <Link href="/about">Haqqımızda</Link>
          <Link href="/contact">Əlaqə</Link>
          <Link href="/return-policy">Qaytarılma</Link>
        </nav>
        <div className="flex items-center gap-2">
          <a className="ghost-button hidden sm:inline-flex" href={shop.whatsappLink}><MessageCircle size={18} /> WhatsApp</a>
          <Link className="gold-button" href="/cart"><ShoppingBag size={18} /><CartBadge /></Link>
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-[var(--line)] bg-[#181512] text-white">
      <div className="container grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="display text-3xl font-bold">Aromera</div>
          <p className="mt-3 max-w-md text-sm leading-6 text-white/70">{shop.tagline}. {shop.delivery}. Təhlükəsiz ödəniş və səliqəli hədiyyə paketi.</p>
        </div>
        <div className="grid gap-2 text-sm text-white/76">
          <Link href="/terms">Şərtlər</Link>
          <Link href="/return-policy">Qaytarılma siyasəti</Link>
          <Link href="/admin/login">Admin</Link>
        </div>
        <div className="grid gap-2 text-sm text-white/76">
          <span>{shop.phone}</span>
          <span>{shop.address}</span>
          <span className="inline-flex items-center gap-2"><AtSign size={16} /> {shop.instagram}</span>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
