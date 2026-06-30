import type { LucideIcon } from "lucide-react"
import { Chip } from "@heroui/react"
import { cn } from "@/lib/utils"

interface LiveChipProps {
  label?: string
  className?: string
}

/** Pulsing-dot chip implying a live/real-time feed. Reuse for any "live" framing. */
export function LiveChip({ label = "Live · Hourly refresh", className }: LiveChipProps) {
  return (
    <Chip
      color="success"
      variant="soft"
      className={cn("gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium", className)}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
      </span>
      {label}
    </Chip>
  )
}

interface LiveDotRowProps {
  label: string
  status: string
  icon?: LucideIcon
  className?: string
}

/** Dot + status row for system-health panels — pairs visually with LiveChip. */
export function LiveDotRow({ label, status, icon: Icon, className }: LiveDotRowProps) {
  return (
    <div className={cn("flex items-center justify-between py-2", className)}>
      <span className="flex items-center gap-2.5 text-[12.5px] text-slate-600">
        {Icon && (
          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-indigo-50">
            <Icon className="h-3.5 w-3.5 text-indigo-600" />
          </span>
        )}
        {label}
      </span>
      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-600">
        {status}
      </span>
    </div>
  )
}
