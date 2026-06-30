import { useState } from "react"
import { Outlet, useNavigate } from "react-router"
import { Briefcase, AlertTriangle } from "lucide-react"
import { Sidebar } from "@/components/layout/Sidebar"
import { Topbar } from "@/components/layout/Topbar"
import { useRiskStore } from "@/store/useRiskStore"

export function AppLayout() {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const currentUser = useRiskStore((s) => s.currentUser)
  const logout = useRiskStore((s) => s.logout)
  const decisions = useRiskStore((s) => s.decisions)

  const canSee = (path: string) => currentUser?.permissions?.includes(path) ?? false

  const pendingCount = decisions.filter((d) => d.status === "pending").length
  const exceptionCount = decisions.filter((d) => d.status === "exception").length

  const notifications = [
    pendingCount > 0 && {
      key: "pending",
      icon: Briefcase,
      iconColor: "text-violet-600",
      iconBg: "bg-violet-50",
      title: `${pendingCount} decision${pendingCount === 1 ? "" : "s"} awaiting review`,
      description: "AI-proposed actions need HITL sign-off.",
      target: "/workbench",
      canSee: canSee("/workbench"),
    },
    exceptionCount > 0 && {
      key: "exception",
      icon: AlertTriangle,
      iconColor: "text-rose-600",
      iconBg: "bg-rose-50",
      title: `${exceptionCount} exception${exceptionCount === 1 ? "" : "s"} flagged`,
      description: "Low-confidence decisions require escalation.",
      target: "/auditor",
      canSee: canSee("/auditor"),
    },
  ].filter((n): n is Exclude<typeof n, false> => n !== false)

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#fafafb]">
      <div className="flex min-h-0 flex-1">
        <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((v) => !v)} currentUser={currentUser} />
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Topbar
            currentUser={currentUser}
            decisions={decisions}
            notifications={notifications}
            onNotificationClick={(target) => navigate(target)}
            onSelectDecision={(id) => navigate(canSee("/auditor") ? `/audit/${id}` : "/workbench")}
            onLogout={handleLogout}
          />
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
