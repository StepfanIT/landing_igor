import { buildRobots } from "@landing/ui/server";
import { site } from "@/site.config";

export const dynamic = "force-static";

export default function robots() {
  return buildRobots(site);
}
