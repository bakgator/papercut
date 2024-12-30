import React from "react";
import { useForm, FormProvider } from "react-hook-form";
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

interface FormValues {
  customerId: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  paymentTerms: string;
}

const InvoiceForm = () => {
  const navigate = useNavigate();
  const methods = useForm<FormValues>({
    defaultValues: {
      customerId: "",
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: [{ id: "1", description: "", quantity: 0, unitPrice: 0, total: 0 }],
      notes: "",
      paymentTerms: "net30"
    }
  });

  const onSubmit = (data: FormValues) => {
    if (!data.customerId) {
      toast.error("Please fill in all required fields");
      return;
    }

    const customer = store.getCustomer(data.customerId);
    if (!customer) {
      toast.error("Invalid customer selected");
      return;
    }

    const subtotal = data.items.reduce((acc, item) => acc + item.total, 0);
    const vatRate = 25; // 25% VAT rate
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;

    const invoice = {
      id: Math.random().toString(),
      customer: customer.companyName,
      customerId: data.customerId,
      date: data.invoiceDate,
      dueDate: data.dueDate,
      items: data.items,
      subtotal,
      vatRate,
      vatAmount,
      total,
      status: "unpaid" as const,
      paymentTerms: data.paymentTerms,
      notes: data.notes
    };

    store.addInvoice(invoice);
    toast.success("Invoice created successfully");
    navigate("/dashboard");
  };

  const updateItemTotal = (index: number) => {
    const items = methods.getValues("items");
    const item = items[index];
    item.total = item.quantity * item.unitPrice;
    methods.setValue("items", items);
  };

  // Create a mock invoice object for InvoiceActions
  const mockInvoice = {
    id: "new",
    status: "draft" as const
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-8">
        <InvoiceHeader />
        <InvoiceCustomerSection customers={store.getCustomers()} />
        <InvoiceDatesSection />
        <InvoiceItemsSection 
          updateItemTotal={updateItemTotal}
        />
        <InvoiceNotesSection />
        <InvoiceTotalsSection 
          subtotal={methods.watch("items").reduce((acc, item) => acc + item.total, 0)}
          vatRate={25}
          vatAmount={methods.watch("items").reduce((acc, item) => acc + item.total, 0) * 0.25}
          total={methods.watch("items").reduce((acc, item) => acc + item.total, 0) * 1.25}
        />
        <InvoiceActions 
          invoice={mockInvoice}
          onMarkAsPaid={() => {}}
          onMarkAsUnpaid={() => {}}
        />
      </form>
    </FormProvider>
  );
};

export default InvoiceForm;