import { Outlet } from "react-router-dom"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { Sidebar } from "./Sidebar"

export function AppLayout() {
  const { user, signOut } = useAuth()

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
      {/* 左侧侧边栏 */}
      <Sidebar />

      {/* 右侧：顶栏 + 内容区 */}
      <div className="flex flex-1 flex-col">
        {/* 顶栏 */}
        <header className="flex h-14 items-center justify-end border-b px-6">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{user?.email}</span>
            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              <LogOut className="mr-1 h-4 w-4" />
              退出
            </Button>
          </div>
        </header>

        {/* 内容区 —— Outlet 会渲染当前路由匹配的子页面 */}
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
