import { useEffect, useMemo, useRef, useState } from "react"
import { Search, RefreshCw, Bell, LogOut, Menu } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import type { AuthUser, DecisionEntity } from "@/store/useRiskStore"

const ICON_BUTTON_CLASS = "grid h-9 w-9 place-items-center rounded text-slate-500 hover:bg-slate-50"

const STATUS_DOT_CLASS: Record<DecisionEntity["status"], string> = {
  pending: "bg-amber-400",
  approved: "bg-emerald-500",
  rejected: "bg-rose-500",
  exception: "bg-rose-500",
}

interface Notification {
  key: string
  icon: React.ComponentType<{ className?: string }>
  iconColor: string
  iconBg: string
  title: string
  description: string
  target: string
  canSee: boolean
}

interface TopbarProps {
  currentUser: AuthUser | null
  decisions: DecisionEntity[]
  notifications: Notification[]
  onNotificationClick: (target: string) => void
  onSelectDecision: (id: string) => void
  onLogout: () => void
  onMenuClick?: () => void
}

export function Topbar({
  currentUser,
  decisions,
  notifications,
  onNotificationClick,
  onSelectDecision,
  onLogout,
  onMenuClick,
}: TopbarProps) {
  const unreadCount = notifications.length
  const [query, setQuery] = useState("")
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return []
    return decisions
      .filter(
        (d) =>
          d.fundName.toLowerCase().includes(term) ||
          d.proposedAction.toLowerCase().includes(term) ||
          d.pillar.toLowerCase().includes(term) ||
          d.id.toLowerCase().includes(term)
      )
      .slice(0, 6)
  }, [decisions, query])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === "Escape") {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  const handleSelect = (id: string) => {
    onSelectDecision(id)
    setQuery("")
    setOpen(false)
  }

  return (
    <header className="relative z-30 flex h-14 shrink-0 items-center gap-2 border-b hairline bg-white/80 px-3 backdrop-blur-md sm:gap-3 sm:px-5">
      <button
        type="button"
        onClick={onMenuClick}
        className={cn(ICON_BUTTON_CLASS, "shrink-0 lg:hidden")}
        aria-label="Toggle navigation menu"
      >
        <Menu className="h-4 w-4" />
      </button>
      <div ref={containerRef} className="relative w-full max-w-sm min-w-0">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => query && setOpen(true)}
          placeholder="Search decisions, investors…"
          className="h-9 w-full rounded border hairline bg-slate-50/70 pl-9 pr-16 text-sm outline-none focus:border-[#c7cdf9] focus:bg-white focus:ring-4 focus:ring-[#eef2ff]"
        />
        {!query && (
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[3px] border hairline bg-white px-1.5 py-0.5 text-[11px] font-medium text-slate-400">
            ⌘K
          </kbd>
        )}

        {open && query && (
          <div className="absolute left-0 top-full z-30 mt-1.5 w-full overflow-hidden rounded-lg border hairline bg-white shadow-lg">
            {results.length === 0 ? (
              <div className="px-3.5 py-3 text-xs text-slate-400">No decisions match "{query}".</div>
            ) : (
              <div className="max-h-72 divide-y divide-[#ececf1] overflow-y-auto">
                {results.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => handleSelect(d.id)}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left hover:bg-slate-50"
                  >
                    <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", STATUS_DOT_CLASS[d.status])} />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-[13px] font-medium text-slate-800">{d.fundName}</span>
                      <span className="truncate text-[11px] text-slate-400">
                        {d.pillar} &middot; {d.proposedAction}
                      </span>
                    </div>
                    <span className="nums shrink-0 text-[11px] text-slate-400">{Math.round(d.confidence * 100)}%</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        <button type="button" className={ICON_BUTTON_CLASS} aria-label="Refresh">
          <RefreshCw className="h-4 w-4" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className={cn(ICON_BUTTON_CLASS, "relative outline-none")} aria-label="Notifications">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#f43f5e] ring-2 ring-white" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-6 text-center">
                <span className="text-xs text-slate-500">You're all caught up.</span>
              </div>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem
                  key={n.key}
                  disabled={!n.canSee}
                  onClick={() => n.canSee && onNotificationClick(n.target)}
                  className="flex items-start gap-3 py-2.5"
                >
                  <div className={cn("shrink-0 rounded-md p-1.5", n.iconBg)}>
                    <n.icon className={cn("h-3.5 w-3.5", n.iconColor)} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium leading-tight">{n.title}</span>
                    <span className="text-xs leading-tight text-slate-500">{n.description}</span>
                  </div>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-1 h-6 w-px bg-[#ececf1]" />

        <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b8ff7] text-[12px] font-semibold text-white">
          {currentUser?.initials ?? "?"}
        </div>
        <div className="hidden leading-tight sm:block">
          <div className="text-[13px] font-semibold text-slate-800">{currentUser?.name ?? "Guest"}</div>
          <div className="-mt-0.5 text-[11px] text-slate-400">{currentUser?.role ?? ""}</div>
        </div>

        <button
          type="button"
          onClick={onLogout}
          className={cn(ICON_BUTTON_CLASS, "hover:text-rose-500")}
          aria-label="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
