import type { SiteConfig } from "../../types";
import { GiantTitle } from "../ui";

/** "НАША АДРЕСА:" + карта на всю ширину контейнера */
export function Address({ c }: { c: SiteConfig }) {
  const co = c.company;
  const mapSrc = `https://www.google.com/maps?q=${co.geo.lat},${co.geo.lng}&z=16&hl=uk&output=embed`;
  return (
    <section id="contacts" aria-labelledby="contacts-title" className="bg-page pt-14 lg:pt-[100px]">
      <div className="container-site">
        <GiantTitle id="contacts-title">{c.contacts.title}</GiantTitle>
        <div className="relative mt-6 h-[clamp(18rem,20.8vw,400px)] overflow-hidden bg-[#979797] lg:mt-[50px]">
          <iframe
            title={`Карта: ${co.name}, ${co.address}, ${co.city}`}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
