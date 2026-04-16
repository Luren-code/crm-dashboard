import { NavLink } from "react-router-dom"
import { LayoutDashboard, Users, Building2 } from "lucide-react"

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/contacts", icon: Users, label: "联系人" },
  { to: "/companies", icon: Building2, label: "公司" },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-56 flex-col border-r bg-card">
      {/* Logo 区域 */}
      <div className="flex h-14 items-center border-b px-4">
        <h1 className="text-lg font-bold">CRM Dashboard</h1>
      </div>

      {/* 导航列表 */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}   //嵌套路由时起作用
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
