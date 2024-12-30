import { memo } from "react";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface RevenueChartProps {
  data: Array<{ date: string; amount: number }>;
  maxAmount: number;
  formatCurrency: (value: number) => string;
}

export const RevenueChart = memo(({ data, maxAmount, formatCurrency }: RevenueChartProps) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <ChartContainer config={{
        amount: {
          theme: {
            light: "hsl(var(--primary))",
            dark: "hsl(var(--primary))"
          }
        }
      }}>
        <LineChart 
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <XAxis 
            dataKey="date" 
            axisLine={true}
            tickLine={true}
            stroke="currentColor"
            fontSize={12}
            className="font-mono"
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(Number(value))}
            axisLine={true}
            tickLine={true}
            stroke="currentColor"
            fontSize={12}
            ticks={[maxAmount]}
            className="font-mono"
          />
          <Line 
            type="monotone"
            dataKey="amount"
            stroke="currentColor"
            strokeWidth={2}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
            className="!stroke-primary"
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-popover text-popover-foreground p-3 rounded-lg border border-border shadow-lg backdrop-blur-sm">
                    <p className="font-mono text-sm">{formatCurrency(Number(payload[0].value))}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </LineChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
});

RevenueChart.displayName = "RevenueChart";