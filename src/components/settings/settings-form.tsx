'use client';

import { useFormState, useForm } from 'react-hook-form';
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
import { useEffect, useState, useTransition } from 'react';
import { Loader2 } from 'lucide-react';

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required.'),
  address: z.string().min(1, 'Address is required.'),
  contactInfo: z.string().min(1, 'Contact info is required.'),
  taxId: z.string().min(1, 'Tax ID is required.'),
  logoUrl: z.string().url('Must be a valid URL.'),
  disclaimer: z.string().min(1, 'Disclaimer is required.'),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a valid hex color code.'),
});

export function SettingsForm({ company }: { company: Company }) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company.name || '',
      address: company.address || '',
      contactInfo: company.contactInfo || '',
      taxId: company.taxId || '',
      logoUrl: company.logoUrl || '',
      disclaimer: company.disclaimer || '',
      accentColor: company.accentColor || '#ff8c00',
    },
  });

  const [state, formAction] = useFormState(updateCompanyAction, { message: '', errors: {} });

  useEffect(() => {
    if(state.message && state.message.includes('success')) {
        toast({
            title: 'Success!',
            description: state.message,
        });
    } else if (state.message) {
        toast({
            title: 'Error',
            description: state.message,
            variant: 'destructive',
        });
    }
  }, [state, toast]);

  return (
    <Form {...form}>
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>Company Settings</CardTitle>
            <CardDescription>Update your company's information. This will be used on all estimates.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input placeholder="PetPal Veterinary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="123 Animal Lane, Pet City" {...field} />
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
                  <FormLabel>Contact Information</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@petpal.vet | 555-123-4567" {...field} />
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
                  <FormLabel>Tax ID</FormLabel>
                  <FormControl>
                    <Input placeholder="12-3456789" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://your-domain.com/logo.png" {...field} />
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
                  <FormLabel>Accent Color</FormLabel>
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
              <FormField
                control={form.control}
                name="disclaimer"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                        <FormLabel>Disclaimer Text</FormLabel>
                    </div>
                    <FormControl>
                      <Textarea rows={5} placeholder="This estimate is valid for 30 days..." {...field} />
                    </FormControl>
                    <FormDescription>This text will appear at the bottom of every estimate.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
             <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
             </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
