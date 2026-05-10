interface EmptyStateProps {
  message: string
}

export function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-md border p-8 text-center text-muted-foreground">
      {message}
    </div>
  )
}
