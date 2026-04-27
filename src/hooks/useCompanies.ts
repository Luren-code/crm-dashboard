import { useCallback, useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"
import type { Company } from "@/types/company"

export function useCompanies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 用 useCallback 包裹，这样外部可以调用 refresh 重新拉数据
  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setCompanies(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  return { companies, loading, error, refresh: fetchCompanies }
}
