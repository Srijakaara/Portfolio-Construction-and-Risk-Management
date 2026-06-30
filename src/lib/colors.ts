/**
 * Single source of truth for status/semantic color mapping.
 * indigo = primary/active/total only · emerald = success/approved only
 * amber = pending/caution only · rose = rejected/critical only · orange = escalated only
 * Never inline ad-hoc status colors — extend this map instead.
 */
export type TintKey = "indigo" | "amber" | "emerald" | "rose" | "orange" | "slate"

interface TintStyle {
  text: string
  bg: string
  border: string
  dot: string
  hex: string
}

export const TINT: Record<TintKey, TintStyle> = {
  indigo: { text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-200", dot: "bg-indigo-500", hex: "#6366f1" },
  emerald: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500", hex: "#10b981" },
  amber: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500", hex: "#f59e0b" },
  rose: { text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-200", dot: "bg-rose-500", hex: "#f43f5e" },
  orange: { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500", hex: "#fb923c" },
  slate: { text: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200", dot: "bg-slate-400", hex: "#94a3b8" },
}

export type StatusKey = "active" | "approved" | "pending" | "rejected" | "escalated" | "neutral"

const STATUS_TINT: Record<StatusKey, TintKey> = {
  active: "indigo",
  approved: "emerald",
  pending: "amber",
  rejected: "rose",
  escalated: "orange",
  neutral: "slate",
}

const STATUS_LABEL: Record<StatusKey, string> = {
  active: "Active",
  approved: "Approved",
  pending: "Pending",
  rejected: "Rejected",
  escalated: "Escalated",
  neutral: "Neutral",
}

export const STATUS_COLORS: Record<StatusKey, TintStyle & { label: string }> = Object.fromEntries(
  Object.entries(STATUS_TINT).map(([status, tint]) => [
    status,
    { ...TINT[tint], label: STATUS_LABEL[status as StatusKey] },
  ])
) as Record<StatusKey, TintStyle & { label: string }>

/** KPI health → shared chip color + dot tint. on_track=success, at_risk=warning, off_track=danger. */
export type KPIStatusKey = "on_track" | "at_risk" | "off_track"

export const KPI_STATUS: Record<KPIStatusKey, { label: string; chipColor: "success" | "warning" | "danger"; tint: TintKey }> = {
  on_track: { label: "On track", chipColor: "success", tint: "emerald" },
  at_risk: { label: "At risk", chipColor: "warning", tint: "amber" },
  off_track: { label: "Off track", chipColor: "danger", tint: "rose" },
}

/** Ordered palette for proportional breakdowns (e.g. risk bands) — lightest to darkest indigo. */
export const ORDERED_PALETTE = ["#4338ca", "#6366f1", "#818cf8", "#a5b4fc"]

/**
 * Shared AIStatus (decision queue) → StatusKey mapping. Use this everywhere a
 * DecisionEntity's status is rendered (Dashboard, Workbench, Audit) — never
 * re-derive a page-local switch statement.
 */
export type AIStatusKey = "pending" | "approved" | "rejected" | "exception"

export const DECISION_STATUS_TO_KEY: Record<AIStatusKey, StatusKey> = {
  pending: "pending",
  approved: "approved",
  rejected: "rejected",
  exception: "escalated",
}

/** Raw priority dot — color alone carries the signal, no label. */
export type PriorityKey = "high" | "medium" | "low"

export const PRIORITY_DOT: Record<PriorityKey, string> = {
  high: "bg-rose-500",
  medium: "bg-amber-400",
  low: "bg-slate-300",
}
