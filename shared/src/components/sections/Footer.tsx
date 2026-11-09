import type { ComponentType, SVGProps } from "react";
import type { SiteConfig } from "../../types";
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
            <span className="grid size-[75px] shrink-0 place-items-center rounded-full bg-white font-display text-xl font-semibold uppercase text-page">
              {c.brand.name.length <= 3 ? c.brand.name : c.brand.name.charAt(0)}
            </span>
            <span className="text-center">
              <span className="block font-display text-card font-semibold uppercase">{co.name}</span>
              <span className="mt-[5px] block font-display text-base text-white/60">{c.footer.tagline}</span>
            </span>
          </a>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            <nav aria-label="Месенджери" className="flex items-center gap-5 font-display text-base text-white/60">
              {co.whatsapp && (
                <a href={co.whatsapp} target="_blank" rel="noopener" className="flex items-center gap-5 p-2.5 transition hover:text-brand">
                  WhatsApp <WhatsApp className="size-[15px] text-white" />
                </a>
              )}
              <a href={co.telegram} target="_blank" rel="noopener" className="flex items-center gap-5 p-2.5 transition hover:text-brand">
                Telegram <Telegram className="size-[15px] text-white" />
              </a>
            </nav>
            <LeadButton prefill={{ type: "consult" }} className={buttonClass("brand", "lg", "w-full whitespace-nowrap sm:w-auto sm:min-w-[264px]")}>
              Замовити дзвінок
            </LeadButton>
          </div>
        </div>

        <address className="mt-10 grid gap-8 not-italic sm:grid-cols-2 lg:mt-[40px] lg:flex lg:gap-[45px]">
          <Contact Icon={PhoneSquare} label="Телефонуйте нам за номером:" value={co.phone} href={telHref(co.phone)} />
          <Contact
            Icon={AddressIcon}
            label="Наш офіс знаходиться за адресою:"
            value={`${co.city}, ${co.address}`}
            href={`https://www.google.com/maps/dir/?api=1&destination=${co.geo.lat},${co.geo.lng}`}
          />
          <Contact Icon={Mail} label="Пишіть нам на пошту:" value={co.email} href={`mailto:${co.email}`} />
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
