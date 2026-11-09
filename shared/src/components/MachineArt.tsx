import type { ReactNode } from "react";
import type { AttachmentKind, MachineKind } from "../types";

/**
 * Стилізовані SVG-ілюстрації техніки. Використовуються як заглушки,
 * поки в /public/images немає реальних фото. Кольори беруться з CSS-змінних
 * --color-brand / --color-brand-deep, тому підлаштовуються під бренд сайту.
 */

const BRAND = "var(--color-brand)";
const DEEP = "var(--color-brand-deep)";
const DARK = "#1b1c1f";
const STEEL = "#7b818a";
const STEEL_D = "#565b63";
const GLASS = "#bcd3e2";

function Wheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill={DARK} />
      <circle cx={cx} cy={cy} r={r * 0.78} fill="none" stroke="#2c2e33" strokeWidth={r * 0.18} strokeDasharray="4 4" />
      <circle cx={cx} cy={cy} r={r * 0.45} fill={STEEL} />
      <circle cx={cx} cy={cy} r={r * 0.18} fill={STEEL_D} />
    </g>
  );
}

function Track({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  const rollers = Math.max(3, Math.floor((w - h) / 26));
  const step = (w - h) / rollers;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={DARK} />
      <rect x={x + 4} y={y + 4} width={w - 8} height={h - 8} rx={(h - 8) / 2} fill="none" stroke="#2c2e33" strokeWidth={3} strokeDasharray="5 4" />
      <circle cx={x + h / 2} cy={y + h / 2} r={h * 0.32} fill={STEEL} />
      <circle cx={x + w - h / 2} cy={y + h / 2} r={h * 0.36} fill={STEEL} />
      {Array.from({ length: rollers - 1 }, (_, i) => (
        <circle key={i} cx={x + h / 2 + step * (i + 1)} cy={y + h * 0.62} r={h * 0.16} fill={STEEL_D} />
      ))}
    </g>
  );
}

function Cab({ x1, x2, top, bottom }: { x1: number; x2: number; top: number; bottom: number }) {
  return (
    <g>
      <path d={`M${x1} ${bottom} L${x1 + 5} ${top + 6} Q${x1 + 6} ${top} ${x1 + 12} ${top} L${x2 - 12} ${top} Q${x2 - 6} ${top} ${x2 - 5} ${top + 6} L${x2} ${bottom} Z`} fill={DARK} />
      <path d={`M${x1 + 9} ${bottom - 4} L${x1 + 13} ${top + 10} L${x2 - 13} ${top + 10} L${x2 - 9} ${bottom - 4} Z`} fill={GLASS} opacity={0.85} />
      <path d={`M${x1 + 16} ${top + 14} L${x1 + 30} ${top + 14} L${x1 + 18} ${bottom - 14} Z`} fill="#fff" opacity={0.35} />
      <rect x={x1 - 2} y={top - 6} width={x2 - x1 + 4} height={8} rx={3} fill={BRAND} />
    </g>
  );
}

function Shadow({ cx = 160, rx = 140 }: { cx?: number; rx?: number }) {
  return <ellipse cx={cx} cy={188} rx={rx} ry={7} fill="#000" opacity={0.28} />;
}

function SkidSteer({ tracked }: { tracked?: boolean }) {
  return (
    <>
      <Shadow />
      <rect x={190} y={78} width={58} height={74} rx={8} fill={BRAND} />
      <rect x={82} y={118} width={166} height={36} rx={6} fill={BRAND} />
      <rect x={244} y={88} width={6} height={12} rx={2} fill="#e53935" />
      <Cab x1={100} x2={196} top={48} bottom={120} />
      <line x1={204} y1={122} x2={146} y2={86} stroke={STEEL} strokeWidth={7} strokeLinecap="round" />
      <path d="M246 94 L240 74 L160 62 Q140 60 128 72 L70 126 L82 136 L136 88 Q146 79 160 81 L234 94 Z" fill={DEEP} />
      <path d="M20 168 L82 168 L90 112 L62 104 Q38 118 22 152 Z" fill={STEEL} />
      <path d="M34 160 L76 160 L82 118 L64 112 Q46 124 36 150 Z" fill={STEEL_D} />
      <rect x={14} y={165} width={70} height={6} rx={2} fill={DARK} />
      {tracked ? (
        <Track x={84} y={142} w={160} h={40} />
      ) : (
        <>
          <rect x={86} y={146} width={158} height={12} fill={DARK} />
          <Wheel cx={118} cy={160} r={26} />
          <Wheel cx={214} cy={160} r={26} />
        </>
      )}
    </>
  );
}

function Excavator({ blade = true }: { blade?: boolean }) {
  return (
    <>
      <Shadow cx={170} rx={150} />
      <Track x={98} y={150} w={156} h={32} />
      {blade && (
        <>
          <line x1={240} y1={164} x2={262} y2={160} stroke={STEEL_D} strokeWidth={7} />
          <path d="M256 146 L272 144 L276 184 L254 184 Z" fill={BRAND} />
        </>
      )}
      <rect x={120} y={140} width={112} height={12} fill={STEEL_D} />
      <path d="M116 142 L116 112 Q116 102 126 102 L238 102 Q252 102 252 116 L252 142 Z" fill={BRAND} />
      <path d="M228 102 L250 102 Q264 104 264 122 L264 142 L236 142 Z" fill={DEEP} />
      <rect x={200} y={112} width={30} height={4} rx={2} fill={DARK} opacity={0.5} />
      <rect x={200} y={120} width={30} height={4} rx={2} fill={DARK} opacity={0.5} />
      <Cab x1={124} x2={192} top={44} bottom={104} />
      <line x1={140} y1={112} x2={96} y2={66} stroke={STEEL} strokeWidth={6} strokeLinecap="round" />
      <path d="M124 128 L72 40" stroke={DEEP} strokeWidth={18} strokeLinecap="round" />
      <path d="M72 40 L40 128" stroke={STEEL_D} strokeWidth={12} strokeLinecap="round" />
      <line x1={86} y1={46} x2={52} y2={104} stroke={STEEL} strokeWidth={5} strokeLinecap="round" />
      <path d="M28 120 L56 126 L52 160 Q42 168 26 160 Z" fill={STEEL} />
      <path d="M26 160 L20 168 L30 166 Z" fill={DARK} />
    </>
  );
}

function Telehandler() {
  return (
    <>
      <Shadow cx={165} rx={150} />
      <rect x={58} y={118} width={222} height={30} rx={8} fill={BRAND} />
      <rect x={200} y={96} width={80} height={28} rx={6} fill={BRAND} />
      <rect x={236} y={104} width={36} height={4} rx={2} fill={DARK} opacity={0.5} />
      <rect x={236} y={112} width={36} height={4} rx={2} fill={DARK} opacity={0.5} />
      <Cab x1={112} x2={172} top={50} bottom={120} />
      <line x1={160} y1={120} x2={138} y2={78} stroke={STEEL} strokeWidth={8} strokeLinecap="round" />
      <path d="M262 98 L98 66" stroke={DEEP} strokeWidth={20} strokeLinecap="round" />
      <path d="M104 67 L40 56" stroke={STEEL} strokeWidth={13} strokeLinecap="round" />
      <rect x={26} y={48} width={10} height={52} rx={2} fill={DARK} />
      <rect x={4} y={95} width={32} height={6} rx={1} fill={DARK} />
      <path d="M62 142 A32 32 0 0 1 122 142" fill="none" stroke={DARK} strokeWidth={6} />
      <path d="M208 142 A32 32 0 0 1 268 142" fill="none" stroke={DARK} strokeWidth={6} />
      <Wheel cx={92} cy={158} r={27} />
      <Wheel cx={238} cy={158} r={27} />
    </>
  );
}

function Backhoe() {
  return (
    <>
      <Shadow cx={160} rx={150} />
      <rect x={60} y={120} width={198} height={26} rx={6} fill={BRAND} />
      <path d="M62 124 L62 100 Q62 92 72 92 L134 92 L134 124 Z" fill={BRAND} />
      <rect x={56} y={98} width={8} height={22} rx={2} fill={DARK} />
      <rect x={96} y={78} width={6} height={16} rx={2} fill={DARK} />
      <Cab x1={136} x2={208} top={42} bottom={122} />
      <path d="M150 104 L58 128" stroke={DEEP} strokeWidth={11} strokeLinecap="round" />
      <path d="M8 170 L60 170 L62 116 L36 108 Q14 128 8 160 Z" fill={STEEL} />
      <path d="M18 162 L54 162 L56 122 L40 118 Q24 132 18 154 Z" fill={STEEL_D} />
      <rect x={4} y={167} width={60} height={6} rx={2} fill={DARK} />
      <path d="M246 132 L262 132 L272 180 L254 180 Z" fill={DARK} />
      <rect x={250} y={178} width={26} height={6} rx={2} fill={STEEL_D} />
      <path d="M252 120 Q262 62 290 46" fill="none" stroke={DEEP} strokeWidth={15} strokeLinecap="round" />
      <path d="M290 46 L304 136" stroke={STEEL_D} strokeWidth={11} strokeLinecap="round" />
      <path d="M294 132 L316 136 L314 164 Q304 172 292 162 Z" fill={STEEL} />
      <Wheel cx={92} cy={164} r={22} />
      <Wheel cx={212} cy={154} r={32} />
    </>
  );
}

function WheelLoader() {
  return (
    <>
      <Shadow cx={160} rx={150} />
      <rect x={82} y={118} width={80} height={28} rx={6} fill={BRAND} />
      <path d="M164 148 L164 108 Q164 100 172 100 L282 100 Q294 100 294 112 L294 148 Z" fill={BRAND} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={252} y={108 + i * 8} width={34} height={4} rx={2} fill={DARK} opacity={0.5} />
      ))}
      <rect x={156} y={118} width={12} height={26} fill={DARK} />
      <Cab x1={176} x2={242} top={34} bottom={102} />
      <path d="M170 110 L66 126" stroke={DEEP} strokeWidth={13} strokeLinecap="round" />
      <path d="M176 92 L118 98 L72 106" fill="none" stroke={STEEL} strokeWidth={6} strokeLinecap="round" />
      <path d="M6 172 L72 172 L76 98 L44 90 Q14 118 6 162 Z" fill={STEEL} />
      <path d="M18 164 L66 164 L68 106 L48 100 Q26 124 18 156 Z" fill={STEEL_D} />
      <rect x={2} y={169} width={72} height={6} rx={2} fill={DARK} />
      <Wheel cx={108} cy={156} r={30} />
      <Wheel cx={238} cy={156} r={30} />
    </>
  );
}

function Forklift() {
  return (
    <>
      <Shadow cx={150} rx={130} />
      <path d="M90 152 L90 120 L158 120 L170 100 L248 100 Q262 100 262 114 L262 152 Z" fill={BRAND} />
      <rect x={234} y={92} width={34} height={60} rx={6} fill={DEEP} />
      <rect x={164} y={80} width={26} height={22} rx={3} fill={DARK} />
      <line x1={122} y1={120} x2={130} y2={50} stroke={DARK} strokeWidth={6} />
      <line x1={204} y1={100} x2={200} y2={50} stroke={DARK} strokeWidth={6} />
      <rect x={118} y={44} width={90} height={8} rx={3} fill={DARK} />
      <rect x={68} y={26} width={16} height={134} rx={2} fill={STEEL_D} />
      <rect x={74} y={36} width={6} height={124} fill={STEEL} />
      <rect x={54} y={118} width={18} height={42} rx={2} fill={DARK} />
      <rect x={8} y={154} width={64} height={6} rx={1} fill={DARK} />
      <Wheel cx={112} cy={162} r={24} />
      <Wheel cx={222} cy={164} r={20} />
    </>
  );
}

function ScissorLift() {
  return (
    <>
      <Shadow cx={160} rx={120} />
      <rect x={58} y={22} width={204} height={10} rx={2} fill={DARK} />
      <rect x={58} y={2} width={204} height={4} rx={2} fill={STEEL} />
      {[62, 110, 160, 210, 258].map((x) => (
        <rect key={x} x={x - 2} y={2} width={4} height={22} fill={STEEL} />
      ))}
      {[
        [32, 72],
        [72, 112],
        [112, 150],
      ].map(([a, b]) => (
        <g key={a}>
          <line x1={84} y1={a} x2={236} y2={b} stroke={DEEP} strokeWidth={8} strokeLinecap="round" />
          <line x1={84} y1={b} x2={236} y2={a} stroke={BRAND} strokeWidth={8} strokeLinecap="round" />
        </g>
      ))}
      <rect x={66} y={148} width={188} height={24} rx={4} fill={BRAND} />
      <rect x={84} y={156} width={60} height={4} rx={2} fill={DARK} opacity={0.5} />
      <Wheel cx={94} cy={176} r={12} />
      <Wheel cx={226} cy={176} r={12} />
    </>
  );
}

const machines: Record<MachineKind, () => ReactNode> = {
  "skid-steer": () => <SkidSteer />,
  "track-loader": () => <SkidSteer tracked />,
  "mini-excavator": () => <Excavator />,
  excavator: () => <Excavator blade={false} />,
  telehandler: () => <Telehandler />,
  backhoe: () => <Backhoe />,
  "wheel-loader": () => <WheelLoader />,
  forklift: () => <Forklift />,
  "scissor-lift": () => <ScissorLift />,
};

export function MachineArt({ kind, className, mirror }: { kind: MachineKind; className?: string; mirror?: boolean }) {
  return (
    <svg viewBox="0 0 320 200" className={className} role="presentation" aria-hidden="true">
      <g transform={mirror ? "translate(320 0) scale(-1 1)" : undefined}>{machines[kind]()}</g>
    </svg>
  );
}

const attachments: Record<Exclude<AttachmentKind, "blade" | "mower" | "snowblower">, () => ReactNode> = {
  bucket: () => (
    <>
      <path d="M22 38 L178 38 L168 108 L32 108 Z" fill={STEEL} />
      <path d="M36 50 L164 50 L157 98 L43 98 Z" fill={STEEL_D} />
      <rect x={18} y={32} width={164} height={8} rx={3} fill={DARK} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M${40 + i * 24} 108 L${52 + i * 24} 108 L${46 + i * 24} 124 Z`} fill={DARK} />
      ))}
    </>
  ),
  forks: () => (
    <>
      <rect x={124} y={14} width={16} height={104} rx={3} fill={DARK} />
      <rect x={136} y={24} width={22} height={10} rx={2} fill={BRAND} />
      <rect x={136} y={90} width={22} height={10} rx={2} fill={BRAND} />
      <path d="M126 104 L30 104 L24 114 L140 114 L140 18 L130 18 Z" fill={STEEL} />
      <path d="M126 116 L44 116 L40 124 L138 124 L138 30 L132 30 Z" fill={STEEL_D} />
    </>
  ),
  auger: () => (
    <>
      <rect x={76} y={6} width={48} height={30} rx={5} fill={BRAND} />
      <rect x={70} y={4} width={60} height={8} rx={3} fill={DARK} />
      <rect x={95} y={36} width={10} height={86} fill={STEEL_D} />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path key={i} d={`M66 ${52 + i * 13} L134 ${42 + i * 13} L134 ${48 + i * 13} L66 ${58 + i * 13} Z`} fill={STEEL} />
      ))}
      <path d="M92 122 L108 122 L100 136 Z" fill={DARK} />
    </>
  ),
  breaker: () => (
    <>
      <rect x={70} y={4} width={60} height={12} rx={3} fill={DARK} />
      <rect x={76} y={14} width={48} height={74} rx={6} fill={BRAND} />
      <rect x={84} y={26} width={32} height={4} rx={2} fill={DARK} opacity={0.4} />
      <rect x={84} y={34} width={32} height={4} rx={2} fill={DARK} opacity={0.4} />
      <rect x={84} y={88} width={32} height={16} rx={2} fill={DARK} />
      <path d="M93 104 L107 104 L103 134 L97 134 Z" fill={STEEL} />
    </>
  ),
  broom: () => (
    <>
      <path d="M26 66 Q100 8 174 66 L174 80 L26 80 Z" fill={BRAND} />
      <rect x={30} y={72} width={140} height={48} rx={24} fill={DARK} />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={42 + i * 10.5} y1={78} x2={38 + i * 10.5} y2={124} stroke={STEEL_D} strokeWidth={3} />
      ))}
      <rect x={90} y={30} width={20} height={20} rx={4} fill={DARK} />
    </>
  ),
  grapple: () => (
    <>
      <path d="M16 116 L150 116 L158 58 L62 52 Q28 76 16 108 Z" fill={STEEL} />
      <path d="M30 108 L142 108 L148 66 L66 62 Q40 82 30 102 Z" fill={STEEL_D} />
      <rect x={150} y={44} width={14} height={76} rx={3} fill={DARK} />
      <path d="M158 44 Q120 6 50 26 L34 58" fill="none" stroke={BRAND} strokeWidth={10} strokeLinecap="round" />
      <path d="M50 26 L40 64 M78 18 L70 54 M106 16 L100 50" stroke={DARK} strokeWidth={6} strokeLinecap="round" />
    </>
  ),
};

// для видів без власної ілюстрації — найближча за формою
const ART_ALIASES: Partial<Record<AttachmentKind, AttachmentKind>> = { blade: "bucket", mower: "broom", snowblower: "broom" };

export function AttachmentArt({ kind, className }: { kind: AttachmentKind; className?: string }) {
  return (
    <svg viewBox="0 0 200 140" className={className} role="presentation" aria-hidden="true">
      {attachments[(ART_ALIASES[kind] ?? kind) as keyof typeof attachments]()}
    </svg>
  );
}
