// Simple in-memory store for development
interface Customer {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  billingAddress: string;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface Invoice {
  id: string;
  invoiceNumber: string;
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

class Store {
  private customers: Customer[] = [
    {
      id: "1",
      companyName: "BAKGATOR AB",
      email: "KARL@INDE.SE",
      phone: "0725432110",
      billingAddress: "FERSENS VÄG 12, MALMÖ",
    }
  ];
  
  private invoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-2024-001",
      customer: "BAKGATOR AB",
      date: "2024-02-20",
      dueDate: "2024-03-21",
      items: [
        {
          description: "Consulting Services",
          quantity: 1,
          unitPrice: 10000,
          total: 10000
        }
      ],
      subtotal: 10000,
      vatRate: 25,
      vatAmount: 2500,
      total: 12500,
      status: "unpaid",
      paymentTerms: "Net 30",
    }
  ];

  private getNextInvoiceNumber() {
    const currentYear = new Date().getFullYear();
    const currentCount = this.invoices.length + 1;
    return `INV-${currentYear}-${String(currentCount).padStart(3, '0')}`;
  }

  getCustomers() {
    return this.customers;
  }

  getInvoices() {
    return this.invoices;
  }

  addCustomer(customerData: Omit<Customer, 'id'>) {
    const newCustomer = {
      ...customerData,
      id: (this.customers.length + 1).toString(),
    };
    this.customers.push(newCustomer);
    return newCustomer;
  }

  addInvoice(invoiceData: Omit<Invoice, 'id' | 'invoiceNumber'>) {
    const newInvoice = {
      ...invoiceData,
      id: (this.invoices.length + 1).toString(),
      invoiceNumber: this.getNextInvoiceNumber(),
    };
    this.invoices.push(newInvoice);
    return newInvoice;
  }
}

export const store = new Store();