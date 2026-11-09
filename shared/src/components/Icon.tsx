import {
  ArrowRight,
  Award,
  BadgeCheck,
  Building2,
  CalendarClock,
  Check,
  ClipboardCheck,
  Clock,
  Cog,
  Coins,
  FileText,
  Fuel,
  Gamepad2,
  Gauge,
  Handshake,
  Headset,
  HardHat,
  Layers,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Shapes,
  Truck,
  UserCog,
  Weight,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { SVGProps } from "react";

function Telegram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.94 4.3a1.2 1.2 0 0 0-1.62-1.3L2.86 9.73c-1.12.44-1.1 2.04.03 2.45l4.3 1.55 1.66 5.33c.22.71 1.1.95 1.65.45l2.48-2.27 4.62 3.4c.7.51 1.7.12 1.87-.73L21.94 4.3Zm-4.06 3.5-7.6 6.9-.3 3.07-1.27-4.08 9.17-5.89Z" />
    </svg>
  );
}

const icons = {
  arrow: ArrowRight,
  award: Award,
  badge: BadgeCheck,
  building: Building2,
  calendar: CalendarClock,
  check: Check,
  clipboard: ClipboardCheck,
  clock: Clock,
  cog: Cog,
  coins: Coins,
  doc: FileText,
  fuel: Fuel,
  control: Gamepad2,
  gauge: Gauge,
  handshake: Handshake,
  headset: Headset,
  helmet: HardHat,
  layers: Layers,
  mail: Mail,
  pin: MapPin,
  phone: Phone,
  shield: ShieldCheck,
  shapes: Shapes,
  truck: Truck,
  operator: UserCog,
  weight: Weight,
  wrench: Wrench,
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof icons | "telegram";

export function Icon({ name, className }: { name: IconName; className?: string }) {
  if (name === "telegram") return <Telegram className={className} />;
  const Cmp = icons[name];
  return <Cmp className={className} strokeWidth={2} aria-hidden="true" />;
}
