import Image from "next/image";
import type { SiteConfig } from "../../types";

/** Банер "250К": фото на всю ширину, велика цифра зліва, слоган справа */
export function BigStat({ c }: { c: SiteConfig }) {
  const s = c.bigStat;
  return (
    <section aria-label={`${s.value} ${s.label}`} className="relative isolate overflow-hidden bg-page">
      {s.image && <Image src={s.image} alt="" fill sizes="100vw" className="-z-10 object-cover" />}
      <div className="absolute inset-0 -z-10 bg-page/25" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-page/50 via-transparent to-page/40" />
      <div className="container-site grid min-h-[clamp(28rem,39.6vw,761px)] gap-10 py-14 lg:grid-cols-2 lg:gap-0 lg:pb-[130px] lg:pt-[100px]">
        <div className="reveal text-center">
          <p className="text-glow font-display text-mega font-semibold uppercase">{s.value}</p>
          <p className="text-glow font-display text-h5 font-semibold uppercase">{s.label}</p>
        </div>
        <div className="reveal flex flex-col justify-end text-center">
          <p className="text-glow font-display text-h5 font-semibold uppercase">{s.quote}</p>
          <p className="mx-auto mt-[10px] max-w-[911px] font-display text-base leading-[1.56] text-white/60">{s.text}</p>
        </div>
      </div>
    </section>
  );
}
