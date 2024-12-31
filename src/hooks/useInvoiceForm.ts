import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCreateInvoice } from "./useCreateInvoice";
import type { InvoiceItem } from "@/types/invoice";

interface FormValues {
  customerId: string;
  invoiceDate: string;
  dueDate: string;
  items: InvoiceItem[];
  notes: string;
  paymentTerms: string;
}

export const useInvoiceForm = () => {
  const navigate = useNavigate();
  const createInvoiceMutation = useCreateInvoice();

  const methods = useForm<FormValues>({
    defaultValues: {
      customerId: "",
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: new Date().toISOString().split('T')[0],
      items: [{ id: "1", description: "", quantity: 0, unit_price: 0, total: 0 }],
      notes: "",
      paymentTerms: "net30"
    }
  });

  const updateItemTotal = (index: number) => {
    const items = methods.getValues("items");
    const item = items[index];
    item.total = item.quantity * item.unit_price;
    methods.setValue("items", items);
  };

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

  return {
    methods,
    updateItemTotal,
    onSubmit,
    isSubmitting: createInvoiceMutation.isPending
  };
};