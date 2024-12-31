import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { InvoiceItem } from "@/types/invoice";

interface CreateInvoiceData {
  customerId: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
  paymentTerms: string;
  notes: string;
}

export const useCreateInvoice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (invoiceData: CreateInvoiceData) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!user) throw new Error("No user found");

      const invoicePayload = {
        customer_id: invoiceData.customerId,
        date: invoiceData.invoiceDate,
        due_date: invoiceData.dueDate,
        subtotal: invoiceData.subtotal,
        vat_rate: invoiceData.vatRate,
        vat_amount: invoiceData.vatAmount,
        total: invoiceData.total,
        status: "unpaid" as const,
        payment_terms: invoiceData.paymentTerms,
        notes: invoiceData.notes,
        invoice_number: `INV-${Date.now()}`,
        user_id: user.id,
      };

      const { data: invoice, error: invoiceError } = await supabase
        .from("invoices")
        .insert([invoicePayload])
        .select()
        .single();

      if (invoiceError) throw invoiceError;

      const { error: itemsError } = await supabase
        .from("invoice_items")
        .insert(
          invoiceData.items.map((item) => ({
            invoice_id: invoice.id,
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            total: item.total,
          }))
        );

      if (itemsError) throw itemsError;

      return invoice;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
      toast.success("Invoice created successfully");
    },
    onError: () => {
      toast.error("Failed to create invoice");
    },
  });
};