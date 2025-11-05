'use client'
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FilePlus2, Search } from 'lucide-react';
import { Input } from '../ui/input';

export function DashboardActions() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Crear Presupuesto</CardTitle>
          <CardDescription>Inicia un nuevo presupuesto para un cliente.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild size="lg" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
            <Link href="/estimates/new">
              <FilePlus2 className="mr-2 h-5 w-5" />
              Crear Nuevo Presupuesto
            </Link>
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Buscar Presupuesto</CardTitle>
          <CardDescription>Busca un presupuesto existente por número de cédula del dueño.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input type="text" placeholder="Número de Cédula" />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
