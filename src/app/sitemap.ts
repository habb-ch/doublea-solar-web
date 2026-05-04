import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();
  const routes = [
    "",
    "/services",
    "/solarrechner",
    "/finanzierung",
    "/projekte",
    "/ueber-uns",
    "/kontakt",
    "/angebote",
    "/impressum",
    "/datenschutz",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/solarrechner" ? 0.9 : 0.7,
  }));
}
