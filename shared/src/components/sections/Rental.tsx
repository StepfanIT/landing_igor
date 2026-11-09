import type { SiteConfig } from "../../types";
import { LeadButton } from "../lead/LeadContext";
import { Bullet, GiantTitle, buttonClass } from "../ui";

/** "ОРЕНДА" — умови оренди (у стилі макета: великий заголовок + пункти з квадратними маркерами) */
export function Rental({ c }: { c: SiteConfig }) {
  const r = c.rental;
  const rentModels = c.catalog.products.filter((p) => p.deals.includes("rent"));
  return (
    <section id="rent" aria-labelledby="rent-title" className="bg-page pb-10 pt-12 lg:pt-[62px]">
      <div className="container-site">
        <GiantTitle id="rent-title">{r.title}</GiantTitle>
        <div className="mt-4 grid gap-10 lg:mt-[clamp(1rem,2.1vw,41px)] lg:grid-cols-[1.3fr_1fr] lg:gap-[40px]">
          <div>
            <p className="max-w-3xl font-display text-[clamp(1rem,1.25vw,24px)] leading-relaxed text-white/70">{r.lead}</p>
            <ul className="mt-8 grid gap-x-10 gap-y-5 sm:grid-cols-2">
              {r.terms.map((t) => (
                <li key={t} className="flex items-center gap-4 font-display text-caption font-semibold uppercase">
                  <Bullet />
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between gap-6 border-2 border-brand p-6 sm:p-[30px]">
            <div>
              <p className="font-display text-h4 font-semibold uppercase">Доступно в оренду</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {rentModels.map((m) => (
                  <li key={m.id}>
                    <LeadButton
                      prefill={{ type: "rent", model: m.name }}
                      className="border border-white/20 px-3 py-1.5 font-display text-sm font-semibold uppercase transition hover:border-brand hover:text-brand"
                    >
                      {m.name}
                    </LeadButton>
                  </li>
                ))}
              </ul>
              <p className="mt-5 font-display text-sm text-white/50">{r.note}</p>
            </div>
            <LeadButton prefill={{ type: "rent" }} className={buttonClass("brand", "lg", "w-full")}>
              {r.cta}
            </LeadButton>
          </div>
        </div>
      </div>
    </section>
  );
}
