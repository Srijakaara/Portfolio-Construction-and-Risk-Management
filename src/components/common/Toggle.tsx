import { cn } from "@/lib/utils"

interface ToggleProps {
  checked: boolean
  onToggle: () => void
  disabled?: boolean
  "aria-label"?: string
}

/** Accessible on/off switch — build once, reuse for any boolean setting in the app. */
export function Toggle({ checked, onToggle, disabled, ...rest }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-5 w-9 shrink-0 items-center overflow-hidden rounded-full transition-colors disabled:opacity-40",
        checked ? "bg-[#6366f1]" : "bg-slate-200"
      )}
      {...rest}
    >
      <span
        className={cn(
          "absolute left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-4" : "translate-x-0"
        )}
      />
    </button>
  )
}
