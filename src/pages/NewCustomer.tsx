import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type CustomerFormData = {
  companyName: string;
  orgNumber: string;
  vatNumber: string;
  billingAddress: string;
  shippingAddress: string;
  useCustomShipping: boolean;
  email: string;
  phone: string;
  responsiblePerson: string;
};

const NewCustomer = () => {
  const navigate = useNavigate();
  const form = useForm<CustomerFormData>({
    defaultValues: {
      companyName: "",
      orgNumber: "",
      vatNumber: "",
      billingAddress: "",
      shippingAddress: "",
      useCustomShipping: false,
      email: "",
      phone: "",
      responsiblePerson: "",
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    // TODO: Implement actual customer creation logic
    console.log("Customer data:", data);
    toast.success("Customer created successfully");
    navigate("/customers");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">New Customer</h1>
          <p className="text-gray-500 mt-2">Add a new customer to your system</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter company name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="orgNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisation Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter organisation number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="vatNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>VAT Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter VAT number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="billingAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Billing Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter billing address"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="useCustomShipping"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Different shipping address</FormLabel>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("useCustomShipping") && (
                <FormField
                  control={form.control}
                  name="shippingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Shipping Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter shipping address"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="responsiblePerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsible Person</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter responsible person's name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/customers")}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Customer</Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default NewCustomer;