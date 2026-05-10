import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { ContactStatus } from "@/types/contact"

interface StatusPieChartProps {
  distribution: Record<ContactStatus, number>
}

const COLORS: Record<ContactStatus, string> = {
  lead: "#3b82f6",   // blue-500，与列表 badge 蓝色保持一致
  active: "#22c55e", // green-500
  lost: "#9ca3af",   // gray-400
}

const LABELS: Record<ContactStatus, string> = {
  lead: "潜在",
  active: "活跃",
  lost: "已流失",
}

export function StatusPieChart({ distribution }: StatusPieChartProps) {
  // 把 Record<status, count> 摊成 recharts 要的 [{ name, value }] 数组
  // value 为 0 的扇区过滤掉，避免饼图边缘出现 0 度碎片
  const data = (Object.keys(distribution) as ContactStatus[])
    .map((status) => ({
      status,
      name: LABELS[status],
      value: distribution[status],
    }))
    .filter((d) => d.value > 0)

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>联系人状态分布</CardTitle>
        <CardDescription>按潜在 / 活跃 / 已流失分组</CardDescription>
      </CardHeader>
      <CardContent>
        {total === 0 ? (
          <div className="flex h-[260px] items-center justify-center text-sm text-muted-foreground">
            暂无数据
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                labelLine={false}
                label={(entry: { name?: string; value?: number }) =>
                  `${entry.name} ${(((entry.value ?? 0) / total) * 100).toFixed(0)}%`
                }
              >
                {data.map((entry) => (
                  <Cell key={entry.status} fill={COLORS[entry.status]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`${value} 条`, String(name)]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
