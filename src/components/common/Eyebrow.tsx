import type { LucideIcon } from "lucide-react"
import { Chip } from "@heroui/react"
import { cn } from "@/lib/utils"

interface EyebrowProps {
  icon?: LucideIcon
  children: React.ReactNode
  className?: string
}

export function Eyebrow({ icon: Icon, children, className }: EyebrowProps) {
  return (
    <Chip
      className={cn(
        "rounded-lg border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-indigo-700",
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        {Icon && <Icon className="h-3.5 w-3.5" />}
        {children}
      </span>
    </Chip>
  )
}
