import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"

// 公开演示账号——README 里也会列出，方便招聘者一键体验
// 安全说明：账号受 Supabase RLS 保护，访客只能读写该 demo 用户的数据
const DEMO_EMAIL = "demo@crm-dashboard.app"
const DEMO_PASSWORD = "demo12345678"

export function LoginPage() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [demoSubmitting, setDemoSubmitting] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await signIn(email, password)
      toast.success("登录成功")
      navigate("/", { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : "登录失败"
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDemoLogin = async () => {
    setDemoSubmitting(true)
    try {
      await signIn(DEMO_EMAIL, DEMO_PASSWORD)
      toast.success("已进入演示账号")
      navigate("/", { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : "演示登录失败"
      toast.error(message)
    } finally {
      setDemoSubmitting(false)
    }
  }

  const busy = submitting || demoSubmitting

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>输入你的邮箱和密码登录 CRM 后台</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={busy}>
              {submitting ? "登录中..." : "登录"}
            </Button>

            {/* 分隔线 */}
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">或</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={busy}
              onClick={handleDemoLogin}
            >
              {demoSubmitting ? "进入中..." : "使用演示账号一键登录 →"}
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              演示账号已预填测试数据，无需注册
            </p>

            <p className="text-center text-sm text-muted-foreground">
              还没有账号？{" "}
              <Link
                to="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                注册
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
