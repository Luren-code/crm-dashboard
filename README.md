# CRM Dashboard

  一个用 React + Supabase 从零搭建的客户关系管理系统，用于练习前端工程能力。

  参考项目：[marmelab/atomic-crm](https://github.com/marmelab/atomic-crm)

  ## 技术栈

  - **前端**：React 18 + TypeScript + Vite
  - **样式**：Tailwind CSS v4 + Shadcn/ui
  - **数据表格**：TanStack Table（待加）
  - **后端**：Supabase（Auth + PostgreSQL + RLS）
  - **路由**：React Router v6
  - **部署**：Vercel（待加）

  ## 已实现功能

  - [x] 用户认证（注册 / 登录 / 登出）
  - [x] 后台布局（侧边栏导航 + 顶栏 + 内容区）
  - [x] 联系人列表展示（含 loading / error / empty / data 四种状态）
  - [x] 行级安全（RLS）：用户只能访问自己的联系人数据
  - [ ] 联系人列表筛选 / 排序 / 分页
  - [ ] 联系人 CRUD（新增 / 编辑 / 删除）
  - [ ] 公司管理
  - [ ] Dashboard 数据概览
  - [ ] 响应式布局

  ## 本地运行

  ```bash
  # 1. 安装依赖
  npm install

  # 2. 配置环境变量
  cp .env.local.example .env.local
  # 编辑 .env.local 填入你自己的 Supabase URL 和 anon key

  # 3. 启动开发服务器
  npm run dev
  ```

  ## 项目结构

  ```
  src/
  ├── components/
  │   ├── auth/        # 认证相关组件（ProtectedRoute）
  │   ├── layout/      # 布局组件（AppLayout、Sidebar）
  │   └── ui/          # Shadcn 基础组件（button、card、input、table 等）
  ├── contexts/        # React Context（全局状态，如 AuthContext）
  ├── hooks/           # 自定义 Hook（如 useContacts）
  ├── lib/             # 工具函数 + Supabase client
  ├── pages/           # 页面级组件
  ├── types/           # TypeScript 类型定义
  └── App.tsx          # 路由配置（嵌套路由）
  ```