export const shopSlug = process.env.NEXT_PUBLIC_SHOP_SLUG === "aromera"
  ? "ehdi-parfum" : process.env.NEXT_PUBLIC_SHOP_SLUG || "ehdi-parfum";
export const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";
export const defaultShop = {
  name: "Əhdi Parfum", wordmark: "Ehdi Hasan Parfumer's", slogan: "BİR KEYFİYYƏT BRENDİ",
  heroText: "Ətirinizi seçin. İziniz yadda qalsın.", phone: "+994556994666", whatsApp: "+994556994666",
  address: "Bakı şəhəri, Qara Qarayev küçəsi 74A", logoUrl: "/brand/ehdi-hasan-logo.svg",
  legalName: "", voen: "", primaryColor: "#171512", accentColor: "#B99045",
  delivery: "Bakı üzrə çatdırılma imkanı", bakuFee: 5, regionsFee: 8, freeDeliveryFrom: 150,
};
export type ShopConfig = typeof defaultShop;
export const whatsappLink = (shop: ShopConfig) => `https://wa.me/${shop.whatsApp.replace(/\D/g, "")}`;
export const phoneLink = (shop: ShopConfig) => `tel:${shop.phone.replace(/[^+\d]/g, "")}`;
export const displayPhone = (phone: string) => phone.replace(/^(\+994)(\d{2})(\d{3})(\d{2})(\d{2})$/, "$1 $2 $3 $4 $5");
export async function fetchShop(): Promise<ShopConfig> {
  try {
    const response = await fetch(`${apiUrl}/api/shops/by-slug/${shopSlug}`, { next: { revalidate: 60 }, signal: AbortSignal.timeout(5000) });
    if (response.ok) return { ...defaultShop, ...await response.json() };
  } catch { /* Keep verified contact details available during API outages. */ }
  return defaultShop;
}
