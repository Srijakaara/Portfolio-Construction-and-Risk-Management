import { useParams, useNavigate } from "react-router"
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Bot,
  FileText,
  Shield,
  Circle,
} from "lucide-react"
import { Card } from "@heroui/react"
import { Button } from "@/components/ui/button"
import { useRiskStore } from "@/store/useRiskStore"
import { Header } from "@/components/common/Header"
import { StatusBadge } from "@/components/common/StatusBadge"
import { PillarBadge } from "@/components/common/PillarBadge"
import { ConfidenceBar } from "@/components/common/ConfidenceBar"
import { cn } from "@/lib/utils"
import { DECISION_STATUS_TO_KEY } from "@/lib/colors"
import {
  isOverridden,
  isResolved,
  decisionActor,
  formatDateTime,
  fundCode,
  inputSignalContext,
  evidenceChecklist,
} from "@/lib/auditMeta"

const STEP_BADGE_CLASS = "grid h-6 w-6 shrink-0 place-items-center rounded-md bg-[#eef2ff] text-[11px] font-semibold text-[#6366f1]"

function StepHeading({ step, title }: { step: number; title: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={STEP_BADGE_CLASS}>{step}</span>
      <h3 className="text-[15px] font-semibold text-slate-900">{title}</h3>
    </div>
  )
}

export function AuditDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const decisions = useRiskStore((s) => s.decisions)
  const updateDecisionStatus = useRiskStore((s) => s.updateDecisionStatus)
  const currentUser = useRiskStore((s) => s.currentUser)
  const decision = decisions.find((d) => d.id === id)
  const canReview = currentUser?.permissions?.includes("/workbench") ?? false

  if (!decision) {
    const stillLoading = decisions.length === 0
    return (
      <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
        <Header
          title="Decision Replay"
          subtitle="Full audit trail — read only"
          actions={
            <Button variant="outline" size="sm" onClick={() => navigate("/auditor")}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          }
        />
        {stillLoading ? (
          <div className="h-64 w-full max-w-2xl animate-pulse rounded bg-slate-100" />
        ) : (
          <Card variant="transparent" className="surface-card p-10 text-center">
            <p className="text-sm text-slate-600">
              Decision <strong className="nums">{id}</strong> not found in current session.
            </p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => navigate("/auditor")}>
              <ArrowLeft className="h-4 w-4" />
              Back to Auditor Console
            </Button>
          </Card>
        )}
      </div>
    )
  }

  const { actor, role } = decisionActor(decision)
  const overridden = isOverridden(decision)
  const resolved = isResolved(decision)
  const pct = Math.round(decision.confidence * 100)

  const timelineSteps = [
    {
      icon: <Circle className="h-3 w-3 text-slate-400" />,
      title: "Decision Logged",
      desc: "AI engine logged a new decision for review.",
      timestamp: decision.timestamp,
    },
    {
      icon: <Bot className="h-3.5 w-3.5 text-indigo-500" />,
      title: "AI Model Processed",
      desc: `Model ${decision.model_version} generated a proposal at ${pct}% confidence.`,
      timestamp: decision.timestamp,
    },
    {
      icon: <FileText className="h-3.5 w-3.5 text-indigo-500" />,
      title: "Proposal Generated",
      desc: decision.proposedAction,
      timestamp: decision.timestamp,
    },
    ...(resolved
      ? [
          decision.status === "approved"
            ? {
                icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
                title: "Approved",
                desc: `${actor} (${role}) approved this proposal.`,
                timestamp: decision.timestamp,
              }
            : decision.status === "rejected"
              ? {
                  icon: <AlertTriangle className="h-3.5 w-3.5 text-rose-500" />,
                  title: "Overridden",
                  desc: `${actor} (${role}) rejected this proposal.`,
                  timestamp: decision.timestamp,
                }
              : {
                  icon: <AlertTriangle className="h-3.5 w-3.5 text-orange-500" />,
                  title: "Escalated for Senior Review",
                  desc: `Routed to ${actor} (${role}) — confidence below autonomy threshold.`,
                  timestamp: decision.timestamp,
                },
        ]
      : []),
  ]

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
      <Header
        title={`Replay: ${decision.id}`}
        subtitle="Full audit trail — read only"
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        }
      />

      <Card variant="transparent" className="surface-card flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <PillarBadge pillar={decision.pillar} />
          <StatusBadge status={DECISION_STATUS_TO_KEY[decision.status]} />
          {overridden && (
            <span className="flex items-center gap-1 rounded border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
              <AlertTriangle size={12} /> Human Override
            </span>
          )}
        </div>
        <div className="text-right">
          <p className="nums text-[12px] text-slate-500">Model {decision.model_version}</p>
          <p className="nums text-[12px] text-slate-400">{formatDateTime(decision.timestamp)}</p>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card variant="transparent" className="surface-card space-y-4 p-6">
          <StepHeading step={1} title="Inputs to AI" />
          <div className="space-y-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Fund</span>
            <p className="text-[13px] font-medium text-slate-700">{decision.fundName}</p>
            <p className="nums text-[12px] text-slate-400">{fundCode(decision)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Signal Context</span>
            <p className="text-[12.5px] leading-relaxed text-slate-600">{inputSignalContext(decision)}</p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">{decision.pillar}</span>
            <span className="nums rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] text-slate-500">{pct}% confidence</span>
          </div>
        </Card>

        <Card variant="transparent" className="surface-card space-y-4 p-6">
          <StepHeading step={2} title="AI Output" />
          <div className="rounded border border-[#ececf1] bg-slate-50/60 p-4">
            <p className="text-[13.5px] font-medium text-slate-900">{decision.proposedAction}</p>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Confidence</span>
            <div className="flex items-center gap-2">
              <span className="nums text-sm font-semibold text-slate-800">{pct}%</span>
              <ConfidenceBar confidence={decision.confidence} className="flex-1" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Model Version</span>
            <p className="nums text-[13px] text-slate-700">{decision.model_version}</p>
          </div>
        </Card>

        <Card variant="transparent" className="surface-card space-y-4 p-6">
          <StepHeading step={3} title="Rationale & Evidence" />
          <p className="text-[12.5px] leading-relaxed text-slate-600">{decision.rationale}</p>
          <ul className="space-y-1.5">
            {evidenceChecklist(decision).map((item) => (
              <li key={item} className="flex items-start gap-2 text-[12.5px] text-slate-600">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="transparent" className="surface-card space-y-4 p-6">
          <StepHeading step={4} title="Human Action" />
          {resolved ? (
            <div className="space-y-3">
              <StatusBadge status={DECISION_STATUS_TO_KEY[decision.status]} />
              <div className="space-y-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Actor</span>
                <p className="text-[13px] font-medium text-slate-700">{actor}</p>
                <p className="text-[12px] capitalize text-slate-400">{role}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">Resolved At</span>
                <p className="nums text-[13px] text-slate-700">{formatDateTime(decision.timestamp)}</p>
              </div>
              {overridden && (
                <div className="rounded border border-amber-200 bg-amber-50 p-3 text-[12.5px] text-amber-800">
                  Reviewer judgment overrode the AI proposal — see Rationale &amp; Evidence for the system's original
                  reasoning. The proposed action above was not executed.
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-6 text-center text-slate-400">
              <Shield size={28} className="text-slate-300" />
              <p className="text-[13px] font-medium">Decision still pending</p>
              <p className="text-[12px]">No human action recorded yet</p>
              {canReview && (
                <div className="mt-2 flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => updateDecisionStatus(decision.id, "rejected")}
                    className="border-rose-200 text-rose-700 hover:bg-rose-50"
                  >
                    Reject Override
                  </Button>
                  <Button
                    onClick={() => updateDecisionStatus(decision.id, "approved")}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Approve Action
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>

      <Card variant="transparent" className="surface-card p-6">
        <h3 className="text-[15px] font-semibold text-slate-900">Decision Timeline</h3>
        <div className="mt-4">
          {timelineSteps.map((step, i) => (
            <div key={step.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full border hairline bg-slate-50">
                  {step.icon}
                </div>
                {i < timelineSteps.length - 1 && (
                  <div className="my-1 w-px flex-1 bg-[#ececf1]" style={{ minHeight: "24px" }} />
                )}
              </div>
              <div className="pb-4">
                <p className="text-[13px] font-medium text-slate-800">{step.title}</p>
                <p className="text-[12px] text-slate-600">{step.desc}</p>
                <p className="nums text-[12px] text-slate-400">{formatDateTime(step.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card variant="transparent" className="surface-card p-4">
        <p className="text-[11px] uppercase tracking-wide text-slate-400">Audit Log Entry</p>
        <div className="mt-2 grid grid-cols-2 gap-3 text-[12px] sm:grid-cols-4">
          <div className="text-slate-500">
            Audit ID: <span className="nums text-slate-700">{decision.id}</span>
          </div>
          <div className="text-slate-500">
            Model: <span className="nums text-slate-700">{decision.model_version}</span>
          </div>
          <div className="text-slate-500">
            Confidence: <span className="nums text-slate-700">{pct}%</span>
          </div>
          <div className="text-slate-500">
            Override: <span className={cn(overridden ? "font-semibold text-amber-600" : "text-slate-700")}>{overridden ? "Yes" : "No"}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
