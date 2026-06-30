import { cn } from "@/lib/utils"

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

/** Reused identically at the top of every internal page (Dashboard, Workbench, Auditor, Admin). */
export function Header({ title, subtitle, actions, className }: HeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex flex-col gap-0.5">
        <h1 className="text-[17px] font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-[12.5px] text-slate-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}
