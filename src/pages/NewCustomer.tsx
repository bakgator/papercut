import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CompanyInfoSection } from "@/components/customer/CompanyInfoSection";
import { AddressSection } from "@/components/customer/AddressSection";
import { ContactPersonSection } from "@/components/customer/ContactPersonSection";
import { CustomerFormData } from "@/types/customer";
import { store } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const customerSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  orgNumber: z.string().min(1, "Organisation number is required"),
  vatNumber: z.string().optional(),
  billingAddress: z.string().min(1, "Billing address is required"),
  shippingAddress: z.string().optional(),
  useCustomShipping: z.boolean(),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  contactPerson: z.object({
    name: z.string().optional(),
    position: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }),
});

const NewCustomer = () => {
  const navigate = useNavigate();
  const form = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      companyName: "",
      orgNumber: "",
      vatNumber: "",
      billingAddress: "",
      shippingAddress: "",
      useCustomShipping: false,
      email: "",
      phone: "",
      contactPerson: {
        name: "",
        position: "",
        email: "",
        phone: "",
      },
    },
  });

  const onSubmit = async (data: CustomerFormData) => {
    try {
      store.addCustomer({
        companyName: data.companyName,
        email: data.email,
        phone: data.phone,
        billingAddress: data.billingAddress,
      });
      
      toast.success("Customer created successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Failed to create customer");
    }
  };

  return (
    <div className="min-h-screen bg-custom-bg p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">New Customer</h1>
          <p className="text-gray-500 mt-2">Add a new customer to your system</p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <CompanyInfoSection form={form} />
              <AddressSection form={form} />
              <ContactPersonSection form={form} />

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