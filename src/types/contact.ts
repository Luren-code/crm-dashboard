export type ContactStatus = "lead" | "active" | "lost"

export interface Contact {
  id: string
  user_id: string
  name: string
  email: string | null
  phone: string | null
  company_id: string | null
  status: ContactStatus
  notes: string | null
  created_at: string
}

// useContacts 用嵌套 select 把公司名一起拉回来后的形状
export interface ContactWithCompany extends Contact {
  companies: { name: string } | null
}

// 状态的中文显示 + 颜色样式
export const statusConfig: Record<
  ContactStatus,
  { label: string; className: string }
> = {
  lead: {
    label: "潜在",
    className: "bg-blue-100 text-blue-700",
  },
  active: {
    label: "活跃",
    className: "bg-green-100 text-green-700",
  },
  lost: {
    label: "已流失",
    className: "bg-gray-100 text-gray-600",
  },
}
