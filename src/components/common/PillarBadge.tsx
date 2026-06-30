import { BrainCircuit } from "lucide-react"
import { Chip } from "@heroui/react"
import { cn } from "@/lib/utils"
import type { DecisionEntity } from "@/store/useRiskStore"

interface PillarBadgeProps {
  pillar: DecisionEntity["pillar"]
  className?: string
}

/** Category badge for a decision's pillar. Neutral by design — color is reserved for status. */
export function PillarBadge({ pillar, className }: PillarBadgeProps) {
  return (
    <Chip
      className={cn(
        "gap-1 rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-600",
        className
      )}
    >
      <BrainCircuit className="h-3 w-3" />
      {pillar}
    </Chip>
  )
}
