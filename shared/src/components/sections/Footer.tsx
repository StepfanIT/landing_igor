import type { ComponentType, SVGProps } from "react";
import type { SiteConfig } from "../../types";
import { CatMark } from "../CatMark";
import { Address as AddressIcon, Mail, PhoneSquare, Telegram, WhatsApp } from "../FigmaIcons";
import { LeadButton } from "../lead/LeadContext";
import { buttonClass, telHref } from "../ui";

function Contact({ Icon, label, value, href }: { Icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; value: string; href?: string }) {
  const body = (
    <>
      <span className="grid size-[50px] shrink-0 place-items-center bg-brand text-on-brand">
        <Icon className="size-[22px]" />
      </span>
      <span className="min-w-0">
        <span className="block pt-[5px] font-display text-base text-white/60">{label}</span>
        <span className="mt-[10px] block break-words font-display text-contact font-semibold uppercase">{value}</span>
      </span>
    </>
  );
  return href ? (
    <a href={href} className="flex gap-5 transition hover:text-brand" target={href.startsWith("http") ? "_blank" : undefined} rel="noopener">
      {body}
    </a>
  ) : (
    <div className="flex gap-5">{body}</div>
  );
}

/** Футер за макетом: логотип + назва, месенджери + "Замовити дзвінок", контакти з жовтими іконками, копірайт */
export function Footer({ c }: { c: SiteConfig }) {
  const co = c.company;
  const year = new Date().getFullYear();
  const partnerHref = `${c.partner.url}${c.partner.url.includes("?") ? "&" : "?"}utm_source=${c.id}-site&utm_medium=footer-link`;

  return (
    <footer className="bg-page pb-28 pt-14 lg:pb-[100px] lg:pt-[80px]">
      <div className="container-site">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <a href="#top" className="flex items-center gap-5" aria-label={`${c.brand.name} — на початок сторінки`}>
            {c.about.logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.about.logo} alt={`${co.name} — логотип`} width={2386} height={1646} loading="lazy" className="h-auto w-[110px] shrink-0 transition duration-500 hover:scale-105" />
            ) : (
              <span className="grid size-[75px] shrink-0 place-items-center rounded-full bg-white text-page">
                <CatMark className="size-[52px]" />
              </span>
            )}
            <span>
              <span className="block font-display text-card font-semibold uppercase">{co.legalName}</span>
              <span className="mt-[5px] block font-display text-base text-white/60">{c.footer.tagline}</span>
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <nav aria-label="Месенджери" className="flex flex-wrap items-center gap-x-5 gap-y-1 font-display text-base text-white/60">
              {co.whatsapp && (
                <a href={co.whatsapp} target="_blank" rel="noopener" className="flex items-center gap-5 p-2.5 transition hover:text-brand">
                  WhatsApp <WhatsApp className="size-[15px] text-white" />
                </a>
              )}
              {co.telegram && (
                <a href={co.telegram} target="_blank" rel="noopener" className="flex items-center gap-5 p-2.5 transition hover:text-brand">
                  Telegram <Telegram className="size-[15px] text-white" />
                </a>
              )}
              {co.tiktok && (
                <a href={co.tiktok} target="_blank" rel="noopener" className="flex items-center gap-5 p-2.5 transition hover:text-brand">
                  TikTok
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-[15px] text-white">
                    <path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-2.6-2.6c.3 0 .5 0 .8.1V9.7a5.8 5.8 0 0 0-.8-.1 5.7 5.7 0 1 0 5.7 5.7V9a7.4 7.4 0 0 0 4.3 1.4V7.3a4.3 4.3 0 0 1-3.2-1.5Z" />
                  </svg>
                </a>
              )}
            </nav>
            <div className="grid w-full gap-2 sm:flex sm:w-auto">
              <LeadButton prefill={{ type: "consult" }} className={buttonClass("brand", "lg", "w-full whitespace-nowrap sm:w-auto sm:min-w-[264px]")}>
                Замовити дзвінок
              </LeadButton>
              <a href={telHref(co.phone)} className={buttonClass("outline", "lg", "w-full whitespace-nowrap sm:w-auto")}>
                Зателефонувати
              </a>
            </div>
          </div>
        </div>

        <address className="mt-10 grid gap-8 not-italic sm:grid-cols-2 lg:mt-[40px] lg:flex lg:gap-[45px]">
          <Contact Icon={PhoneSquare} label="Телефонуйте нам за номером:" value={co.phone} href={telHref(co.phone)} />
          <Contact
            Icon={AddressIcon}
            label="Наш офіс знаходиться за адресою:"
            value={`${co.city}, ${co.address}`}
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(co.mapQuery ?? `${co.geo.lat},${co.geo.lng}`)}`}
          />
          {co.email && <Contact Icon={Mail} label="Пишіть нам на пошту:" value={co.email} href={`mailto:${co.email}`} />}
        </address>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-10 font-display text-base text-white/60 lg:mt-[40px] lg:flex-row lg:items-start lg:justify-between">
          <p>
            Copyright © {co.foundingYear} – {year} {co.legalName}
            {co.edrpou && <span className="ml-2.5">ЄДРПОУ: {co.edrpou}</span>}
          </p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <a href={partnerHref} target="_blank" rel="noopener" className="transition hover:text-brand">
              Техніка {c.partner.name} ↗
            </a>
            <span className="max-w-xl text-sm text-white/40">{c.footer.disclaimer}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
