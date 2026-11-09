import type { ReactNode } from "react";
import type { LeadPrefill } from "../lead-types";
import { LeadButton } from "./lead/LeadContext";

/**
 * Картка як у макеті: біле тло + фото, легке затемнення донизу,
 * великий напис зліва вгорі (бейдж), назва та ціна справа внизу. Уся картка клікабельна.
 */
export function MediaCard({
  media,
  badge,
  tag,
  title,
  price,
  prefill,
  label,
}: {
  media: ReactNode;
  badge?: string;
  tag?: string;
  title: string;
  price: string;
  prefill: LeadPrefill;
  label: string;
}) {
  return (
    <LeadButton
      prefill={prefill}
      aria-label={label}
      className="group relative block aspect-[587/400] w-full overflow-hidden bg-white text-left"
    >
      <span className="absolute inset-0 transition duration-500 group-hover:scale-[1.04]">{media}</span>
      <span aria-hidden="true" className="absolute inset-0 bg-page/10 bg-gradient-to-b from-page/0 to-page/30" />
      {badge && (
        <span className="text-glow absolute left-[clamp(0.75rem,1vw,20px)] top-[clamp(0.5rem,1vw,20px)] font-display text-badge font-normal text-white">
          {badge}
        </span>
      )}
      {tag && (
        <span className="absolute right-[clamp(0.75rem,1.56vw,30px)] top-[clamp(0.75rem,1.56vw,30px)] bg-page px-2.5 py-1 font-display text-xs font-semibold uppercase text-brand">
          {tag}
        </span>
      )}
      <span className="text-glow absolute bottom-[clamp(0.75rem,1.56vw,30px)] right-[clamp(0.75rem,1.56vw,30px)] max-w-[85%] text-right font-display text-card font-semibold uppercase">
        <span className="block text-white">{title}</span>
        <span className="block text-brand">{price}</span>
      </span>
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-brand transition duration-300 group-hover:scale-x-100" />
    </LeadButton>
  );
}
