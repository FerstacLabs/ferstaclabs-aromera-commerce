"use client";

import Image, { type ImageProps } from "next/image";
import { useMemo, useState } from "react";

const FALLBACK_IMAGE = "/products/fallback-perfume.webp";

type SafeProductImageProps = Omit<ImageProps, "src"> & {
  src?: string | null;
};

export function SafeProductImage({ src, alt, ...props }: SafeProductImageProps) {
  const initialSrc = useMemo(() => normalizeProductImage(src), [src]);
  const [failedSources, setFailedSources] = useState<string[]>([]);
  const currentSrc = failedSources.includes(initialSrc) ? FALLBACK_IMAGE : initialSrc;

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt || "Aromera perfume"}
      onError={() => setFailedSources((sources) => (sources.includes(initialSrc) ? sources : [...sources, initialSrc]))}
    />
  );
}

function normalizeProductImage(src?: string | null) {
  if (!src || src.trim().length === 0) return FALLBACK_IMAGE;
  return src;
}
