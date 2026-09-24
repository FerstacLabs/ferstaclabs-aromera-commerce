"use client";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useShop } from "./ShopProvider";
import { whatsappLink } from "@/lib/shop";
export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const shop = useShop();
  return <div className="lg:hidden">
    <button type="button" className="grid h-11 w-11 place-items-center rounded border border-[var(--line)]" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Menyunu bağla" : "Menyunu aç"} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
    {open && <nav id="mobile-navigation" onKeyDown={(e) => { if (e.key === "Escape") setOpen(false); }} className="absolute inset-x-0 top-full grid gap-1 border-b border-[var(--line)] bg-[var(--paper)] p-4 shadow-lg">
      {[["/shop", "Mağaza"], ["/about", "Haqqımızda"], ["/contact", "Əlaqə"], ["/return-policy", "Çatdırılma və qaytarılma"]].map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)} className="rounded p-3 hover:bg-[var(--mist)]">{label}</Link>)}
      <a className="p-3" href={whatsappLink(shop)}>WhatsApp</a>
    </nav>}
  </div>;
}
