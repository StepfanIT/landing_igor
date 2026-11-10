/** Типи заявки у формі (оренди немає — компанія лише продає) */
export const LEAD_TYPES = [
  { value: "sale", label: "Купівля" },
  { value: "attachment", label: "Навісне" },
  { value: "parts", label: "Запчастини" },
  { value: "service", label: "Сервіс" },
] as const;

/** "consult" — коротка форма без вибору типу; "rent" — лишається для сумісності конфігів */
export type LeadType = (typeof LEAD_TYPES)[number]["value"] | "consult" | "rent";

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  sale: "Купівля",
  rent: "Оренда",
  attachment: "Навісне",
  parts: "Запчастини",
  service: "Сервіс",
  consult: "Консультація / зворотний дзвінок",
};

export const RENT_PERIODS = ["1 зміна", "2–6 днів", "1–3 тижні", "Місяць", "Більше місяця"];

export interface LeadPayload {
  type: LeadType;
  name: string;
  phone: string;
  model?: string;
  period?: string;
  city?: string;
  comment?: string;
  utm?: string;
}

export interface LeadPrefill {
  type?: LeadType;
  model?: string;
}
