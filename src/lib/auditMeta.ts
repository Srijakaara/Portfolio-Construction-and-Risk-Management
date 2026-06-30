import type { DecisionEntity } from "@/store/useRiskStore"

const PILLAR_REVIEWER: Record<DecisionEntity["pillar"], string> = {
  "Regime Detection": "Priya Nair",
  "Dynamic Allocation": "Arjun Mehta",
  "Stress Engine": "Lena Fischer",
  "Risk Memory": "Devika Rao",
}

const AUTO_APPROVE_THRESHOLD = 0.9

/** True once a human disagreed with the AI proposal — the single most audit-relevant signal. */
export function isOverridden(d: DecisionEntity): boolean {
  return d.status === "rejected"
}

/** True when a decision resolved without a human touching it. */
export function isAutoApproved(d: DecisionEntity): boolean {
  return d.status === "approved" && d.confidence >= AUTO_APPROVE_THRESHOLD
}

/** Attributes every action to an accountable actor + role — never "the system" alone. */
export function decisionActor(d: DecisionEntity): { actor: string; role: string } {
  if (d.status === "pending") return { actor: "Unassigned", role: "awaiting review" }
  if (d.status === "exception") return { actor: "Senior Risk Committee", role: "escalation reviewer" }
  if (isAutoApproved(d)) return { actor: "Ascend Risk AI", role: "system (auto)" }
  if (isOverridden(d)) return { actor: PILLAR_REVIEWER[d.pillar], role: "compliance officer" }
  return { actor: PILLAR_REVIEWER[d.pillar], role: "portfolio risk analyst" }
}

/** Absolute date+time — audit trails must stay precise and non-decaying, never relative. */
export function formatDateTime(timestamp: string): string {
  return new Date(timestamp).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

/** A decision has a recorded human (or escalation) action once it leaves "pending". */
export function isResolved(d: DecisionEntity): boolean {
  return d.status !== "pending"
}

/** Stable, deterministic fund code derived from the decision ID — no separate ID field in the store. */
export function fundCode(d: DecisionEntity): string {
  return `FND-${d.id.replace(/\D/g, "").padStart(3, "0")}`
}

/** What the pillar engine actually consumes as input — distinct from the rationale it produces as output. */
const PILLAR_INPUT_CONTEXT: Record<DecisionEntity["pillar"], string> = {
  "Regime Detection": "Macro & market regime indicators — rate cycle, volatility surface, sector rotation signals.",
  "Dynamic Allocation": "Regime-conditioned expected-return and risk-covariance estimates.",
  "Stress Engine": "Weekly Monte Carlo and historical-stress simulation outputs.",
  "Risk Memory": "Historical drawdown and recovery pattern library across prior regime cycles.",
}

export function inputSignalContext(d: DecisionEntity): string {
  return PILLAR_INPUT_CONTEXT[d.pillar]
}

/** Generic evidence checks every proposal passes through before reaching a human queue. */
export function evidenceChecklist(d: DecisionEntity): string[] {
  return [
    "Confidence score evaluated against the pillar's autonomy threshold",
    `Cross-checked against the ${d.pillar} engine's latest output`,
    "Reviewed against precedent in the Risk Memory compounding layer",
  ]
}
