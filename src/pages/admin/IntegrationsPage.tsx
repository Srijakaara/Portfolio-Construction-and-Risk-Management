import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, RefreshCw, AlertTriangle } from "lucide-react"
import { Card, Chip } from "@heroui/react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/common/Header"
import { StatCard } from "@/components/common/StatCard"
import { cn } from "@/lib/utils"

type IntegrationStatus = "healthy" | "degraded" | "down"

interface Integration {
  id: string
  name: string
  category: string
  status: IntegrationStatus
  description: string
  alert?: string
  latencyMs: number
  uptimePct: number
  lastSyncMinutesAgo: number
  endpoint: string
}

export const INTEGRATIONS: Integration[] = [
  {
    id: "bloomberg",
    name: "Bloomberg Terminal API",
    category: "Market Data",
    status: "healthy",
    description: "Real-time pricing, fixed income, and macro data feed for the regime detection pillar.",
    latencyMs: 120,
    uptimePct: 99.97,
    lastSyncMinutesAgo: 1,
    endpoint: "https://api.bloomberg.com/v3/market-data",
  },
  {
    id: "axioma",
    name: "Axioma Risk Engine",
    category: "Risk Analytics",
    status: "healthy",
    description: "Factor risk models feeding covariance estimates into dynamic allocation.",
    latencyMs: 340,
    uptimePct: 99.8,
    lastSyncMinutesAgo: 3,
    endpoint: "https://risk.axioma.com/api/v2/covariance",
  },
  {
    id: "ssc-geneva",
    name: "SS&C Geneva",
    category: "Portfolio Accounting",
    status: "degraded",
    description: "Position and NAV reconciliation feed for fund-level reporting.",
    alert: "Sync latency elevated for 35 minutes — vendor incident under investigation.",
    latencyMs: 2400,
    uptimePct: 96.2,
    lastSyncMinutesAgo: 38,
    endpoint: "https://geneva.ssctech.com/api/positions",
  },
  {
    id: "okta",
    name: "Okta SSO",
    category: "Identity & Access",
    status: "healthy",
    description: "Single sign-on and role provisioning for every internal console.",
    latencyMs: 80,
    uptimePct: 99.99,
    lastSyncMinutesAgo: 0,
    endpoint: "https://ascend.okta.com/api/v1/sessions",
  },
  {
    id: "vault",
    name: "HashiCorp Vault",
    category: "Secrets Management",
    status: "healthy",
    description: "Credential and API key vaulting for every connected data source.",
    latencyMs: 45,
    uptimePct: 99.95,
    lastSyncMinutesAgo: 2,
    endpoint: "https://vault.internal.ascend.ai/v1/secret",
  },
  {
    id: "risk-lake",
    name: "Risk Data Lake",
    category: "Internal Storage",
    status: "down",
    description: "Long-horizon historical store feeding the Risk Memory compounding layer.",
    alert: "Connection lost 12 minutes ago — failing over to read replica.",
    latencyMs: 5200,
    uptimePct: 91.4,
    lastSyncMinutesAgo: 12,
    endpoint: "https://datalake.internal.ascend.ai/query",
  },
]

function statusStyle(status: IntegrationStatus) {
  switch (status) {
    case "healthy":
      return { dot: "bg-emerald-500", chipColor: "success" as const, label: "Healthy" }
    case "degraded":
      return { dot: "bg-amber-400", chipColor: "warning" as const, label: "Degraded" }
    case "down":
      return { dot: "bg-rose-500", chipColor: "danger" as const, label: "Down" }
  }
}

function latencyColor(ms: number) {
  if (ms < 500) return "text-emerald-600"
  if (ms < 2000) return "text-amber-600"
  return "text-rose-600"
}

function uptimeColor(pct: number) {
  if (pct >= 99) return "text-emerald-600"
  if (pct >= 95) return "text-amber-600"
  return "text-rose-600"
}

function Metric({ label, value, colorClass }: { label: string; value: string; colorClass?: string }) {
  return (
    <div>
      <p className={cn("nums text-[15px] font-semibold tracking-tight", colorClass ?? "text-slate-900")}>{value}</p>
      <p className="text-[10px] uppercase tracking-wide text-slate-400">{label}</p>
    </div>
  )
}

export function IntegrationsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 700)
  }

  const total = INTEGRATIONS.length
  const healthy = INTEGRATIONS.filter((i) => i.status === "healthy").length
  const degraded = INTEGRATIONS.filter((i) => i.status !== "healthy").length

  return (
    <div className="space-y-7 px-8 py-6">
      <Header
        title="Integrations"
        subtitle="Live health for every system Ascend Risk AI depends on."
        actions={
          <>
            <button
              type="button"
              onClick={handleRefresh}
              aria-label="Refresh integration status"
              className="grid h-9 w-9 place-items-center rounded text-slate-500 hover:bg-slate-100"
            >
              <RefreshCw className={cn("h-4 w-4", refreshing && "animate-spin")} />
            </button>
            <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-3 gap-5">
        <StatCard label="Total Systems" value={<span className="nums">{total}</span>} />
        <StatCard
          label="Healthy"
          value={<span className="nums text-emerald-600">{healthy}</span>}
        />
        <StatCard
          label="Degraded"
          value={
            <span className={cn("nums", degraded > 0 ? "text-amber-600" : "text-slate-900")}>{degraded}</span>
          }
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded border hairline bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {INTEGRATIONS.map((integration) => {
            const style = statusStyle(integration.status)
            return (
              <Card key={integration.id} variant="transparent" className="surface-card space-y-3 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", style.dot)} />
                    <div>
                      <h3 className="text-[14px] font-semibold text-slate-900">{integration.name}</h3>
                      <p className="text-[11.5px] text-slate-400">{integration.category}</p>
                    </div>
                  </div>
                  <Chip size="sm" variant="soft" color={style.chipColor} className="shrink-0 rounded-full px-2 text-[10px]">
                    {style.label}
                  </Chip>
                </div>

                <p className="text-[12.5px] leading-relaxed text-slate-600">{integration.description}</p>

                {integration.alert && (
                  <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
                    <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                    <p className="text-[12px] text-amber-700">{integration.alert}</p>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-3">
                  <Metric label="Latency" value={`${integration.latencyMs}ms`} colorClass={latencyColor(integration.latencyMs)} />
                  <Metric label="Uptime" value={`${integration.uptimePct}%`} colorClass={uptimeColor(integration.uptimePct)} />
                  <div className="flex items-center gap-1.5">
                    <RefreshCw className={cn("h-3 w-3 text-slate-400", refreshing && "animate-spin")} />
                    <div>
                      <p className="nums text-[15px] font-semibold tracking-tight text-slate-900">
                        {integration.lastSyncMinutesAgo === 0 ? "Now" : `${integration.lastSyncMinutesAgo}m`}
                      </p>
                      <p className="text-[10px] uppercase tracking-wide text-slate-400">Last Sync</p>
                    </div>
                  </div>
                </div>

                <p className="truncate border-t hairline pt-3 font-mono text-[11px] text-slate-400">{integration.endpoint}</p>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
