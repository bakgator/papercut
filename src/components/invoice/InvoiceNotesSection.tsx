import React from "react";
import { Textarea } from "@/components/ui/textarea";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

export const InvoiceNotesSection = () => {
  const form = useFormContext();
  
  return (
    <FormField
      control={form.control}
      name="notes"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="font-mono">Notes</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Add any additional notes or payment instructions..."
              className="bg-background/50 backdrop-blur-sm resize-none"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};