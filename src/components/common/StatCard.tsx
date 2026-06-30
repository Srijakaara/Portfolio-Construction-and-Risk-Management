import type { LucideIcon } from "lucide-react"
import { Card } from "@heroui/react"
import { cn } from "@/lib/utils"
import { TINT, type TintKey } from "@/lib/colors"

interface StatCardProps {
  value: React.ReactNode
  label: string
  icon?: LucideIcon
  tint?: TintKey
  className?: string
  fixedHeight?: boolean
  onClick?: () => void
}

/**
 * Dense dashboard variant when `icon`/`tint` are passed (label+icon row, big value below).
 * Falls back to the plain value/label layout used on marketing pages otherwise.
 * Pass `onClick` to make the whole card a click target (e.g. drill into a filtered view).
 */
export function StatCard({ value, label, icon: Icon, tint, className, fixedHeight = true, onClick }: StatCardProps) {
  return (
    <Card
      variant="transparent"
      onClick={onClick}
      className={cn(
        "surface-card flex flex-col p-4",
        fixedHeight && "h-[84px]",
        onClick && "cursor-pointer transition-colors hover:bg-slate-50/60",
        className
      )}
    >
      {Icon && tint ? (
        <div className="flex h-full flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-[13px] text-slate-500">{label}</span>
            <div className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded", TINT[tint].bg)}>
              <Icon className={cn("h-3.5 w-3.5", TINT[tint].text)} />
            </div>
          </div>
          <div className="nums text-[20px] font-semibold leading-none tracking-tight text-slate-900">{value}</div>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-center gap-1">
          <div className="nums text-xl font-semibold leading-none tracking-tight text-zinc-900">{value}</div>
          <div className="truncate text-xs leading-tight text-zinc-500">{label}</div>
        </div>
      )}
    </Card>
  )
}
