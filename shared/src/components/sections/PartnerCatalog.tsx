import Image from "next/image";
import { DEFAULT_PRICE, KIND_LABELS } from "../../labels";
import type { SiteConfig } from "../../types";
import { CardSlider } from "../CardSlider";
import { Icon } from "../Icon";
import { MediaCard } from "../ProductCard";

/**
 * "ТЕХНІКА BOBCAT" на сайті JCB (і навпаки): слайдер техніки з сайту-партнера,
 * кнопка "Переглянути весь асортимент" і фото лінійки. У кольорах поточного сайту.
 * Фото карток беруться прямо з сайту-партнера (його public/images).
 */
export function PartnerCatalog({ c }: { c: SiteConfig }) {
  const p = c.partner;
  const items = p.products ?? [];
  const base = p.url.replace(/\/$/, "");
  const href = `${base}/?utm_source=${c.id}-site&utm_medium=partner-catalog&utm_campaign=cross-sell`;

  return (
    <section id="partner" aria-labelledby="partner-title" className="bg-page pb-16 pt-12 lg:pb-[100px] lg:pt-[62px]">
      <div className="container-site">
        {items.length > 0 && (
          <CardSlider titleId="partner-title" title={`Техніка ${p.name}`}>
            {items.map((x) => {
              const price = x.priceSale ?? DEFAULT_PRICE;
              return (
                <MediaCard
                  key={x.id}
                  media={
                    x.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`${base}${x.image}`}
                        alt={`${x.name} — ${KIND_LABELS[x.kind].toLowerCase()}`}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-contain"
                      />
                    ) : null
                  }
                  badge={x.badge}
                  title={x.name}
                  price={price}
                  prefill={{ type: "sale", model: x.name }}
                  label={`${x.name}: ${price}. Залишити заявку`}
                />
              );
            })}
          </CardSlider>
        )}

        <div className="mt-10 flex flex-col items-center gap-8 lg:mt-[60px]">
          <a
            href={href}
            target="_blank"
            rel="noopener"
            data-reveal
            className="group inline-flex h-[66px] items-center gap-3 bg-brand px-8 font-display text-base font-semibold uppercase text-on-brand transition hover:brightness-110 sm:px-12 sm:text-[20px] [clip-path:polygon(0_0,calc(100%-20px)_0,100%_20px,100%_100%,20px_100%,0_calc(100%-20px))]"
          >
            {p.cta}
            <Icon name="arrow" className="size-5 transition group-hover:translate-x-1" />
          </a>
          {p.image && (
            <a href={href} target="_blank" rel="noopener" data-reveal="zoom" className="relative block aspect-[2000/560] w-full max-w-5xl" aria-label={p.cta}>
              <Image src={p.image} alt={`Лінійка техніки ${p.name}`} fill sizes="(min-width: 1024px) 64rem, 100vw" className="object-contain" />
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
