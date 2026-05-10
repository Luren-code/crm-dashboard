-- =============================================================================
-- CRM Dashboard — Row Level Security (RLS) 策略
-- =============================================================================
-- 用法：在 Supabase Dashboard → SQL Editor 里整段粘贴运行。
--
-- 设计：
--   两张业务表 (contacts, companies) 都按 user_id 做租户隔离，
--   每个登录用户只能 CRUD 自己 user_id 下的行。
--   anon key 暴露在前端是安全的——RLS 在 Postgres 层强制隔离，
--   攻击者拿到 anon key 也读不到别人的数据。
--
-- 为什么用 `auth.uid()`：
--   Supabase 把当前请求的 JWT 解析出的用户 id 注入到 session 变量，
--   `auth.uid()` 在 SQL 里直接拿到，不需要 WHERE user_id = '...' 这种硬编码。
--
-- 为什么 INSERT 用 WITH CHECK，UPDATE 同时用 USING + WITH CHECK：
--   - USING：决定"哪些行能被这条语句看到/修改"（旧行视图）
--   - WITH CHECK：决定"修改后的行是否合法"（新行视图）
--   - INSERT 没有"旧行"，所以只用 WITH CHECK
--   - UPDATE 既要保证旧行属于自己，也要防止把 user_id 改成别人的
-- =============================================================================


-- -----------------------------------------------------------------------------
-- contacts
-- -----------------------------------------------------------------------------
alter table public.contacts enable row level security;

-- 已有同名策略时先删——SQL 文件可重复执行
drop policy if exists "contacts_select_own" on public.contacts;
drop policy if exists "contacts_insert_own" on public.contacts;
drop policy if exists "contacts_update_own" on public.contacts;
drop policy if exists "contacts_delete_own" on public.contacts;

create policy "contacts_select_own"
on public.contacts for select
to authenticated
using (auth.uid() = user_id);

create policy "contacts_insert_own"
on public.contacts for insert
to authenticated
with check (auth.uid() = user_id);

create policy "contacts_update_own"
on public.contacts for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "contacts_delete_own"
on public.contacts for delete
to authenticated
using (auth.uid() = user_id);


-- -----------------------------------------------------------------------------
-- companies
-- -----------------------------------------------------------------------------
alter table public.companies enable row level security;

drop policy if exists "companies_select_own" on public.companies;
drop policy if exists "companies_insert_own" on public.companies;
drop policy if exists "companies_update_own" on public.companies;
drop policy if exists "companies_delete_own" on public.companies;

create policy "companies_select_own"
on public.companies for select
to authenticated
using (auth.uid() = user_id);

create policy "companies_insert_own"
on public.companies for insert
to authenticated
with check (auth.uid() = user_id);

create policy "companies_update_own"
on public.companies for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "companies_delete_own"
on public.companies for delete
to authenticated
using (auth.uid() = user_id);


-- =============================================================================
-- 自检：以登录用户身份查询应该只返回自己的行
-- 在 Dashboard 里以两个不同账号分别登录，互相看不到对方的 contacts/companies
-- =============================================================================
