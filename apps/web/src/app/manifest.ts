import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return { name: "Ehdi Hasan Parfumer's", short_name: "Əhdi Parfum", start_url: "/", display: "standalone", background_color: "#F7F3EA", theme_color: "#171512", lang: "az", icons: [{ src: "/brand/favicon.svg", sizes: "any", type: "image/svg+xml" }] };
}
