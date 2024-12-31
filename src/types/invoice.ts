export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
  invoice_id?: string;
  created_at?: string;
  updated_at?: string;
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
  customer: {
    company_name: string;
  };
  items?: InvoiceItem[];
}

export interface Customer {
  id: string;
  user_id: string;
  company_name: string;
  email: string | null;
  phone: string | null;
  billing_address: string | null;
  shipping_address: string | null;
  org_number: string | null;
  vat_number: string | null;
  contact_person_name: string | null;
  contact_person_position: string | null;
  contact_person_email: string | null;
  contact_person_phone: string | null;
  created_at: string;
  updated_at: string;
}