"use client";
import { createContext, useContext } from "react";
import { defaultShop, type ShopConfig } from "@/lib/shop";
const ShopContext = createContext<ShopConfig>(defaultShop);
export const useShop = () => useContext(ShopContext);
export function ShopProvider({ shop, children }: { shop: ShopConfig; children: React.ReactNode }) {
  return <ShopContext.Provider value={shop}>{children}</ShopContext.Provider>;
}
