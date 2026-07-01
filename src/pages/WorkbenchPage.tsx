import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { Search } from "lucide-react"
import { Card, Chip } from "@heroui/react"
import { useRiskStore, type DecisionEntity, type AIStatus } from "@/store/useRiskStore"
import { Header } from "@/components/common/Header"
import { StatusBadge } from "@/components/common/StatusBadge"
import { PillarBadge } from "@/components/common/PillarBadge"
import { ConfidenceBar } from "@/components/common/ConfidenceBar"
import { EmptyState } from "@/components/common/EmptyState"
import { cn } from "@/lib/utils"
import { DECISION_STATUS_TO_KEY, PRIORITY_DOT } from "@/lib/colors"
import { decisionPriority, decisionSLA } from "@/lib/decisionMeta"
import { isAutoApproved } from "@/lib/auditMeta"
import { INPUT_CLASS } from "@/lib/uiConstants"
import { Inbox, ArrowRight, Cpu } from "lucide-react"

const PILLARS: DecisionEntity["pillar"][] = ["Regime Detection", "Dynamic Allocation", "Stress Engine", "Risk Memory"]
const STATUSES: AIStatus[] = ["pending", "approved", "rejected", "exception"]

export function WorkbenchPage() {
  const { decisions } = useRiskStore()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  const pillarFromUrl = searchParams.get("pillar")
  const [pillarFilter, setPillarFilter] = useState<string>(
    pillarFromUrl && PILLARS.includes(pillarFromUrl as DecisionEntity["pillar"]) ? pillarFromUrl : "all"
  )
  const statusFromUrl = searchParams.get("status")
  const [statusFilter, setStatusFilter] = useState<string>(
    statusFromUrl && STATUSES.includes(statusFromUrl as AIStatus) ? statusFromUrl : "all"
  )

  const handlePillarFilterChange = (value: string) => {
    setPillarFilter(value)
    setSearchParams((params) => {
      if (value === "all") {
        params.delete("pillar")
      } else {
        params.set("pillar", value)
      }
      return params
    })
  }

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
    setSearchParams((params) => {
      if (value === "all") {
        params.delete("status")
      } else {
        params.set("status", value)
      }
      return params
    })
  }

  const filteredDecisions = useMemo(() => {
    const q = search.trim().toLowerCase()
    return decisions.filter(
      (d) =>
        (pillarFilter === "all" || d.pillar === pillarFilter) &&
        (statusFilter === "all" || d.status === statusFilter) &&
        (q === "" || d.fundName.toLowerCase().includes(q) || d.proposedAction.toLowerCase().includes(q))
    )
  }, [decisions, pillarFilter, statusFilter, search])

  const pendingCount = decisions.filter((d) => d.status === "pending").length

  return (
    <div className="space-y-7 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <Header
        title="Operational Workbench"
        subtitle="Human-in-the-loop review queue for AI-proposed actions."
        actions={
          <Chip size="sm" variant="soft" color="warning" className="rounded-full px-2.5 text-[11px] font-medium">
            <span className="nums">{pendingCount}</span> pending
          </Chip>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fund or action…"
            className={cn(INPUT_CLASS, "w-56 pl-9")}
          />
        </div>
        <select
          value={pillarFilter}
          onChange={(e) => handlePillarFilterChange(e.target.value)}
          className={cn(INPUT_CLASS, "w-44")}
        >
          <option value="all">All pillars</option>
          {PILLARS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => handleStatusFilterChange(e.target.value)}
          className={cn(INPUT_CLASS, "w-36 capitalize")}
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
        <span className="nums ml-auto text-[12px] text-slate-400">
          {filteredDecisions.length} of {decisions.length}
        </span>
      </div>

      {loading ? (
        <Card variant="transparent" className="surface-card p-6">
          <div className="space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-14 animate-pulse rounded-md bg-slate-100" />
            ))}
          </div>
        </Card>
      ) : filteredDecisions.length === 0 ? (
        <Card variant="transparent" className="surface-card p-6">
          <EmptyState
            icon={Inbox}
            title="No decisions found"
            description="Try adjusting your search or filters."
          />
        </Card>
      ) : (
        <Card variant="transparent" className="surface-card overflow-hidden p-0">
          <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px]">
            <thead>
              <tr className="border-b hairline text-[11px] font-medium uppercase tracking-wide text-slate-400">
                <th className="w-10 px-4 py-2.5" />
                <th className="px-2 py-2.5">Decision</th>
                <th className="hidden px-2 py-2.5 md:table-cell">Pillar</th>
                <th className="px-2 py-2.5">Confidence</th>
                <th className="hidden px-2 py-2.5 lg:table-cell">SLA</th>
                <th className="px-2 py-2.5">Status</th>
                <th className="w-8 px-4 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {filteredDecisions.map((d) => {
                const priority = decisionPriority(d)
                const sla = decisionSLA(d)
                return (
                  <tr
                    key={d.id}
                    onClick={() => navigate(`/audit/${d.id}`)}
                    className="cursor-pointer border-t hairline hover:bg-slate-50/60"
                  >
                    <td className="px-4 py-3">
                      <span className={cn("block h-2 w-2 shrink-0 rounded-full", PRIORITY_DOT[priority])} />
                    </td>
                    <td className="px-2 py-3">
                      <p className="font-medium text-slate-900">{d.fundName}</p>
                      <p className="nums mt-0.5 truncate text-[11px] text-slate-400">{d.id} · {d.proposedAction}</p>
                    </td>
                    <td className="hidden px-2 py-3 md:table-cell">
                      <PillarBadge pillar={d.pillar} />
                    </td>
                    <td className="px-2 py-3">
                      <ConfidenceBar confidence={d.confidence} />
                    </td>
                    <td className="hidden px-2 py-3 lg:table-cell">
                      <span className={cn("nums", sla.urgent ? "font-semibold text-rose-600" : "text-slate-400")}>
                        {sla.label}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={DECISION_STATUS_TO_KEY[d.status]} />
                        {isAutoApproved(d) && (
                          <span className="flex items-center gap-1 rounded border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-700">
                            <Cpu size={11} /> Auto
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <ArrowRight className="h-4 w-4 text-slate-400" />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          </div>
        </Card>
      )}
    </div>
  )
}
