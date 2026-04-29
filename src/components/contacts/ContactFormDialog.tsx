import { useEffect, useState, type FormEvent } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { useCompanies } from "@/hooks/useCompanies"
import { supabase } from "@/lib/supabase"
import type { Contact, ContactStatus } from "@/types/contact"

interface ContactFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contact?: Contact // 有值 = 编辑模式，没值 = 新增模式
  onSuccess: () => void // 保存成功后刷新列表
}

export function ContactFormDialog({
  open,
  onOpenChange,
  contact,
  onSuccess,
}: ContactFormDialogProps) {
  const { user } = useAuth()
  const { companies, loading: companiesLoading } = useCompanies()
  const isEdit = !!contact

  // 表单状态
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [companyId, setCompanyId] = useState("") // "" 表示"无公司"，提交时转 null
  const [status, setStatus] = useState<ContactStatus>("lead")
  const [notes, setNotes] = useState("")
  const [saving, setSaving] = useState(false)

  // 弹窗打开时：新增模式清空表单，编辑模式填入现有数据
  useEffect(() => {
    if (open) {
      setName(contact?.name ?? "")
      setEmail(contact?.email ?? "")
      setPhone(contact?.phone ?? "")
      setCompanyId(contact?.company_id ?? "")
      setStatus(contact?.status ?? "lead")
      setNotes(contact?.notes ?? "")
    }
  }, [open, contact])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const formData = {
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      company_id: companyId || null, // 空字符串转 null
      status,
      notes: notes.trim() || null,
    }

    if (isEdit) {
      // 编辑：更新现有记录
      const { error } = await supabase
        .from("contacts")
        .update(formData)
        .eq("id", contact.id)

      if (error) {
        toast.error("更新失败：" + error.message)
        setSaving(false)
        return
      }
      toast.success("联系人已更新")
    } else {
      // 新增：插入新记录
      const { error } = await supabase
        .from("contacts")
        .insert({ ...formData, user_id: user!.id })

      if (error) {
        toast.error("新增失败：" + error.message)
        setSaving(false)
        return
      }
      toast.success("联系人已添加")
    }

    setSaving(false)
    onOpenChange(false) // 关闭弹窗
    onSuccess() // 刷新列表
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "编辑联系人" : "新增联系人"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "修改联系人信息" : "填写联系人信息并保存"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 姓名（必填） */}
          <div className="space-y-2">
            <Label htmlFor="name">
              姓名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入姓名"
              required
            />
          </div>

          {/* 邮箱 */}
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
            />
          </div>

          {/* 电话 */}
          <div className="space-y-2">
            <Label htmlFor="phone">电话</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="13800138000"
            />
          </div>

          {/* 所属公司 */}
          <div className="space-y-2">
            <Label htmlFor="company">所属公司</Label>
            <select
              id="company"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              disabled={companiesLoading}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">无</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 状态 */}
          <div className="space-y-2">
            <Label htmlFor="status">状态</Label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value as ContactStatus)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="lead">潜在</option>
              <option value="active">活跃</option>
              <option value="lost">已流失</option>
            </select>
          </div>

          {/* 备注 */}
          <div className="space-y-2">
            <Label htmlFor="notes">备注</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="可选备注信息"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={saving || !name.trim()}>
              {saving ? "保存中..." : "保存"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
