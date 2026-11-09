/**
 * Перевірка заявки, текст повідомлення і відправка в Telegram.
 * Без залежностей від Node/Next — використовується і в API-роуті Next.js, і в Cloudflare Worker.
 */
import { LEAD_TYPE_LABELS, type LeadPayload } from "../lead-types";

const MIN_FILL_MS = 2500;

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export type ValidatedLead = { ok: true; lead: LeadPayload } | { ok: false; error: string; spam?: boolean };

export function validateLead(body: Record<string, unknown>): ValidatedLead {
  // honeypot: боти заповнюють приховане поле
  if (clean(body.website, 200)) return { ok: false, error: "spam", spam: true };
  const startedAt = Number(body.startedAt);
  if (Number.isFinite(startedAt) && Date.now() - startedAt < MIN_FILL_MS) {
    return { ok: false, error: "spam", spam: true };
  }

  const name = clean(body.name, 80);
  const phone = clean(body.phone, 30);
  const digits = phone.replace(/\D/g, "");
  const type = clean(body.type, 20) as LeadPayload["type"];

  if (name.length < 2) return { ok: false, error: "Вкажіть ім'я" };
  if (digits.length < 10 || digits.length > 13) return { ok: false, error: "Перевірте номер телефону" };
  if (!(type in LEAD_TYPE_LABELS)) return { ok: false, error: "Невідомий тип заявки" };

  return {
    ok: true,
    lead: {
      type,
      name,
      phone,
      model: clean(body.model, 120),
      period: clean(body.period, 60),
      city: clean(body.city, 80),
      comment: clean(body.comment, 1000),
      utm: clean(body.utm, 300),
    },
  };
}

export function formatLeadMessage(site: string, lead: LeadPayload) {
  const typeLabel = LEAD_TYPE_LABELS[lead.type] ?? lead.type;
  const rows: [string, string | undefined][] = [
    ["Тип", typeLabel],
    ["Ім'я", lead.name],
    ["Телефон", lead.phone],
    ["Модель", lead.model],
    ["Термін оренди", lead.period],
    ["Місто", lead.city],
    ["Коментар", lead.comment],
    ["UTM", lead.utm],
  ];
  return [
    `<b>🚜 Нова заявка — ${escapeHtml(site)}</b>`,
    "",
    ...rows.filter(([, v]) => v).map(([k, v]) => `<b>${k}:</b> ${escapeHtml(v!)}`),
  ].join("\n");
}

/** Надсилає повідомлення в усі чати (chatIds — через кому). false — якщо не налаштовано. */
export async function sendTelegram(text: string, token: string | undefined, chatIds: string | undefined) {
  const ids = (chatIds ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!token || ids.length === 0) return false;

  const results = await Promise.all(
    ids.map((chat_id) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id, text, parse_mode: "HTML", disable_web_page_preview: true }),
      }).then((r) => r.ok),
    ),
  );
  if (!results.some(Boolean)) throw new Error("Telegram API error");
  return true;
}
