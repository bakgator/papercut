import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, User, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "@/types/customer";
import { toast } from "sonner";

const Customers = () => {
  const { data: customers, isLoading } = useQuery({
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

      return data as Customer[];
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-custom-bg p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center h-64">
            <p className="text-lg text-gray-500">Loading customers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-bg p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Customers</h1>
          <Button asChild>
            <Link to="/customers/new">
              <Plus className="mr-1" />
              New Customer
            </Link>
          </Button>
        </div>

        {/* Customers Table */}
        <div className="bg-white shadow-sm rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.company_name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.contact_person_name}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/customers/${customer.id}`}>
                          <User className="w-4 h-4 mr-1" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/invoices/new?customer=${customer.id}`}>
                          <FileText className="w-4 h-4 mr-1" />
                          New Invoice
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {customers?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <p className="text-gray-500">No customers found</p>
                    <Button asChild className="mt-4">
                      <Link to="/customers/new">
                        <Plus className="mr-1" />
                        Add Your First Customer
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Customers;