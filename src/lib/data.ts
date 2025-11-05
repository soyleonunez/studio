import type { Company, Estimate } from '@/lib/types';
import fs from 'fs/promises';
import path from 'path';

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const companyDataPath = path.join(process.cwd(), 'src', 'lib', 'company.json');
const estimatesDataPath = path.join(process.cwd(), 'src', 'lib', 'estimates.json');

async function readData<T>(filePath: string): Promise<T | null> {
    try {
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If the file doesn't exist, return null
        if (isNodeError(error) && error.code === 'ENOENT') {
            return null;
        }
        console.error(`Error reading data from ${filePath}:`, error);
        throw error;
    }
}

async function writeData<T>(filePath: string, data: T): Promise<void> {
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing data to ${filePath}:`, error);
        throw error;
    }
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error;
}

export async function getCompany(): Promise<Company | null> {
    await delay(100);
    return readData<Company>(companyDataPath);
}

export async function updateCompany(data: Partial<Company>): Promise<Company> {
    await delay(200);
    const existingCompany = await getCompany();
    const companyData = { ...(existingCompany || { id: '1', name: '', address: '', contactInfo: '', taxId: '', logoUrl: '', disclaimer: '', accentColor: '#4f46e5' }), ...data };
    await writeData(companyDataPath, companyData);
    return companyData;
}

export async function getEstimates(): Promise<Estimate[]> {
    await delay(150);
    const estimatesData = await readData<Estimate[]>(estimatesDataPath);
    const sortedEstimates = (estimatesData || []).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sortedEstimates;
}

export async function getEstimateById(id: string): Promise<Estimate | undefined> {
    await delay(100);
    const estimatesData = await getEstimates();
    return estimatesData.find(e => e.id === id);
}

export async function saveEstimate(estimate: Estimate): Promise<Estimate> {
    await delay(300);
    let estimatesData = await getEstimates();
    const existingIndex = estimatesData.findIndex(e => e.id === estimate.id);
    
    if (existingIndex > -1) {
        estimatesData[existingIndex] = estimate;
        await writeData(estimatesDataPath, estimatesData);
        return estimate;
    } else {
        const newIdNumber = estimatesData.length > 0
            ? Math.max(...estimatesData.map(e => parseInt(e.id.split('-')[1]))) + 1
            : 1;
        const newEstimate = { ...estimate, id: `EST-${String(newIdNumber).padStart(3, '0')}`, createdAt: new Date().toISOString() };
        estimatesData.push(newEstimate);
        await writeData(estimatesDataPath, estimatesData);
        return newEstimate;
    }
}
