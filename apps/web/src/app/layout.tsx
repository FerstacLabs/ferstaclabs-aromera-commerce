import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { fetchShop } from "@/lib/shop";
import { ShopProvider } from "@/components/ShopProvider";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3005")),
  title: { default: "Əhdi Parfum | Online Ətir Mağazası", template: "%s | Əhdi Parfum" },
  description: "Əhdi Parfum onlayn mağazasında kişi, qadın və unisex ətirlərini kəşf edin, məhsullara baxın və sifarişinizi rahat şəkildə tamamlayın.",
  keywords: ["Əhdi Parfum", "Ehdi Hasan Parfumer's", "Ətir mağazası Bakı", "Parfumeriya Bakı", "Online ətir sifarişi", "Kişi ətirləri", "Qadın ətirləri", "Unisex ətirlər"],
  openGraph: { title: "Əhdi Parfum | Online Ətir Mağazası", description: "Ehdi Hasan Parfumer's · BİR KEYFİYYƏT BRENDİ", locale: "az_AZ", type: "website", images: [{ url: "/products/royal-amber.webp", width: 1024, height: 1280, alt: "Əhdi Parfum" }] },
  icons: { icon: "/brand/favicon.svg" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const shop = await fetchShop();
  const colors = { "--ink": /^#[0-9a-f]{6}$/i.test(shop.primaryColor) ? shop.primaryColor : "#171512", "--gold": /^#[0-9a-f]{6}$/i.test(shop.accentColor) ? shop.accentColor : "#B99045" } as React.CSSProperties;
  return (
    <html lang="az">
      <body className={`${inter.variable} ${cormorant.variable}`} style={colors}>
        <ShopProvider shop={shop}>{children}</ShopProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
