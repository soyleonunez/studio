import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Estimate } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

function getStatusVariant(status: Estimate['status']) {
  switch (status) {
    case 'Aprobado':
      return 'secondary';
    case 'Enviado':
      return 'default';
    case 'Borrador':
    default:
      return 'outline';
  }
}

function calculateTotal(estimate: Estimate): number {
    const subtotal = estimate.lineItems.reduce((acc, item) => acc + item.quantity * item.price, 0);
    const taxAmount = subtotal * (estimate.taxRate / 100);
    return subtotal + taxAmount;
}


export async function RecentEstimates({ estimates }: { estimates: Estimate[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presupuestos Recientes</CardTitle>
        <CardDescription>Una lista de tus presupuestos más recientes.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Presupuesto</TableHead>
              <TableHead>Nombre de Mascota</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {estimates.map((estimate) => (
              <TableRow key={estimate.id}>
                <TableCell className="font-medium">
                  <Link href={`/estimates/${estimate.id}`} className="hover:underline text-primary">
                    {estimate.id}
                  </Link>
                </TableCell>
                <TableCell>{estimate.pet.name}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(estimate.status)}>
                    {estimate.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(estimate.createdAt), { addSuffix: true, locale: es })}
                </TableCell>
                <TableCell className="text-right">{formatCurrency(calculateTotal(estimate))}</TableCell>
              </TableRow>
            ))}
             {estimates.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                        No se encontraron presupuestos. ¡Crea uno para empezar!
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
