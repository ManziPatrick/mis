"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useGetAllRejectedRequest } from "@/utlis/hooks/report.hook"


interface chartType {
  approved?: number
  rejected?: number
  pending?: number
}

export function RequestChart({ rejected, pending, approved }: chartType) {
  const chartData = [
    { browser: "approved", visitors: approved, fill: "var(--color-approved)" },
    { browser: "pending", visitors: pending, fill: "var(--color-pending)" },
    { browser: "rejected", visitors: rejected, fill: "var(--color-rejected)" },
  ]

  const chartConfig = {
    approved: {
      label: "Approved",
      color: "hsl(var(--chart-2))",
    },
    pending: {
      label: "Pending",
      color: "hsl(var(--chart-1))",
    },
    rejected: {
      label: "Rejected",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Requests</CardTitle>
        <CardDescription>Request statistics</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>

    </Card>
  )
}
