export interface InvoiceItem {
  id?: string;
  description: string;  // Making description required
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
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