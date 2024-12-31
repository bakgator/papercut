import React, { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceCustomerSection } from "./InvoiceCustomerSection";
import { InvoiceDatesSection } from "./InvoiceDatesSection";
import { InvoiceItemsSection } from "./InvoiceItemsSection";
import { InvoiceNotesSection } from "./InvoiceNotesSection";
import { InvoiceTotalsSection } from "./InvoiceTotalsSection";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { useCreateInvoice } from "@/hooks/useCreateInvoice";
import { useCustomers } from "@/hooks/useCustomers";
import type { InvoiceItem } from "@/types/invoice";

interface FormValues {
  customerId: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  paymentTerms: string;
}

interface Props {
  existingInvoiceId?: string;
}

const InvoiceForm = ({ existingInvoiceId }: Props) => {
  const navigate = useNavigate();
  const { data: customers } = useCustomers();
  const createInvoiceMutation = useCreateInvoice();

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

  const onSubmit = async (data: FormValues) => {
    if (!data.customerId) {
      toast.error("Please select a customer");
      return;
    }

    const subtotal = data.items.reduce((acc, item) => acc + item.total, 0);
    const vatRate = 25;
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;

    await createInvoiceMutation.mutateAsync({
      customerId: data.customerId,
      invoiceDate: data.invoiceDate,
      dueDate: data.dueDate,
      items: data.items,
      subtotal,
      vatRate,
      vatAmount,
      total,
      paymentTerms: data.paymentTerms,
      notes: data.notes,
    });

    navigate("/paperwork");
  };

  const updateItemTotal = (index: number) => {
    const items = methods.getValues("items");
    const item = items[index];
    item.total = item.quantity * item.unitPrice;
    methods.setValue("items", items);
  };

  const totals = useMemo(() => {
    const items = methods.watch("items");
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const vatAmount = subtotal * 0.25;
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  }, [methods.watch("items")]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-8">
        <InvoiceHeader />
        <InvoiceCustomerSection customers={customers || []} />
        <InvoiceDatesSection />
        <InvoiceItemsSection updateItemTotal={updateItemTotal} />
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
            disabled={createInvoiceMutation.isPending}
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            {createInvoiceMutation.isPending ? "Saving..." : "Save & Create"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default InvoiceForm;