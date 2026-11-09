import Image from "next/image";
import type { ReactNode } from "react";
import type { AttachmentKind, MachineKind } from "../types";
import { AttachmentArt, MachineArt } from "./MachineArt";

export function cx(...c: (string | false | null | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

const btnBase =
  "inline-flex items-center justify-center gap-2 font-display font-semibold uppercase transition-all duration-200 disabled:pointer-events-none disabled:opacity-60 select-none";

const btnSize = {
  sm: "h-11 px-5 text-sm",
  md: "h-14 px-7 text-base",
  /** 66px — як "Надіслати запит" / "Замовити дзвінок" у макеті */
  lg: "h-[66px] px-10 text-[20px]",
};

const btnVariant = {
  brand: "bg-brand text-on-brand hover:brightness-110 active:translate-y-px",
  outline: "border border-white/25 text-white hover:border-brand hover:text-brand",
  dark: "bg-page text-white hover:bg-ink-700",
};

export function buttonClass(variant: keyof typeof btnVariant = "brand", size: keyof typeof btnSize = "md", extra?: string) {
  return cx(btnBase, btnSize[size], btnVariant[variant], extra);
}

/** Великий заголовок секції (Tektur 600, 176px на 1920) */
export function GiantTitle({
  id,
  children,
  className,
  as: Tag = "h2",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Tag id={id} className={cx("font-display text-giant font-semibold uppercase", className)}>
      {children}
    </Tag>
  );
}

/** Фото, якщо воно є в /public, інакше — SVG-ілюстрація відповідного типу техніки */
export function MachineMedia({
  src,
  alt,
  kind,
  sizes = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw",
  priority,
  className,
  imgClassName = "object-contain",
  mirror,
}: {
  src?: string;
  alt: string;
  kind: MachineKind;
  sizes?: string;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  mirror?: boolean;
}) {
  return (
    <div className={cx("relative", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={imgClassName} />
      ) : (
        <MachineArt kind={kind} mirror={mirror} className="absolute inset-0 h-full w-full p-[6%] drop-shadow-[0_18px_24px_rgba(0,0,0,0.3)]" />
      )}
    </div>
  );
}

export function AttachmentMedia({ src, alt, kind, className }: { src?: string; alt: string; kind: AttachmentKind; className?: string }) {
  return (
    <div className={cx("relative", className)}>
      {src ? (
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 90vw" className="object-contain" />
      ) : (
        <AttachmentArt kind={kind} className="absolute inset-0 h-full w-full p-[14%] drop-shadow-[0_12px_16px_rgba(0,0,0,0.25)]" />
      )}
    </div>
  );
}

/** Текстовий логотип бренду (поки немає файлу логотипа) */
export function BrandMark({ name, logo, className }: { name: string; logo?: string; className?: string }) {
  if (logo) return <Image src={logo} alt={name} width={140} height={40} className={cx("h-9 w-auto", className)} />;
  return <span className={cx("font-display text-2xl font-semibold uppercase leading-none tracking-tight", className)}>{name}</span>;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

/** Квадратний маркер-буліт кольору бренду (як у смужці переваг макета) */
export function Bullet({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cx("inline-block size-3 shrink-0 bg-brand", className)} />;
}
