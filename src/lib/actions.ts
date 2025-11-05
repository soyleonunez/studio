'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { saveEstimate as dbSaveEstimate, updateCompany as dbUpdateCompany, getCompany } from '@/lib/data';
import type { Company, Estimate } from '@/lib/types';

const companySchema = z.object({
  name: z.string().min(1, 'El nombre de la empresa es requerido.'),
  address: z.string().min(1, 'La dirección es requerida.'),
  contactInfo: z.string().min(1, 'La información de contacto es requerida.'),
  taxId: z.string().min(1, 'El RIF es requerido.'),
  logoUrl: z.string().optional(),
  disclaimer: z.string().min(1, 'El texto de descargo de responsabilidad es requerido.'),
  accentColor: z.string().min(1, 'El color de acento es requerido.'),
});

export async function updateCompanyAction(
  data: unknown
) {
  const wasCompanyDataMissing = !(await getCompany())?.name;
  const validatedFields = companySchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'La validación falló.',
    };
  }

  try {
    await dbUpdateCompany(validatedFields.data as Company);

    revalidatePath('/', 'layout');

    if (wasCompanyDataMissing) {
      redirect('/');
    }

    return { success: true, message: 'La configuración de la empresa se ha actualizado correctamente.' };
  } catch (e) {
    return { success: false, message: 'No se pudo actualizar la configuración.' };
  }
}

export async function saveEstimateAction(data: Estimate) {
  const newEstimate = await dbSaveEstimate(data);
  revalidatePath('/');
  redirect(`/estimates/${newEstimate.id}`);
}
