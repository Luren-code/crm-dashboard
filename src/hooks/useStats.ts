import { useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"
import type { ContactStatus } from "@/types/contact"

export interface MonthlyTrendPoint {
  month: string  // "2026-05"，用于排序/key
  label: string  // "5月"，用于图表 X 轴显示
  count: number
}

export interface DashboardStats {
  totalContacts: number
  totalCompanies: number
  newContactsThisMonth: number
  statusDistribution: Record<ContactStatus, number>
  monthlyTrend: MonthlyTrendPoint[]
}

// 最近 6 个月（含本月）的 created_at 列表 → 按月份分桶聚合
// 预填充 0 保证图表上每个月都有一根柱子，即使没新增
function buildMonthlyTrend(
  rows: { created_at: string }[]
): MonthlyTrendPoint[] {
  const now = new Date()
  const buckets = new Map<string, number>()

  // 从 5 个月前到本月，依次塞入空桶（Map 迭代顺序 = 插入顺序）
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    buckets.set(key, 0)
  }

  for (const row of rows) {
    const d = new Date(row.created_at)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    // 只统计在窗口内的（理论上 SQL 已过滤，这里是双保险）
    if (buckets.has(key)) {
      buckets.set(key, buckets.get(key)! + 1)
    }
  }

  return Array.from(buckets.entries()).map(([month, count]) => ({
    month,
    label: `${Number(month.split("-")[1])}月`,
    count,
  }))
}

export function useStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      setError(null)

      // 本月 1 号 0:00 的 ISO 字符串（用于 created_at >= monthStart 比较）
      const now = new Date()
      const monthStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      ).toISOString()
      // 5 个月前的 1 号——配合本月共 6 个月窗口
      const sixMonthsAgo = new Date(
        now.getFullYear(),
        now.getMonth() - 5,
        1
      ).toISOString()

      // 七个查询并行——一个 round-trip 拿全部统计
      // { count: "exact", head: true } 只返回 count、不返回数据，最省流量
      // 最后一个 trendRes 拉 created_at 列表，前端 group by 月份
      const [
        contactsRes,
        companiesRes,
        newContactsRes,
        leadRes,
        activeRes,
        lostRes,
        trendRes,
      ] = await Promise.all([
        supabase
          .from("contacts")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("companies")
          .select("*", { count: "exact", head: true }),
        supabase
          .from("contacts")
          .select("*", { count: "exact", head: true })
          .gte("created_at", monthStart),
        supabase
          .from("contacts")
          .select("*", { count: "exact", head: true })
          .eq("status", "lead"),
        supabase
          .from("contacts")
          .select("*", { count: "exact", head: true })
          .eq("status", "active"),
        supabase
          .from("contacts")
          .select("*", { count: "exact", head: true })
          .eq("status", "lost"),
        // select("created_at") 只拉一列，最近 6 个月的行——前端再聚合
        supabase
          .from("contacts")
          .select("created_at")
          .gte("created_at", sixMonthsAgo),
      ])

      // 任一请求出错就整体置错——不展示半截数据
      const firstError = [
        contactsRes,
        companiesRes,
        newContactsRes,
        leadRes,
        activeRes,
        lostRes,
        trendRes,
      ].find((r) => r.error)

      if (firstError?.error) {
        setError(firstError.error.message)
        setLoading(false)
        return
      }

      setStats({
        totalContacts: contactsRes.count ?? 0,
        totalCompanies: companiesRes.count ?? 0,
        newContactsThisMonth: newContactsRes.count ?? 0,
        statusDistribution: {
          lead: leadRes.count ?? 0,
          active: activeRes.count ?? 0,
          lost: lostRes.count ?? 0,
        },
        monthlyTrend: buildMonthlyTrend(trendRes.data ?? []),
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
