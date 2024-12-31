import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileImage } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Invoice } from "@/types/invoice";

const Paperwork = () => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Fetch invoices
  const { data: invoices, isLoading: isLoadingInvoices } = useQuery({
    queryKey: ["invoices"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from("invoices")
        .select(`
          *,
          customer:customers(company_name),
          items:invoice_items(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Failed to load invoices");
        throw error;
      }

      return data.map(invoice => ({
        ...invoice,
        customer: invoice.customer?.company_name || 'Unknown Customer',
        items: invoice.items || [],
        // Ensure status is either 'paid' or 'unpaid'
        status: invoice.status === 'paid' ? 'paid' : 'unpaid'
      }));
    },
  });

  // Fetch purchases
  const { data: purchases, isLoading: isLoadingPurchases } = useQuery({
    queryKey: ["purchases"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("purchases")
        .select("*")
        .order('created_at', { ascending: false });

      if (error) {
        toast.error("Failed to load purchases");
        throw error;
      }

      return data;
    },
  });

  // Update invoice status mutation
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

  // Add purchase mutation
  const addPurchase = useMutation({
    mutationFn: async (purchaseData: {
      date: string;
      description: string;
      amount: number;
      image_url?: string;
      user_id: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from("purchases")
        .insert([{
          ...purchaseData,
          user_id: user.id,
          image_url: purchaseData.image_url // Ensure correct property name
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      setSelectedFile(null);
      setDescription("");
      setAmount("");
      toast.success("Purchase added successfully");
    },
    onError: () => {
      toast.error("Failed to add purchase");
    },
  });

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !description || !amount) {
      toast.error("Please fill in all fields");
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("You must be logged in to upload purchases");
      return;
    }

    await addPurchase.mutateAsync({
      date: new Date().toISOString().split('T')[0],
      description,
      amount: parseFloat(amount),
      image_url: URL.createObjectURL(selectedFile), // Fixed property name
      user_id: user.id
    });
  };

  if (isLoadingInvoices || isLoadingPurchases) {
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Bookkeeping</h1>
          <Button asChild>
            <Link to="/invoices/new">
              <Plus className="mr-1" />
              New Invoice
            </Link>
          </Button>
        </div>

        {/* Purchase Upload Section */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Purchase</h2>
            <div className="space-y-4">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-gray-300 hover:border-primary"
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <FileImage className="w-12 h-12 text-gray-400" />
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">
                      Drag and drop your receipt here, or
                    </p>
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
                    >
                      <span>browse to choose a file</span>
                      <Input
                        id="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  {selectedFile && (
                    <p className="text-sm text-gray-500">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <Input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter purchase description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                />
              </div>
              <Button onClick={handleUpload}>
                <Upload className="mr-1" />
                Upload Purchase
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Purchases Display */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {purchases?.map((purchase) => (
                <div key={purchase.id} className="border rounded-lg p-4">
                  {purchase.image_url && (
                    <img
                      src={purchase.image_url}
                      alt={purchase.description}
                      className="w-full h-48 object-cover rounded-lg mb-2"
                    />
                  )}
                  <h3 className="font-medium">{purchase.description}</h3>
                  <p className="text-gray-600">
                    Amount: ${purchase.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(purchase.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
              {purchases?.length === 0 && (
                <div className="col-span-full text-center py-8">
                  <p className="text-gray-500">No purchases found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">All Invoices</h2>
            {invoices && (
              <InvoiceTable
                invoices={invoices}
                onMarkAsPaid={handleMarkAsPaid}
                onMarkAsUnpaid={handleMarkAsUnpaid}
              />
            )}
            {invoices?.length === 0 && (
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Paperwork;