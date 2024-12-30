import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceCustomerSection } from "./InvoiceCustomerSection";
import { InvoiceDatesSection } from "./InvoiceDatesSection";
import { InvoiceItemsSection } from "./InvoiceItemsSection";
import { InvoiceTotalsSection } from "./InvoiceTotalsSection";
import { InvoiceNotesSection } from "./InvoiceNotesSection";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { store } from "@/lib/store";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import type { InvoiceItem } from "@/types/invoice";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  total: z.number(),
});

const formSchema = z.object({
  customerId: z.string({
    required_error: "Please select a customer",
  }),
  invoiceDate: z.string({
    required_error: "Please select an invoice date",
  }),
  dueDate: z.string({
    required_error: "Please select a due date",
  }),
  paymentTerms: z.string({
    required_error: "Please select payment terms",
  }),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

const VAT_RATE = 25; // 25% Swedish VAT

export const InvoiceForm = () => {
  const navigate = useNavigate();
  const customers = store.getCustomers();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      items: [
        {
          description: "New Item",
          quantity: 1,
          unitPrice: 0,
          total: 0,
        } as InvoiceItem
      ],
      notes: "",
    },
  });

  const items = form.watch("items");
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const vatAmount = subtotal * (VAT_RATE / 100);
  const total = subtotal + vatAmount;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const customer = customers.find(c => c.id === values.customerId);
    if (!customer) return;

    store.addInvoice({
      customer: customer.companyName,
      date: values.invoiceDate,
      dueDate: values.dueDate,
      items: values.items,
      subtotal,
      vatRate: VAT_RATE,
      vatAmount,
      total,
      status: "unpaid",
      paymentTerms: values.paymentTerms,
      notes: values.notes,
    });
    
    toast.success("Invoice created successfully");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-4 sm:p-8 fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <InvoiceHeader />
        
        <div className="bg-gradient-to-br from-card/50 to-background backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <InvoiceCustomerSection customers={customers} />
              <InvoiceDatesSection />
              <InvoiceItemsSection form={form} updateItemTotal={(index: number) => {
                const items = form.getValues("items");
                const item = items[index];
                const total = item.quantity * item.unitPrice;
                form.setValue(`items.${index}.total`, total);
              }} />
              <InvoiceTotalsSection subtotal={subtotal} vatRate={VAT_RATE} vatAmount={vatAmount} total={total} />
              <InvoiceNotesSection />

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="bg-background/50 backdrop-blur-sm hover:bg-primary/20"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                >
                  Create Invoice
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};