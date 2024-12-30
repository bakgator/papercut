import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { format, startOfDay, subMonths, subWeeks, subYears, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval } from "date-fns";
import { store } from "@/lib/store";

const chartConfig = {
  amount: {
    theme: {
      light: "hsl(var(--primary))",
      dark: "hsl(var(--primary))"
    }
  }
};

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
      case "day":
        start = new Date(now.setHours(0, 0, 0, 0));
        intervals = eachDayOfInterval({ start, end: now });
        break;
      case "week":
        start = subWeeks(now, 1);
        intervals = eachDayOfInterval({ start, end: now });
        break;
      case "month":
        start = subMonths(now, 1);
        intervals = eachDayOfInterval({ start, end: now });
        break;
      case "year":
        start = subYears(now, 1);
        intervals = eachMonthOfInterval({ start, end: now });
        break;
      case "all":
        // Get the date of the first invoice or default to 3 years ago
        const firstInvoiceDate = invoices.length > 0 
          ? new Date(Math.min(...invoices.map(inv => new Date(inv.date).getTime())))
          : subYears(now, 3);
        start = firstInvoiceDate;
        intervals = eachMonthOfInterval({ start, end: now });
        break;
      default:
        start = subMonths(now, 1);
        intervals = eachDayOfInterval({ start, end: now });
    }

    return intervals.map(date => {
      let nextDate: Date;
      switch (timeframe) {
        case "day":
          nextDate = new Date(date.getTime() + (24 * 60 * 60 * 1000));
          break;
        case "week":
          nextDate = new Date(date.getTime() + (24 * 60 * 60 * 1000));
          break;
        case "month":
          nextDate = new Date(date.getTime() + (24 * 60 * 60 * 1000));
          break;
        case "year":
        case "all":
          nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
          break;
        default:
          nextDate = new Date(date.getTime() + (24 * 60 * 60 * 1000));
      }

      const periodInvoices = invoices.filter(invoice => {
        const invoiceDate = startOfDay(new Date(invoice.date));
        return invoiceDate >= date && invoiceDate < nextDate;
      });

      const total = periodInvoices.reduce((sum, invoice) => sum + invoice.total, 0);

      let label: string;
      switch (timeframe) {
        case "day":
          label = "This day";
          break;
        case "week":
          label = "This week";
          break;
        case "month":
          label = "This month";
          break;
        case "year":
          label = "This year";
          break;
        case "all":
          label = format(date, "MMM yyyy");
          break;
        default:
          label = format(date, "MMM d");
      }

      return {
        date: label,
        amount: total
      };
    });
  };

  const chartData = getTimeframeData();
  
  // Find the maximum value for Y axis
  const maxAmount = Math.max(...chartData.map(item => item.amount));

  return (
    <Card className="card-gradient">
      <CardHeader>
        <CardTitle>Revenue Overview</CardTitle>
        <ToggleGroup 
          type="single" 
          value={timeframe} 
          onValueChange={(value) => value && setTimeframe(value)} 
          className="justify-start"
        >
          <ToggleGroupItem value="day" className="font-mono">This day</ToggleGroupItem>
          <ToggleGroupItem value="week" className="font-mono">This week</ToggleGroupItem>
          <ToggleGroupItem value="month" className="font-mono">This month</ToggleGroupItem>
          <ToggleGroupItem value="year" className="font-mono">This year</ToggleGroupItem>
          <ToggleGroupItem value="all" className="font-mono">All time</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <LineChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis 
                dataKey="date" 
                axisLine={true}
                tickLine={true}
                hide={false}
                stroke="currentColor"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(Number(value))}
                axisLine={true}
                tickLine={true}
                hide={false}
                stroke="currentColor"
                fontSize={12}
                ticks={[maxAmount]}
              />
              <Line 
                type="monotone"
                dataKey="amount"
                stroke="currentColor"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
                strokeDasharray="5 5"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover text-popover-foreground p-2 rounded-sm border border-border">
                        <p className="font-mono">{formatCurrency(Number(payload[0].value))}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </LineChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};