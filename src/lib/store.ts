// Simple in-memory store for development
interface Customer {
  id: string;
  companyName: string;
  email: string;
  phone: string;
  billingAddress: string;
}

interface Invoice {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: 'paid' | 'unpaid';
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
      customer: "BAKGATOR AB",
      date: "2024-02-20",
      amount: "10000",
      status: "unpaid",
    }
  ];

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

  addInvoice(invoiceData: Omit<Invoice, 'id'>) {
    const newInvoice = {
      ...invoiceData,
      id: (this.invoices.length + 1).toString(),
    };
    this.invoices.push(newInvoice);
    return newInvoice;
  }
}

export const store = new Store();