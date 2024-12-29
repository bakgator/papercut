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

// Mock data - replace with real data later
const customers = [
  {
    id: "1",
    name: "BAKGATOR AB",
    email: "KARL@INDE.SE",
    phone: "0725432110",
    address: "FERSENS VÄG 12, MALMÖ",
  },
];

const Customers = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/customers/${customer.id}`}>
                          <User className="w-4 h-4" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/invoices/new?customer=${customer.id}`}>
                          <FileText className="w-4 h-4" />
                          New Invoice
                        </Link>
                      </Button>
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

export default Customers;