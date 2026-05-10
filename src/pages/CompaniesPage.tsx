import { useMemo, useState } from "react"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react"

import { EmptyState } from "@/components/common/EmptyState"
import { ErrorState } from "@/components/common/ErrorState"
import { LoadingState } from "@/components/common/LoadingState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CompanyFormDialog } from "@/components/companies/CompanyFormDialog"
import { DeleteConfirmDialog } from "@/components/companies/DeleteConfirmDialog"
import { useCompanies } from "@/hooks/useCompanies"
import type { Company } from "@/types/company"

// ---- 类型 ----
type SortField = "name" | "industry" | "created_at"
type SortDirection = "asc" | "desc"

const PAGE_SIZE = 8

export function CompaniesPage() {
  const { companies, loading, error, refresh } = useCompanies()

  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<{
    field: SortField
    direction: SortDirection
  }>({ field: "created_at", direction: "desc" })

  const [currentPage, setCurrentPage] = useState(1)

  const [formOpen, setFormOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | undefined>()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingCompany, setDeletingCompany] = useState<Company | undefined>()

  const handleCreate = () => {
    setEditingCompany(undefined)
    setFormOpen(true)
  }

  const handleEdit = (company: Company) => {
    setEditingCompany(company)
    setFormOpen(true)
  }

  const handleDelete = (company: Company) => {
    setDeletingCompany(company)
    setDeleteOpen(true)
  }

  const handleSort = (field: SortField) => {
    setSort((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const renderSortIcon = (field: SortField) => {
    if (sort.field !== field) return <ArrowUpDown className="ml-1 h-3 w-3" />
    return sort.direction === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    )
  }

  const filteredCompanies = useMemo(() => {
    let result = [...companies]

    if (search.trim()) {
      const keyword = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(keyword) ||
          (c.industry && c.industry.toLowerCase().includes(keyword))
      )
    }

    result.sort((a, b) => {
      const valA = a[sort.field] ?? ""
      const valB = b[sort.field] ?? ""
      if (valA < valB) return sort.direction === "asc" ? -1 : 1
      if (valA > valB) return sort.direction === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [companies, search, sort])

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCompanies.length / PAGE_SIZE)
  )
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
  const pagedCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + PAGE_SIZE
  )

  return (
    <div className="space-y-4">
      {/* 标题 + 新增按钮 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">公司</h2>
          <p className="text-sm text-muted-foreground">
            共 {filteredCompanies.length} 条记录
            {filteredCompanies.length !== companies.length &&
              `（总共 ${companies.length} 条）`}
          </p>
        </div>
        <Button onClick={handleCreate} className="sm:self-auto self-start">
          <Plus className="mr-1 h-4 w-4" />
          新增公司
        </Button>
      </div>

      {/* 搜索 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索公司名或行业..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {loading && <LoadingState />}
      {error && <ErrorState error={error} />}

      {!loading && !error && filteredCompanies.length === 0 && (
        <EmptyState
          message={companies.length === 0 ? "暂无公司数据" : "没有匹配的结果"}
        />
      )}

      {!loading && !error && filteredCompanies.length > 0 && (
        <>
          <div className="rounded-md border overflow-x-auto">
            <Table className="min-w-[640px]">
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("name")}
                  >
                    <span className="inline-flex items-center">
                      公司名{renderSortIcon("name")}
                    </span>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("industry")}
                  >
                    <span className="inline-flex items-center">
                      行业{renderSortIcon("industry")}
                    </span>
                  </TableHead>
                  <TableHead>网址</TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("created_at")}
                  >
                    <span className="inline-flex items-center">
                      创建时间{renderSortIcon("created_at")}
                    </span>
                  </TableHead>
                  <TableHead className="w-24">操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">
                      {company.name}
                    </TableCell>
                    <TableCell>{company.industry ?? "-"}</TableCell>
                    <TableCell>
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {company.website}
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(company.created_at).toLocaleDateString("zh-CN")}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(company)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(company)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
              <p className="text-sm text-muted-foreground">
                第 {startIndex + 1}-
                {Math.min(startIndex + PAGE_SIZE, filteredCompanies.length)}{" "}
                条，共 {filteredCompanies.length} 条
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safeCurrentPage <= 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  上一页
                </Button>
                <span className="text-sm">
                  {safeCurrentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={safeCurrentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  下一页
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <CompanyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        company={editingCompany}
        onSuccess={refresh}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        company={deletingCompany}
        onSuccess={refresh}
      />
    </div>
  )
}
