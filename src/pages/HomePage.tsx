import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

export function HomePage() {
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("已退出登录")
    } catch (error) {
      const message = error instanceof Error ? error.message : "退出失败"
      toast.error(message)
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">CRM Dashboard</h1>
          <Button variant="outline" onClick={handleSignOut}>
            退出登录
          </Button>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>欢迎回来</CardTitle>
            <CardDescription>当前登录账号信息</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">邮箱：</span>
              <span className="font-medium">{user?.email}</span>
            </div>
            <div>
              <span className="text-muted-foreground">用户 ID：</span>
              <span className="font-mono text-xs">{user?.id}</span>
            </div>
          </CardContent>
        </Card>
        <p className="text-sm text-muted-foreground">
          Day 1 完成 ✓ — 接下来 Day 2 会加上侧边栏布局。
        </p>
      </div>
    </div>
  )
}
