/**
 * Cloudflare Worker: приймає заявки з лендінгів (GitHub Pages) і пересилає в Telegram.
 * Токен бота і chat_id зберігаються як секрети Worker'а (wrangler secret put), не в коді сайту.
 */
import { formatLeadMessage, sendTelegram, validateLead } from "../../../shared/src/server/lead-core";

interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
  /** Дозволені сайти через кому, напр. "https://stepfanit.github.io,http://localhost:3001" */
  ALLOWED_ORIGINS: string;
}

const SITE_NAMES: Record<string, string> = { bobcat: "Bobcat", jcb: "JCB" };

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function json(data: unknown, status: number, origin: string) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get("Origin") ?? "";
    const allowed = (env.ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    if (!allowed.includes(origin)) return new Response("Forbidden", { status: 403 });

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });
    if (request.method !== "POST") return json({ ok: false, error: "Method not allowed" }, 405, origin);

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return json({ ok: false, error: "Некоректний запит" }, 400, origin);
    }

    const result = validateLead(body);
    if (!result.ok) {
      // ботам відповідаємо "успіхом", щоб не підказувати
      if (result.spam) return json({ ok: true }, 200, origin);
      return json({ ok: false, error: result.error }, 422, origin);
    }

    const site = SITE_NAMES[String(body.site)] ?? "Сайт";
    const text = formatLeadMessage(site, result.lead);
    try {
      const sent = await sendTelegram(text, env.TELEGRAM_BOT_TOKEN, env.TELEGRAM_CHAT_ID);
      if (!sent) return json({ ok: false, error: "Сервіс заявок тимчасово недоступний" }, 503, origin);
      return json({ ok: true }, 200, origin);
    } catch (e) {
      console.error("telegram send failed", e);
      return json({ ok: false, error: "Не вдалося надіслати заявку" }, 502, origin);
    }
  },
};
