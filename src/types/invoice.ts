export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  customer: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  status: 'paid' | 'unpaid';
  paymentTerms: string;
  notes?: string;
}