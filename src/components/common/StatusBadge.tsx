import { Chip } from "@heroui/react"
import { cn } from "@/lib/utils"
import { STATUS_COLORS, type StatusKey } from "@/lib/colors"

interface StatusBadgeProps {
  status: StatusKey
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const style = STATUS_COLORS[status]
  return (
    <Chip
      className={cn(
        "rounded-lg border px-2 py-0.5 text-[11px] font-semibold tracking-tight",
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      <span className={cn("mr-1.5 inline-block h-1.5 w-1.5 rounded-full", style.dot)} />
      {label ?? style.label}
    </Chip>
  )
}
