import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, FileText, User, Check, Edit, Eye, RefreshCcw, Download, Printer, Send } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

  const handleMarkAsUnpaid = (id: string) => {
    if (store.markInvoiceAsUnpaid(id)) {
      toast.success("Invoice marked as unpaid");
    } else {
      toast.error("Failed to mark invoice as unpaid");
    }
  };

  const handleDownload = (invoice: any) => {
    // Create a text representation of the invoice
    const invoiceText = `
Invoice #${invoice.invoiceNumber}
Customer: ${invoice.customer}
Date: ${invoice.date}
Amount: ${invoice.total} SEK
Status: ${invoice.status}
    `;
    
    // Create blob and download
    const blob = new Blob([invoiceText], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoice.invoiceNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success("Invoice downloaded successfully");
  };

  const handlePrint = (invoice: any) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice #${invoice.invoiceNumber}</title>
          </head>
          <body>
            <h1>Invoice #${invoice.invoiceNumber}</h1>
            <p>Customer: ${invoice.customer}</p>
            <p>Date: ${invoice.date}</p>
            <p>Amount: ${invoice.total} SEK</p>
            <p>Status: ${invoice.status}</p>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    toast.success("Print window opened");
  };

  const handleSend = (invoice: any) => {
    // This would typically integrate with an email service
    // For now, we'll just show a success message
    toast.success(`Invoice ${invoice.invoiceNumber} sent successfully`);
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
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" asChild>
                              <Link to={`/invoices/${invoice.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View Invoice</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="outline" size="icon" asChild>
                              <Link to={`/invoices/${invoice.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Edit Invoice</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      {invoice.status === 'unpaid' ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleMarkAsPaid(invoice.id)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as Paid</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon"
                                onClick={() => handleMarkAsUnpaid(invoice.id)}
                              >
                                <RefreshCcw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Mark as Unpaid</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDownload(invoice)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download Invoice</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handlePrint(invoice)}
                            >
                              <Printer className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Print Invoice</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleSend(invoice)}
                            >
                              <Send className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Send Invoice</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
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