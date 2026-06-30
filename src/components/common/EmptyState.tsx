import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center gap-2 py-12 text-center", className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#ececf1] bg-indigo-50">
        <Icon className="h-5 w-5 text-indigo-500" />
      </div>
      <div className="text-sm font-semibold tracking-tight text-zinc-900">{title}</div>
      {description && <p className="max-w-sm text-xs text-zinc-500">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
