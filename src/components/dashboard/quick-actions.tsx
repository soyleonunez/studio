import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ClipboardIcon, LightningIcon, WalletIcon } from "@/components/icons/phosphor";

const actions = [
  {
    id: "new",
    title: "Crear presupuesto",
    description: "Configura un estimado rápido con los datos básicos.",
    href: "/estimates/new",
    icon: ClipboardIcon,
    tone: "from-slate-900 via-slate-800 to-slate-900",
  },
  {
    id: "history",
    title: "Ver historial",
    description: "Consulta el estado de cada presupuesto enviado.",
    href: "/estimates",
    icon: WalletIcon,
    tone: "from-indigo-500 via-indigo-400 to-indigo-600",
  },
  {
    id: "services",
    title: "Catálogo de servicios",
    description: "Actualiza los conceptos que utilizas con mayor frecuencia.",
    href: "/settings",
    icon: LightningIcon,
    tone: "from-sky-500 via-cyan-400 to-sky-500",
  },
] as const;

export function QuickActions() {
  return (
    <Card className="rounded-3xl border border-slate-200/60 bg-white shadow-xl">
      <CardHeader className="flex flex-col gap-2 pb-4">
        <CardTitle className="text-xl font-semibold text-slate-900">Acciones rápidas</CardTitle>
        <CardDescription className="text-slate-500">
          Accede con un toque a los flujos más utilizados por tu equipo.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.id}
              asChild
              className="group relative flex h-full flex-col items-start gap-3 rounded-2xl border border-slate-200/60 bg-slate-50/50 px-5 py-4 text-left text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              variant="secondary"
            >
              <Link href={action.href}>
                <span className="flex items-center gap-3">
                  <span
                    className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${action.tone} text-white shadow-lg`}
                  >
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-lg font-semibold tracking-tight">{action.title}</span>
                </span>
                <span className="mt-3 block text-sm text-slate-500 transition-colors group-hover:text-slate-600">
                  {action.description}
                </span>
              </Link>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
