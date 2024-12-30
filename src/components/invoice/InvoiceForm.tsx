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
    { description: "", quantity: 0, unitPrice: 0, total: 0 }
  ]);

  const [dueDate, setDueDate] = React.useState<Date>();
  const [notes, setNotes] = React.useState("");
  const [selectedCustomerId, setSelectedCustomerId] = React.useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCustomerId || !dueDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const invoice = {
      customerId: selectedCustomerId,
      items,
      dueDate,
      notes,
      status: "unpaid" as const,
      total: items.reduce((acc, item) => acc + item.total, 0),
    };

    store.addInvoice(invoice);
    toast.success("Invoice created successfully");
    navigate("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-8">
      <InvoiceHeader />
      <InvoiceCustomerSection
        selectedCustomerId={selectedCustomerId}
        setSelectedCustomerId={setSelectedCustomerId}
      />
      <InvoiceDatesSection dueDate={dueDate} setDueDate={setDueDate} />
      <InvoiceItemsSection items={items} setItems={setItems} />
      <InvoiceNotesSection notes={notes} setNotes={setNotes} />
      <InvoiceTotalsSection items={items} />
      <InvoiceActions />
    </form>
  );
};

export default InvoiceForm;