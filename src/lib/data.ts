import type { Company, Estimate } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

let companyData: Company = {
    id: '1',
    name: 'PetPal Veterinary',
    address: '123 Animal Lane, Pet City, PC 12345',
    contactInfo: 'contact@petpal.vet | 555-123-4567',
    taxId: '12-3456789',
    logoUrl: PlaceHolderImages.find(p => p.id === 'company-logo')?.imageUrl || 'https://picsum.photos/seed/petpal/200/200',
    disclaimer: 'This estimate is valid for 30 days. Prices for medications and external lab services are subject to change. Payment is due at time of service.',
    accentColor: '#ff8c00'
};

let estimatesData: Estimate[] = [
    {
        id: 'EST-001',
        owner: { name: 'John Doe', address: '456 Oak Avenue, Human Town, HT 67890', email: 'john.doe@email.com', phone: '555-987-6543' },
        pet: { name: 'Buddy', breed: 'Golden Retriever', age: '5 years', gender: 'Male' },
        lineItems: [
            { id: '1', service: 'Annual Wellness Exam', description: 'Comprehensive physical examination.', quantity: 1, price: 75 },
            { id: '2', service: 'Vaccination Package', description: 'Includes Rabies, DHLPP, and Bordetella vaccines.', quantity: 1, price: 120 },
        ],
        taxRate: 8.25,
        createdAt: '2024-07-15T10:30:00Z',
        status: 'Sent',
    },
    {
        id: 'EST-002',
        owner: { name: 'Jane Smith', address: '789 Pine Street, Human Town, HT 67890', email: 'jane.smith@email.com', phone: '555-111-2222' },
        pet: { name: 'Luna', breed: 'Siamese Cat', age: '2 years', gender: 'Female' },
        lineItems: [
            { id: '1', service: 'Dental Cleaning', description: 'Anesthesia, cleaning, polishing, and full-mouth dental X-rays.', quantity: 1, price: 450 },
        ],
        taxRate: 0,
        createdAt: '2024-07-20T14:00:00Z',
        status: 'Approved',
    },
    {
        id: 'EST-003',
        owner: { name: 'Alice Johnson', address: '321 Maple Drive, Human Town, HT 67890', email: 'alice.j@email.com', phone: '555-333-4444' },
        pet: { name: 'Rocky', breed: 'Boxer', age: '8 years', gender: 'Male' },
        lineItems: [
            { id: '1', service: 'Senior Pet Bloodwork', description: 'Complete blood count and chemistry panel.', quantity: 1, price: 250 },
            { id: '2', service: 'Pain Medication', description: '30-day supply of joint pain relief medication.', quantity: 1, price: 65 },
        ],
        taxRate: 8.25,
        createdAt: '2024-07-28T09:00:00Z',
        status: 'Draft',
    }
];

// Simulate a delay to mimic network latency
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getCompany(): Promise<Company> {
    await delay(100);
    return companyData;
}

export async function updateCompany(data: Partial<Company>): Promise<Company> {
    await delay(200);
    companyData = { ...companyData, ...data };
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
