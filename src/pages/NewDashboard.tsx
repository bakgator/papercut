import React, { useState } from "react";
import { store } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis } from "recharts";
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, subMonths, subWeeks, subYears } from "date-fns";

const NewDashboard = () => {
  const invoices = store.getInvoices();
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid').length;
  const [timeframe, setTimeframe] = useState("month");

  // Calculate invoices due within 7 days
  const today = new Date();
  const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
  const upcomingDueInvoices = invoices.filter(inv => {
    const dueDate = new Date(inv.dueDate);
    return inv.status === 'unpaid' && dueDate <= sevenDaysFromNow;
  });

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
        const invoiceDate = new Date(invoice.date);
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
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalInvoices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{paidInvoices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{unpaidInvoices}</div>
            </CardContent>
          </Card>
        </div>

        {upcomingDueInvoices.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Attention Required</AlertTitle>
            <AlertDescription>
              You have {upcomingDueInvoices.length} invoice(s) due within the next 7 days.
            </AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <ToggleGroup type="single" value={timeframe} onValueChange={(value) => value && setTimeframe(value)}>
              <ToggleGroupItem value="day">Day</ToggleGroupItem>
              <ToggleGroupItem value="week">Week</ToggleGroupItem>
              <ToggleGroupItem value="month">Month</ToggleGroupItem>
              <ToggleGroupItem value="year">Year</ToggleGroupItem>
            </ToggleGroup>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ChartContainer
                config={{
                  amount: {
                    theme: {
                      light: "hsl(var(--primary))",
                      dark: "hsl(var(--primary))",
                    },
                  },
                }}
              >
                <BarChart data={chartData}>
                  <XAxis dataKey="date" />
                  <YAxis 
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'SEK',
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      }).format(value)
                    }
                  />
                  <Bar dataKey="amount" fill="currentColor" />
                  <ChartTooltip>
                    <ChartTooltipContent />
                  </ChartTooltip>
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewDashboard;