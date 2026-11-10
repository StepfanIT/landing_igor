import type { IconName } from "./components/Icon";

/** Категорія техніки — визначає підпис і SVG-заглушку, поки немає фото. */
export type MachineKind =
  | "skid-steer"
  | "track-loader"
  | "mini-excavator"
  | "excavator"
  | "telehandler"
  | "backhoe"
  | "wheel-loader"
  | "forklift"
  | "scissor-lift";

export type AttachmentKind = "bucket" | "forks" | "auger" | "breaker" | "broom" | "grapple" | "blade" | "mower" | "snowblower";

export type DealType = "sale" | "rent";

/** Іконки з макета (каска, монети, робітник) + будь-яка з набору Icon */
export type FeatureIconName = "helmet" | "money" | "worker" | IconName;

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  /** Повна назва моделі, напр. "JCB 3CX" */
  name: string;
  kind: MachineKind;
  /** Шлях від /public, напр. "/images/products/3cx.webp". Якщо файлу немає — показується SVG-заглушка. */
  image?: string;
  specs?: Spec[];
  deals: DealType[];
  /** Великий напис у лівому верхньому куті картки (у макеті "-10%") */
  badge?: string;
  /** Текст ціни. Поки цін немає — "Ціна за запитом". */
  priceSale?: string;
  priceRent?: string;
  /** Числова ціна для schema.org (Offer.price) */
  price?: number;
  currency?: "EUR" | "USD" | "UAH";
  /** Сторінка товару в магазині клієнта (Prom) */
  sourceUrl?: string;
}

export interface Attachment {
  id: string;
  name: string;
  kind: AttachmentKind;
  image?: string;
  text: string;
  price?: string;
}

export interface Feature {
  icon: FeatureIconName;
  title: string;
  text: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface NavItem {
  href: string;
  label: string;
}

export interface SiteConfig {
  /** Внутрішній ідентифікатор сайту (для заявок, UTM) */
  id: "bobcat" | "jcb";
  brand: {
    name: string;
    /** Логотип у /public. Якщо немає — рендериться текстовий логотип. */
    logo?: string;
  };
  company: {
    name: string;
    legalName: string;
    phone: string;
    email?: string;
    telegram?: string;
    whatsapp?: string;
    tiktok?: string;
    address: string;
    city: string;
    region: string;
    postalCode: string;
    geo: { lat: number; lng: number };
    /** Пошуковий запит для Google Maps (назва + адреса) — показує саме мітку компанії */
    mapQuery?: string;
    workHours: string;
    /** Для schema.org, напр. ["Mo-Fr 09:00-18:00", "Sa 10:00-15:00"] */
    openingHours: string[];
    foundingYear: number;
    /** Код ЄДРПОУ (показується у футері) */
    edrpou?: string;
  };
  seo: {
    siteUrl: string;
    title: string;
    description: string;
    keywords: string[];
    ogTitle: string;
    ogSubtitle: string;
  };
  nav: NavItem[];
  /** Додаткові блоки, яких немає в макеті (вимкнені за замовчуванням) */
  sections?: { rental?: boolean; faq?: boolean };
  hero: {
    image?: string;
    /** Додаткове затемнення фото (0–1), якщо фото світле і текст погано читається */
    dim?: number;
    /**
     * Ефект "техніка перед текстом" (як у макеті: ківш перекриває плашку "ПРОДАЖ").
     * CSS clip-path polygon у % від блоку героя — ця частина фото малюється поверх тексту (лише десктоп).
     */
    foreground?: string;
    art: MachineKind;
    stats: { icon: "machines" | "delivery"; value: string; label: string }[];
    highlight: { value: string; label: string };
    /** Слово в кольоровій плашці ("Продаж") */
    accent: string;
    /** Великий рядок ("спецтехніки") */
    title: string;
    /** Продовження h1 для пошуковиків (візуально приховане) */
    srTitle: string;
    /** Смужка переваг під першим екраном; `accent` — частина тексту, виділена кольором */
    benefits: { text: string; accent?: string }[];
  };
  about: {
    title: string;
    sinceLabel: string;
    sinceSuffix: string;
    image?: string;
    /** Логотип компанії (кугуар на мапі України) у правій колонці */
    logo?: string;
    paragraphs: string[];
    points: string[];
  };
  featured: {
    /** Перший рядок заголовка ("Телескопічний навантажувач") */
    kicker: string;
    /** Назва моделі; перше слово (бренд) виділяється кольором */
    model: string;
    image?: string;
    art: MachineKind;
    /** 6 пунктів: перші 3 — зліва, решта — справа */
    features: Feature[];
  };
  catalog: {
    title: string;
    products: Product[];
    note: string;
  };
  rental: {
    title: string;
    lead: string;
    terms: string[];
    cta: string;
    note: string;
  };
  attachments: {
    title: string;
    items: Attachment[];
  };
  order: {
    title: string;
    formTitle: string;
    /** Короткий текст під заголовком */
    text: string;
  };
  bigStat: {
    value: string;
    label: string;
    quote: string;
    text: string;
    image?: string;
  };
  partner: {
    name: string;
    url: string;
    label: string;
    title: string;
    text: string;
    models: string[];
    cta: string;
    image?: string;
    art: MachineKind;
    colors?: { bg: string; fg: string; accent: string; accentFg: string };
    /** Колір кнопки "Переглянути весь асортимент" — бренд сайту-партнера, щоб кнопка виділялась */
    ctaColor?: { bg: string; fg: string };
    /** Техніка з сайту-партнера для слайдера "Техніка <партнер>" */
    products?: Product[];
  };
  faq: {
    title: string;
    items: Faq[];
  };
  contacts: {
    title: string;
  };
  footer: {
    tagline: string;
    disclaimer: string;
  };
}
