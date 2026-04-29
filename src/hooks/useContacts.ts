import { useCallback, useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"
import type { ContactWithCompany } from "@/types/contact"

export function useContacts() {
  const [contacts, setContacts] = useState<ContactWithCompany[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 用 useCallback 包裹，这样外部可以调用 refresh 重新拉数据
  const fetchContacts = useCallback(async () => {
    setLoading(true)
    setError(null)

    // "*, companies(name)" = 拉 contacts 全部列，加上外键关联的公司名
    // 依赖 contacts.company_id → companies.id 的外键约束
    const { data, error } = await supabase
      .from("contacts")
      .select("*, companies(name)")
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setContacts((data ?? []) as ContactWithCompany[])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  return { contacts, loading, error, refresh: fetchContacts }
}
