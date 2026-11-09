import { renderOgImage } from "@landing/ui/server";
import { site } from "@/site.config";

// Картинка-прев'ю для соцмереж/месенджерів: генерується під час білду у файл /og.png
export const dynamic = "force-static";

export function GET() {
  return renderOgImage(site, { brand: "#f26a1b", onBrand: "#131313" });
}
