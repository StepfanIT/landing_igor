"use client";

import { useEffect, useState } from "react";
import { Menu, Phone, X } from "lucide-react";
import type { NavItem } from "../../types";
import { Telegram } from "../FigmaIcons";
import { LeadButton } from "../lead/LeadContext";
import { BrandMark, buttonClass, cx, telHref } from "../ui";

/**
 * Компактна шапка, що з'являється після першого екрану (у макеті перший екран без меню —
 * тож навігація не змінює вигляд героя, але доступна при скролі). На мобільному — бургер-меню.
 */
export function StickyHeader({ brand, logo, phone, telegram, nav }: { brand: string; logo?: string; phone: string; telegram?: string; nav: NavItem[] }) {
  const [show, setShow] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.75);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const visible = show || menu;

  return (
    <>
    <header
      className={cx(
        "fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-page/95 backdrop-blur transition-transform duration-300",
        visible ? "translate-y-0" : "-translate-y-full",
      )}
    >
      <div className="container-site flex h-16 items-center justify-between gap-6 lg:h-[72px]">
        <a href="#top" className="text-white" onClick={() => setMenu(false)} aria-label={`${brand} — на початок сторінки`}>
          <BrandMark name={brand} logo={logo} />
        </a>
        <nav aria-label="Головне меню" className="hidden lg:block">
          <ul className="flex items-center gap-[clamp(1rem,2vw,40px)]">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="font-display text-sm font-semibold uppercase text-white/70 transition hover:text-brand">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <a href={telHref(phone)} className="hidden font-display text-base font-semibold xl:block hover:text-brand">
            {phone}
          </a>
          {telegram && (
            <a href={telegram} target="_blank" rel="noopener" className="grid size-11 place-items-center border border-white/20 text-white transition hover:text-brand" aria-label="Написати в Telegram">
              <Telegram className="size-5" />
            </a>
          )}
          <a href={telHref(phone)} className="grid size-11 place-items-center border border-white/20 text-brand xl:hidden" aria-label={`Подзвонити ${phone}`}>
            <Phone className="size-5" />
          </a>
          <span className="hidden sm:block">
            <LeadButton className={buttonClass("brand", "sm")}>Залишити заявку</LeadButton>
          </span>
          <button
            type="button"
            className="grid size-11 place-items-center border border-white/20 lg:hidden"
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? "Закрити меню" : "Відкрити меню"}
          >
            {menu ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

    </header>

    {/* панель меню — поза <header>: у шапки є transform, через який fixed-елементи всередині рахуються від неї, а не від екрана */}
      <div
        id="mobile-menu"
        className={cx(
          "fixed inset-x-0 bottom-0 top-16 z-[49] overflow-y-auto bg-page transition-opacity duration-300 lg:hidden",
          menu ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav aria-label="Мобільне меню" className="container-site py-6">
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} onClick={() => setMenu(false)} className="flex items-center justify-between py-4 font-display text-2xl font-semibold uppercase">
                  {n.label}
                  <span className="text-brand">→</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-3">
            <a href={telHref(phone)} className={buttonClass("outline", "lg", "w-full")}>
              {phone}
            </a>
            <div onClickCapture={() => setMenu(false)}>
              <LeadButton className={buttonClass("brand", "lg", "w-full")}>Залишити заявку</LeadButton>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

/** Липка нижня панель на мобільних: дзвінок + заявка */
export function MobileBar({ phone, telegram }: { phone: string; telegram?: string }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cx(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-page/95 p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur transition-transform duration-300 lg:hidden",
        show ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className={cx("grid gap-2", telegram ? "grid-cols-[auto_1fr]" : "grid-cols-1")}>
        {telegram && (
          <a href={telegram} target="_blank" rel="noopener" className={buttonClass("outline", "md", "px-4")} aria-label="Написати в Telegram">
            <Telegram className="size-5 text-brand" />
          </a>
        )}
        <a href={telHref(phone)} className={buttonClass("brand", "md", "w-full")}>
          <Phone className="size-5" /> Зателефонувати
        </a>
      </div>
    </div>
  );
}
