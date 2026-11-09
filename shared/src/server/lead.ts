import { formatLeadMessage, sendTelegram, validateLead } from "./lead-core";

/** Фабрика для app/api/lead/route.server.ts кожного сайту (серверний деплой: Vercel / власний сервер) */
export function createLeadHandler(siteName: string) {
  return async function POST(request: Request) {
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      return Response.json({ ok: false, error: "Некоректний запит" }, { status: 400 });
    }

    const result = validateLead(body);
    if (!result.ok) {
      // ботам відповідаємо "успіхом", щоб не підказувати
      if (result.spam) return Response.json({ ok: true });
      return Response.json({ ok: false, error: result.error }, { status: 422 });
    }

    const text = formatLeadMessage(siteName, result.lead);
    try {
      const sent = await sendTelegram(text, process.env.TELEGRAM_BOT_TOKEN, process.env.TELEGRAM_CHAT_ID);
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
