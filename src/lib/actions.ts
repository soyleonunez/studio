'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { saveEstimate as dbSaveEstimate, updateCompany as dbUpdateCompany } from '@/lib/data';
import type { Company, Estimate } from '@/lib/types';

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required.'),
  address: z.string().min(1, 'Address is required.'),
  contactInfo: z.string().min(1, 'Contact info is required.'),
  taxId: z.string().min(1, 'Tax ID is required.'),
  logoUrl: z.string().url('Must be a valid URL.'),
  disclaimer: z.string().min(1, 'Disclaimer is required.'),
  accentColor: z.string().min(1, 'Accent color is required.'),
});

export async function updateCompanyAction(
  prevState: any,
  formData: FormData
) {
  const validatedFields = companySchema.safeParse({
    name: formData.get('name'),
    address: formData.get('address'),
    contactInfo: formData.get('contactInfo'),
    taxId: formData.get('taxId'),
    logoUrl: formData.get('logoUrl'),
    disclaimer: formData.get('disclaimer'),
    accentColor: formData.get('accentColor'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation failed.',
    };
  }

  try {
    await dbUpdateCompany(validatedFields.data as Company);
    revalidatePath('/settings');
    revalidatePath('/estimates/[id]', 'page');
    return { message: 'Company settings updated successfully.' };
  } catch (e) {
    return { message: 'Failed to update settings.' };
  }
}

export async function saveEstimateAction(data: Estimate) {
  const newEstimate = await dbSaveEstimate(data);
  revalidatePath('/');
  redirect(`/estimates/${newEstimate.id}`);
}
