import { cn } from "@/lib/utils"
import { ProgressBar } from "@/components/common/ProgressBar"

interface ConfidenceBarProps {
  confidence: number
  className?: string
}

/** Shared AI-confidence indicator — reuse wherever a DecisionEntity's confidence renders. */
export function ConfidenceBar({ confidence, className }: ConfidenceBarProps) {
  const pct = Math.round(confidence * 100)
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <ProgressBar value={pct} className="w-16" />
      <span className="nums shrink-0 text-[11px] text-slate-500">{pct}%</span>
    </div>
  )
}
