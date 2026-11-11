"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown } from "lucide-react";
import { cx } from "./ui";

/**
 * Випадний список у стилі сайту замість системного <select> (той на Windows/Android
 * малює біле меню з синім виділенням). Клавіатура: ↑/↓, Home/End, Enter/Пробіл, Esc, пошук за літерою.
 */
export function Select({
  id,
  name,
  value,
  onChange,
  options,
  placeholder,
  label,
  className,
}: {
  id?: string;
  name?: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  /** назва поля для скрінрідерів */
  label: string;
  className?: string;
}) {
  const auto = useId();
  const baseId = id ?? auto;
  const listId = `${baseId}-list`;
  const root = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const typed = useRef({ text: "", at: 0 });

  const selectedIdx = options.indexOf(value);

  const openList = () => {
    setActive(selectedIdx >= 0 ? selectedIdx : 0);
    setOpen(true);
  };
  const choose = (i: number) => {
    if (options[i] !== undefined) onChange(options[i]);
    setOpen(false);
  };

  // клік поза списком — закрити
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  // активний пункт завжди видно
  useEffect(() => {
    if (open && active >= 0) list.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  function onKey(e: KeyboardEvent) {
    const last = options.length - 1;
    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp": {
        e.preventDefault();
        if (!open) return openList();
        const d = e.key === "ArrowDown" ? 1 : -1;
        setActive((a) => Math.min(last, Math.max(0, a + d)));
        return;
      }
      case "Home":
      case "End":
        if (!open) return;
        e.preventDefault();
        setActive(e.key === "Home" ? 0 : last);
        return;
      case "Enter":
      case " ":
        e.preventDefault();
        if (open) choose(active);
        else openList();
        return;
      case "Escape":
        if (open) {
          e.preventDefault();
          e.stopPropagation(); // не закривати модальне вікно
          setOpen(false);
        }
        return;
      case "Tab":
        setOpen(false);
        return;
      default:
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const now = Date.now();
          typed.current.text = (now - typed.current.at > 700 ? "" : typed.current.text) + e.key.toLowerCase();
          typed.current.at = now;
          const i = options.findIndex((o) => o.toLowerCase().startsWith(typed.current.text));
          if (i >= 0) {
            if (open) setActive(i);
            else onChange(options[i]);
          }
        }
    }
  }

  return (
    <div ref={root} className={cx("relative", className)}>
      {name && <input type="hidden" name={name} value={value} />}
      <button
        id={baseId}
        type="button"
        role="combobox"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && active >= 0 ? `${baseId}-opt-${active}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKey}
        className={cx(
          "flex w-full items-center justify-between gap-3 border-0 border-b bg-transparent px-0 py-5 text-left text-base outline-none transition",
          open ? "border-brand" : "border-white/15 focus-visible:border-brand",
        )}
      >
        <span className={cx("truncate", value ? "text-white" : "text-white/60")}>{value || placeholder}</span>
        <ChevronDown className={cx("size-5 shrink-0 transition-transform duration-200", open ? "rotate-180 text-brand" : "text-white/60")} aria-hidden="true" />
      </button>

      <ul
        ref={list}
        id={listId}
        role="listbox"
        aria-label={label}
        tabIndex={-1}
        className={cx(
          "absolute inset-x-0 top-full z-30 mt-1 max-h-64 origin-top overflow-y-auto overscroll-contain border border-white/10 bg-ink-850 py-1 shadow-[0_18px_40px_rgba(0,0,0,0.55)] transition duration-150",
          open ? "visible scale-y-100 opacity-100" : "invisible scale-y-95 opacity-0",
        )}
      >
        {options.map((o, i) => {
          const selected = o === value;
          return (
            <li
              key={o}
              id={`${baseId}-opt-${i}`}
              role="option"
              aria-selected={selected}
              onPointerEnter={() => setActive(i)}
              onClick={() => choose(i)}
              className={cx(
                "relative flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-[15px] transition-colors",
                i === active && "bg-white/[0.06]",
                selected ? "text-brand" : i === active ? "text-white" : "text-white/80",
              )}
            >
              <span aria-hidden="true" className={cx("absolute inset-y-1 left-0 w-[3px] bg-brand transition-opacity", i === active ? "opacity-100" : "opacity-0")} />
              <span className="truncate">{o}</span>
              {selected && <Check className="size-4 shrink-0" aria-hidden="true" />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
