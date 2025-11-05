'use client';

import { useFieldArray, useForm, useWatch } from 'react-hook-form';
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
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import type { Estimate } from '@/lib/types';
import { saveEstimateAction, refineDescriptionAction } from '@/lib/actions';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Trash2, Wand2, Loader2, Save } from 'lucide-react';
import { useEffect, useTransition } from 'react';
import { useToast } from '@/hooks/use-toast';

const lineItemSchema = z.object({
    id: z.string(),
    service: z.string().min(1, "Service name is required."),
    description: z.string().min(1, "Description is required."),
    quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0."),
    price: z.coerce.number().min(0, "Price cannot be negative."),
});

const estimateSchema = z.object({
  id: z.string(),
  owner: z.object({
    name: z.string().min(1, "Owner name is required."),
    address: z.string().min(1, "Owner address is required."),
    email: z.string().email("Invalid email address."),
    phone: z.string().min(1, "Owner phone is required."),
  }),
  pet: z.object({
    name: z.string().min(1, "Pet name is required."),
    breed: z.string().min(1, "Pet breed is required."),
    age: z.string().min(1, "Pet age is required."),
    gender: z.enum(['Male', 'Female', 'Unknown']),
  }),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required."),
  taxRate: z.coerce.number().min(0, "Tax rate cannot be negative.").default(0),
  status: z.enum(['Draft', 'Sent', 'Approved']),
});

type EstimateFormData = z.infer<typeof estimateSchema>;

export function EstimateForm({ estimate }: { estimate?: Estimate }) {
    const { toast } = useToast();
    const [isSaving, startSavingTransition] = useTransition();
    const [isRefining, startRefiningTransition] = useTransition();

    const form = useForm<EstimateFormData>({
        resolver: zodResolver(estimateSchema),
        defaultValues: estimate || {
            id: 'new',
            owner: { name: '', address: '', email: '', phone: '' },
            pet: { name: '', breed: '', age: '', gender: 'Unknown' },
            lineItems: [{ id: '1', service: '', description: '', quantity: 1, price: 0 }],
            taxRate: 0,
            status: 'Draft',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'lineItems',
    });
    
    const lineItems = useWatch({ control: form.control, name: 'lineItems' });
    const taxRate = useWatch({ control: form.control, name: 'taxRate' });

    const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.price || 0), 0);
    const taxAmount = subtotal * ((taxRate || 0) / 100);
    const total = subtotal + taxAmount;
    
    const onSubmit = (data: EstimateFormData) => {
        startSavingTransition(async () => {
            await saveEstimateAction(data as Estimate);
            toast({
                title: 'Estimate Saved!',
                description: `Estimate ${estimate ? estimate.id : 'new'} has been saved successfully.`
            });
        });
    };

    const handleRefineDescription = (index: number) => {
        startRefiningTransition(async () => {
            const lineItem = form.getValues(`lineItems.${index}`);
            const result = await refineDescriptionAction(lineItem.service, lineItem.description);
            if(result.refinedDescription) {
                form.setValue(`lineItems.${index}.description`, result.refinedDescription);
                toast({ title: 'Description Refined!'});
            } else {
                toast({ title: 'Error', description: result.error, variant: 'destructive'});
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Client & Pet Information</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Owner Details</h3>
                                    <FormField control={form.control} name="owner.name" render={({ field }) => (
                                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} placeholder="John Doe" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="owner.address" render={({ field }) => (
                                        <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} placeholder="123 Main St" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="owner.email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field} type="email" placeholder="john@example.com"/></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="owner.phone" render={({ field }) => (
                                        <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} placeholder="555-123-4567" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="font-semibold">Pet Details</h3>
                                    <FormField control={form.control} name="pet.name" render={({ field }) => (
                                        <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} placeholder="Buddy" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="pet.breed" render={({ field }) => (
                                        <FormItem><FormLabel>Breed</FormLabel><FormControl><Input {...field} placeholder="Golden Retriever" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="pet.age" render={({ field }) => (
                                        <FormItem><FormLabel>Age</FormLabel><FormControl><Input {...field} placeholder="5 years" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="pet.gender" render={({ field }) => (
                                        <FormItem><FormLabel>Gender</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger></FormControl>
                                            <SelectContent><SelectItem value="Male">Male</SelectItem><SelectItem value="Female">Female</SelectItem><SelectItem value="Unknown">Unknown</SelectItem></SelectContent>
                                        </Select><FormMessage /></FormItem>
                                    )}/>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Services & Products</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="p-4 border rounded-lg space-y-4 relative">
                                        <div className="grid gap-4 md:grid-cols-5">
                                            <FormField control={form.control} name={`lineItems.${index}.service`} render={({ field }) => (
                                                <FormItem className="md:col-span-2"><FormLabel>Service/Product</FormLabel><FormControl><Input {...field} placeholder="Annual Wellness Exam"/></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={form.control} name={`lineItems.${index}.quantity`} render={({ field }) => (
                                                <FormItem><FormLabel>Qty</FormLabel><FormControl><Input {...field} type="number" step="1" /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <FormField control={form.control} name={`lineItems.${index}.price`} render={({ field }) => (
                                                <FormItem><FormLabel>Unit Price</FormLabel><FormControl><Input {...field} type="number" step="0.01" /></FormControl><FormMessage /></FormItem>
                                            )}/>
                                            <div className="flex items-end">
                                                <p className="font-medium text-right w-full">{formatCurrency((lineItems[index]?.quantity || 0) * (lineItems[index]?.price || 0))}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <FormLabel>Description</FormLabel>
                                                <Button type="button" variant="ghost" size="sm" onClick={() => handleRefineDescription(index)} disabled={isRefining}>
                                                    {isRefining ? <Loader2 className="h-4 w-4 animate-spin"/> : <Wand2 className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                            <FormField control={form.control} name={`lineItems.${index}.description`} render={({ field }) => (
                                                <FormItem className="!mt-0"><FormControl><Textarea {...field} placeholder="Detailed description of the service..."/></FormControl><FormMessage /></FormItem>
                                            )}/>
                                        </div>
                                        {fields.length > 1 && (
                                            <Button type="button" variant="destructive" size="icon" className="absolute -top-3 -right-3 h-7 w-7" onClick={() => remove(index)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                                 <Button type="button" variant="outline" onClick={() => append({ id: `${Date.now()}`, service: '', description: '', quantity: 1, price: 0 })}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Line Item
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
                                <div className="flex justify-between items-center">
                                    <FormLabel>Tax Rate (%)</FormLabel>
                                    <FormField control={form.control} name="taxRate" render={({ field }) => (
                                        <FormItem><FormControl><Input {...field} type="number" step="0.01" className="w-24 h-8 text-right" /></FormControl><FormMessage /></FormItem>
                                    )}/>
                                </div>
                                <div className="flex justify-between"><span>Tax</span><span>{formatCurrency(taxAmount)}</span></div>
                                <Separator />
                                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatCurrency(total)}</span></div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full" disabled={isSaving}>
                                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Save className="mr-2 h-4 w-4" />}
                                    Save Estimate
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </form>
        </Form>
    );
}
