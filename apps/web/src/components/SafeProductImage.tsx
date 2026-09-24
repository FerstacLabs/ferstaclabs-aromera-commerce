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
  const [fallbackFailed, setFallbackFailed] = useState(false);
  const currentSrc = failedSources.includes(initialSrc) ? FALLBACK_IMAGE : initialSrc;

  if (fallbackFailed) return <div role="img" aria-label={alt || "Ətir flakonu"} className={`${props.fill ? "absolute inset-0" : "h-full w-full"} grid place-items-center bg-[var(--mist)] text-[var(--gold)]`}><span className="display text-4xl">EH</span></div>;

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt || "Ətir flakonu"}
      onError={() => {
        if (currentSrc === FALLBACK_IMAGE) setFallbackFailed(true);
        else setFailedSources((sources) => sources.includes(initialSrc) ? sources : [...sources, initialSrc]);
      }}
    />
  );
}

function normalizeProductImage(src?: string | null) {
  if (!src || src.trim().length === 0) return FALLBACK_IMAGE;
  return src;
}
