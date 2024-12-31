import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Customer } from "@/types/invoice";

interface InvoiceCustomerSectionProps {
  customers: Customer[];
}

export const InvoiceCustomerSection: React.FC<InvoiceCustomerSectionProps> = ({ customers }) => {
  return (
    <FormField
      name="customerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-mono">Customer</FormLabel>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                <SelectValue placeholder="Select a customer" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {customers.map((customer) => (
                <SelectItem key={customer.id} value={customer.id}>
                  {customer.company_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};