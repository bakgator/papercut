import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const currencies = {
  SEK: { symbol: "kr", rate: 1 },
  EUR: { symbol: "€", rate: 0.087 },
  USD: { symbol: "$", rate: 0.095 },
};

export const InvoiceCalculator = () => {
  const [amount, setAmount] = useState<number>(0);
  const [currency, setCurrency] = useState<keyof typeof currencies>("SEK");
  const [vatRate, setVatRate] = useState<number>(25);
  const [discount, setDiscount] = useState<number>(0);

  const calculateTotals = () => {
    const subtotal = amount;
    const discountAmount = (subtotal * discount) / 100;
    const afterDiscount = subtotal - discountAmount;
    const vatAmount = (afterDiscount * vatRate) / 100;
    const total = afterDiscount + vatAmount;

    return {
      subtotal,
      discountAmount,
      afterDiscount,
      vatAmount,
      total,
    };
  };

  const formatCurrency = (value: number) => {
    const converted = value * currencies[currency].rate;
    return `${currencies[currency].symbol} ${converted.toFixed(2)}`;
  };

  const totals = calculateTotals();

  return (
    <Card className="p-6 bg-background/50 backdrop-blur-sm border border-border/50">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="font-mono">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-background/50 backdrop-blur-sm"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="currency" className="font-mono">Currency</Label>
            <Select value={currency} onValueChange={(value: keyof typeof currencies) => setCurrency(value)}>
              <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(currencies).map((curr) => (
                  <SelectItem key={curr} value={curr}>
                    {curr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vat" className="font-mono">VAT Rate (%)</Label>
            <Select value={vatRate.toString()} onValueChange={(value) => setVatRate(Number(value))}>
              <SelectTrigger className="bg-background/50 backdrop-blur-sm">
                <SelectValue placeholder="Select VAT rate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0%</SelectItem>
                <SelectItem value="6">6%</SelectItem>
                <SelectItem value="12">12%</SelectItem>
                <SelectItem value="25">25%</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount" className="font-mono">Discount (%)</Label>
            <Input
              id="discount"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="bg-background/50 backdrop-blur-sm"
              min="0"
              max="100"
            />
          </div>
        </div>

        <div className="space-y-3 border-t border-border/50 pt-4">
          <div className="flex justify-between text-sm font-mono">
            <span>Subtotal:</span>
            <span>{formatCurrency(totals.subtotal)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm font-mono text-muted-foreground">
              <span>Discount ({discount}%):</span>
              <span>-{formatCurrency(totals.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-mono">
            <span>Amount after discount:</span>
            <span>{formatCurrency(totals.afterDiscount)}</span>
          </div>
          <div className="flex justify-between text-sm font-mono">
            <span>VAT ({vatRate}%):</span>
            <span>{formatCurrency(totals.vatAmount)}</span>
          </div>
          <div className="flex justify-between font-bold font-mono pt-2 border-t border-border/50">
            <span>Total:</span>
            <span>{formatCurrency(totals.total)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};