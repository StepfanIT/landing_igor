import fs from "node:fs";
import path from "node:path";
import { withBase } from "../base-path";
import type { SiteConfig } from "../types";

/**
 * Повертає шлях до зображення лише якщо файл реально існує в /public.
 * Сторінка генерується статично під час білду, тож перевірка безкоштовна для користувача.
 * Так можна просто докидати фото в public/images — і вони автоматично замінять SVG-заглушки.
 */
export function existingImage(src?: string): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//.test(src)) return src;
  const file = path.join(process.cwd(), "public", src.replace(/^\//, ""));
  return fs.existsSync(file) ? withBase(src) : undefined;
}

export function resolveImages(config: SiteConfig): SiteConfig {
  return {
    ...config,
    brand: { ...config.brand, logo: existingImage(config.brand.logo) },
    hero: { ...config.hero, image: existingImage(config.hero.image) },
    about: { ...config.about, image: existingImage(config.about.image), logo: existingImage(config.about.logo) },
    featured: { ...config.featured, image: existingImage(config.featured.image) },
    bigStat: { ...config.bigStat, image: existingImage(config.bigStat.image) },
    partner: { ...config.partner, image: existingImage(config.partner.image) },
    catalog: {
      ...config.catalog,
      products: config.catalog.products.map((p) => ({ ...p, image: existingImage(p.image) })),
    },
    attachments: {
      ...config.attachments,
      items: config.attachments.items.map((a) => ({ ...a, image: existingImage(a.image) })),
    },
  };
}
