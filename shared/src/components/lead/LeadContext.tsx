"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import type { DealType } from "../../types";
import type { LeadPrefill } from "../../lead-types";
import { LeadForm } from "./LeadForm";

export interface LeadData {
  siteId: string;
  phone: string;
  products: { name: string; deals: DealType[] }[];
  attachments: string[];
}

interface Ctx extends LeadData {
  open: (prefill?: LeadPrefill) => void;
}

const LeadCtx = createContext<Ctx | null>(null);

export function useLead() {
  const ctx = useContext(LeadCtx);
  if (!ctx) throw new Error("useLead must be used inside <LeadProvider>");
  return ctx;
}

export function LeadProvider({ children, data }: { children: ReactNode; data: LeadData }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [prefill, setPrefill] = useState<LeadPrefill | undefined>();
  const [isOpen, setIsOpen] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const open = useCallback((p?: LeadPrefill) => {
    setPrefill(p);
    setFormKey((k) => k + 1);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (isOpen && !d.open) d.showModal();
    if (!isOpen && d.open) d.close();
    document.documentElement.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const value = useMemo(() => ({ ...data, open }), [data, open]);

  return (
    <LeadCtx.Provider value={value}>
      {children}
      <dialog
        ref={dialogRef}
        onClose={close}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        aria-labelledby="lead-modal-title"
        className="m-auto w-[min(100%-2rem,34rem)] max-h-[calc(100dvh-2rem)] overflow-y-auto border border-white/10 bg-page p-0 text-white shadow-2xl backdrop:bg-black/80 backdrop:backdrop-blur-sm open:animate-fade-up"
      >
        <div className="relative px-6 py-8 sm:px-[30px] sm:py-[50px]">
          <div className="absolute inset-x-0 top-0 h-1 bg-brand" />
          <button
            type="button"
            onClick={close}
            className="absolute right-3 top-3 grid size-10 place-items-center text-white/60 transition hover:text-brand"
            aria-label="Закрити"
          >
            <X className="size-6" />
          </button>
          <h2 id="lead-modal-title" className="text-center font-display text-h4 font-semibold uppercase">
            {prefill?.model ? prefill.model : "On-line заявка"}
          </h2>
          <p className="mt-2 text-center text-sm text-white/60">Передзвонимо, підберемо техніку під ваші задачі та розрахуємо вартість.</p>
          <div className="mt-6">{isOpen && <LeadForm key={formKey} prefill={prefill} onDone={close} />}</div>
        </div>
      </dialog>
    </LeadCtx.Provider>
  );
}

/** Кнопка, яка відкриває модальне вікно заявки (з передзаповненими полями) */
export function LeadButton({
  prefill,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  prefill?: LeadPrefill;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  const { open } = useLead();
  return (
    <button type="button" className={className} onClick={() => open(prefill)} aria-label={ariaLabel} aria-haspopup="dialog">
      {children}
    </button>
  );
}
