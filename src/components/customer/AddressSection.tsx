import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { UseFormReturn } from "react-hook-form";
import { CustomerFormData } from "@/types/customer";

interface AddressSectionProps {
  form: UseFormReturn<CustomerFormData>;
}

export function AddressSection({ form }: AddressSectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Address Information</h3>
      <FormField
        control={form.control}
        name="billingAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="after:content-['*'] after:ml-0.5 after:text-red-500">Billing Address</FormLabel>
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
    </div>
  );
}