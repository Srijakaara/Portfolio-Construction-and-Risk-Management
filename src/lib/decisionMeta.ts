import type { DecisionEntity } from "@/store/useRiskStore"
import type { PriorityKey } from "@/lib/colors"

const SLA_HOURS = 48
const URGENT_THRESHOLD_HOURS = 12

/** Derives queue priority from status + confidence — shared so every queue view agrees. */
export function decisionPriority(d: DecisionEntity): PriorityKey {
  if (d.status === "exception") return "high"
  if (d.status === "pending" && d.confidence < 0.7) return "high"
  if (d.status === "pending") return "medium"
  return "low"
}

/** SLA countdown label + urgency flag for pending/exception decisions; resolved ones are neutral. */
export function decisionSLA(d: DecisionEntity): { label: string; urgent: boolean } {
  if (d.status !== "pending" && d.status !== "exception") {
    return { label: "Resolved", urgent: false }
  }
  const hoursElapsed = (Date.now() - new Date(d.timestamp).getTime()) / 3600000
  const remaining = Math.round(SLA_HOURS - hoursElapsed)
  if (remaining <= 0) {
    return { label: `Overdue ${Math.abs(remaining)}h`, urgent: true }
  }
  return { label: `${remaining}h left`, urgent: remaining <= URGENT_THRESHOLD_HOURS }
}
