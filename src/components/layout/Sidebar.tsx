import { Link, useLocation } from "react-router"
import {
  ShieldCheck,
  Home,
  LayoutDashboard,
  Briefcase,
  Activity,
  Settings,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { AuthUser } from "@/store/useRiskStore"

const NAV = [
  { label: "Home", path: "/", icon: Home, matchPrefixes: ["/"], exact: true },
  { label: "Executive Dashboard", path: "/dashboard", icon: LayoutDashboard, matchPrefixes: ["/dashboard"] },
  { label: "Operational Workbench", path: "/workbench", icon: Briefcase, matchPrefixes: ["/workbench"] },
  { label: "Auditor Console", path: "/auditor", icon: Activity, matchPrefixes: ["/auditor", "/audit/"] },
  { label: "Admin Console", path: "/admin", icon: Settings, matchPrefixes: ["/admin"] },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
  currentUser: AuthUser | null
}

export function Sidebar({ collapsed, onToggle, currentUser }: SidebarProps) {
  const location = useLocation()
  const visibleNav = NAV.filter((item) => item.exact || currentUser?.permissions?.includes(item.path))

  return (
    <aside
      className={cn(
        "flex shrink-0 flex-col border-r hairline bg-white transition-[width] duration-200 ease-out",
        collapsed ? "w-[68px]" : "w-60"
      )}
    >
      <div
        className={cn(
          "flex h-14 items-center gap-2.5 border-b hairline px-4",
          collapsed && "justify-center px-0"
        )}
      >
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded bg-[#6366f1] text-white shadow-sm">
          <ShieldCheck size={17} />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <div className="text-[15px] font-semibold tracking-tight text-slate-900">Ascend Risk AI</div>
            <div className="-mt-0.5 text-[11px] text-slate-400">Risk Intelligence Platform</div>
          </div>
        )}
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {!collapsed && (
          <div className="px-3 pb-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
            Workspace
          </div>
        )}
        {visibleNav.map((item) => {
          const isActive = item.exact
            ? location.pathname === item.path
            : item.matchPrefixes.some((prefix) => location.pathname.startsWith(prefix))
          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              className={cn(
                "group flex items-center gap-3 rounded px-3 py-2 text-sm font-medium transition-colors",
                collapsed && "justify-center px-0",
                isActive ? "bg-[#eef2ff] text-[#4f46e5]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon
                className={cn("h-4 w-4 shrink-0", isActive ? "text-[#6366f1]" : "text-slate-400 group-hover:text-slate-600")}
              />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t hairline p-3">
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center gap-2.5 rounded px-3 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50"
        >
          {collapsed ? <ChevronsRight size={18} /> : <ChevronsLeft size={18} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  )
}
