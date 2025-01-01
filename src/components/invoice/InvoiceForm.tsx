import React from "react";
import { FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import { InvoiceHeader } from "./InvoiceHeader";
import { InvoiceCustomerSection } from "./InvoiceCustomerSection";
import { InvoiceDatesSection } from "./InvoiceDatesSection";
import { InvoiceItemsSection } from "./InvoiceItemsSection";
import { InvoiceNotesSection } from "./InvoiceNotesSection";
import { InvoiceTotalsSection } from "./InvoiceTotalsSection";
import { InvoiceTotalsCalculator } from "./InvoiceTotalsCalculator";
import { Button } from "@/components/ui/button";
import { SaveIcon, Calculator } from "lucide-react";
import { useCustomers } from "@/hooks/useCustomers";
import { useInvoiceForm } from "@/hooks/useInvoiceForm";

interface Props {
  existingInvoiceId?: string;
}

const InvoiceForm = ({ existingInvoiceId }: Props) => {
  const { data: customers } = useCustomers();
  const { methods, updateItemTotal, onSubmit, isSubmitting } = useInvoiceForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="space-y-8">
          <div className="flex justify-end">
            <Link to="/invoices/calculator">
              <Button variant="outline" className="gap-2">
                <Calculator className="w-4 h-4" />
                Price Calculator
              </Button>
            </Link>
          </div>
          <InvoiceHeader />
          <InvoiceCustomerSection customers={customers || []} />
          <InvoiceDatesSection />
          <InvoiceItemsSection updateItemTotal={updateItemTotal} />
          <InvoiceNotesSection />
          <InvoiceTotalsCalculator items={methods.watch("items")}>
            {(totals) => (
              <InvoiceTotalsSection 
                subtotal={totals.subtotal}
                vatRate={25}
                vatAmount={totals.vatAmount}
                total={totals.total}
              />
            )}
          </InvoiceTotalsCalculator>
          <div className="flex justify-end space-x-4">
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={isSubmitting}
            >
              <SaveIcon className="w-4 h-4 mr-2" />
              {isSubmitting ? "Saving..." : "Save & Create"}
            </Button>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default InvoiceForm;