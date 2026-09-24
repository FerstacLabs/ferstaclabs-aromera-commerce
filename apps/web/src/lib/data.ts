import { apiUrl, shopSlug } from "./shop";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type Product = {
  images?: { url: string; alt?: string }[];
  createdAt?: string;
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


export const categories: Category[] = [
  { id: "c1", name: "Kişi ətirləri", slug: "kisi-etirleri", description: "Dərin, təmiz və xarakterli notlar" },
  { id: "c2", name: "Qadın ətirləri", slug: "qadin-etirleri", description: "Zərif, parlaq və yadda qalan seçimlər" },
  { id: "c3", name: "Unisex ətirlər", slug: "unisex-etirler", description: "Hər stilə uyğun balanslı kompozisiyalar" },
  { id: "c4", name: "Premium seçimlər", slug: "premium-secimler", description: "İsti ağac və şərq akkordları" },
  { id: "c5", name: "Hədiyyə seçimləri", slug: "hediyye-secimleri", description: "Xüsusi günlər üçün hazır seçimlər" },
  { id: "c6", name: "Yeni gələnlər", slug: "yeni-gelenler", description: "Vitrində yeni notlar" },
  { id: "c7", name: "Endirimli məhsullar", slug: "endirimli-mehsullar", description: "Seçilmiş qiymət fürsətləri" },
];

const names = [
  "Noir Essence",
  "Midnight Musk",
  "Oud Mirage",
  "Silver Cedar",
  "Citrus Bloom",
  "Golden Saffron",
  "Ocean Mist",
  "Rose Imperial",
  "Velvet Oud",
  "Royal Amber",
  "Tuscan Fig",
  "White Neroli",
  "Amber Veil",
  "Saffron Night",
  "Musk Royale",
  "Bergamot Sky",
  "Vanilla Dusk",
  "Cedar Wood",
  "Rose Noir",
  "Aqua Vetiver",
  "Jasmine Cloud",
  "Noir Absolute",
  "Imperial Oud",
  "Fresh Amber",
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
    brand: index % 3 === 0 ? "Əhdi Selection" : index % 3 === 1 ? "Premium Collection" : "Signature Collection",
    gender: index % 3 === 0 ? "unisex" : index % 3 === 1 ? "qadın" : "kişi",
    shortDescription: "Zərif notlarla gündəlik stilə premium toxunuş.",
    description: `${name} haqqında ətraflı məlumat və mövcud seçimlər üçün mağaza ilə əlaqə saxlayın.`,
    price,
    oldPrice: index % 5 === 0 ? price + 18 : null,
    stockQuantity: 8 + index,
    volume: index % 3 === 0 ? "50ml" : index % 3 === 1 ? "75ml" : "100ml",
    concentration: index % 3 === 0 ? "EDP" : index % 3 === 1 ? "Parfum" : "EDT",
    mainImageUrl: `/products/${slugify(name)}.webp`,
    isFeatured: index < 8,
    isBestseller: index % 4 === 0,
    isActive: true,
  };
});

export async function fetchProducts(): Promise<Product[]> {
  const url = `${apiUrl}/api/${shopSlug}/products`;
  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) return products;
    return response.json();
  } catch {
    return products;
  }
}

export async function fetchProduct(slug: string): Promise<Product | undefined> {
  const url = `${apiUrl}/api/${shopSlug}/products/${slug}`;
  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (response.ok) return response.json();
    if (response.status === 404) return undefined;
  } catch {
  }
  return products.find((product) => product.slug === slug);
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const response = await fetch(`${apiUrl}/api/${shopSlug}/categories`, { next: { revalidate: 60 } });
    if (response.ok) return response.json();
  } catch { }
  return categories;
}
