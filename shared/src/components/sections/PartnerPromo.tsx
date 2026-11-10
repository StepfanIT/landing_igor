import Image from "next/image";
import type { CSSProperties } from "react";
import type { SiteConfig } from "../../types";
import { MachineArt } from "../MachineArt";

/**
 * Рекламний блок сайту-партнера (на Bobcat — реклама JCB, на JCB — реклама Bobcat).
 * Оформлений у кольорах партнера, щоб виглядав як окрема реклама. Посилання з UTM-мітками.
 */
export function PartnerPromo({ c }: { c: SiteConfig }) {
  const p = c.partner;
  const href = `${p.url}${p.url.includes("?") ? "&" : "?"}utm_source=${c.id}-site&utm_medium=cross-banner&utm_campaign=partner`;
  if (!p.colors) return null;
  const vars = {
    "--color-brand": p.colors.accent,
    "--color-brand-deep": p.colors.accent,
    "--color-on-brand": p.colors.accentFg,
    background: p.colors.bg,
    color: p.colors.fg,
  } as CSSProperties;

  return (
    <aside aria-label={`Реклама: ${p.name}`} className="bg-page py-12 lg:py-[80px]">
      <div className="container-site">
        <a
          href={href}
          target="_blank"
          rel="noopener"
          style={vars}
          data-reveal="zoom"
          className="group relative grid items-center gap-6 overflow-hidden p-6 sm:p-10 lg:grid-cols-[1fr_1.15fr] lg:gap-10 lg:p-[clamp(2.5rem,3.1vw,60px)]"
        >
          <span className="absolute right-0 top-0 bg-black/15 px-3 py-1 font-display text-[11px] font-semibold uppercase tracking-widest">
            {p.label}
          </span>
          <div className="relative z-10">
            <p className="font-display text-giant font-semibold uppercase leading-none">{p.name}</p>
            <p className="mt-4 font-display text-h5 font-semibold uppercase">{p.title}</p>
            <p className="mt-4 max-w-xl font-display text-base leading-relaxed opacity-75 lg:text-lg">{p.text}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {p.models.map((m) => (
                <li key={m} className="border border-current/30 px-3 py-1 font-display text-sm font-semibold uppercase">
                  {m}
                </li>
              ))}
            </ul>
            <span className="mt-8 inline-flex h-[66px] items-center gap-3 whitespace-nowrap bg-brand px-6 font-display text-base font-semibold uppercase text-on-brand transition group-hover:gap-5 sm:px-10 sm:text-[20px]">
              {p.cta} <span aria-hidden="true">→</span>
            </span>
          </div>
          <div className="relative aspect-[2000/700] w-full transition duration-500 group-hover:scale-[1.03] lg:-mr-[clamp(0rem,3vw,60px)]">
            {p.image ? (
              <Image src={p.image} alt={`Техніка ${p.name}`} fill sizes="(min-width: 1024px) 50vw, 90vw" className="object-contain" />
            ) : (
              <MachineArt kind={p.art} className="absolute inset-0 h-full w-full" />
            )}
          </div>
        </a>
      </div>
    </aside>
  );
}
