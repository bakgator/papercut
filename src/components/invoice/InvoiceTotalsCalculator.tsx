import { useMemo } from "react";
import type { InvoiceItem } from "@/types/invoice";

interface InvoiceTotalsCalculatorProps {
  items: InvoiceItem[];
  children: (totals: { subtotal: number; vatAmount: number; total: number }) => React.ReactNode;
}

export const InvoiceTotalsCalculator: React.FC<InvoiceTotalsCalculatorProps> = ({
  items,
  children
}) => {
  const totals = useMemo(() => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const vatAmount = subtotal * 0.25;
    const total = subtotal + vatAmount;
    return { subtotal, vatAmount, total };
  }, [items]);

  return <>{children(totals)}</>;
};