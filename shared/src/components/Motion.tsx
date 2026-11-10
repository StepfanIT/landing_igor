"use client";

import { useEffect, useRef, useState } from "react";

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Вмикає анімацію появи для всіх [data-reveal] на сторінці (див. base.css).
 * Те, що вже на екрані в момент завантаження, показується одразу — без "блимання".
 */
export function RevealObserver() {
  useEffect(() => {
    if (reducedMotion() || !("IntersectionObserver" in window)) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const vh = window.innerHeight;
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0 && r.left < window.innerWidth && r.right > 0) el.classList.add("is-visible");
    }
    document.documentElement.classList.add("js-reveal");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    for (const el of els) if (!el.classList.contains("is-visible")) io.observe(el);
    return () => io.disconnect();
  }, []);
  return null;
}

/**
 * Число, що "рахується" від нуля, коли з'являється на екрані: "35+", "99.9%", "250К", "24 год".
 * На сервері (і для SEO) одразу рендериться кінцеве значення.
 */
export function CountUp({ value, duration = 1600 }: { value: string; duration?: number }) {
  const m = value.match(/^(\D*?)(\d+(?:[.,]\d+)?)(.*)$/);
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!m || !el || reducedMotion() || !("IntersectionObserver" in window)) return;
    const [, prefix, num, suffix] = m;
    const target = parseFloat(num.replace(",", "."));
    const decimals = (num.split(/[.,]/)[1] ?? "").length;
    const sep = num.includes(",") ? "," : ".";
    let raf = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = (target * eased).toFixed(decimals).replace(".", sep);
          setText(`${prefix}${v}${suffix}`);
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        setText(`${prefix}${(0).toFixed(decimals).replace(".", sep)}${suffix}`);
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{text}</span>
    </span>
  );
}
