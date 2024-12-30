import React from "react";
import { store } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { RevenueOverview } from "@/components/dashboard/RevenueOverview";
import { Button } from "@/components/ui/button";

const NewDashboard = () => {
  const invoices = store.getInvoices();
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const unpaidInvoices = invoices.filter(inv => inv.status === 'unpaid').length;

  const today = new Date();
  const sevenDaysFromNow = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));
  const upcomingDueInvoices = invoices.filter(inv => {
    const dueDate = new Date(inv.dueDate);
    return inv.status === 'unpaid' && dueDate <= sevenDaysFromNow;
  });

  return (
    <div className="min-h-screen p-4 fade-in">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold font-mono text-left">Dashboard Overview</h1>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="bg-custom-element border-gray-200/50 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono text-left">{totalInvoices}</div>
            </CardContent>
          </Card>

          <Card className="bg-custom-element border-gray-200/50 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 font-mono text-left">{paidInvoices}</div>
            </CardContent>
          </Card>

          <Card className="bg-custom-element border-gray-200/50 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unpaid Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 font-mono text-left">{unpaidInvoices}</div>
            </CardContent>
          </Card>
        </div>

        {upcomingDueInvoices.length > 0 && (
          <Alert variant="destructive" className="bg-custom-element border-gray-200/50 shadow-sm backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 mt-1" />
                <div className="text-left">
                  <AlertTitle>Attention Required</AlertTitle>
                  <AlertDescription>
                    You have {upcomingDueInvoices.length} invoice(s) due within the next 7 days.
                  </AlertDescription>
                </div>
              </div>
              <Button variant="outline" className="gap-2 bg-custom-element hover:bg-white/80">
                <AlertCircle className="w-4 h-4" />
                Check this
              </Button>
            </div>
          </Alert>
        )}

        <RevenueOverview />
      </div>
    </div>
  );
};

export default NewDashboard;