export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
  invoice_id?: string;
}

export interface Invoice {
  id: string;
  user_id: string;
  invoice_number: string;
  customer_id: string | null;
  date: string;
  due_date: string;
  subtotal: number;
  vat_rate: number;
  vat_amount: number;
  total: number;
  status: 'paid' | 'unpaid';
  payment_terms: string | null;
  notes: string | null;
  created_at?: string;
  updated_at?: string;
  customer?: {
    company_name: string;
  };
  items?: InvoiceItem[];
}

export interface Customer {
  id: string;
  company_name: string;
  email?: string;
  phone?: string;
  billing_address?: string;
  shipping_address?: string;
  org_number?: string;
  vat_number?: string;
  contact_person_name?: string;
  contact_person_position?: string;
  contact_person_email?: string;
  contact_person_phone?: string;
  user_id: string;
}