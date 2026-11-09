import { buildSitemap } from "@landing/ui/server";
import { site } from "@/site.config";

export const dynamic = "force-static";

export default function sitemap() {
  return buildSitemap(site);
}
