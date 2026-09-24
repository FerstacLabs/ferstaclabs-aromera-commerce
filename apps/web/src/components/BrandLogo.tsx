import Image from "next/image";
export function BrandLogo({ compact = false, src, name = "Əhdi Parfum" }: { compact?: boolean; src?: string; name?: string }) {
  return <Image unoptimized priority src={src || `/brand/ehdi-hasan-logo${compact ? "-compact" : ""}.svg`}
    alt={name} width={compact ? 190 : 280} height={compact ? 48 : 120}
    className={compact ? "h-10 w-[158px] object-contain" : "h-[104px] w-[244px] object-contain"} />;
}
