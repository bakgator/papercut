import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { InvoiceActions } from "./InvoiceActions";

interface Invoice {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string;
  total: number;
  status: 'paid' | 'unpaid';
}

interface InvoiceTableProps {
  invoices: Invoice[];
  onMarkAsPaid: (id: string) => void;
  onMarkAsUnpaid: (id: string) => void;
}

export const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onMarkAsPaid,
  onMarkAsUnpaid,
}) => {
  return (
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
              <InvoiceActions
                invoice={invoice}
                onMarkAsPaid={onMarkAsPaid}
                onMarkAsUnpaid={onMarkAsUnpaid}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};