import React, { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceCustomerSection } from "./InvoiceCustomerSection";
import { InvoiceDatesSection } from "./InvoiceDatesSection";
import { InvoiceItemsSection } from "./InvoiceItemsSection";
import { InvoiceNotesSection } from "./InvoiceNotesSection";
import { InvoiceTotalsSection } from "./InvoiceTotalsSection";
import { InvoiceActions } from "./InvoiceActions";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
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

  // Memoize calculations for totals
  const totals = useMemo(() => {
    const items = methods.watch("items");
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const vatAmount = subtotal * 0.25;
    const total = subtotal * 1.25;
    return { subtotal, vatAmount, total };
  }, [methods.watch("items")]);

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
          subtotal={totals.subtotal}
          vatRate={25}
          vatAmount={totals.vatAmount}
          total={totals.total}
        />
        <div className="flex justify-end space-x-4">
          <Button
            type="submit"
            className="bg-primary hover:bg-primary/90"
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            Save Invoice
          </Button>
        </div>
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