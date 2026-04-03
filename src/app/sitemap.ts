import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://eduardobraide.com.br";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { url: "", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/trajetoria", priority: 0.9, changeFrequency: "monthly" as const },
    { url: "/agenda", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/plano-de-governo", priority: 0.9, changeFrequency: "weekly" as const },
    { url: "/downloads", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/pontos-de-apoio", priority: 0.7, changeFrequency: "weekly" as const },
  ];

  return routes.map((route) => ({
    url: `${BASE_URL}${route.url}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
