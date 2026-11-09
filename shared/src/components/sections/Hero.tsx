import Image from "next/image";
import type { CSSProperties } from "react";
import { withBase } from "../../base-path";
import type { SiteConfig } from "../../types";
import { MachineArt } from "../MachineArt";
import { Bullet, telHref } from "../ui";

const STAT_ICONS = {
  machines: withBase("/images/icons/stat-machines.png"),
  delivery: withBase("/images/icons/stat-delivery.png"),
};

function Backdrop({ c, priority }: { c: SiteConfig; priority?: boolean }) {
  const h = c.hero;
  return (
    <>
      {h.image ? (
        <Image src={h.image} alt="" fill priority={priority} sizes="100vw" className="object-cover object-[60%_center]" />
      ) : (
        <MachineArt kind={h.art} className="absolute bottom-0 right-0 h-[80%] w-auto opacity-60" />
      )}
      {h.dim ? <div className="absolute inset-0 bg-page" style={{ opacity: h.dim }} /> : null}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(19_19_19/0.6)_0%,rgb(19_19_19/0)_55%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(19_19_19/0.6)_0%,rgb(19_19_19/0.4)_25%,rgb(19_19_19/0)_55%,#131313_100%)]" />
    </>
  );
}

/** Перший екран: фото на всю ширину, плашка з назвою і телефоном, статистика, "ПРОДАЖ / СПЕЦТЕХНІКИ" */
export function Hero({ c }: { c: SiteConfig }) {
  const h = c.hero;
  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-page">
      {/* фон: фото + градієнти з макета */}
      <div className="absolute inset-0 -z-10">
        <Backdrop c={c} priority />
      </div>

      <div className="container-site relative pb-2 pt-4 sm:pt-[30px]">
        {/* верхня плашка з обводкою */}
        <div className="text-glow flex flex-col items-start justify-between gap-1 border-2 border-brand px-3 py-2 font-display text-banner font-semibold uppercase sm:flex-row sm:items-center sm:px-[23px] sm:py-0">
          <span>{c.company.legalName.replace(/«|»/g, (m) => (m === "«" ? "“" : "”"))}</span>
          <a href={telHref(c.company.phone)} className="transition hover:text-brand" aria-label={`Подзвонити ${c.company.phone}`}>
            {c.company.phone}
          </a>
        </div>

        {/* статистика */}
        <div className="mt-6 flex flex-col gap-6 lg:mt-[clamp(2.5rem,3.7vw,71px)] lg:flex-row lg:items-start lg:justify-between">
          <dl className="flex flex-wrap gap-x-[clamp(1.5rem,1.6vw,30px)] gap-y-4 lg:pl-[10px] lg:pt-[20px]">
            {h.stats.map((s) => (
              <div key={s.label} className="flex min-w-[min(100%,380px)] flex-col-reverse whitespace-nowrap lg:min-w-[clamp(14rem,20.6vw,395px)]">
                <dt className="font-display text-caption font-semibold uppercase">{s.label}</dt>
                <dd className="flex items-center">
                  <span
                    aria-hidden="true"
                    className="icon-mask mr-[clamp(0.75rem,1vw,20px)] size-[clamp(2.5rem,3.1vw,60px)] shrink-0"
                    style={{ maskImage: `url(${STAT_ICONS[s.icon]})`, WebkitMaskImage: `url(${STAT_ICONS[s.icon]})` } as CSSProperties}
                  />
                  <span className="font-display text-stat font-semibold uppercase">{s.value}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className="lg:-mt-[clamp(0rem,1.5vw,28px)] lg:text-right">
            <span className="block font-display text-huge font-semibold leading-[1.1]">{h.highlight.value}</span>
            <span className="block font-display text-caption font-semibold uppercase lg:pr-[90px]">{h.highlight.label}</span>
          </p>
        </div>

        {/* заголовок */}
        <div className="relative mt-8 lg:mt-[clamp(2.5rem,5vw,96px)]">
          <h1 id="hero-title" className="font-display font-semibold uppercase">
            <span className="inline-block bg-brand pl-[clamp(0.75rem,1.5vw,29px)] pr-[clamp(0.75rem,2.6vw,50px)] text-banner text-on-brand">{h.accent}</span>{" "}
            <span className="block text-giant">{h.title}</span>
            <span className="sr-only"> {h.srTitle}</span>
          </h1>
          <a
            href="#about"
            aria-label="Гортати далі"
            className="absolute bottom-[clamp(1rem,3.1vw,60px)] right-0 hidden size-[clamp(4rem,5.2vw,100px)] transition hover:translate-x-1 hover:translate-y-1 sm:block"
          >
            <svg viewBox="0 0 100 100" fill="none" className="size-full text-white" aria-hidden="true">
              <circle cx="53.6" cy="53.6" r="46" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
              <path d="M1 1l63.9 63.9M31.2 64.9h33.7V36" stroke="currentColor" strokeWidth="1.55" />
            </svg>
          </a>
        </div>
      </div>

      {/* частина фото поверх тексту: техніка "перед" плашкою, як у макеті (лише десктоп) */}
      {h.image && h.foreground && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 hidden lg:block" style={{ clipPath: `polygon(${h.foreground})` }}>
          <Backdrop c={c} />
        </div>
      )}
    </section>
  );
}

/** Смужка переваг під першим екраном (з великими напівпрозорими 01/02/03) */
export function Benefits({ c }: { c: SiteConfig }) {
  return (
    <section aria-label="Наші переваги" className="bg-page pt-6 lg:pt-[50px]">
      <ul className="container-site grid gap-2 sm:grid-cols-3 lg:!px-[20px]">
        {c.hero.benefits.map((b, i) => (
          <li key={b.text} className="relative flex min-h-[clamp(4rem,5.7vw,109px)] items-center gap-[clamp(0.75rem,1vw,20px)] overflow-hidden py-2 lg:pl-[6px]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-[60%] top-1/2 -translate-y-[45%] select-none font-display text-[clamp(4rem,9.6vw,185px)] font-semibold leading-none text-white/[0.09]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <Bullet className="relative" />
            <span className="relative font-display text-[clamp(0.85rem,1.35vw,26px)] font-semibold uppercase leading-[1.3]">
              {b.accent ? (
                <>
                  {b.text.replace(b.accent, "")}
                  <span className="text-brand">{b.accent}</span>
                </>
              ) : (
                b.text
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
