import { LeadProvider } from "./components/lead/LeadContext";
import { About } from "./components/sections/About";
import { Address } from "./components/sections/Address";
import { BigStat } from "./components/sections/BigStat";
import { Attachments, Catalog } from "./components/sections/Catalog";
import { Faq } from "./components/sections/Faq";
import { Featured } from "./components/sections/Featured";
import { Footer } from "./components/sections/Footer";
import { Benefits, Hero } from "./components/sections/Hero";
import { Order } from "./components/sections/Order";
import { PartnerPromo } from "./components/sections/PartnerPromo";
import { Rental } from "./components/sections/Rental";
import { MobileBar, StickyHeader } from "./components/sections/StickyHeader";
import { resolveImages } from "./server/images";
import { buildJsonLd } from "./server/seo";
import type { SiteConfig } from "./types";

/** Уся сторінка лендінгу (порядок секцій — як у макеті Figma). Обидва сайти рендерять її зі своїм конфігом. */
export function LandingPage({ config }: { config: SiteConfig }) {
  const c = resolveImages(config);
  const jsonLd = buildJsonLd(c);

  return (
    <LeadProvider
      data={{
        siteId: c.id,
        phone: c.company.phone,
        products: c.catalog.products.map((p) => ({ name: p.name, deals: p.deals })),
        attachments: c.attachments.items.map((a) => a.name),
      }}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-brand focus:px-4 focus:py-2 focus:text-on-brand"
      >
        Перейти до змісту
      </a>
      <StickyHeader brand={c.brand.name} logo={c.brand.logo} phone={c.company.phone} nav={c.nav} />
      <main id="main">
        <Hero c={c} />
        <Benefits c={c} />
        <About c={c} />
        <Featured c={c} />
        <Catalog title={c.catalog.title} note={c.catalog.note} products={c.catalog.products} />
        {c.sections?.rental && <Rental c={c} />}
        <Attachments title={c.attachments.title} items={c.attachments.items} />
        <Order c={c} />
        <BigStat c={c} />
        <PartnerPromo c={c} />
        {c.sections?.faq && <Faq c={c} />}
        <Address c={c} />
      </main>
      <Footer c={c} />
      <MobileBar phone={c.company.phone} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </LeadProvider>
  );
}
