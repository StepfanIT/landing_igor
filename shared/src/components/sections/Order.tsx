import type { SiteConfig } from "../../types";
import { LeadForm } from "../lead/LeadForm";
import { GiantTitle, cx } from "../ui";

/** "ЗАМОВИТИ": темна форма зліва + 3 кроки з повернутими цифрами (зигзагом, як у макеті) */
export function Order({ c }: { c: SiteConfig }) {
  const o = c.order;
  return (
    <section id="order" aria-labelledby="order-title" className="bg-white py-14 text-page lg:py-[100px]">
      <div className="container-site grid items-start gap-10 lg:grid-cols-[minmax(0,479px)_1fr] lg:gap-[40px]">
        <div className="order-2 bg-page px-6 py-10 text-white sm:px-[30px] sm:py-[50px] lg:order-1">
          <p className="text-center font-display text-h4 font-semibold uppercase">{o.formTitle}</p>
          <div className="mt-4">
            <LeadForm variant="mini" />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <GiantTitle id="order-title" className="text-page">
            {o.title}
          </GiantTitle>
          <ol className="mt-6 grid gap-10 sm:grid-cols-3 lg:mt-[50px] lg:gap-0">
            {o.steps.map((s, i) => {
              const numberFirst = i % 2 === 0;
              // на телефоні цифра завжди над своїм кроком і без повороту; з 640px — зигзаг і поворот, як у макеті
              const num = (
                <span
                  aria-hidden="true"
                  className={cx(
                    "flex items-center justify-center overflow-visible sm:h-[clamp(7rem,10.4vw,200px)]",
                    !numberFirst && "max-sm:order-first",
                  )}
                >
                  <span className="inline-block font-display text-[5rem] font-semibold leading-none text-brand sm:-rotate-90 sm:text-step">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </span>
              );
              return (
                <li key={s.title} className={cx("flex flex-col items-center px-5 text-center", numberFirst ? "lg:pt-[17px]" : "lg:pt-[20px]")}>
                  {numberFirst && num}
                  <div className={cx("max-sm:mt-3", numberFirst ? "sm:mt-[clamp(1rem,2vw,38px)]" : "sm:mb-[clamp(1rem,2vw,37px)]")}>
                    <p className="font-display text-[clamp(1rem,0.94vw,18px)] font-semibold uppercase leading-[1.3]">
                      <span className="sr-only">Крок {i + 1}. </span>
                      {s.title}
                    </p>
                    <p className="mx-auto mt-5 max-w-[355px] font-display text-base leading-[1.56] text-black/60">{s.text}</p>
                  </div>
                  {!numberFirst && num}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
