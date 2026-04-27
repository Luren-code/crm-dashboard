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
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase"

interface CompanyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void // 保存成功后刷新列表
}

export function CompanyFormDialog({
  open,
  onOpenChange,
  onSuccess,
}: CompanyFormDialogProps) {
  const { user } = useAuth()

  // 表单状态
  const [name, setName] = useState("")
  const [industry, setIndustry] = useState("")
  const [website, setWebsite] = useState("")
  const [saving, setSaving] = useState(false)

  // 弹窗每次打开时清空表单
  useEffect(() => {
    if (open) {
      setName("")
      setIndustry("")
      setWebsite("")
    }
  }, [open])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)

    const formData = {
      name: name.trim(),
      industry: industry.trim() || null,
      website: website.trim() || null,
    }

    const { error } = await supabase
      .from("companies")
      .insert({ ...formData, user_id: user!.id })

    if (error) {
      toast.error("新增失败：" + error.message)
      setSaving(false)
      return
    }

    toast.success("公司已添加")
    setSaving(false)
    onOpenChange(false)
    onSuccess()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>新增公司</DialogTitle>
          <DialogDescription>填写公司信息并保存</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 公司名（必填） */}
          <div className="space-y-2">
            <Label htmlFor="name">
              公司名 <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="请输入公司名"
              required
            />
          </div>

          {/* 行业 */}
          <div className="space-y-2">
            <Label htmlFor="industry">行业</Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="如：互联网、金融、教育"
            />
          </div>

          {/* 网址 */}
          <div className="space-y-2">
            <Label htmlFor="website">网址</Label>
            <Input
              id="website"
              type="url"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://example.com"
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
