import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, User, Check, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { store } from "@/lib/store";
import { toast } from "sonner";

const Dashboard = () => {
  const invoices = store.getInvoices();

  const handleMarkAsPaid = (id: string) => {
    if (store.markInvoiceAsPaid(id)) {
      toast.success("Invoice marked as paid");
    } else {
      toast.error("Failed to mark invoice as paid");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Logo */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-primary w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Papertrail</h1>
              <p className="text-sm text-muted-foreground">Keep track of your paperwork like a pro</p>
            </div>
          </div>
          <div className="flex gap-3">
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
        </div>

        {/* Invoices Table */}
        <div className="bg-white shadow-sm rounded-lg">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Recent Invoices</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>#{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell>{invoice.date}</TableCell>
                  <TableCell>{invoice.total} SEK</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      invoice.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/invoices/${invoice.id}`}>
                          <FileText className="w-4 h-4" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/invoices/${invoice.id}/edit`}>
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                      </Button>
                      {invoice.status === 'unpaid' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleMarkAsPaid(invoice.id)}
                        >
                          <Check className="w-4 h-4" />
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;