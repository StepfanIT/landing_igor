import Image from "next/image";
import type { CSSProperties } from "react";
import type { SiteConfig } from "../../types";
import { Helmet } from "../FigmaIcons";
import { Bullet, GiantTitle } from "../ui";

/** "ПРО НАС": великий рік заснування поверх фото + текст про компанію */
export function About({ c }: { c: SiteConfig }) {
  const a = c.about;
  const year = String(c.company.foundingYear);
  return (
    <section id="about" aria-labelledby="about-title" className="bg-page pb-16 pt-12 lg:pb-[45px] lg:pt-[69px]">
      <div className="container-site grid gap-10 lg:grid-cols-2 lg:gap-[40px]">
        <div>
          <GiantTitle id="about-title">{a.title}</GiantTitle>
          <div className="relative mt-2 flex items-start">
            <p
              data-reveal="left"
              aria-label={`${a.sinceLabel} ${year} ${a.sinceSuffix}`}
              className="relative z-10 shrink-0 pl-[10px] font-display font-semibold uppercase leading-none"
            >
              <span className="block text-[clamp(1rem,1.56vw,30px)]">{a.sinceLabel}</span>
              <span className="mt-[0.3em] block text-[clamp(3.5rem,7.3vw,140px)]">{year.slice(0, 2)}</span>
              <span className="block text-[clamp(3.5rem,7.3vw,140px)] text-brand">{year.slice(2)}</span>
              <span className="mt-[0.15em] block text-[clamp(1.75rem,3.5vw,68px)]">{a.sinceSuffix}</span>
            </p>
            <div data-reveal="zoom" style={{ "--reveal-delay": "150ms" } as CSSProperties} className="relative -ml-[clamp(1rem,2.6vw,50px)] mt-[clamp(0.25rem,0.4vw,7px)] aspect-[630/419] w-full max-w-[630px] overflow-hidden bg-ink-800">
              {a.image ? (
                <Image src={a.image} alt={`Команда ${c.company.name}`} fill sizes="(min-width: 1024px) 33vw, 80vw" className="object-cover" />
              ) : (
                <div className="absolute inset-0 grid place-items-center">
                  <Helmet className="size-24 text-brand" />
                </div>
              )}
              <div className="absolute inset-0 bg-page/30" />
            </div>
          </div>
        </div>

        <div data-reveal="right" style={{ "--reveal-delay": "250ms" } as CSSProperties} className="flex flex-col justify-end lg:pb-[45px]">
          {a.logo && (
            // eslint-disable-next-line @next/next/no-img-element
            // мобільний/планшет: по центру, зверху трохи заходить на фото, знизу плавно ховається під текст
            <img
              src={a.logo}
              alt={`${c.company.name} — логотип`}
              width={2386}
              height={1646}
              loading="lazy"
              className="relative mx-auto -mb-[clamp(2rem,9vw,4.5rem)] -mt-[clamp(4.5rem,18vw,8rem)] h-auto w-[min(88%,440px)] [mask-image:linear-gradient(180deg,#000_58%,transparent_100%)] lg:mx-0 lg:mb-8 lg:mt-0 lg:w-[min(100%,420px)] lg:[mask-image:none]"
            />
          )}
          <div className="relative z-10 space-y-5 font-display text-[clamp(1rem,1.04vw,20px)] leading-relaxed text-white/70">
            {a.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {a.points.map((p) => (
              <li key={p} className="flex items-center gap-4 font-display text-caption font-semibold uppercase">
                <Bullet />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
