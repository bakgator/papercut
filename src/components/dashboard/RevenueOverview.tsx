import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfDay, eachDayOfInterval, eachMonthOfInterval, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, addHours, startOfHour } from "date-fns";
import { store } from "@/lib/store";
import { TimeframeToggle } from "./TimeframeToggle";
import { RevenueChart } from "./RevenueChart";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'SEK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const RevenueOverview = () => {
  const [timeframe, setTimeframe] = useState("month");
  const invoices = store.getInvoices();

  const getTimeframeData = () => {
    const now = new Date();
    let start: Date;
    let intervals: Date[];

    switch (timeframe) {
      case "day": {
        start = startOfDay(now);
        intervals = Array.from({ length: 6 }, (_, i) => addHours(start, i * 4));
        break;
      }
      case "week": {
        start = startOfWeek(now, { weekStartsOn: 1 });
        const end = endOfWeek(now, { weekStartsOn: 1 });
        intervals = eachDayOfInterval({ start, end });
        break;
      }
      case "month": {
        start = startOfMonth(now);
        const end = endOfMonth(now);
        intervals = eachDayOfInterval({ start, end });
        break;
      }
      case "year": {
        start = startOfYear(now);
        const end = endOfYear(now);
        intervals = eachMonthOfInterval({ start, end });
        break;
      }
      case "all": {
        const firstInvoiceDate = invoices.length > 0 
          ? new Date(Math.min(...invoices.map(inv => new Date(inv.date).getTime())))
          : new Date(now.getFullYear() - 3, now.getMonth(), now.getDate());
        start = firstInvoiceDate;
        intervals = eachMonthOfInterval({ start, end: now });
        break;
      }
      default:
        start = startOfMonth(now);
        const end = endOfMonth(now);
        intervals = eachDayOfInterval({ start, end });
    }

    return intervals.map(date => {
      let nextDate: Date;
      let label: string;

      switch (timeframe) {
        case "day":
          nextDate = addHours(date, 4);
          label = format(date, "HH:mm");
          break;
        case "week":
          nextDate = new Date(date.getTime() + (24 * 60 * 60 * 1000));
          label = format(date, "EEE");
          break;
        case "month":
          nextDate = new Date(date.getTime() + (24 * 60 * 60 * 1000));
          label = format(date, "d");
          break;
        case "year":
          nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
          label = format(date, "MMM");
          break;
        case "all":
          nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
          label = format(date, "MMM yyyy");
          break;
        default:
          nextDate = new Date(date.getTime() + (24 * 60 * 60 * 1000));
          label = format(date, "MMM d");
      }

      const periodInvoices = invoices.filter(invoice => {
        const invoiceDate = startOfDay(new Date(invoice.date));
        return invoiceDate >= date && invoiceDate < nextDate;
      });

      const total = periodInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

      return {
        date: label,
        amount: total
      };
    });
  };

  const chartData = getTimeframeData();
  const maxAmount = Math.max(...chartData.map(item => item.amount));

  return (
    <Card className="overflow-hidden border border-border/50 bg-gradient-to-br from-card/50 to-background backdrop-blur-sm">
      <CardHeader className="space-y-4">
        <CardTitle className="font-mono text-xl tracking-tight">Revenue Overview</CardTitle>
        <TimeframeToggle value={timeframe} onValueChange={setTimeframe} />
      </CardHeader>
      <CardContent className="h-[300px]">
        <RevenueChart 
          data={chartData}
          maxAmount={maxAmount}
          formatCurrency={formatCurrency}
        />
      </CardContent>
    </Card>
  );
};