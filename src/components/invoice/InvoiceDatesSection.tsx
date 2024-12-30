import React from "react";
import { Input } from "@/components/ui/input";
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

const PAYMENT_TERMS_OPTIONS = [
  { value: "immediate", label: "Immediate Payment" },
  { value: "net15", label: "Net 15" },
  { value: "net30", label: "Net 30" },
  { value: "net60", label: "Net 60" },
];

export const InvoiceDatesSection = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <FormField
        name="invoiceDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-mono">Invoice Date</FormLabel>
            <FormControl>
              <Input type="date" className="bg-background/50 backdrop-blur-sm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="dueDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-mono">Due Date</FormLabel>
            <FormControl>
              <Input type="date" className="bg-background/50 backdrop-blur-sm" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="paymentTerms"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="font-mono">Payment Terms</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                  <SelectValue placeholder="Select payment terms" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {PAYMENT_TERMS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};