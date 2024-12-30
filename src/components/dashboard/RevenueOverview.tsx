import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";
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
        start = subMonths(now, 1);
        intervals = eachDayOfInterval({ start, end: now });
        break;
      case "week":
        start = subMonths(now, 3);
        intervals = eachWeekOfInterval({ start, end: now });
        break;
      case "month":
        start = subYears(now, 1);
        intervals = eachMonthOfInterval({ start, end: now });
        break;
      case "year":
        start = subYears(now, 3);
        intervals = eachYearOfInterval({ start, end: now });
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
          nextDate = new Date(date.getTime() + (7 * 24 * 60 * 60 * 1000));
          break;
        case "month":
          nextDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
          break;
        case "year":
          nextDate = new Date(date.getFullYear() + 1, 0, 1);
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
          label = format(date, "MMM d");
          break;
        case "week":
          label = `Week ${format(date, "w")}`;
          break;
        case "month":
          label = format(date, "MMM yyyy");
          break;
        case "year":
          label = format(date, "yyyy");
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
          <ToggleGroupItem value="day" className="font-mono">Day</ToggleGroupItem>
          <ToggleGroupItem value="week" className="font-mono">Week</ToggleGroupItem>
          <ToggleGroupItem value="month" className="font-mono">Month</ToggleGroupItem>
          <ToggleGroupItem value="year" className="font-mono">Year</ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ChartContainer config={chartConfig}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="date" 
                axisLine={false}
                tickLine={false}
                hide={true}
              />
              <YAxis 
                tickFormatter={(value) => formatCurrency(Number(value))}
                axisLine={false}
                tickLine={false}
                hide={true}
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
        </div>
      </CardContent>
    </Card>
  );
};