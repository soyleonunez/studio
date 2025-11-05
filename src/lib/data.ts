import type { Company, Estimate } from '@/lib/types';

let companyData: Company = {
    id: '1',
    name: 'VetCare+',
    address: 'Calle de la Veterinaria 123, 28010 Madrid, España',
    contactInfo: 'info@vetcareplus.es | 91 234 56 78',
    taxId: 'B-12345678',
    logoUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAACrElEQVR4nO2Yy27TQBDHB1coVoQ6QA8gIBQpQhAVegA/QLwA8Q7kBAVCCAoBuYAEofYDRDwA/AA9gKiA6MhIqYNsY9+b2Z0kknRkS2JHzp/dnZ/fnf2s4b/NKfMv134P8LwP4B2IZPpGkaTzMMb/B4B48A0h5AJiWbZt/o/h2Y/n+DPg9wB8Y4yqAXu3buN/fnbI5bdsW7eNDQDEl+b82g2A/zDC0A1oBuBHGIZv7Z2/e4BvAO4t3tZ2y5ZtWb39a+0/AHDZpIk870cQBC+y1fRmAAC2bRuO40g5BZDkKaIoiu/7v/M0fIExxp+SZCgK4+s+gK+iKIpmh3HcN+r/hUDIW5IkD+1acj4y+bMBgGEYnucBvExkHkXyJpFkL2Y8wD/A8whQZJ/IqgBACIF/AOQe5/89gPeIYVYTANd9/e/lGRZnZQAAYIz5F1GkGABYlgWRZEmSaZqmM8sB8PE4OQDA0zQ1TbMsywzD0A8AP8uydo8zy7KkCIIgy7Ke5/lBkiRIklyLImlqmv/vP0tJkoRzHEVRAMAwDEBEl+8I0o3GGIpif6/L+BoAYLqu67qurusoih/y/P8XkQjA932O44hEBHmed7wA8Lzv+34hpJ/v3/B5gGv+dwA0FlmWlWVZEQSBSZKkRBCiKLIsq2uaRJL9yLKsKArC9/2kXNl+B4BqmuI4jpRj5Lr+s3VdY1nWPzf2gIjoPM/BYFxmGeCR4/hJkvjhiG9+b89wGGbbtiAIlmVZ3/ctSZKkKAqCIAgCg2EABEEAYPjX+pVIHwF6t/s+gG+iKIrLsozj+Kouo/s+gH8BHgBeu2L/xQXWbds+AMyLIsn7vu/7vu95nnHccZqmqaoKAGmaPq/LeJ7nPE8RBCkpxRj/A2g3k9Jv490dAAAAAElFTkSuQmCC',
    disclaimer: 'Este presupuesto tiene una validez de 30 días. Los precios de los medicamentos y servicios de laboratorio externos están sujetos a cambios. El pago se realiza en el momento del servicio.',
    accentColor: '#4f46e5'
};

let estimatesData: Estimate[] = [
    {
        id: 'EST-001',
        owner: { name: 'Carlos González', address: 'Paseo de la Castellana 100, 28046 Madrid', email: 'carlos.g@email.com', phone: '611 223 344' },
        pet: { name: 'Toby', breed: 'Labrador Retriever', age: '3 años', gender: 'Macho' },
        lineItems: [
            { id: '1', service: 'Consulta General', description: 'Examen físico completo y revisión del estado de salud.', quantity: 1, price: 45 },
            { id: '2', service: 'Vacuna Anual Polivalente', description: 'Protección contra moquillo, parvovirus, hepatitis y leptospirosis.', quantity: 1, price: 55 },
            { id: '3', service: 'Desparasitación Interna', description: 'Tratamiento trimestral contra parásitos intestinales.', quantity: 1, price: 20 },
        ],
        taxRate: 21.00,
        createdAt: '2024-07-28T10:30:00Z',
        status: 'Enviado',
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
