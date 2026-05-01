import { useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"
import type { ContactStatus } from "@/types/contact"

export interface DashboardStats {
  totalContacts: number
  totalCompanies: number
  newContactsThisMonth: number
  statusDistribution: Record<ContactStatus, number>
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

      // 六个 count 查询并行——一个 round-trip 拿全部统计
      // { count: "exact", head: true } 只返回 count、不返回数据，最省流量
      const [
        contactsRes,
        companiesRes,
        newContactsRes,
        leadRes,
        activeRes,
        lostRes,
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
      ])

      // 任一请求出错就整体置错——不展示半截数据
      const firstError = [
        contactsRes,
        companiesRes,
        newContactsRes,
        leadRes,
        activeRes,
        lostRes,
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
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  return { stats, loading, error }
}
