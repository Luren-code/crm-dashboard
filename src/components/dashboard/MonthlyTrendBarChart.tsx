import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { MonthlyTrendPoint } from "@/hooks/useStats"

interface MonthlyTrendBarChartProps {
  data: MonthlyTrendPoint[]
}

export function MonthlyTrendBarChart({ data }: MonthlyTrendBarChartProps) {
  // 6 个月全是 0 → 显示"暂无数据"占位，避免一排空柱子很奇怪
  const empty = data.every((d) => d.count === 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>近 6 个月新增联系人</CardTitle>
        <CardDescription>按月聚合 created_at</CardDescription>
      </CardHeader>
      <CardContent>
        {empty ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
            暂无数据
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={data}
              margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                fontSize={12}
              />
              <Tooltip
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
                formatter={(value) => [`${value} 条`, "新增"]}
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
