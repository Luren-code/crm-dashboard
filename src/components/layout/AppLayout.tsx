import { useEffect, useState } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { LogOut, Menu, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Sidebar } from "./Sidebar"

export function AppLayout() {
  const { user, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  // 路由切换 → 自动关抽屉（用户点 NavLink 也会同步关，这是双保险）
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // 抽屉打开时锁住 body 滚动，避免背景跟着滚
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileOpen])

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("已退出登录")
    } catch {
      toast.error("退出失败")
    }
  }

  return (
    <div className="flex h-screen">
      {/* 桌面端：常驻侧边栏（md 及以上显示） */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>

      {/* 移动端：抽屉 + 遮罩 */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-y-0 left-0 z-50 md:hidden">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      {/* 右侧：顶栏 + 内容区 */}
      <div className="flex flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b px-4 md:px-6">
          {/* 移动端 hamburger（桌面隐藏） */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "关闭菜单" : "打开菜单"}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          <div className="flex flex-1 items-center justify-end gap-3">
            {/* 邮箱在小屏隐藏避免挤压 */}
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user?.email}
            </span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-1 h-4 w-4" />
              退出
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
