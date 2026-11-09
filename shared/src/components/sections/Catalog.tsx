"use client";

import { DEFAULT_PRICE, KIND_LABELS } from "../../labels";
import type { Attachment, Product } from "../../types";
import { CardSlider } from "../CardSlider";
import { MediaCard } from "../ProductCard";
import { AttachmentMedia, MachineMedia } from "../ui";

/** "ТОП ПРОДАЖ" — картки техніки 3×2 зі стрілками */
export function Catalog({ title, note, products }: { title: string; note: string; products: Product[] }) {
  return (
    <section id="catalog" aria-labelledby="catalog-title" className="bg-page pb-10 pt-12 lg:pt-[45px]">
      <div className="container-site">
        <CardSlider titleId="catalog-title" title={title}>
          {products.map((p) => {
            const forSale = p.deals.includes("sale");
            const price = forSale ? (p.priceSale ?? DEFAULT_PRICE) : `Оренда: ${p.priceRent ?? "за запитом"}`;
            return (
              <MediaCard
                key={p.id}
                media={<MachineMedia src={p.image} alt={`${p.name} — ${KIND_LABELS[p.kind].toLowerCase()}`} kind={p.kind} className="h-full w-full" />}
                badge={p.badge}
                title={p.name}
                price={price}
                prefill={{ type: forSale ? "sale" : "rent", model: p.name }}
                label={`${p.name}: ${price}. Залишити заявку`}
              />
            );
          })}
        </CardSlider>
        <p className="mt-6 font-display text-sm text-white/40">{note}</p>
      </div>
    </section>
  );
}

/** "НАВІСНЕ" — той самий стиль карток */
export function Attachments({ title, items }: { title: string; items: Attachment[] }) {
  return (
    <section id="attachments" aria-labelledby="attachments-title" className="bg-page pb-16 pt-12 lg:pb-[100px] lg:pt-[62px]">
      <div className="container-site">
        <CardSlider titleId="attachments-title" title={title}>
          {items.map((a) => (
            <MediaCard
              key={a.id}
              media={<AttachmentMedia src={a.image} alt={a.name} kind={a.kind} className="h-full w-full" />}
              title={a.name}
              price={a.price ?? DEFAULT_PRICE}
              prefill={{ type: "attachment", model: a.name }}
              label={`${a.name}: ${a.text} Дізнатися ціну`}
            />
          ))}
        </CardSlider>
      </div>
    </section>
  );
}
