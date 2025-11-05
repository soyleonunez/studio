'use server';

/**
 * @fileOverview Generates a default disclaimer text for estimates using GenAI.
 *
 * - generateDisclaimerText - A function that generates the disclaimer text.
 * - GenerateDisclaimerTextInput - The input type for the generateDisclaimerText function.
 * - GenerateDisclaimerTextOutput - The return type for the generateDisclaimerText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDisclaimerTextInputSchema = z.object({
  companyName: z.string().describe('The name of the company.'),
  companyAddress: z.string().describe('The address of the company.'),
  taxId: z.string().describe('The tax ID of the company.'),
});
export type GenerateDisclaimerTextInput = z.infer<typeof GenerateDisclaimerTextInputSchema>;

const GenerateDisclaimerTextOutputSchema = z.object({
  disclaimerText: z.string().describe('The generated disclaimer text.'),
});
export type GenerateDisclaimerTextOutput = z.infer<typeof GenerateDisclaimerTextOutputSchema>;

export async function generateDisclaimerText(input: GenerateDisclaimerTextInput): Promise<GenerateDisclaimerTextOutput> {
  return generateDisclaimerTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDisclaimerTextPrompt',
  input: {schema: GenerateDisclaimerTextInputSchema},
  output: {schema: GenerateDisclaimerTextOutputSchema},
  prompt: `Generate a disclaimer for a company with the following information:

Company Name: {{{companyName}}}
Company Address: {{{companyAddress}}}
Tax ID: {{{taxId}}}

The disclaimer should be legally sound and protect the company from liability.  The generated disclaimer should be no longer than 200 words.`,
});

const generateDisclaimerTextFlow = ai.defineFlow(
  {
    name: 'generateDisclaimerTextFlow',
    inputSchema: GenerateDisclaimerTextInputSchema,
    outputSchema: GenerateDisclaimerTextOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
