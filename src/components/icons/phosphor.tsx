import { cn } from "@/lib/utils";
import type { JSX, SVGProps } from "react";

function createIcon(path: JSX.Element) {
  return function Icon(props: SVGProps<SVGSVGElement>) {
    const { className, ...rest } = props;
    return (
      <svg
        viewBox="0 0 256 256"
        fill="none"
        stroke="currentColor"
        strokeWidth={16}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("h-5 w-5", className)}
        {...rest}
      >
        {path}
      </svg>
    );
  };
}

export const LightningIcon = createIcon(
  <path d="M144 16L48 144h64l-16 96 96-128h-64z" />
);

export const WalletIcon = createIcon(
  <>
    <rect x={32} y={64} width={192} height={128} rx={24} />
    <path d="M176 128h32" />
    <path d="M176 96h24" />
  </>
);

export const ClipboardIcon = createIcon(
  <>
    <rect x={64} y={40} width={128} height={176} rx={24} />
    <path d="M96 40V24h64v16" />
    <path d="M96 112h64" />
    <path d="M96 152h64" />
  </>
);

export const ChartPieIcon = createIcon(
  <>
    <circle cx={128} cy={128} r={88} />
    <path d="M128 40v88l72 72" />
  </>
);

export const MagnifierIcon = createIcon(
  <>
    <circle cx={112} cy={112} r={72} />
    <line x1={175} y1={175} x2={232} y2={232} />
  </>
);

export const CalendarIcon = createIcon(
  <>
    <rect x={44} y={48} width={168} height={176} rx={20} />
    <line x1={44} y1={96} x2={212} y2={96} />
    <line x1={92} y1={24} x2={92} y2={64} />
    <line x1={164} y1={24} x2={164} y2={64} />
    <rect x={92} y={140} width={36} height={36} rx={6} />
    <rect x={148} y={140} width={36} height={36} rx={6} />
  </>
);

export const BarChartIcon = createIcon(
  <>
    <path d="M40 216h176" />
    <rect x={56} y={120} width={32} height={80} rx={8} />
    <rect x={112} y={72} width={32} height={128} rx={8} />
    <rect x={168} y={152} width={32} height={48} rx={8} />
  </>
);

export const GearIcon = createIcon(
  <>
    <circle cx={128} cy={128} r={36} />
    <circle cx={128} cy={128} r={84} />
    <line x1={128} y1={36} x2={128} y2={68} />
    <line x1={128} y1={188} x2={128} y2={220} />
    <line x1={60} y1={60} x2={82} y2={82} />
    <line x1={174} y1={174} x2={196} y2={196} />
    <line x1={36} y1={128} x2={68} y2={128} />
    <line x1={188} y1={128} x2={220} y2={128} />
    <line x1={60} y1={196} x2={82} y2={174} />
    <line x1={174} y1={82} x2={196} y2={60} />
  </>
);
