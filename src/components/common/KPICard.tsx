import { Card, Chip } from "@heroui/react"
import { cn } from "@/lib/utils"
import { KPI_STATUS, type KPIStatusKey } from "@/lib/colors"
import { ProgressBar } from "@/components/common/ProgressBar"

interface KPICardProps {
  label: string
  value: React.ReactNode
  status: KPIStatusKey
  /** Baseline, current, and target values used to compute the progress fill. */
  baseline: number
  current: number
  target: number
  className?: string
  onClick?: () => void
}

const VALUE_COLOR: Record<KPIStatusKey, string> = {
  on_track: "text-emerald-600",
  at_risk: "text-amber-600",
  off_track: "text-rose-600",
}

export function KPICard({ label, value, status, baseline, current, target, className, onClick }: KPICardProps) {
  const denom = baseline - target
  const pct = denom === 0 ? 100 : Math.round(((baseline - current) / denom) * 100)
  const clamped = Math.min(100, Math.max(0, pct))
  const { label: statusLabel, chipColor } = KPI_STATUS[status]

  return (
    <Card
      variant="transparent"
      onClick={onClick}
      className={cn(
        "surface-card flex h-[100px] flex-col gap-2 p-4",
        onClick && "cursor-pointer transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-[12px] text-slate-500">{label}</span>
        <Chip size="sm" variant="soft" color={chipColor} className="shrink-0 rounded-full px-2 text-[10px]">
          {statusLabel}
        </Chip>
      </div>
      <div className={cn("nums text-base font-semibold leading-none tracking-tight", VALUE_COLOR[status])}>{value}</div>
      <div className="mt-auto flex items-center gap-2">
        <ProgressBar value={clamped} />
        <span className="nums shrink-0 text-[11px] text-slate-400">{clamped}%</span>
      </div>
    </Card>
  )
}
