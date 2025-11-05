'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sidebar, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { LayoutDashboard, ClipboardList, Settings } from 'lucide-react';

const navigation = [
  { href: '/', label: 'Panel de control', icon: LayoutDashboard },
  { href: '/estimates', label: 'Presupuestos', icon: ClipboardList },
  { href: '/settings', label: 'Configuración', icon: Settings },
] as const;

export function AppSidebar({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname();

  return (
    <Sidebar
      collapsible="icon"
      className="md:border-r md:border-slate-900/40 [&_[data-sidebar=sidebar]]:bg-slate-950 [&_[data-sidebar=sidebar]]:text-slate-200 [&_[data-sidebar=header]]:border-b [&_[data-sidebar=header]]:border-white/10 [&_[data-sidebar=menu-button]]:rounded-2xl [&_[data-sidebar=menu-button]]:text-slate-400 [&_[data-sidebar=menu-button]]:hover:bg-white/10 [&_[data-sidebar=menu-button]]:hover:text-white [&_[data-sidebar=menu-button][data-active=true]]:bg-white/15 [&_[data-sidebar=menu-button][data-active=true]]:text-white [&_[data-sidebar=footer]]:border-t [&_[data-sidebar=footer]]:border-white/10"
    >
      <SidebarHeader className="px-4 pb-6 pt-8">
        <Logo
          logoUrl={logoUrl}
          className="[&>div]:border-white/20 [&>div]:bg-white/10 [&>span]:text-white"
        />
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="text-sm font-medium transition data-[active=true]:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
                  tooltip={{ children: item.label }}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span className="group-data-[state=collapsed]/sidebar-wrapper:hidden">
                      {item.label}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="px-4 pb-8 pt-6">
        <div className="hidden rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-slate-300 group-data-[state=collapsed]/sidebar-wrapper:hidden">
          <p className="font-medium text-slate-100">¿Necesitas ayuda?</p>
          <p className="mt-1 leading-relaxed text-slate-400">
            Escribe a soporte@petpal.app y nuestro equipo responderá a la brevedad.
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
