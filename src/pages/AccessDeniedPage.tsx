import { Link } from "react-router"
import { ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRiskStore } from "@/store/useRiskStore"

export function AccessDeniedPage() {
  const currentUser = useRiskStore((s) => s.currentUser)

  return (
    <div className="flex flex-col items-center justify-center text-center px-4 py-16 sm:py-24 animate-in fade-in duration-500">
      <div className="p-4 rounded-full bg-rose-50 dark:bg-rose-500/10 mb-4">
        <ShieldAlert className="w-8 h-8 text-rose-600 dark:text-rose-400" />
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        Access Restricted
      </h2>
      <p className="text-sm text-zinc-500 mt-2 max-w-sm">
        Your role ({currentUser?.role}) does not have permission to view this console. RBAC is
        enforced across every surface of Ascend Risk AI.
      </p>
      <Button asChild className="mt-6">
        <Link to={currentUser?.landingPath ?? "/dashboard"}>Go to my console</Link>
      </Button>
    </div>
  )
}
