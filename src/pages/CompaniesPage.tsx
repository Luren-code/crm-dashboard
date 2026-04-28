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

  // 筛选/排序状态
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState<{
    field: SortField
    direction: SortDirection
  }>({ field: "created_at", direction: "desc" })

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)

  // 新增/编辑弹窗状态
  const [formOpen, setFormOpen] = useState(false)
  const [editingCompany, setEditingCompany] = useState<Company | undefined>()

  // 删除弹窗状态
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingCompany, setDeletingCompany] = useState<Company | undefined>()

  // ---- 事件处理 ----
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

  // ---- 筛选 + 排序 ----
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

  // ---- 分页 ----
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">公司</h2>
          <p className="text-sm text-muted-foreground">
            共 {filteredCompanies.length} 条记录
            {filteredCompanies.length !== companies.length &&
              `（总共 ${companies.length} 条）`}
          </p>
        </div>
        <Button onClick={handleCreate}>
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

      {/* 加载态 */}
      {loading && (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          加载中...
        </div>
      )}

      {/* 错误态 */}
      {error && (
        <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
          加载失败：{error}
        </div>
      )}

      {/* 空态 */}
      {!loading && !error && filteredCompanies.length === 0 && (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          {companies.length === 0 ? "暂无公司数据" : "没有匹配的结果"}
        </div>
      )}

      {/* 数据表格 */}
      {!loading && !error && filteredCompanies.length > 0 && (
        <>
          <div className="rounded-md border">
            <Table>
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

          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
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

      {/* 新增/编辑弹窗 */}
      <CompanyFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        company={editingCompany}
        onSuccess={refresh}
      />

      {/* 删除确认弹窗 */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        company={deletingCompany}
        onSuccess={refresh}
      />
    </div>
  )
}
