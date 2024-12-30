import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import type { InvoiceItem } from "@/types/invoice";

interface InvoiceItemsSectionProps {
  updateItemTotal: (index: number) => void;
}

export const InvoiceItemsSection: React.FC<InvoiceItemsSectionProps> = ({ updateItemTotal }) => {
  const form = useFormContext();

  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [
      ...currentItems,
      { id: Math.random().toString(), description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    form.setValue(
      "items",
      currentItems.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold font-mono">Items</h3>
        <Button 
          type="button" 
          variant="outline" 
          onClick={addItem}
          className="bg-background/50 backdrop-blur-sm hover:bg-primary/20"
        >
          Add Item
        </Button>
      </div>

      {form.watch("items").map((item: InvoiceItem, index: number) => (
        <div key={item.id || index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gradient-to-br from-card/30 to-background/30 backdrop-blur-sm border border-border/50 rounded-lg">
          <FormField
            control={form.control}
            name={`items.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono">Description</FormLabel>
                <FormControl>
                  <Input className="bg-background/50 backdrop-blur-sm" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`items.${index}.quantity`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono">Quantity</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-background/50 backdrop-blur-sm"
                    {...field}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                      updateItemTotal(index);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={`items.${index}.unitPrice`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-mono">Unit Price (SEK)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    className="bg-background/50 backdrop-blur-sm"
                    {...field}
                    onChange={(e) => {
                      field.onChange(Number(e.target.value));
                      updateItemTotal(index);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex flex-col justify-between">
            <FormField
              control={form.control}
              name={`items.${index}.total`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-mono">Total (SEK)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      className="bg-background/50 backdrop-blur-sm" 
                      {...field} 
                      readOnly 
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            {index > 0 && (
              <Button
                type="button"
                variant="destructive"
                className="mt-2 hover:bg-destructive/90"
                onClick={() => removeItem(index)}
              >
                Remove
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};