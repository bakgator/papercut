import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Upload, FileImage } from "lucide-react";
import { Link } from "react-router-dom";
import { store } from "@/lib/store";
import { toast } from "sonner";
import { InvoiceTable } from "@/components/invoice/InvoiceTable";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const Paperwork = () => {
  const invoices = store.getInvoices();
  const purchases = store.getPurchases();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [isDragging, setIsDragging] = useState(false);

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

    // In a real application, you would upload the file to a server here
    // For now, we'll create a local URL
    const imageUrl = URL.createObjectURL(selectedFile);

    store.addPurchase({
      date: new Date().toISOString(),
      description,
      amount: parseFloat(amount),
      imageUrl,
    });

    setSelectedFile(null);
    setDescription("");
    setAmount("");
    toast.success("Purchase added successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
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
              {purchases.map((purchase) => (
                <div key={purchase.id} className="border rounded-lg p-4">
                  <img
                    src={purchase.imageUrl}
                    alt={purchase.description}
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                  <h3 className="font-medium">{purchase.description}</h3>
                  <p className="text-gray-600">
                    Amount: ${purchase.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(purchase.date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card>
          <CardContent className="p-4">
            <h2 className="text-xl font-semibold mb-4">All Invoices</h2>
            <InvoiceTable
              invoices={invoices}
              onMarkAsPaid={handleMarkAsPaid}
              onMarkAsUnpaid={handleMarkAsUnpaid}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Paperwork;