export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unit_price: number; // Changed from unitPrice to match database
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