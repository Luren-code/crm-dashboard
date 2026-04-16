import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useContacts } from "@/hooks/useContacts"
import { statusConfig } from "@/types/contact"

export function ContactsPage() {
  const { contacts, loading, error } = useContacts()

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">联系人</h2>
        <p className="text-sm text-muted-foreground">
          共 {contacts.length} 条记录
        </p>
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
      {!loading && !error && contacts.length === 0 && (
        <div className="rounded-md border p-8 text-center text-muted-foreground">
          暂无联系人数据
        </div>
      )}

      {/* 数据表格 */}
      {!loading && !error && contacts.length > 0 && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>姓名</TableHead>
                <TableHead>邮箱</TableHead>
                <TableHead>电话</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>创建时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => {
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
