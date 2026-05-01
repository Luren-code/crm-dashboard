import { Building2, TrendingUp, UserCheck, Users } from "lucide-react"

import { StatCard } from "@/components/dashboard/StatCard"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useStats } from "@/hooks/useStats"
import { statusConfig, type ContactStatus } from "@/types/contact"

const STATUS_ORDER: ContactStatus[] = ["lead", "active", "lost"]

export function DashboardPage() {
  const { stats, loading, error } = useStats()

  if (loading) {
    return (
      <div className="rounded-md border p-8 text-center text-muted-foreground">
        加载中...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        加载失败：{error}
      </div>
    )
  }

  if (!stats) return null

  // 状态分布总数（用于算百分比，避免除零）
  const statusTotal =
    stats.statusDistribution.lead +
    stats.statusDistribution.active +
    stats.statusDistribution.lost

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">数据概览</h2>
        <p className="text-sm text-muted-foreground">
          客户和公司的核心指标
        </p>
      </div>

      {/* 4 张统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="联系人总数"
          value={stats.totalContacts}
          icon={Users}
          description="所有客户记录"
        />
        <StatCard
          title="公司总数"
          value={stats.totalCompanies}
          icon={Building2}
          description="已录入公司"
        />
        <StatCard
          title="本月新增"
          value={stats.newContactsThisMonth}
          icon={TrendingUp}
          description="本月新增联系人"
        />
        <StatCard
          title="活跃联系人"
          value={stats.statusDistribution.active}
          icon={UserCheck}
          description="状态为活跃"
        />
      </div>

      {/* 状态分布——简易进度条 */}
      <Card>
        <CardHeader>
          <CardTitle>联系人状态分布</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {STATUS_ORDER.map((status) => {
            const count = stats.statusDistribution[status]
            const percent = statusTotal === 0 ? 0 : (count / statusTotal) * 100
            const config = statusConfig[status]
            return (
              <div key={status}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${config.className}`}
                  >
                    {config.label}
                  </span>
                  <span className="text-muted-foreground">
                    {count} 条（{percent.toFixed(1)}%）
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
