import { LandingPage } from "@landing/ui";
import { site } from "@/site.config";

export default function Page() {
  return <LandingPage config={site} />;
}
