import { buildManifest } from "@landing/ui/server";
import { site } from "@/site.config";

export const dynamic = "force-static";

export default function manifest() {
  return buildManifest(site, { theme: "#f26a1b", background: "#0a0b0d" });
}
