export type Company = {
  id: string;
  name: string;
  address: string;
  contactInfo: string;
  taxId: string;
  logoUrl: string;
  disclaimer: string;
  accentColor: string;
};

export type Owner = {
  name: string;
  address: string;
  email: string;
  phone: string;
};

export type Pet = {
  name:string;
  breed: string;
  age: string;
  gender: 'Male' | 'Female' | 'Unknown';
};

export type LineItem = {
  id: string;
  service: string;
  description: string;
  quantity: number;
  price: number;
};

export type Estimate = {
  id: string;
  owner: Owner;
  pet: Pet;
  lineItems: LineItem[];
  taxRate: number;
  createdAt: string;
  status: 'Draft' | 'Sent' | 'Approved';
};
