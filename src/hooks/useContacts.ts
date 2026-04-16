import { useEffect, useState } from "react"

import { supabase } from "@/lib/supabase"
import type { Contact } from "@/types/contact"

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchContacts() {
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
    }

    fetchContacts()
  }, [])

  return { contacts, loading, error }
}
