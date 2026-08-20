export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type Product = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  brand: string;
  gender: "kişi" | "qadın" | "unisex";
  shortDescription: string;
  description: string;
  price: number;
  oldPrice?: number | null;
  stockQuantity: number;
  volume: string;
  concentration: string;
  mainImageUrl: string;
  isFeatured: boolean;
  isBestseller: boolean;
  isActive: boolean;
  category?: Category;
};

export const shop = {
  name: "Aromera",
  tagline: "Premium ətriyyat və şəxsi stil üçün seçilmiş ətirlər",
  phone: "+994 50 555 55 55",
  whatsapp: "+994 50 555 55 55",
  whatsappLink: "https://wa.me/994505555555",
  instagram: "@aromera.az",
  address: "Bakı, Azərbaycan",
  delivery: "Bakı daxili çatdırılma mövcuddur",
  currency: "AZN",
};

export const categories: Category[] = [
  { id: "c1", name: "Kişi ətirləri", slug: "kisi-etirleri", description: "Dərin, təmiz və xarakterli notlar" },
  { id: "c2", name: "Qadın ətirləri", slug: "qadin-etirleri", description: "Zərif, parlaq və yadda qalan seçimlər" },
  { id: "c3", name: "Unisex ətirlər", slug: "unisex-etirler", description: "Hər stilə uyğun balanslı kompozisiyalar" },
  { id: "c4", name: "Oud kolleksiyası", slug: "oud-kolleksiyasi", description: "İsti ağac və şərq akkordları" },
  { id: "c5", name: "Hədiyyəlik setlər", slug: "hediyyelik-setler", description: "Xüsusi günlər üçün hazır seçimlər" },
  { id: "c6", name: "Yeni gələnlər", slug: "yeni-gelenler", description: "Aromera vitrinində yeni notlar" },
  { id: "c7", name: "Endirimli məhsullar", slug: "endirimli-mehsullar", description: "Seçilmiş qiymət fürsətləri" },
];

const imageIds = [
  "1541643600914-78b084683601",
  "1594035910387-fea47794261f",
  "1587017539504-67cfbddac569",
  "1615634260167-c8cdede054de",
  "1608528577891-eb055944f2e2",
  "1595425959632-34f2822322ce",
  "1563170351-be82bc888aa4",
  "1592914610354-fd354ea45e48",
];

const names = [
  "Aromera Noir Essence",
  "Velvet Oud",
  "Royal Amber",
  "Citrus Bloom",
  "Midnight Musk",
  "Golden Saffron",
  "Ocean Mist",
  "Rose Imperial",
  "Silver Cedar",
  "Amber Dusk",
  "White Neroli",
  "Satin Peony",
  "Tuscan Fig",
  "Sandal Veil",
  "Aqua Basil",
  "Cashmere Iris",
  "Oud Mirage",
  "Jasmine Aura",
  "Leather Noir",
  "Bergamot Silk",
  "Vanilla Ember",
  "Musk Atelier",
  "Pearl Garden",
  "Crimson Spice",
];

const slugify = (value: string) => value.toLowerCase().replaceAll(" ", "-").replaceAll("ə", "e");

export const products: Product[] = names.map((name, index) => {
  const category = categories[index % categories.length];
  const price = 64 + index * 5;
  return {
    id: `p${index + 1}`,
    categoryId: category.id,
    category,
    name,
    slug: slugify(name),
    brand: index % 3 === 0 ? "Aromera Private" : index % 3 === 1 ? "Maison Aura" : "Noir Atelier",
    gender: index % 3 === 0 ? "unisex" : index % 3 === 1 ? "qadın" : "kişi",
    shortDescription: "Zərif notlarla gündəlik stilə premium toxunuş.",
    description: `${name} isti, təmiz və yadda qalan akkordları birləşdirən seçilmiş ətirdir. Bakı ritminə uyğun uzunömürlü, səliqəli və hədiyyə üçün ideal kompozisiya kimi hazırlanıb.`,
    price,
    oldPrice: index % 5 === 0 ? price + 18 : null,
    stockQuantity: 8 + index,
    volume: index % 3 === 0 ? "50ml" : index % 3 === 1 ? "75ml" : "100ml",
    concentration: index % 3 === 0 ? "EDP" : index % 3 === 1 ? "Parfum" : "EDT",
    mainImageUrl: `https://images.unsplash.com/photo-${imageIds[index % imageIds.length]}?auto=format&fit=crop&w=900&q=85`,
    isFeatured: index < 8,
    isBestseller: index % 4 === 0,
    isActive: true,
  };
});

export async function fetchProducts(): Promise<Product[]> {
  const url = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/${process.env.NEXT_PUBLIC_SHOP_SLUG ?? "aromera"}/products`;
  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) return products;
    return response.json();
  } catch {
    return products;
  }
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
  const url = `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000"}/api/${process.env.NEXT_PUBLIC_SHOP_SLUG ?? "aromera"}/products/${slug}`;
  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (response.ok) return response.json();
  } catch {
  }
  return products.find((product) => product.slug === slug);
}
