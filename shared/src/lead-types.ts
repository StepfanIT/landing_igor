export const LEAD_TYPES = [
  { value: "sale", label: "Купівля" },
  { value: "rent", label: "Оренда" },
  { value: "attachment", label: "Навісне" },
  { value: "service", label: "Сервіс" },
] as const;

/** "consult" — коротка форма без вибору типу (блок "Замовити", "Замовити дзвінок") */
export type LeadType = (typeof LEAD_TYPES)[number]["value"] | "consult";

export const LEAD_TYPE_LABELS: Record<LeadType, string> = {
  sale: "Купівля",
  rent: "Оренда",
  attachment: "Навісне",
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
