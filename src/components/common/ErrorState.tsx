interface ErrorStateProps {
  error: string
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <div className="rounded-md border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
      加载失败：{error}
    </div>
  )
}
