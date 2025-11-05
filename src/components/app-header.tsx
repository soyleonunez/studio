import Link from 'next/link';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MagnifierIcon } from '@/components/icons/phosphor';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

type AppHeaderProps = {
  companyName?: string | null;
};

export function AppHeader({ companyName }: AppHeaderProps) {
  const headline = companyName ? `¡Bienvenido, ${companyName}!` : '¡Saludos!';
  const subline = 'Inicia tu día con la información más reciente.';
  const initials = companyName?.slice(0, 2).toUpperCase() ?? 'PP';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="flex h-20 flex-col justify-center gap-4 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="sm:hidden" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-500">{headline}</p>
            <h1 className="text-xl font-semibold text-slate-900">{subline}</h1>
          </div>
        </div>
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          <div className="relative w-full max-w-xl">
            <MagnifierIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              type="search"
              placeholder="Buscar pacientes, presupuestos o servicios"
              className="h-12 w-full rounded-full border border-slate-200 bg-white pl-12 text-sm text-slate-700 shadow-sm focus-visible:ring-slate-400"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-3 py-2 text-slate-700 shadow-sm hover:bg-slate-50"
              >
                <Avatar className="h-10 w-10 border border-slate-200">
                  <AvatarFallback className="bg-slate-900 text-sm font-medium text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden text-left sm:flex sm:flex-col">
                  <span className="text-xs text-slate-400">Mi Cuenta</span>
                  <span className="text-sm font-medium text-slate-700">Administrador</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/settings">Configuración</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>Mi Perfil</DropdownMenuItem>
              <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
