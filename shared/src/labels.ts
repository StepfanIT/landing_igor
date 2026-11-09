import type { MachineKind } from "./types";

export const KIND_LABELS: Record<MachineKind, string> = {
  "skid-steer": "Міні-навантажувач",
  "track-loader": "Гусеничний міні-навантажувач",
  "mini-excavator": "Міні-екскаватор",
  excavator: "Екскаватор",
  telehandler: "Телескопічний навантажувач",
  backhoe: "Екскаватор-навантажувач",
  "wheel-loader": "Фронтальний навантажувач",
  forklift: "Вилковий навантажувач",
  "scissor-lift": "Ножичний підйомник",
};

export const DEFAULT_PRICE = "Ціна за запитом";
