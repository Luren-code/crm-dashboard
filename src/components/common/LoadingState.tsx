interface LoadingStateProps {
  message?: string
}

export function LoadingState({ message = "加载中..." }: LoadingStateProps) {
  return (
    <div className="rounded-md border p-8 text-center text-muted-foreground">
      {message}
    </div>
  )
}
