import { cn } from "@/lib/utils"
import { STATUS_COLORS, type StatusKey } from "@/lib/colors"

interface ProgressBarProps {
  value: number
  status?: StatusKey
  /** Raw hex fill color, e.g. from ORDERED_PALETTE. Overrides `status`. */
  color?: string
  /** Minimum rendered width so zero-count rows still show a sliver. */
  minPct?: number
  className?: string
}

export function ProgressBar({ value, status = "active", color, minPct = 0, className }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(minPct, value))
  const fillClass = color ? undefined : STATUS_COLORS[status].dot
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-slate-100", className)}>
      <div
        className={cn("h-full rounded-full transition-all", fillClass)}
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}
