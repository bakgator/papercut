export interface InvoiceItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoice_number: string;  // Changed from invoiceNumber to match DB
  customer_id: string;     // Added to match DB
  date: string;
  due_date: string;       // Changed from dueDate to match DB
  items: InvoiceItem[];
  subtotal: number;
  vat_rate: number;      // Changed from vatRate to match DB
  vat_amount: number;    // Changed from vatAmount to match DB
  total: number;
  status: 'paid' | 'unpaid';
  payment_terms: string; // Changed from paymentTerms to match DB
  notes?: string;
  user_id: string;      // Added to match DB
}

export interface Customer {
  id: string;
  company_name: string;  // Changed from companyName to match DB
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