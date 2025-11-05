import type { Company, Estimate } from '@/lib/types';

let companyData: Company | null = null;

let estimatesData: Estimate[] = [];

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getCompany(): Promise<Company | null> {
    await delay(100);
    return companyData;
}

export async function updateCompany(data: Partial<Company>): Promise<Company> {
    await delay(200);
    companyData = { ...(companyData || { id: '1', name: '', address: '', contactInfo: '', taxId: '', logoUrl: '', disclaimer: '', accentColor: '#4f46e5' }), ...data };
    return companyData;
}

export async function getEstimates(): Promise<Estimate[]> {
    await delay(150);
    return [...estimatesData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getEstimateById(id: string): Promise<Estimate | undefined> {
    await delay(100);
    return estimatesData.find(e => e.id === id);
}

export async function saveEstimate(estimate: Estimate): Promise<Estimate> {
    await delay(300);
    const existingIndex = estimatesData.findIndex(e => e.id === estimate.id);
    if (existingIndex > -1) {
        estimatesData[existingIndex] = estimate;
        return estimate;
    } else {
        const newIdNumber = Math.max(0, ...estimatesData.map(e => parseInt(e.id.split('-')[1]))) + 1;
        const newEstimate = { ...estimate, id: `EST-${String(newIdNumber).padStart(3, '0')}`, createdAt: new Date().toISOString() };
        estimatesData.push(newEstimate);
        return newEstimate;
    }
}
