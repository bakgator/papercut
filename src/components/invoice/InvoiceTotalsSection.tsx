import React from "react";

interface InvoiceTotalsSectionProps {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

export const InvoiceTotalsSection: React.FC<InvoiceTotalsSectionProps> = ({
  subtotal,
  vatRate,
  vatAmount,
  total,
}) => {
  return (
    <div className="space-y-4 border-t border-border/50 pt-4">
      <div className="flex justify-between text-sm font-mono">
        <span>Subtotal:</span>
        <span>{subtotal.toFixed(2)} SEK</span>
      </div>
      <div className="flex justify-between text-sm font-mono">
        <span>VAT ({vatRate}%):</span>
        <span>{vatAmount.toFixed(2)} SEK</span>
      </div>
      <div className="flex justify-between font-bold font-mono">
        <span>Total:</span>
        <span>{total.toFixed(2)} SEK</span>
      </div>
    </div>
  );
};