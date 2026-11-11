import type { CSSProperties } from "react";
import Image from "next/image";
import { withBase } from "../../base-path";
import { DEFAULT_PRICE, KIND_LABELS } from "../../labels";
import type { SiteConfig } from "../../types";
import { CardSlider } from "../CardSlider";
import { Icon } from "../Icon";
import { MediaCard } from "../ProductCard";

/**
 * "ТЕХНІКА BOBCAT" на сайті JCB (і навпаки): слайдер техніки з сайту-партнера,
 * кнопка "Переглянути весь асортимент" і фото лінійки. У кольорах поточного сайту.
 * Фото карток — локальні копії фото партнера (scripts/sync-partner-images.mjs → public/images/partner).
 */
export function PartnerCatalog({ c }: { c: SiteConfig }) {
  const p = c.partner;
  const items = p.products ?? [];
  const base = p.url.replace(/\/$/, "");
  const href = `${base}/?utm_source=${c.id}-site&utm_medium=partner-catalog&utm_campaign=cross-sell`;
  const cta = p.ctaColor ?? { bg: "var(--color-brand)", fg: "var(--color-on-brand)" };

  return (
    <section id="partner" aria-labelledby="partner-title" className="bg-page pb-16 pt-12 lg:pb-[100px] lg:pt-[62px]">
      <div className="container-site">
        {items.length > 0 && (
          // ціни, стрілки та підсвітка карток — у кольорі бренду-партнера, як кнопка нижче
          <div style={{ "--color-brand": cta.bg } as CSSProperties}>
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
                        src={withBase(x.image.replace("/images/products/", "/images/partner/"))}
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
          </div>
        )}

        <div className="mt-10 flex flex-col items-center gap-8 lg:mt-[60px]">
          {/* кнопка в кольорі бренду-партнера (червона на сайті JCB, жовта на Bobcat) — щоб кидалась в очі */}
          <div data-reveal className="w-full max-w-[680px] [filter:drop-shadow(0_14px_34px_var(--cta-glow))]" style={{ "--cta-glow": `${cta.bg}66` } as CSSProperties}>
            <a
              href={href}
              target="_blank"
              rel="noopener"
              style={{ background: cta.bg, color: cta.fg }}
              className="cta-shine group relative flex min-h-[84px] w-full items-center justify-between gap-4 overflow-hidden py-4 pl-7 pr-4 font-display text-[19px] font-bold uppercase leading-tight transition hover:brightness-110 sm:min-h-[96px] sm:pl-10 sm:pr-5 sm:text-[26px] [clip-path:polygon(0_0,calc(100%-24px)_0,100%_24px,100%_100%,24px_100%,0_calc(100%-24px))]"
            >
              <span>{p.cta}</span>
              <span className="grid size-12 shrink-0 place-items-center bg-black/15 sm:size-14" aria-hidden="true">
                <Icon name="arrow" className="nudge-x size-6 sm:size-7" />
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* лінійка техніки партнера: без фону, на всю ширину екрана, світиться по контуру кольором кнопки */}
      {p.image && (
        <a
          href={href}
          target="_blank"
          rel="noopener"
          data-reveal="zoom"
          aria-label={p.cta}
          className="group relative mt-4 block w-full overflow-x-clip py-6 sm:py-10 lg:mt-6"
          style={
            {
              "--glow-a": `color-mix(in srgb, ${cta.bg} 70%, transparent)`,
              "--glow-b": `color-mix(in srgb, ${cta.bg} 35%, transparent)`,
              "--glow-bg": `color-mix(in srgb, ${cta.bg} 16%, transparent)`,
            } as CSSProperties
          }
        >
          {/* м'яке сяйво на фоні за технікою */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_48%_42%_at_50%_58%,var(--glow-bg),transparent_72%)]" />
          <Image
            src={p.image}
            alt={`Техніка ${p.name}`}
            width={p.imageSize?.width ?? 3200}
            height={p.imageSize?.height ?? 1000}
            sizes="100vw"
            className="relative h-auto w-full transition duration-500 [filter:drop-shadow(0_0_6px_var(--glow-a))_drop-shadow(0_0_18px_var(--glow-b))] group-hover:scale-[1.02] sm:[filter:drop-shadow(0_0_10px_var(--glow-a))_drop-shadow(0_0_30px_var(--glow-b))] lg:[filter:drop-shadow(0_0_14px_var(--glow-a))_drop-shadow(0_0_44px_var(--glow-b))]"
          />
        </a>
      )}
    </section>
  );
}
