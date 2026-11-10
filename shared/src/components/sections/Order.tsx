import type { SiteConfig } from "../../types";
import { LeadForm } from "../lead/LeadForm";
import { GiantTitle } from "../ui";

/** "ЗАМОВИТИ": великий заголовок + короткий текст, поруч темна форма online-заявки */
export function Order({ c }: { c: SiteConfig }) {
  const o = c.order;
  return (
    <section id="order" aria-labelledby="order-title" className="bg-white py-14 text-page lg:py-[100px]">
      <div className="container-site grid items-center gap-10 lg:grid-cols-[minmax(0,479px)_1fr] lg:gap-[clamp(2.5rem,5vw,96px)]">
        <div data-reveal="left" className="order-2 bg-page px-6 py-10 text-white sm:px-[30px] sm:py-[50px] lg:order-1">
          <p className="text-center font-display text-h4 font-semibold uppercase">{o.formTitle}</p>
          <div className="mt-4">
            <LeadForm variant="mini" />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <GiantTitle id="order-title" className="text-page">
            {o.title}
          </GiantTitle>
          <p data-reveal className="mt-4 max-w-3xl font-display text-[clamp(1.25rem,1.9vw,36px)] font-semibold uppercase leading-[1.35] lg:mt-6">
            {o.text}
          </p>
          <span data-reveal className="mt-8 block h-2 w-40 bg-brand" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
