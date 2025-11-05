import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";
import { ClipboardIcon, CalendarIcon, BarChartIcon, GearIcon } from "@/components/icons/phosphor";

type Action = {
  id: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  href?: string;
  disabled?: boolean;
};

const actions: Action[] = [
  {
    id: "service",
    label: "Crear Servicio",
    icon: ClipboardIcon,
    href: "/settings",
  },
  {
    id: "calendar",
    label: "Ver Calendario",
    icon: CalendarIcon,
    disabled: true,
  },
  {
    id: "reports",
    label: "Reportes",
    icon: BarChartIcon,
    disabled: true,
  },
  {
    id: "settings",
    label: "Configuración",
    icon: GearIcon,
    href: "/settings",
  },
];

function ActionTile({ action, disabled }: { action: Action; disabled: boolean }) {
  const Icon = action.icon;

  return (
    <div
      className={cn(
        "flex h-full flex-col items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition",
        disabled ? "cursor-not-allowed opacity-70" : "hover:-translate-y-1 hover:shadow-lg",
      )}
    >
      <span
        className={cn(
          "flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-white shadow-inner transition",
          disabled ? "" : "group-hover:scale-105 group-hover:bg-slate-800",
        )}
      >
        <Icon className="h-7 w-7" />
      </span>
      <span className="text-sm font-semibold text-slate-700">{action.label}</span>
      {disabled && <span className="text-xs text-slate-400">Próximamente</span>}
    </div>
  );
}

export function QuickActions() {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {actions.map((action) => {
        if (action.href && !action.disabled) {
          return (
            <Link
              key={action.id}
              href={action.href}
              className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
            >
              <ActionTile action={action} disabled={false} />
            </Link>
          );
        }

        return (
          <button
            key={action.id}
            type="button"
            className="group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2"
            disabled
            aria-disabled="true"
          >
            <ActionTile action={action} disabled={true} />
          </button>
        );
      })}
    </section>
  );
}
