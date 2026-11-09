import type { SiteConfig } from "../../types";
import { GiantTitle } from "../ui";

/** FAQ на нативних <details> — працює без JS і добре індексується */
export function Faq({ c }: { c: SiteConfig }) {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-page pt-14 lg:pt-[100px]">
      <div className="container-site">
        <GiantTitle id="faq-title">{c.faq.title}</GiantTitle>
        <div className="mt-6 divide-y divide-white/15 border-y border-white/15 lg:mt-[50px]">
          {c.faq.items.map((f, i) => (
            <details key={f.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 font-display text-[clamp(1.05rem,1.3vw,25px)] font-semibold uppercase [&::-webkit-details-marker]:hidden">
                {f.q}
                <span aria-hidden="true" className="grid size-10 shrink-0 place-items-center bg-brand font-display text-2xl leading-none text-on-brand">
                  <span className="inline-block transition group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="max-w-5xl pb-7 font-display text-base leading-[1.7] text-white/60 lg:text-lg">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
