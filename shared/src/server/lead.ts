import { LEAD_TYPE_LABELS, type LeadPayload } from "../lead-types";

const MIN_FILL_MS = 2500;

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

type Validated = { ok: true; lead: LeadPayload } | { ok: false; error: string; spam?: boolean };

function validate(body: Record<string, unknown>): Validated {
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

function formatMessage(site: string, lead: LeadPayload) {
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

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_ID ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!token || chatIds.length === 0) return false;

  const results = await Promise.all(
    chatIds.map((chat_id) =>
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

/** Фабрика для app/api/lead/route.ts кожного сайту */
export function createLeadHandler(siteName: string) {
  return async function POST(request: Request) {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return Response.json({ ok: false, error: "Некоректний запит" }, { status: 400 });
    }

    const result = validate(body);
    if (!result.ok) {
      // ботам відповідаємо "успіхом", щоб не підказувати
      if (result.spam) return Response.json({ ok: true });
      return Response.json({ ok: false, error: result.error }, { status: 422 });
    }

    const text = formatMessage(siteName, result.lead);
    try {
      const sent = await sendTelegram(text);
      if (!sent) {
        if (process.env.NODE_ENV !== "production") {
          console.info("[lead] TELEGRAM_* не налаштовано, заявка:\n" + text);
          return Response.json({ ok: true });
        }
        console.error("[lead] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID не задані — заявка втрачена:\n" + text);
        return Response.json({ ok: false, error: "Сервіс заявок тимчасово недоступний" }, { status: 503 });
      }
      return Response.json({ ok: true });
    } catch (e) {
      console.error("[lead] send failed", e);
      return Response.json({ ok: false, error: "Не вдалося надіслати заявку" }, { status: 502 });
    }
  };
}
