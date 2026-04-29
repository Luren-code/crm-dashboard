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
import { ContactFormDialog } from "@/components/contacts/ContactFormDialog"
import { DeleteConfirmDialog } from "@/components/contacts/DeleteConfirmDialog"
import { useContacts } from "@/hooks/useContacts"
import { statusConfig, type Contact, type ContactStatus } from "@/types/contact"

// ---- 类型 ----
type SortField = "name" | "email" | "status" | "created_at"
type SortDirection = "asc" | "desc"

const PAGE_SIZE = 8 // 每页显示条数

const statusFilters: { value: ContactStatus | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "lead", label: "潜在" },
  { value: "active", label: "活跃" },
  { value: "lost", label: "已流失" },
]

export function ContactsPage() {
  const { contacts, loading, error, refresh } = useContacts()

  // 筛选/排序状态
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all")
  const [sort, setSort] = useState<{
    field: SortField
    direction: SortDirection
  }>({ field: "created_at", direction: "desc" })

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1)

  // 新增/编辑弹窗状态
  const [formOpen, setFormOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | undefined>()

  // 删除弹窗状态
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingContact, setDeletingContact] = useState<Contact | undefined>()

  // 点击"新增"
  const handleCreate = () => {
    setEditingContact(undefined)
    setFormOpen(true)
  }

  // 点击"编辑"
  const handleEdit = (contact: Contact) => {
    setEditingContact(contact)
    setFormOpen(true)
  }

  // 点击"删除"
  const handleDelete = (contact: Contact) => {
    setDeletingContact(contact)
    setDeleteOpen(true)
  }

  // 点击表头切换排序
  const handleSort = (field: SortField) => {
    setSort((prev) => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
    setCurrentPage(1) // 排序变了回第一页
  }

  // 搜索或筛选变化时回第一页
  const handleSearchChange = (value: string) => {
    setSearch(value)
    setCurrentPage(1)
  }

  const handleStatusFilterChange = (value: ContactStatus | "all") => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  // 渲染排序图标
  const renderSortIcon = (field: SortField) => {
    if (sort.field !== field) return <ArrowUpDown className="ml-1 h-3 w-3" />
    return sort.direction === "asc" ? (
      <ArrowUp className="ml-1 h-3 w-3" />
    ) : (
      <ArrowDown className="ml-1 h-3 w-3" />
    )
  }

  // 筛选 + 排序
  const filteredContacts = useMemo(() => {
    let result = [...contacts]

    if (search.trim()) {
      const keyword = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(keyword) ||
          (c.email && c.email.toLowerCase().includes(keyword)) ||
          (c.companies?.name && c.companies.name.toLowerCase().includes(keyword))
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }

    result.sort((a, b) => {
      const valA = a[sort.field] ?? ""
      const valB = b[sort.field] ?? ""
      if (valA < valB) return sort.direction === "asc" ? -1 : 1
      if (valA > valB) return sort.direction === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [contacts, search, statusFilter, sort])

  // 分页计算
  const totalPages = Math.max(1, Math.ceil(filteredContacts.length / PAGE_SIZE))
  const safeCurrentPage = Math.min(currentPage, totalPages)
  const startIndex = (safeCurrentPage - 1) * PAGE_SIZE
  const pagedContacts = filteredContacts.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <div className="space-y-4">
      {/* 标题 + 新增按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">联系人</h2>
          <p className="text-sm text-muted-foreground">
            共 {filteredContacts.length} 条记录
            {filteredContacts.length !== contacts.length &&
              `（总共 ${contacts.length} 条）`}
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-1 h-4 w-4" />
          新增联系人
        </Button>
      </div>

      {/* 搜索 + 状态筛选 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索姓名、邮箱或公司..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-1">
          {statusFilters.map((item) => (
            <Button
              key={item.value}
              variant={statusFilter === item.value ? "default" : "outline"}
              size="sm"
              onClick={() => handleStatusFilterChange(item.value)}
            >
              {item.label}
            </Button>
          ))}
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
      {!loading && !error && filteredContacts.length === 0 && (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          {contacts.length === 0 ? "暂无联系人数据" : "没有匹配的结果"}
        </div>
      )}

      {/* 数据表格 */}
      {!loading && !error && filteredContacts.length > 0 && (
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
                      姓名{renderSortIcon("name")}
                    </span>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("email")}
                  >
                    <span className="inline-flex items-center">
                      邮箱{renderSortIcon("email")}
                    </span>
                  </TableHead>
                  <TableHead>电话</TableHead>
                  <TableHead>公司</TableHead>
                  <TableHead
                    className="cursor-pointer select-none"
                    onClick={() => handleSort("status")}
                  >
                    <span className="inline-flex items-center">
                      状态{renderSortIcon("status")}
                    </span>
                  </TableHead>
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
                {pagedContacts.map((contact) => {
                  const status = statusConfig[contact.status]
                  return (
                    <TableRow key={contact.id}>
                      <TableCell className="font-medium">
                        {contact.name}
                      </TableCell>
                      <TableCell>{contact.email ?? "-"}</TableCell>
                      <TableCell>{contact.phone ?? "-"}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {contact.companies?.name ?? "-"}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(contact.created_at).toLocaleDateString(
                          "zh-CN"
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(contact)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(contact)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                第 {startIndex + 1}-
                {Math.min(startIndex + PAGE_SIZE, filteredContacts.length)} 条，共{" "}
                {filteredContacts.length} 条
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
      <ContactFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        contact={editingContact}
        onSuccess={refresh}
      />

      {/* 删除确认弹窗 */}
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        contact={deletingContact}
        onSuccess={refresh}
      />
    </div>
  )
}
