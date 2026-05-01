"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { parse, format } from "date-fns";

interface chatType {
  data: any;
  year: string;
  type?: string;
  date?: string;
}

export function ExpenseChart({ data, year, type, date }: chatType) {
  const [chartData, setChartData] = useState<any>([]);

  useEffect(() => {
    let dataSet;
    if (type === "daily" && date) {
      const dailyReports =
        year === "lastYear"
          ? data?.summaryReport?.previousYear?.dailyReports
          : data?.summaryReport?.currentYear?.dailyReports;
      const mergedReports = dailyReports?.flat();
      dataSet = mergedReports?.filter((report: any) => report.date === date)
    } else {
      dataSet = year === "lastYear"
        ? data?.summaryReport?.previousYear?.monthlyReports.map((report: any) => ({
          month: report.month,
          expense: report.totalExpense,
          income: report.totalIncome,
        }))
        : data?.summaryReport?.currentYear?.monthlyReports.map((report: any) => ({
          month: report.month,
          expense: report.totalExpense,
          income: report.totalIncome,
        }));
    }
    setChartData(Array.isArray(dataSet) ? dataSet : [dataSet]);
  }, [year, data, type, date]);

  console.log("chartdat", chartData)


  const chartConfig = {
    desktop: {
      label: "Expense",
      color: "orange",
    },
    mobile: {
      label: "Income",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey={type === "daily" ? "date" : "month"}
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) =>
            type === "daily" ? value : value.slice(0, 3)
          }
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey={type == "daily" ? 'totalExpense' : 'expense'} fill="var(--color-desktop)" radius={4} />
        <Bar dataKey={type == "daily" ? 'totalIncome' : 'income'} fill="var(--color-mobile)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
