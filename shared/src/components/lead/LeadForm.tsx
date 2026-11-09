"use client";

import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { withBase } from "../../base-path";
import { LEAD_TYPES, RENT_PERIODS, type LeadPrefill, type LeadType } from "../../lead-types";
import { buttonClass, cx, telHref } from "../ui";
import { useLead } from "./LeadContext";

/** +380 (XX) XXX-XX-XX */
export function formatPhone(input: string) {
  let d = input.replace(/\D/g, "");
  if (!d) return "";
  if (d.startsWith("0")) d = "38" + d;
  else if (d.startsWith("80")) d = "3" + d;
  else if (!d.startsWith("380")) d = "380" + d.replace(/^3?8?/, "");
  d = d.slice(0, 12);
  const p = d.slice(3);
  let out = "+380";
  if (p.length) out += " (" + p.slice(0, 2);
  if (p.length > 2) out += ") " + p.slice(2, 5);
  if (p.length > 5) out += "-" + p.slice(5, 7);
  if (p.length > 7) out += "-" + p.slice(7, 9);
  return out;
}

/* поле як у макеті: прозоре, лише нижня лінія */
const field =
  "w-full border-0 border-b border-white/15 bg-transparent px-0 py-5 text-base text-white placeholder:text-white/60 outline-none transition focus:border-brand";
const selectCls = cx(field, "appearance-none bg-[length:16px] bg-[right_0_center] bg-no-repeat pr-8 [&_option]:bg-page [&_option]:text-white");
const chevron = {
  backgroundImage:
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23ffffff99' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
};

type Status = "idle" | "sending" | "ok" | "error";

/** Куди надсилати заявку: власний API-роут (Vercel/сервер) або зовнішній сервіс для статичного хостингу (GitHub Pages) */
const LEAD_ENDPOINT = process.env.NEXT_PUBLIC_LEAD_ENDPOINT || withBase("/api/lead");

export function LeadForm({
  prefill,
  onDone,
  variant = "full",
  submitLabel = "Надіслати запит",
}: {
  prefill?: LeadPrefill;
  onDone?: () => void;
  /** full — модальне вікно (тип заявки, модель, коментар); mini — лише ім'я + телефон (блок "Замовити") */
  variant?: "full" | "mini";
  submitLabel?: string;
}) {
  const { products, attachments, phone: companyPhone, siteId } = useLead();
  const uid = useId();
  const startedAt = useRef(Date.now());
  const full = variant === "full";

  const [type, setType] = useState<LeadType>(prefill?.type ?? (full ? "sale" : "consult"));
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [model, setModel] = useState(prefill?.model ?? "");
  const [period, setPeriod] = useState("");
  const [comment, setComment] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const modelOptions = useMemo(() => {
    if (type === "attachment") return attachments;
    if (type === "service" || type === "consult") return products.map((p) => p.name);
    return products.filter((p) => p.deals.includes(type)).map((p) => p.name);
  }, [type, products, attachments]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Вкажіть, будь ласка, ім'я");
    if (phone.replace(/\D/g, "").length !== 12) return setError("Вкажіть номер у форматі +380 (XX) XXX-XX-XX");
    if (!agree) return setError("Підтвердіть згоду на обробку персональних даних");
    setError("");
    setStatus("sending");

    const fd = new FormData(e.currentTarget);
    const utm = [...new URLSearchParams(window.location.search)]
      .filter(([k]) => k.startsWith("utm_"))
      .map(([k, v]) => `${k}=${v}`)
      .join("&");

    try {
      const res = await fetch(LEAD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          site: siteId,
          type,
          name,
          phone,
          model,
          period: type === "rent" ? period : "",
          comment,
          website: fd.get("website"),
          startedAt: startedAt.current,
          utm,
        }),
      });
      // статичний хостинг без підключеного сервісу заявок (GitHub Pages) відповідає 404/405
      if (res.status === 404 || res.status === 405) throw new Error("Онлайн-заявки ще не підключені.");
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || json.ok === false) throw new Error(json.error || "Не вдалося надіслати заявку.");
      setStatus("ok");
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: "lead_submit", lead_type: type, lead_model: model });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Помилка відправки");
    }
  }

  if (status === "ok") {
    return (
      <div className="flex flex-col items-center py-6 text-center" role="status">
        <CheckCircle2 className="size-14 text-brand" />
        <p className="mt-4 font-display text-2xl font-semibold uppercase">Заявку прийнято!</p>
        <p className="mt-2 max-w-sm text-white/60">Менеджер зв&apos;яжеться з вами найближчим часом. Якщо питання термінове — телефонуйте:</p>
        <a href={telHref(companyPhone)} className="mt-3 font-display text-lg font-semibold text-brand hover:underline">
          {companyPhone}
        </a>
        {onDone && (
          <button type="button" onClick={onDone} className={buttonClass("outline", "md", "mt-6")}>
            Закрити
          </button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      {full && (
        <fieldset className="mb-2">
          <legend className="mb-3 text-sm uppercase text-white/60">Що вас цікавить?</legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {LEAD_TYPES.map((t) => (
              <label
                key={t.value}
                className={cx(
                  "flex h-11 cursor-pointer items-center justify-center border text-sm font-semibold uppercase transition",
                  type === t.value ? "border-brand bg-brand text-on-brand" : "border-white/15 text-white/75 hover:border-white/40",
                )}
              >
                <input
                  type="radio"
                  name="type"
                  value={t.value}
                  checked={type === t.value}
                  onChange={() => {
                    setType(t.value);
                    setModel("");
                  }}
                  className="sr-only"
                />
                {t.label}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <label htmlFor={`${uid}-name`} className="sr-only">
        Ваше ім&apos;я
      </label>
      <input
        id={`${uid}-name`}
        name="name"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ваше ім'я"
        className={field}
      />
      <label htmlFor={`${uid}-phone`} className="sr-only">
        Телефон
      </label>
      <input
        id={`${uid}-phone`}
        name="phone"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        required
        value={phone}
        onChange={(e) => setPhone(formatPhone(e.target.value))}
        onFocus={() => !phone && setPhone("+380")}
        placeholder="Телефон *"
        className={field}
      />

      {full && (
        <>
          <label htmlFor={`${uid}-model`} className="sr-only">
            Модель
          </label>
          <select id={`${uid}-model`} name="model" value={model} onChange={(e) => setModel(e.target.value)} className={selectCls} style={chevron}>
            <option value="">{type === "attachment" ? "Обладнання — потрібна консультація" : "Модель — потрібна консультація"}</option>
            {model && !modelOptions.includes(model) && <option value={model}>{model}</option>}
            {modelOptions.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          {type === "rent" && (
            <>
              <label htmlFor={`${uid}-period`} className="sr-only">
                Термін оренди
              </label>
              <select id={`${uid}-period`} name="period" value={period} onChange={(e) => setPeriod(e.target.value)} className={selectCls} style={chevron}>
                <option value="">Термін оренди — ще не знаю</option>
                {RENT_PERIODS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </>
          )}
          <label htmlFor={`${uid}-comment`} className="sr-only">
            Коментар
          </label>
          <textarea
            id={`${uid}-comment`}
            name="comment"
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Коментар: тип робіт, місто, терміни"
            className={cx(field, "resize-none")}
          />
        </>
      )}

      {/* honeypot — приховане від людей поле */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-snug text-white">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 size-[13px] shrink-0 cursor-pointer accent-[var(--color-brand)]"
        />
        <span>
          Я погоджуюсь з <span className="text-brand underline underline-offset-2">обробкою персональних даних</span>*
        </span>
      </label>

      {error && (
        <p role="alert" className="mt-4 border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
          {status === "error" && (
            <>
              {" "}
              Або зателефонуйте:{" "}
              <a href={telHref(companyPhone)} className="font-semibold underline">
                {companyPhone}
              </a>
            </>
          )}
        </p>
      )}

      <button type="submit" disabled={status === "sending"} className={buttonClass("brand", "lg", "mt-10 w-full")}>
        {status === "sending" && <Loader2 className="size-5 animate-spin" />}
        {status === "sending" ? "Надсилаємо…" : submitLabel}
      </button>
    </form>
  );
}
