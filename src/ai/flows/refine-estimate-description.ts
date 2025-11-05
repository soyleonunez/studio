'use server';

/**
 * @fileOverview Refines a service description using GenAI to ensure clarity,
 * professionalism, and accuracy in estimates.
 *
 * - refineEstimateDescription - A function that refines the service description.
 * - RefineEstimateDescriptionInput - The input type for the refineEstimateDescription function.
 * - RefineEstimateDescriptionOutput - The return type for the refineEstimateDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RefineEstimateDescriptionInputSchema = z.object({
  service: z.string().describe('The name of the service provided.'),
  description: z.string().describe('The current description of the service.'),
});
export type RefineEstimateDescriptionInput = z.infer<
  typeof RefineEstimateDescriptionInputSchema
>;

const RefineEstimateDescriptionOutputSchema = z.object({
  refinedDescription: z
    .string()
    .describe('The refined description of the service.'),
});
export type RefineEstimateDescriptionOutput = z.infer<
  typeof RefineEstimateDescriptionOutputSchema
>;

export async function refineEstimateDescription(
  input: RefineEstimateDescriptionInput
): Promise<RefineEstimateDescriptionOutput> {
  return refineEstimateDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'refineEstimateDescriptionPrompt',
  input: {schema: RefineEstimateDescriptionInputSchema},
  output: {schema: RefineEstimateDescriptionOutputSchema},
  prompt: `You are an expert at writing clear, professional, and accurate descriptions for services provided in estimates.

  Given the service name and its current description, refine the description to be as clear, professional, and accurate as possible.

  Service: {{{service}}}
  Current Description: {{{description}}}

  Refined Description:`,
});

const refineEstimateDescriptionFlow = ai.defineFlow(
  {
    name: 'refineEstimateDescriptionFlow',
    inputSchema: RefineEstimateDescriptionInputSchema,
    outputSchema: RefineEstimateDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
