import type { ComponentType, SVGProps } from "react";
import type { Feature, FeatureIconName, SiteConfig } from "../../types";
import { Helmet, Worker } from "../FigmaIcons";
import { Icon } from "../Icon";
import { LeadButton } from "../lead/LeadContext";
import { MachineMedia, cx } from "../ui";

// іконка "money" з макета містила знак ₽ — замість неї нейтральні монети
const FIGMA_ICONS: Record<string, ComponentType<SVGProps<SVGSVGElement>>> = { helmet: Helmet, worker: Worker };

function FeatureIcon({ name }: { name: FeatureIconName }) {
  const Figma = FIGMA_ICONS[name];
  if (Figma) return <Figma className="h-1/2 w-1/2" />;
  if (name === "money") return <Icon name="coins" className="h-[46%] w-[46%]" />;
  return <Icon name={name as Exclude<FeatureIconName, "helmet" | "money" | "worker">} className="h-[44%] w-[44%]" />;
}

function FeatureItem({ f, side }: { f: Feature; side: "left" | "right" }) {
  return (
    <li className={cx("flex items-center gap-[clamp(1rem,2.1vw,40px)]", side === "left" && "lg:flex-row-reverse lg:text-right")}>
      <span className="grid size-[clamp(4rem,5.2vw,100px)] shrink-0 place-items-center rounded-full bg-brand text-graphite">
        <FeatureIcon name={f.icon} />
      </span>
      <span className="max-w-[413px]">
        <span className="block font-oswald text-[clamp(1.05rem,1.15vw,22px)] font-bold uppercase leading-[1.5] text-graphite">{f.title}</span>
        <span className="mt-[clamp(0.5rem,1vw,20px)] block font-mont text-[clamp(0.9rem,0.83vw,16px)] leading-[1.75] text-black/60">{f.text}</span>
      </span>
    </li>
  );
}

/** Біла секція флагманської моделі: великий заголовок Oswald + фото по центру + переваги з обох боків */
export function Featured({ c }: { c: SiteConfig }) {
  const f = c.featured;
  const left = f.features.slice(0, 3);
  const right = f.features.slice(3);
  const [brandWord, ...rest] = f.model.split(" ");

  return (
    <section id="featured" aria-labelledby="featured-title" className="overflow-hidden bg-white pb-16 pt-12 text-page lg:pb-[clamp(3rem,3.2vw,62px)] lg:pt-[clamp(3rem,3.3vw,64px)]">
      <div className="container-site">
        <h2 id="featured-title" className="font-oswald text-model font-bold uppercase lg:pl-[9px]">
          {f.kicker}
          <br />
          <span className="text-brand">{brandWord}</span> {rest.join(" ")}
        </h2>

        <div className="mt-10 grid items-center gap-10 lg:mt-[clamp(3rem,5.6vw,106px)] lg:grid-cols-[1fr_1.55fr_1fr] lg:gap-0">
          <ul className="order-2 grid gap-8 sm:grid-cols-2 lg:order-1 lg:grid-cols-1 lg:gap-[clamp(2rem,4.5vw,87px)] lg:pl-[35px]">
            {left.map((x) => (
              <FeatureItem key={x.title} f={x} side="left" />
            ))}
          </ul>
          <div className="order-1 lg:order-2 lg:-mx-[clamp(0rem,6vw,115px)]">
            <LeadButton prefill={{ type: "sale", model: f.model }} aria-label={`${f.model} — дізнатися ціну`} className="block w-full cursor-pointer">
              <MachineMedia src={f.image} alt={f.model} kind={f.art} className="aspect-[1037/580]" sizes="(min-width: 1024px) 55vw, 95vw" />
            </LeadButton>
          </div>
          <ul className="order-3 grid gap-8 sm:grid-cols-2 lg:grid-cols-1 lg:gap-[clamp(2rem,4.5vw,87px)] lg:pr-[35px]">
            {right.map((x) => (
              <FeatureItem key={x.title} f={x} side="right" />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
