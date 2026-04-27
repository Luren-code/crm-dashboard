import { CompanyFormDialog } from "@/components/companies/CompanyFormDialog";
import { useCompanies } from "@/hooks/useCompanies";
import { type Company } from "@/types/company";
import { useState } from "react";

const [deleteOpen, setDeleteOpen] = useState(false)
const [deletingCompany, setDeleteCompany] = useState<Company | undefined>()

export function CompaniesPage() {
  const { companies, loading, error, refresh } = useCompanies()
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight">公司</h2>
      <p className="text-muted-foreground">公司列表（Day 7 实现）</p>

      <CompanyFormDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onSuccess={refresh}
        />
    </div>

  )
}
