import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { store } from "@/lib/store";
import { toast } from "sonner";
import type { InvoiceItem } from "@/types/invoice";

const invoiceItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  unitPrice: z.number().min(0, "Unit price must be positive"),
  total: z.number(),
});

const formSchema = z.object({
  customerId: z.string({
    required_error: "Please select a customer",
  }),
  invoiceDate: z.string({
    required_error: "Please select an invoice date",
  }),
  dueDate: z.string({
    required_error: "Please select a due date",
  }),
  paymentTerms: z.string({
    required_error: "Please select payment terms",
  }),
  items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
  notes: z.string().optional(),
});

const PAYMENT_TERMS_OPTIONS = [
  { value: "immediate", label: "Immediate Payment" },
  { value: "net15", label: "Net 15" },
  { value: "net30", label: "Net 30" },
  { value: "net60", label: "Net 60" },
];

const VAT_RATE = 25; // 25% Swedish VAT

const NewInvoice = () => {
  const navigate = useNavigate();
  const customers = store.getCustomers();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      invoiceDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      items: [
        {
          description: "New Item", // Now providing a default string
          quantity: 1,
          unitPrice: 0,
          total: 0
        }
      ],
      notes: "",
    },
  });

  const items = form.watch("items");
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const vatAmount = subtotal * (VAT_RATE / 100);
  const total = subtotal + vatAmount;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const customer = customers.find(c => c.id === values.customerId);
    if (!customer) return;

    store.addInvoice({
      customer: customer.companyName,
      date: values.invoiceDate,
      dueDate: values.dueDate,
      items: values.items,
      subtotal,
      vatRate: VAT_RATE,
      vatAmount,
      total,
      status: "unpaid",
      paymentTerms: values.paymentTerms,
      notes: values.notes,
    });
    
    toast.success("Invoice created successfully");
    navigate("/dashboard");
  };

  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [
      ...currentItems,
      { description: "", quantity: 1, unitPrice: 0, total: 0 },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    form.setValue(
      "items",
      currentItems.filter((_, i) => i !== index)
    );
  };

  const updateItemTotal = (index: number) => {
    const items = form.getValues("items");
    const item = items[index];
    const total = item.quantity * item.unitPrice;
    form.setValue(`items.${index}.total`, total);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 p-4 sm:p-8 fade-in">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold font-mono tracking-tight">New Invoice</h1>
        </div>

        <div className="bg-gradient-to-br from-card/50 to-background backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-sm">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
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
                            {customer.companyName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
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
                  control={form.control}
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
                  control={form.control}
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

                {form.watch("items").map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gradient-to-br from-card/30 to-background/30 backdrop-blur-sm border border-border/50 rounded-lg">
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

              <div className="space-y-4 border-t border-border/50 pt-4">
                <div className="flex justify-between text-sm font-mono">
                  <span>Subtotal:</span>
                  <span>{subtotal.toFixed(2)} SEK</span>
                </div>
                <div className="flex justify-between text-sm font-mono">
                  <span>VAT ({VAT_RATE}%):</span>
                  <span>{vatAmount.toFixed(2)} SEK</span>
                </div>
                <div className="flex justify-between font-bold font-mono">
                  <span>Total:</span>
                  <span>{total.toFixed(2)} SEK</span>
                </div>
              </div>

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

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/dashboard")}
                  className="bg-background/50 backdrop-blur-sm hover:bg-primary/20"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-primary hover:bg-primary/90"
                >
                  Create Invoice
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewInvoice;