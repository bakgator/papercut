import React, { useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceCustomerSection } from "./InvoiceCustomerSection";
import { InvoiceDatesSection } from "./InvoiceDatesSection";
import { InvoiceItemsSection } from "./InvoiceItemsSection";
import { InvoiceNotesSection } from "./InvoiceNotesSection";
import { InvoiceTotalsSection } from "./InvoiceTotalsSection";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  const queryClient = useQueryClient();

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

  // Fetch customers for the dropdown
  const { data: customers } = useQuery({
    queryKey: ["customers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("customers")
        .select("*")
        .order("company_name", { ascending: true });

      if (error) {
        toast.error("Failed to load customers");
        throw error;
      }

      return data;
    },
  });

  // Create invoice mutation
  const createInvoice = useMutation({
    mutationFn: async (invoiceData: any) => {
      // Get the current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      // First insert the invoice with user_id
      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert([{ ...invoiceData, user_id: user.id }])
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      // Then insert all invoice items
      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(
          invoiceData.items.map((item: any) => ({
            ...item,
            invoice_id: invoice.id
          }))
        );

      if (itemsError) throw itemsError;

      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created successfully");
      navigate("/paperwork");
    },
    onError: () => {
      toast.error("Failed to create invoice");
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.customerId) {
      toast.error("Please select a customer");
      return;
    }

    const subtotal = data.items.reduce((acc, item) => acc + item.total, 0);
    const vatRate = 25; // 25% VAT rate
    const vatAmount = subtotal * (vatRate / 100);
    const total = subtotal + vatAmount;

    const invoiceData = {
      customer_id: data.customerId,
      date: data.invoiceDate,
      due_date: data.dueDate,
      items: data.items,
      subtotal,
      vat_rate: vatRate,
      vat_amount: vatAmount,
      total,
      status: "unpaid" as const,
      payment_terms: data.paymentTerms,
      notes: data.notes,
      invoice_number: `INV-${Date.now()}`, // You might want to implement a more sophisticated numbering system
    };

    await createInvoice.mutateAsync(invoiceData);
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
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  }, [methods.watch("items")]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-8">
        <InvoiceHeader />
        <InvoiceCustomerSection customers={customers || []} />
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
            disabled={createInvoice.isPending}
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            {createInvoice.isPending ? "Saving..." : "Save & Create"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default InvoiceForm;