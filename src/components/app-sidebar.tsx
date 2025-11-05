'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { LayoutDashboard, Settings, LifeBuoy } from 'lucide-react';

export function AppSidebar({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-between">
            <Logo logoUrl={logoUrl} />
            <div className="rounded-full h-8 w-8 flex items-center justify-center bg-background border group-data-[state=collapsed]/sidebar-wrapper:hidden ml-2">
                <SidebarTrigger className="hidden sm:flex" />
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/'}
              tooltip={{ children: 'Panel de Control' }}
            >
              <Link href="/">
                <LayoutDashboard />
                <span className="group-data-[state=collapsed]/sidebar-wrapper:hidden">Panel de Control</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={pathname === '/settings'}
              tooltip={{ children: 'Configuración' }}
            >
              <Link href="/settings">
                <Settings />
                <span className="group-data-[state=collapsed]/sidebar-wrapper:hidden">Configuración</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton tooltip={{ children: 'Soporte' }}>
                    <LifeBuoy />
                    <span className="group-data-[state=collapsed]/sidebar-wrapper:hidden">Soporte</span>
                </SidebarMenuButton>
            </SidebarMenuItem>
         </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
