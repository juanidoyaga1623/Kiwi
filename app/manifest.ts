import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Kiwi — Fractional Stock Trading",
    short_name: "Kiwi",
    description: "Invertí en acciones fraccionadas desde $1 USD",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#22c55e",
    orientation: "portrait",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
