import type { Metadata, MetadataRoute, Viewport } from "next";
import { BASE_PATH } from "../base-path";
import { KIND_LABELS } from "../labels";
import type { SiteConfig } from "../types";

export function buildMetadata(c: SiteConfig): Metadata {
  const url = c.seo.siteUrl.replace(/\/$/, "");
  const ogImage = { url: `${url}/og.png`, width: 1200, height: 630, alt: c.seo.ogTitle };
  return {
    metadataBase: new URL(url),
    title: c.seo.title,
    description: c.seo.description,
    keywords: c.seo.keywords,
    applicationName: `${c.brand.name} — ${c.company.name}`,
    authors: [{ name: c.company.legalName }],
    creator: c.company.legalName,
    publisher: c.company.legalName,
    alternates: { canonical: `${url}/` },
    formatDetection: { telephone: true, email: true, address: true },
    openGraph: {
      type: "website",
      locale: "uk_UA",
      url,
      siteName: `${c.brand.name} — ${c.company.name}`,
      title: c.seo.ogTitle,
      description: c.seo.description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: c.seo.ogTitle,
      description: c.seo.description,
      images: [ogImage.url],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    category: "business",
  };
}

export function buildViewport(themeColor: string): Viewport {
  return {
    themeColor,
    width: "device-width",
    initialScale: 1,
    colorScheme: "dark",
  };
}

/** Structured data: LocalBusiness + каталог пропозицій + WebSite + FAQPage */
export function buildJsonLd(c: SiteConfig) {
  const url = c.seo.siteUrl.replace(/\/$/, "");
  const orgId = `${url}/#organization`;

  const offer = (name: string, kind: string, deal: "sale" | "rent", image?: string, price?: number, currency?: string) => ({
    "@type": "Offer",
    ...(price && deal === "sale" ? { price, priceCurrency: currency ?? "EUR" } : {}),
    businessFunction:
      deal === "sale" ? "http://purl.org/goodrelations/v1#Sell" : "http://purl.org/goodrelations/v1#LeaseOut",
    availability: "https://schema.org/InStock",
    areaServed: { "@type": "Country", name: "Україна" },
    itemOffered: {
      "@type": "Product",
      name,
      category: kind,
      brand: { "@type": "Brand", name: c.brand.name },
      ...(image ? { image: new URL(image, url).href } : {}),
    },
  });

  const business = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": orgId,
    name: `${c.company.name} — ${c.brand.name}`,
    legalName: c.company.legalName,
    description: c.seo.description,
    url,
    telephone: c.company.phone,
    email: c.company.email,
    image: `${url}/og.png`,
    logo: `${url}/logo.png`, // Google вимагає растровий логотип (PNG ≥ 112px)
    foundingDate: String(c.company.foundingYear),
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: c.company.address,
      addressLocality: c.company.city,
      addressRegion: c.company.region,
      postalCode: c.company.postalCode,
      addressCountry: "UA",
    },
    geo: { "@type": "GeoCoordinates", latitude: c.company.geo.lat, longitude: c.company.geo.lng },
    openingHours: c.company.openingHours,
    areaServed: { "@type": "Country", name: "Україна" },
    brand: { "@type": "Brand", name: c.brand.name },
    sameAs: [c.company.telegram, c.company.whatsapp, c.company.tiktok].filter(Boolean),
    hasMap: `https://www.google.com/maps?q=${encodeURIComponent(c.company.mapQuery ?? `${c.company.geo.lat},${c.company.geo.lng}`)}`,
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `Техніка ${c.brand.name}: продаж`,
      itemListElement: c.catalog.products.flatMap((p) =>
        p.deals.map((d) => offer(p.name, KIND_LABELS[p.kind], d, p.image, p.price, p.currency)),
      ),
    },
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: `${c.brand.name} — ${c.company.name}`,
    inLanguage: "uk-UA",
    publisher: { "@id": orgId },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return c.sections?.faq ? [business, website, faq] : [business, website];
}

export function buildSitemap(c: SiteConfig): MetadataRoute.Sitemap {
  return [{ url: c.seo.siteUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}

export function buildRobots(c: SiteConfig): MetadataRoute.Robots {
  const url = c.seo.siteUrl.replace(/\/$/, "");
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${url}/sitemap.xml`,
  };
}

export function buildManifest(c: SiteConfig, colors: { theme: string; background: string }): MetadataRoute.Manifest {
  return {
    name: `${c.brand.name} — ${c.company.name}`,
    short_name: c.brand.name,
    description: c.seo.description,
    start_url: `${BASE_PATH}/`,
    display: "standalone",
    lang: "uk",
    theme_color: colors.theme,
    background_color: colors.background,
    icons: [
      { src: `${BASE_PATH}/icon.svg`, sizes: "any", type: "image/svg+xml" },
      { src: `${BASE_PATH}/icon-192.png`, sizes: "192x192", type: "image/png" },
      { src: `${BASE_PATH}/logo.png`, sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  };
}
