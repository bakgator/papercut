import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, User } from "lucide-react";
import { Link } from "react-router-dom";
import { store } from "@/lib/store";
import { toast } from "sonner";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";

const Dashboard = () => {
  const invoices = store.getInvoices();

  const handleMarkAsPaid = (id: string) => {
    if (store.markInvoiceAsPaid(id)) {
      toast.success("Invoice marked as paid");
    } else {
      toast.error("Failed to mark invoice as paid");
    }
  };

  const handleMarkAsUnpaid = (id: string) => {
    if (store.markInvoiceAsUnpaid(id)) {
      toast.success("Invoice marked as unpaid");
    } else {
      toast.error("Failed to mark invoice as unpaid");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button asChild>
            <Link to="/customers/new">
              <User className="mr-1" />
              New Customer
            </Link>
          </Button>
          <Button asChild>
            <Link to="/invoices/new">
              <Plus className="mr-1" />
              New Invoice
            </Link>
          </Button>
        </div>

        {/* Invoices Table */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Recent Invoices</h2>
          </div>
          <InvoiceTable
            invoices={invoices}
            onMarkAsPaid={handleMarkAsPaid}
            onMarkAsUnpaid={handleMarkAsUnpaid}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;