import React from "react";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceCustomerSection } from "./InvoiceCustomerSection";
import { InvoiceDatesSection } from "./InvoiceDatesSection";
import { InvoiceItemsSection } from "./InvoiceItemsSection";
import { InvoiceNotesSection } from "./InvoiceNotesSection";
import { InvoiceTotalsSection } from "./InvoiceTotalsSection";
import { InvoiceActions } from "./InvoiceActions";
import { store } from "@/lib/store";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { InvoiceItem } from "@/types/invoice";

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [items, setItems] = React.useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 0, unitPrice: 0, total: 0 }
  ]);

  const [invoiceDate, setInvoiceDate] = React.useState<string>(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = React.useState<string>(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = React.useState("");
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string>("");
  const [paymentTerms, setPaymentTerms] = React.useState("net30");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomerId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const customer = store.getCustomer(selectedCustomerId);
    if (!customer) {
      toast.error("Invalid customer selected");
      return;
    }

    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const vatRate = 25; // 25% VAT rate
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;

    const invoice = {
      customer: customer.companyName,
      customerId: selectedCustomerId,
      date: invoiceDate,
      dueDate,
      items,
      subtotal,
      vatRate,
      vatAmount,
      total,
      status: "unpaid" as const,
      paymentTerms,
      notes
    };

    store.addInvoice(invoice);
    toast.success("Invoice created successfully");
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      <InvoiceHeader />
      <InvoiceCustomerSection customers={store.getCustomers()} />
      <InvoiceDatesSection />
      <InvoiceItemsSection 
        form={{
          control: { register: () => {} },
          watch: () => items,
          getValues: () => ({ items }),
          setValue: (name: string, value: any) => {
            if (name === "items") setItems(value);
          }
        }}
        updateItemTotal={(index: number) => {
          const newItems = [...items];
          const item = newItems[index];
          item.total = item.quantity * item.unitPrice;
          setItems(newItems);
        }}
      />
      <InvoiceNotesSection />
      <InvoiceTotalsSection 
        subtotal={items.reduce((acc, item) => acc + item.total, 0)}
        vatRate={25}
        vatAmount={items.reduce((acc, item) => acc + item.total, 0) * 0.25}
        total={items.reduce((acc, item) => acc + item.total, 0) * 1.25}
      />
      <InvoiceActions />
    </form>
  );
};

export default InvoiceForm;