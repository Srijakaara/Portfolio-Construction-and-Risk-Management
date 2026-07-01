import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { ArrowLeft, CheckCircle2, AlertTriangle, Activity, BrainCircuit } from "lucide-react"
import { Card, Chip } from "@heroui/react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/common/Header"
import { PillarBadge } from "@/components/common/PillarBadge"
import { cn } from "@/lib/utils"
import type { DecisionEntity } from "@/store/useRiskStore"

type ModelStatus = "production" | "shadow" | "retired"
type BiasStatus = "passed" | "in_review" | "failed"

interface ModelRecord {
  id: string
  name: string
  pillar: DecisionEntity["pillar"]
  version: string
  status: ModelStatus
  description: string
  metrics: { accuracy: number; confidenceAvg: number; autoResolvedPct: number; overrideRatePct: number }
  training: { dataset: string; window: string; sampleSize: number; lastRetrained: string }
  bias: { overallStatus: BiasStatus; genderBias: BiasStatus; geographicBias: BiasStatus; lastChecked: string }
  capabilities: string[]
}

export const MODELS: ModelRecord[] = [
  {
    id: "regime",
    name: "Regime Classifier Ensemble",
    pillar: "Regime Detection",
    version: "v1.4.2-ensemble",
    status: "production",
    description: "Gradient-boosted ensemble classifying macro/market regime state from rates, volatility, and rotation signals.",
    metrics: { accuracy: 91.4, confidenceAvg: 88.2, autoResolvedPct: 64, overrideRatePct: 3.1 },
    training: { dataset: "Macro + market regime corpus (18y)", window: "2006 – 2024", sampleSize: 482000, lastRetrained: "2026-04-12" },
    bias: { overallStatus: "passed", genderBias: "passed", geographicBias: "passed", lastChecked: "2026-05-30" },
    capabilities: ["Regime classification", "Early-warning flagging", "Cross-asset signal fusion"],
  },
  {
    id: "allocation",
    name: "Dynamic Allocation LLM",
    pillar: "Dynamic Allocation",
    version: "v2.0.1-LLM",
    status: "shadow",
    description: "LLM-assisted optimizer proposing regime-conditioned allocation shifts against expected-return curves.",
    metrics: { accuracy: 86.7, confidenceAvg: 81.5, autoResolvedPct: 41, overrideRatePct: 7.8 },
    training: { dataset: "Allocation decision + outcome pairs", window: "2018 – 2024", sampleSize: 96000, lastRetrained: "2026-05-02" },
    bias: { overallStatus: "in_review", genderBias: "passed", geographicBias: "in_review", lastChecked: "2026-06-10" },
    capabilities: ["Allocation proposal", "Scenario rationale generation", "Constraint-aware rebalancing"],
  },
  {
    id: "stress",
    name: "Stress & Scenario Engine",
    pillar: "Stress Engine",
    version: "v1.3.0-stress",
    status: "production",
    description: "Monte Carlo and historical-stress simulation engine surfacing tail-risk exposure per fund, weekly.",
    metrics: { accuracy: 93.8, confidenceAvg: 90.1, autoResolvedPct: 58, overrideRatePct: 2.4 },
    training: { dataset: "Historical stress + simulated paths", window: "1998 – 2024", sampleSize: 1240000, lastRetrained: "2026-03-21" },
    bias: { overallStatus: "passed", genderBias: "passed", geographicBias: "passed", lastChecked: "2026-05-18" },
    capabilities: ["Tail-risk simulation", "VaR estimation", "Hedge recommendation"],
  },
  {
    id: "memory",
    name: "Risk Memory Retriever",
    pillar: "Risk Memory",
    version: "v1.1.0",
    status: "retired",
    description: "Precedent-retrieval model matching current conditions against the compounding drawdown/recovery library.",
    metrics: { accuracy: 88.9, confidenceAvg: 85.0, autoResolvedPct: 49, overrideRatePct: 5.6 },
    training: { dataset: "Drawdown & recovery event library", window: "2002 – 2023", sampleSize: 21000, lastRetrained: "2025-11-08" },
    bias: { overallStatus: "failed", genderBias: "passed", geographicBias: "failed", lastChecked: "2026-01-15" },
    capabilities: ["Precedent retrieval", "Recovery pattern matching"],
  },
]

const MODEL_STATUS_STYLE: Record<ModelStatus, { chipColor: "success" | "warning" | "danger"; label: string }> = {
  production: { chipColor: "success", label: "Production" },
  shadow: { chipColor: "warning", label: "Shadow Mode" },
  retired: { chipColor: "danger", label: "Retired" },
}

const BIAS_STYLE: Record<BiasStatus, { icon: typeof CheckCircle2; color: string; label: string }> = {
  passed: { icon: CheckCircle2, color: "text-emerald-600", label: "Passed" },
  in_review: { icon: AlertTriangle, color: "text-amber-600", label: "In Review" },
  failed: { icon: AlertTriangle, color: "text-rose-600", label: "Failed" },
}

const OVERRIDE_RATE_RISK_THRESHOLD = 5

export function ModelsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="space-y-7 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <Header
        title="AI Model Registry"
        subtitle="Governance record for every model in production, shadow, or retired."
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate("/admin")}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-5">
          {Array.from({ length: MODELS.length }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded border hairline bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="space-y-5">
          {MODELS.map((model) => {
            const statusStyle = MODEL_STATUS_STYLE[model.status]
            const bias = BIAS_STYLE[model.bias.overallStatus]
            const metrics = [
              { label: "Accuracy", value: `${model.metrics.accuracy}%`, alert: false },
              { label: "Avg Confidence", value: `${model.metrics.confidenceAvg}%`, alert: false },
              { label: "Auto-Resolved", value: `${model.metrics.autoResolvedPct}%`, alert: false },
              {
                label: "Override Rate",
                value: `${model.metrics.overrideRatePct}%`,
                alert: model.metrics.overrideRatePct > OVERRIDE_RATE_RISK_THRESHOLD,
              },
            ]

            return (
              <Card key={model.id} variant="transparent" className="surface-card p-0">
                <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 shrink-0 place-items-center rounded bg-indigo-50">
                      <BrainCircuit className="h-[18px] w-[18px] text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-semibold text-slate-900">{model.name}</h3>
                        <PillarBadge pillar={model.pillar} />
                      </div>
                      <p className="nums text-[12px] text-slate-400">{model.version}</p>
                    </div>
                  </div>
                  <Chip size="sm" variant="soft" color={statusStyle.chipColor} className="rounded-full px-2.5 text-[11px] font-medium">
                    {statusStyle.label}
                  </Chip>
                </div>

                <div className="space-y-5 border-t hairline p-6">
                  <p className="text-[12.5px] leading-relaxed text-slate-600">{model.description}</p>

                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {metrics.map((m) => (
                      <div key={m.label} className="rounded border hairline bg-slate-50/60 p-3 text-center">
                        <p className={cn("nums text-[24px] font-semibold", m.alert ? "text-amber-600" : "text-slate-900")}>
                          {m.value}
                        </p>
                        <p className="text-[10px] uppercase tracking-wide text-slate-400">{m.label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="space-y-2">
                      <h4 className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Training Info</h4>
                      <div className="flex justify-between text-[12.5px]">
                        <span className="text-slate-500">Dataset</span>
                        <span className="text-right text-slate-700">{model.training.dataset}</span>
                      </div>
                      <div className="flex justify-between text-[12.5px]">
                        <span className="text-slate-500">Training Window</span>
                        <span className="nums text-slate-700">{model.training.window}</span>
                      </div>
                      <div className="flex justify-between text-[12.5px]">
                        <span className="text-slate-500">Sample Size</span>
                        <span className="nums text-slate-700">{model.training.sampleSize.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-[12.5px]">
                        <span className="text-slate-500">Last Retrained</span>
                        <span className="nums text-slate-700">{model.training.lastRetrained}</span>
                      </div>
                    </div>

                    <div className="rounded border hairline bg-slate-50/60 p-3.5">
                      <h4 className="mb-2 text-[11px] font-medium uppercase tracking-wider text-slate-400">Bias Report</h4>
                      <div className={cn("flex items-center gap-1.5 text-[13px] font-medium", bias.color)}>
                        <bias.icon className="h-4 w-4" />
                        Overall Status: {bias.label}
                      </div>
                      <div className="mt-2 space-y-1.5">
                        <div className="flex justify-between text-[12px]">
                          <span className="text-slate-500">Gender Bias</span>
                          <span className={BIAS_STYLE[model.bias.genderBias].color}>{BIAS_STYLE[model.bias.genderBias].label}</span>
                        </div>
                        <div className="flex justify-between text-[12px]">
                          <span className="text-slate-500">Geographic Bias</span>
                          <span className={BIAS_STYLE[model.bias.geographicBias].color}>{BIAS_STYLE[model.bias.geographicBias].label}</span>
                        </div>
                        <div className="flex justify-between text-[12px]">
                          <span className="text-slate-500">Last Checked</span>
                          <span className="nums text-slate-700">{model.bias.lastChecked}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-slate-500">
                      <Activity className="h-3.5 w-3.5" />
                      <h4 className="text-[11px] font-medium uppercase tracking-wider text-slate-400">Capabilities</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {model.capabilities.map((cap) => (
                        <Chip key={cap} size="sm" className="rounded border border-slate-200 bg-slate-50 px-2 text-[11px] text-slate-600">
                          {cap}
                        </Chip>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
