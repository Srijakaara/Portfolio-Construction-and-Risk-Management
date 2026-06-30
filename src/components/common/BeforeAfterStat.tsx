import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BeforeAfterStatProps {
  before: React.ReactNode
  after: React.ReactNode
  label: string
  className?: string
}

export function BeforeAfterStat({ before, after, label, className }: BeforeAfterStatProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="nums flex items-center gap-2 text-lg font-semibold tracking-tight">
        <span className="text-zinc-400 line-through">{before}</span>
        <ArrowRight className="h-3.5 w-3.5 text-indigo-500" />
        <span className="text-zinc-900">{after}</span>
      </div>
      <div className="text-xs text-zinc-500">{label}</div>
    </div>
  )
}
