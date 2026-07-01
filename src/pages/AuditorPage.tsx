import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router"
import { Search, Inbox, FileText, Cpu, UserCheck, AlertTriangle, ArrowRight } from "lucide-react"
import { Card } from "@heroui/react"
import { useRiskStore, type DecisionEntity, type AIStatus } from "@/store/useRiskStore"
import { Header } from "@/components/common/Header"
import { StatCard } from "@/components/common/StatCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { PillarBadge } from "@/components/common/PillarBadge"
import { ConfidenceBar } from "@/components/common/ConfidenceBar"
import { EmptyState } from "@/components/common/EmptyState"
import { cn } from "@/lib/utils"
import { DECISION_STATUS_TO_KEY } from "@/lib/colors"
import { INPUT_CLASS } from "@/lib/uiConstants"
import { isOverridden, isAutoApproved, decisionActor, formatDateTime } from "@/lib/auditMeta"

const PILLARS: DecisionEntity["pillar"][] = ["Regime Detection", "Dynamic Allocation", "Stress Engine", "Risk Memory"]
const STATUSES: AIStatus[] = ["approved", "rejected", "exception"]

export function AuditorPage() {
  const { decisions: allDecisions } = useRiskStore()
  const decisions = useMemo(() => allDecisions.filter((d) => d.status !== "pending"), [allDecisions])
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [pillarFilter, setPillarFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [quickFilter, setQuickFilter] = useState<"all" | "auto" | "human" | "overridden">("all")

  const resetFilters = () => {
    setSearch("")
    setPillarFilter("all")
    setStatusFilter("all")
    setQuickFilter("all")
  }

  const applyQuickFilter = (filter: "all" | "auto" | "human" | "overridden") => {
    setStatusFilter("all")
    setQuickFilter((prev) => (prev === filter ? "all" : filter))
  }

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return decisions.filter(
      (d) =>
        (pillarFilter === "all" || d.pillar === pillarFilter) &&
        (statusFilter === "all" || d.status === statusFilter) &&
        (quickFilter === "all" ||
          (quickFilter === "auto" && isAutoApproved(d)) ||
          (quickFilter === "human" && !isAutoApproved(d)) ||
          (quickFilter === "overridden" && isOverridden(d))) &&
        (q === "" || d.id.toLowerCase().includes(q) || d.fundName.toLowerCase().includes(q) || d.proposedAction.toLowerCase().includes(q))
    )
  }, [decisions, pillarFilter, statusFilter, quickFilter, search])

  const autoApproved = decisions.filter(isAutoApproved).length
  const overrideCount = decisions.filter(isOverridden).length
  const humanReviewed = decisions.length - autoApproved

  return (
    <div className="space-y-7 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <Header
        title="Auditor Console"
        subtitle="Immutable, replayable record of every resolved AI decision and the human action taken on it."
      />

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        <StatCard
          icon={FileText}
          tint="indigo"
          value={<span className="nums">{decisions.length}</span>}
          label="Total Logged"
          onClick={resetFilters}
          className={cn(quickFilter === "all" && statusFilter === "all" && "ring-2 ring-indigo-200")}
        />
        <StatCard
          icon={Cpu}
          tint="orange"
          value={<span className="nums">{autoApproved}</span>}
          label="Auto-Approved"
          onClick={() => applyQuickFilter("auto")}
          className={cn(quickFilter === "auto" && "ring-2 ring-orange-200")}
        />
        <StatCard
          icon={UserCheck}
          tint="emerald"
          value={<span className="nums">{humanReviewed}</span>}
          label="Human Reviewed"
          onClick={() => applyQuickFilter("human")}
          className={cn(quickFilter === "human" && "ring-2 ring-emerald-200")}
        />
        <StatCard
          icon={AlertTriangle}
          tint="amber"
          value={<span className="nums">{overrideCount}</span>}
          label="Overridden"
          onClick={() => applyQuickFilter("overridden")}
          className={cn(quickFilter === "overridden" && "ring-2 ring-amber-200")}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search decision ID, fund, or action…"
            className={cn(INPUT_CLASS, "w-64 pl-9")}
          />
        </div>
        <select value={pillarFilter} onChange={(e) => setPillarFilter(e.target.value)} className={cn(INPUT_CLASS, "w-44")}>
          <option value="all">All pillars</option>
          {PILLARS.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={cn(INPUT_CLASS, "w-36 capitalize")}>
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
        <span className="nums ml-auto text-[12px] text-slate-400">
          {filtered.length} of {decisions.length}
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
      ) : filtered.length === 0 ? (
        <Card variant="transparent" className="surface-card p-6">
          <EmptyState icon={Inbox} title="No decisions found" description="Try adjusting your search or filters." />
        </Card>
      ) : (
        <Card variant="transparent" className="surface-card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px]">
              <thead>
                <tr className="border-b hairline text-[11px] font-medium uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-2.5">Decision</th>
                  <th className="px-2 py-2.5">Pillar</th>
                  <th className="hidden px-2 py-2.5 md:table-cell">Fund</th>
                  <th className="hidden px-2 py-2.5 lg:table-cell">Actor</th>
                  <th className="hidden px-2 py-2.5 xl:table-cell">Confidence</th>
                  <th className="hidden px-2 py-2.5 lg:table-cell">Override</th>
                  <th className="px-2 py-2.5">Status</th>
                  <th className="hidden px-2 py-2.5 md:table-cell">Timestamp</th>
                  <th className="w-8 px-4 py-2.5" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const { actor, role } = decisionActor(d)
                  const overridden = isOverridden(d)
                  const autoApprovedRow = isAutoApproved(d)
                  return (
                    <tr
                      key={d.id}
                      onClick={() => navigate(`/audit/${d.id}`)}
                      className="cursor-pointer border-t hairline hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-3">
                        <p className="nums text-[13px] font-semibold text-slate-800">{d.id}</p>
                        <p className="mt-0.5 line-clamp-1 text-[12px] text-slate-400">{d.proposedAction}</p>
                      </td>
                      <td className="px-2 py-3">
                        <PillarBadge pillar={d.pillar} />
                      </td>
                      <td className="hidden px-2 py-3 md:table-cell text-slate-600">{d.fundName}</td>
                      <td className="hidden px-2 py-3 lg:table-cell">
                        <p className="text-[13px] font-medium text-slate-700">{actor}</p>
                        <p className="text-[12px] capitalize text-slate-400">{role}</p>
                      </td>
                      <td className="hidden px-2 py-3 xl:table-cell">
                        <ConfidenceBar confidence={d.confidence} />
                      </td>
                      <td className="hidden px-2 py-3 lg:table-cell">
                        {overridden ? (
                          <span className="flex items-center gap-1 text-[12px] font-medium text-amber-600">
                            <AlertTriangle size={13} /> Override
                          </span>
                        ) : (
                          <span className="text-[12px] text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-2 py-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <StatusBadge status={DECISION_STATUS_TO_KEY[d.status]} />
                          {autoApprovedRow && (
                            <span className="flex items-center gap-1 rounded border border-orange-200 bg-orange-50 px-1.5 py-0.5 text-[10px] font-medium text-orange-700">
                              <Cpu size={11} /> Auto
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="hidden px-2 py-3 md:table-cell">
                        <span className="nums text-[12px] text-slate-500">{formatDateTime(d.timestamp)}</span>
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
