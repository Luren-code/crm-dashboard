import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, Search } from "lucide-react"

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
import { useContacts } from "@/hooks/useContacts"
import { statusConfig, type Contact, type ContactStatus } from "@/types/contact"

// ---- 排序相关类型 ----
type SortField = "name" | "email" | "status" | "created_at"
type SortDirection = "asc" | "desc"

// 状态筛选按钮配置
const statusFilters: { value: ContactStatus | "all"; label: string }[] = [
  { value: "all", label: "全部" },
  { value: "lead", label: "潜在" },
  { value: "active", label: "活跃" },
  { value: "lost", label: "已流失" },
]

export function ContactsPage() {
  const { contacts, loading, error } = useContacts()

  // 三个筛选/排序状态
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ContactStatus | "all">("all")
  const [sort, setSort] = useState<{
    field: SortField
    direction: SortDirection
  }>({ field: "created_at", direction: "desc" })

  // 点击表头切换排序
  const handleSort = (field: SortField) => {
    setSort((prev) => ({
      field,
      // 同一列：切换方向；不同列：默认升序
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
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

  // 核心：筛选 + 排序（useMemo 避免每次渲染都重新计算）
  const filteredContacts = useMemo(() => {
    let result = [...contacts]

    // 1. 关键字搜索（姓名或邮箱包含关键字）
    if (search.trim()) {
      const keyword = search.toLowerCase()
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(keyword) ||
          (c.email && c.email.toLowerCase().includes(keyword))
      )
    }

    // 2. 状态筛选
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter)
    }

    // 3. 排序
    result.sort((a, b) => {
      const valA = a[sort.field] ?? ""
      const valB = b[sort.field] ?? ""

      if (valA < valB) return sort.direction === "asc" ? -1 : 1
      if (valA > valB) return sort.direction === "asc" ? 1 : -1
      return 0
    })

    return result
  }, [contacts, search, statusFilter, sort])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">联系人</h2>
        <p className="text-sm text-muted-foreground">
          共 {filteredContacts.length} 条记录
          {filteredContacts.length !== contacts.length &&
            `（总共 ${contacts.length} 条）`}
        </p>
      </div>

      {/* 搜索 + 状态筛选 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* 搜索框 */}
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="搜索姓名或邮箱..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* 状态筛选按钮组 */}
        <div className="flex gap-1">
          {statusFilters.map((item) => (
            <Button
              key={item.value}
              variant={statusFilter === item.value ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(item.value)}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredContacts.map((contact) => {
                const status = statusConfig[contact.status]
                return (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">
                      {contact.name}
                    </TableCell>
                    <TableCell>{contact.email ?? "-"}</TableCell>
                    <TableCell>{contact.phone ?? "-"}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                      >
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(contact.created_at).toLocaleDateString("zh-CN")}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
