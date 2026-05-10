import { Building2, TrendingUp, UserCheck, Users } from "lucide-react"

import { ErrorState } from "@/components/common/ErrorState"
import { LoadingState } from "@/components/common/LoadingState"
import { MonthlyTrendBarChart } from "@/components/dashboard/MonthlyTrendBarChart"
import { StatCard } from "@/components/dashboard/StatCard"
import { StatusPieChart } from "@/components/dashboard/StatusPieChart"
import { useStats } from "@/hooks/useStats"

export function DashboardPage() {
  const { stats, loading, error } = useStats()

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!stats) return null

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">数据概览</h2>
        <p className="text-sm text-muted-foreground">
          客户和公司的核心指标
        </p>
      </div>

      {/* 4 张统计卡片 —— 桌面 4 列、平板 2 列、手机 1 列 */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

      {/* 图表区 —— 桌面双栏，移动端堆叠 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <StatusPieChart distribution={stats.statusDistribution} />
        <MonthlyTrendBarChart data={stats.monthlyTrend} />
      </div>
    </div>
  )
}
