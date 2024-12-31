import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, User } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Invoice } from "@/types/invoice";

const Dashboard = () => {
  const queryClient = useQueryClient();

  const { data: invoices, isLoading } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customer:customers(company_name)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Failed to load invoices");
        throw error;
      }

      return data as Invoice[];
    },
  });

  const updateInvoiceStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("invoices")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invoices"] });
    },
    onError: () => {
      toast.error("Failed to update invoice status");
    },
  });

  const handleMarkAsPaid = async (id: string) => {
    await updateInvoiceStatus.mutateAsync({ id, status: "paid" });
    toast.success("Invoice marked as paid");
  };

  const handleMarkAsUnpaid = async (id: string) => {
    await updateInvoiceStatus.mutateAsync({ id, status: "unpaid" });
    toast.success("Invoice marked as unpaid");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-custom-bg p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-bg p-4 sm:p-8">
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
          {invoices && invoices.length > 0 ? (
            <InvoiceTable
              invoices={invoices}
              onMarkAsPaid={handleMarkAsPaid}
              onMarkAsUnpaid={handleMarkAsUnpaid}
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No invoices found</p>
              <Button asChild className="mt-4">
                <Link to="/invoices/new">
                  <Plus className="mr-1" />
                  Create Your First Invoice
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;