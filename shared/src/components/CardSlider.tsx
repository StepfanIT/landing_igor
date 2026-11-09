"use client";

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeftThin, ArrowRightThin } from "./FigmaIcons";
import { GiantTitle, cx } from "./ui";

/**
 * Заголовок секції + стрілки + горизонтальний слайдер карток (CSS scroll-snap).
 * Десктоп: 3 колонки × `rows` рядки (як у макеті), мобільний — свайп по одній картці.
 */
export function CardSlider({
  titleId,
  title,
  children,
  rows = 2,
}: {
  titleId: string;
  title: string;
  children: ReactNode;
  rows?: 1 | 2;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [update]);

  const scroll = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth, behavior: "smooth" });
  const count = Children.count(children);

  return (
    <div>
      <div className="flex items-center justify-between gap-6">
        <GiantTitle id={titleId} className="min-w-0">{title}</GiantTitle>
        <div className="flex shrink-0 items-center gap-1 sm:gap-[clamp(0.5rem,2.1vw,40px)]">
          <button
            type="button"
            onClick={() => scroll(-1)}
            disabled={!canPrev}
            aria-label={`Попередні — ${title}`}
            className="size-10 text-white transition hover:text-brand disabled:opacity-30 disabled:hover:text-white sm:size-[clamp(2.75rem,3.1vw,60px)]"
          >
            <ArrowLeftThin className="size-full sm:scale-[1.4]" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            disabled={!canNext}
            aria-label={`Наступні — ${title}`}
            className="size-10 text-white transition hover:text-brand disabled:opacity-30 disabled:hover:text-white sm:size-[clamp(2.75rem,3.1vw,60px)]"
          >
            <ArrowRightThin className="size-full sm:scale-[1.4]" />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        onScroll={update}
        role="region"
        aria-label={title}
        tabIndex={0}
        className={cx(
          "scrollbar-none -mx-4 mt-6 grid snap-x snap-mandatory auto-cols-[86%] grid-flow-col gap-x-4 gap-y-[clamp(1rem,2.6vw,50px)] overflow-x-auto scroll-px-4 px-4 sm:mx-0 sm:auto-cols-[calc((100%-1.25rem)/2)] sm:gap-x-5 sm:scroll-px-0 sm:px-0 lg:mt-[clamp(1.5rem,2.1vw,41px)] lg:auto-cols-[calc((100%-2*clamp(1.25rem,2.1vw,40px))/3)] lg:gap-x-[clamp(1.25rem,2.1vw,40px)]",
          rows === 2 && count > 3 && "lg:grid-rows-2",
        )}
      >
        {Children.map(children, (child) => (
          <div className="snap-start">{child}</div>
        ))}
      </div>
    </div>
  );
}
