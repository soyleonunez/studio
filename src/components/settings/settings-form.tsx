'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Company } from '@/lib/types';
import { updateCompanyAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { useTransition, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

const companySchema = z.object({
  name: z.string().min(1, 'El nombre de la empresa es requerido.'),
  address: z.string().min(1, 'La dirección es requerida.'),
  contactInfo: z.string().min(1, 'La información de contacto es requerida.'),
  taxId: z.string().min(1, 'El NIF/CIF es requerido.'),
  logoUrl: z.string().optional(),
  disclaimer: z.string().min(1, 'El texto de descargo de responsabilidad es requerido.'),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Debe ser un código de color hexadecimal válido.'),
});

export function SettingsForm({ company }: { company: Company }) {
  const { toast } = useToast();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [logoPreview, setLogoPreview] = useState<string | null>(company.logoUrl);

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company.name || '',
      address: company.address || '',
      contactInfo: company.contactInfo || '',
      taxId: company.taxId || '',
      logoUrl: company.logoUrl || '',
      disclaimer: company.disclaimer || '',
      accentColor: company.accentColor || '#4f46e5',
    },
  });

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        form.setValue('logoUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: z.infer<typeof companySchema>) => {
    startTransition(async () => {
        const result = await updateCompanyAction(data);
        if (result.success) {
            toast({
                title: '¡Éxito!',
                description: result.message,
            });
            router.refresh();
        } else {
            toast({
                title: 'Error',
                description: result.message || 'Algo salió mal.',
                variant: 'destructive',
            });
        }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Configuración de la Empresa</CardTitle>
            <CardDescription>Actualice la información de su empresa. Se utilizará en todos los presupuestos.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Mi Veterinaria" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="taxId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NIF/CIF</FormLabel>
                  <FormControl>
                    <Input placeholder="B12345678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="md:col-span-2">
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Calle Falsa 123, 28001 Madrid" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contactInfo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Información de Contacto</FormLabel>
                  <FormControl>
                    <Input placeholder="info@miveterinaria.com | 912 345 678" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="accentColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color de Acento</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="color" className="w-12 h-10 p-1" {...field} />
                      <Input type="text" className="flex-1" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div className="md:col-span-2">
              <FormLabel>Logotipo de la Empresa</FormLabel>
              <div className="flex items-center gap-4 mt-2">
                {logoPreview && <img src={logoPreview} alt="Vista previa del logo" className="h-16 w-16 rounded-lg object-contain border p-1" />}
                <Input id="logoUpload" type="file" accept="image/png, image/jpeg" onChange={handleLogoChange} className="flex-1" />
              </div>
              <FormDescription className="mt-2">Sube el logotipo de tu empresa (se recomienda formato PNG o JPG).</FormDescription>
            </div>
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="disclaimer"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                        <FormLabel>Texto de descargo de responsabilidad</FormLabel>
                    </div>
                    <FormControl>
                      <Textarea rows={4} placeholder="Este presupuesto tiene una validez de 30 días..." {...field} />
                    </FormControl>
                    <FormDescription>Este texto aparecerá al final de cada presupuesto.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
             <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
             </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
