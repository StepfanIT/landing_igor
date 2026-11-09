import { renderOgImage } from "@landing/ui/server";
import { site } from "@/site.config";

export const dynamic = "force-static";

export const alt = "Продаж та оренда спецтехніки JCB";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return renderOgImage(site, { brand: "#fbb503", onBrand: "#131313" });
}
