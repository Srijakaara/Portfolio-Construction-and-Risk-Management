import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface IconButtonProps {
  icon: LucideIcon
  onClick?: () => void
  "aria-label": string
  className?: string
}

/** Plain ~36px icon-only action button — used in Header's actions slot (e.g. refresh). */
export function IconButton({ icon: Icon, onClick, className, ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "grid h-9 w-9 place-items-center rounded text-slate-500 transition-colors hover:bg-slate-100",
        className
      )}
      {...rest}
    >
      <Icon className="h-4 w-4" />
    </button>
  )
}
