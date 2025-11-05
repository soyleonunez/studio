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
