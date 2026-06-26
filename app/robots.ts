import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/analytics/", "/transactions/"],
      },
    ],
    sitemap: "https://foretrackai.in/sitemap.xml",
  };
}
