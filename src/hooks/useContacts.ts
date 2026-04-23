import { useCallback, useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"
import type { Contact } from "@/types/contact"

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 用 useCallback 包裹，这样外部可以调用 refresh 重新拉数据
  const fetchContacts = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      setError(error.message)
    } else {
      setContacts(data ?? [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchContacts()
  }, [fetchContacts])

  return { contacts, loading, error, refresh: fetchContacts }
}
